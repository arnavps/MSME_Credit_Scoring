import pandas as pd
import networkx as nx
import random
import logging
from src.csv_load import read_msme_csv

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FraudEngine:
    def __init__(self, csv_path: str):
        self.csv_path = csv_path
        self.graph = nx.DiGraph()
        self.msme_data = read_msme_csv(csv_path)
        self._build_topology()

    def _build_topology(self):
        """
        Synthesizes a graph topology from the MSME dataset.
        Intentional loops are created for nodes where circular_transaction_flag == 1.
        """
        self.graph.clear()
        
        # Add all MSMEs as nodes
        for _, row in self.msme_data.iterrows():
            self.graph.add_node(row['gstin'], name=row['business_name'], output_gst=row['output_gst'])
        
        gstins = self.msme_data['gstin'].tolist()
        fraudsters = self.msme_data[self.msme_data['circular_transaction_flag'] == 1]['gstin'].tolist()
        
        # 1. Create Internal Fraud Loops (Length 3-4)
        # We group fraudsters into small clusters to form cycles
        for i in range(0, len(fraudsters), 3):
            group = fraudsters[i:i+3]
            if len(group) == 3:
                # Create A -> B -> C -> A cycle
                self.graph.add_edge(group[0], group[1], value=self.graph.nodes[group[0]]['output_gst'] * 0.9)
                self.graph.add_edge(group[1], group[2], value=self.graph.nodes[group[1]]['output_gst'] * 0.9)
                self.graph.add_edge(group[2], group[0], value=self.graph.nodes[group[2]]['output_gst'] * 0.9)

        # 2. Create Random Forward Transactions for non-fraudsters
        # To make the graph look realistic
        non_fraudsters = list(set(gstins) - set(fraudsters))
        for gstin in random.sample(non_fraudsters, min(2000, len(non_fraudsters))):
            # Each node picks 1-2 random targets to 'buy' from
            targets = random.sample(gstins, random.randint(1, 2))
            for target in targets:
                if target != gstin:
                    self.graph.add_edge(gstin, target, value=self.graph.nodes[gstin]['output_gst'] * random.uniform(0.1, 0.4))

    def detect_circular_loops(self, target_gstin: str):
        """
        Checks if the target_gstin is part of any simple cycle of length 3-4.
        """
        if target_gstin not in self.graph:
            return False, []

        # Find all cycles in the graph (limited search for performance)
        # Note: simple_cycles can be slow on large graphs, but works for sparse fraud topologies
        try:
            # We look for cycles containing target_gstin
            for cycle in nx.simple_cycles(self.graph):
                if target_gstin in cycle and 3 <= len(cycle) <= 5:
                    return True, cycle
        except Exception as e:
            logger.error(f"Cycle detection error: {e}")
            
        return False, []

    def get_live_fraud_analysis(self, merchant_id: str):
        """
        Fetches live transactions and runs DFS cycle detection.
        """
        from src.transaction_service import transaction_service
        
        # 1. Fetch live transaction data (cached for 5m)
        transactions = transaction_service.get_unified_transactions(merchant_id)
        
        # 2. Build live graph
        live_graph = nx.DiGraph()
        for tx in transactions:
            live_graph.add_edge(tx['from'], tx['to'], amount=tx['amount'], provider=tx['provider'])
            
        # 3. Detect Cycles (DFS)
        try:
            cycles = list(nx.simple_cycles(live_graph))
            for cycle in cycles:
                # We prioritize cycles containing the target merchant
                if merchant_id in cycle and len(cycle) >= 3:
                    edges = []
                    for i in range(len(cycle)):
                        u, v = cycle[i], cycle[(i + 1) % len(cycle)]
                        edge_data = live_graph.get_edge_data(u, v)
                        edges.append({
                            "from": u, "to": v, 
                            "amount": edge_data['amount'],
                            "label": f"₹{int(edge_data['amount'] / 1000)}K"
                        })
                    
                    return {
                        "is_circular": True,
                        "node_count": len(cycle),
                        "nodes": cycle,
                        "edges": edges,
                        "ratio": 0.85 # Static ratio for sandbox detection
                    }
        except Exception as e:
            logger.error(f"Live DFS detection failed: {e}")
            
        return {
            "is_circular": False,
            "node_count": 0,
            "nodes": [],
            "edges": [],
            "ratio": 0.0
        }

    def get_circularity_metrics(self, target_gstin: str):

        """
        Returns fraud details including the path, circularity ratio, and graph ring.
        Ratio = (Value in Loop) / (Total Outflow)
        """
        is_circular, path = self.detect_circular_loops(target_gstin)
        
        if not is_circular:
            return {
                "is_circular": False,
                "topology_path": [],
                "nodes": [],
                "edges": [],
                "alert_level": "NORMAL",
                "circularity_ratio": 0.0
            }

        # Calculate ratio and build edge list
        total_outflow = sum(d['value'] for u, v, d in self.graph.out_edges(target_gstin, data=True))
        
        edges = []
        for i in range(len(path)):
            u = path[i]
            v = path[(i + 1) % len(path)]
            edge_data = self.graph.get_edge_data(u, v, default={'value': 0})
            edges.append({
                "from": u,
                "to": v,
                "amount": round(edge_data['value'], 2),
                "label": f"₹{round(edge_data['value']/1000, 1)}K"
            })

        # Ratio specifically for targeting node
        next_node = path[(path.index(target_gstin) + 1) % len(path)]
        loop_value = self.graph.get_edge_data(target_gstin, next_node, default={'value': 0})['value']
        
        ratio = loop_value / total_outflow if total_outflow > 0 else 0.0

        return {
            "is_circular": True,
            "topology_path": path,
            "nodes": path,
            "edges": edges,
            "alert_level": "CRITICAL",
            "circularity_ratio": round(ratio, 4)
        }


if __name__ == "__main__":
    # Quick standalone test
    engine = FraudEngine("data/msme_synthetic_3000_v2.csv")
    test_gstin = "19MBWPY4089G1Z8"  # Known fraudster from CSV profile
    metrics = engine.get_circularity_metrics(test_gstin)
    print(f"Fraud Metrics for {test_gstin}: {metrics}")
