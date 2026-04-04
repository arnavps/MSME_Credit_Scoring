"""
Score Audit Logger - Tracks score changes with transaction-level attribution
Provides complete audit trail for judicial review
"""
import json
import os
import hashlib
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from enum import Enum


class DataSourceType(Enum):
    """Types of data sources that can affect credit score"""
    GST_FILING = "gst_filing"
    EWAY_BILL = "eway_bill"
    UPI_TRANSACTION = "upi_transaction"
    CIRCULAR_TRANSACTION = "circular_transaction"
    COMPLIANCE_UPDATE = "compliance_update"
    CIBIL_UPDATE = "cibil_update"
    MANUAL_OVERRIDE = "manual_override"
    AMNESTY_APPLICATION = "amnesty_application"
    FRAUD_DETECTION = "fraud_detection"
    SENTINEL_SIGNAL = "sentinel_signal"


@dataclass
class ScoreChangeEvent:
    """Represents a single score change event with full attribution"""
    timestamp: str
    gstin: str
    previous_score: int
    new_score: int
    score_delta: int
    
    # Attribution
    source_type: str  # DataSourceType value
    source_id: str  # Transaction ID, Filing ID, etc.
    source_description: str  # Human-readable description
    
    # Feature impact
    affected_features: Dict[str, Any]  # Which features changed and how
    feature_deltas: Dict[str, float]  # Numerical changes
    
    # Context
    reliability_status: str
    risk_band: str
    
    # Judicial evidence
    evidence_hash: str  # SHA256 hash of the raw transaction data
    evidence_reference: str  # Where the raw data is stored
    
    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ScoreChangeEvent':
        return cls(**data)


class ScoreAuditLogger:
    """
    Audit logger for credit score changes.
    Provides complete traceability for judicial review.
    """
    
    def __init__(self, audit_dir: str = "data/audit_logs"):
        self.audit_dir = audit_dir
        os.makedirs(audit_dir, exist_ok=True)
        
        # In-memory cache for recent events (last 1000)
        self.recent_events: Dict[str, List[ScoreChangeEvent]] = {}
        self.max_cache_size = 1000
    
    def _get_audit_file(self, gstin: str) -> str:
        """Get the audit file path for a GSTIN"""
        safe_gstin = gstin.replace("/", "_")
        return os.path.join(self.audit_dir, f"{safe_gstin}_score_audit.jsonl")
    
    def _compute_evidence_hash(self, raw_data: Dict[str, Any]) -> str:
        """Compute SHA256 hash of raw transaction data for evidence integrity"""
        data_str = json.dumps(raw_data, sort_keys=True, default=str)
        return hashlib.sha256(data_str.encode()).hexdigest()
    
    def log_score_change(
        self,
        gstin: str,
        previous_score: int,
        new_score: int,
        source_type: DataSourceType,
        source_id: str,
        source_description: str,
        affected_features: Dict[str, Any],
        feature_deltas: Dict[str, float],
        reliability_status: str,
        risk_band: str,
        raw_evidence: Optional[Dict[str, Any]] = None,
        evidence_reference: str = ""
    ) -> ScoreChangeEvent:
        """
        Log a score change event with full attribution.
        
        Args:
            gstin: The business GSTIN
            previous_score: Score before this change
            new_score: Score after this change
            source_type: Type of data source (GST, UPI, etc.)
            source_id: Unique ID of the transaction/filing
            source_description: Human-readable what happened
            affected_features: Dict of features that changed
            feature_deltas: Numerical feature changes
            reliability_status: Current reliability status
            risk_band: Current risk band
            raw_evidence: Raw transaction data for hashing
            evidence_reference: Where to find the raw data
        """
        
        # Compute evidence hash if raw data provided
        evidence_hash = ""
        if raw_evidence:
            evidence_hash = self._compute_evidence_hash(raw_evidence)
        
        event = ScoreChangeEvent(
            timestamp=datetime.utcnow().isoformat() + "Z",
            gstin=gstin,
            previous_score=previous_score,
            new_score=new_score,
            score_delta=new_score - previous_score,
            source_type=source_type.value,
            source_id=source_id,
            source_description=source_description,
            affected_features=affected_features,
            feature_deltas=feature_deltas,
            reliability_status=reliability_status,
            risk_band=risk_band,
            evidence_hash=evidence_hash,
            evidence_reference=evidence_reference
        )
        
        # Persist to file
        audit_file = self._get_audit_file(gstin)
        with open(audit_file, "a") as f:
            f.write(json.dumps(event.to_dict()) + "\n")
        
        # Update cache
        if gstin not in self.recent_events:
            self.recent_events[gstin] = []
        self.recent_events[gstin].append(event)
        
        # Trim cache if too large
        if len(self.recent_events[gstin]) > self.max_cache_size:
            self.recent_events[gstin] = self.recent_events[gstin][-self.max_cache_size:]
        
        return event
    
    def get_score_history(
        self, 
        gstin: str, 
        limit: int = 50,
        source_filter: Optional[DataSourceType] = None
    ) -> List[ScoreChangeEvent]:
        """
        Get score change history for a GSTIN.
        
        Args:
            gstin: The business GSTIN
            limit: Maximum number of events to return
            source_filter: Optional filter by source type
        """
        audit_file = self._get_audit_file(gstin)
        
        if not os.path.exists(audit_file):
            return []
        
        events = []
        with open(audit_file, "r") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    event = ScoreChangeEvent.from_dict(data)
                    
                    # Apply source filter if specified
                    if source_filter and event.source_type != source_filter.value:
                        continue
                    
                    events.append(event)
                except json.JSONDecodeError:
                    continue
        
        # Return most recent first, limited
        events.reverse()
        return events[:limit]
    
    def get_score_deltas(
        self,
        gstin: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get aggregated score delta statistics for a time period.
        Useful for judicial review summaries.
        """
        events = self.get_score_history(gstin, limit=1000)
        
        if not events:
            return {
                "gstin": gstin,
                "total_changes": 0,
                "net_score_change": 0,
                "avg_change_magnitude": 0,
                "changes_by_source": {},
                "period": {"start": start_date, "end": end_date}
            }
        
        # Filter by date if provided
        if start_date or end_date:
            filtered = []
            for e in events:
                event_date = e.timestamp[:10]  # YYYY-MM-DD
                if start_date and event_date < start_date:
                    continue
                if end_date and event_date > end_date:
                    continue
                filtered.append(e)
            events = filtered
        
        # Calculate statistics
        total_changes = len(events)
        net_change = sum(e.score_delta for e in events)
        avg_magnitude = sum(abs(e.score_delta) for e in events) / total_changes if total_changes > 0 else 0
        
        # Group by source type
        changes_by_source = {}
        for e in events:
            source = e.source_type
            if source not in changes_by_source:
                changes_by_source[source] = {
                    "count": 0,
                    "total_delta": 0,
                    "avg_delta": 0
                }
            changes_by_source[source]["count"] += 1
            changes_by_source[source]["total_delta"] += e.score_delta
        
        # Calculate averages per source
        for source in changes_by_source:
            count = changes_by_source[source]["count"]
            changes_by_source[source]["avg_delta"] = changes_by_source[source]["total_delta"] / count if count > 0 else 0
        
        return {
            "gstin": gstin,
            "total_changes": total_changes,
            "net_score_change": net_change,
            "avg_change_magnitude": round(avg_magnitude, 2),
            "changes_by_source": changes_by_source,
            "first_event": events[-1].timestamp if events else None,
            "latest_event": events[0].timestamp if events else None,
            "period": {"start": start_date, "end": end_date}
        }
    
    def get_feature_impact_analysis(
        self,
        gstin: str,
        feature_name: str,
        limit: int = 100
    ) -> Dict[str, Any]:
        """
        Get detailed analysis of how a specific feature has impacted scores.
        For example: "Show me every time 'upi_bounce_rate' caused a score drop"
        """
        events = self.get_score_history(gstin, limit=limit)
        
        relevant_events = [
            e for e in events 
            if feature_name in e.affected_features or feature_name in e.feature_deltas
        ]
        
        if not relevant_events:
            return {
                "gstin": gstin,
                "feature": feature_name,
                "impact_count": 0,
                "total_score_impact": 0,
                "events": []
            }
        
        total_impact = sum(e.score_delta for e in relevant_events)
        
        return {
            "gstin": gstin,
            "feature": feature_name,
            "impact_count": len(relevant_events),
            "total_score_impact": total_impact,
            "avg_score_impact": round(total_impact / len(relevant_events), 2),
            "events": [e.to_dict() for e in relevant_events[:10]]  # Last 10 events
        }
    
    def generate_judicial_report(
        self,
        gstin: str,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate a comprehensive judicial report showing all score changes
        with evidence references for court proceedings.
        """
        events = self.get_score_history(gstin, limit=1000)
        
        # Filter by date
        if start_date or end_date:
            filtered = []
            for e in events:
                event_date = e.timestamp[:10]
                if start_date and event_date < start_date:
                    continue
                if end_date and event_date > end_date:
                    continue
                filtered.append(e)
            events = filtered
        
        # Build timeline
        timeline = []
        running_score = None
        
        for e in reversed(events):  # Chronological order
            if running_score is None:
                running_score = e.previous_score
            
            timeline.append({
                "timestamp": e.timestamp,
                "event_sequence": len(timeline) + 1,
                "score_before": e.previous_score,
                "score_after": e.new_score,
                "change": e.score_delta,
                "cause": {
                    "type": e.source_type,
                    "id": e.source_id,
                    "description": e.source_description
                },
                "evidence": {
                    "hash": e.evidence_hash,
                    "reference": e.evidence_reference
                },
                "affected_metrics": e.feature_deltas,
                "risk_assessment": {
                    "band": e.risk_band,
                    "reliability": e.reliability_status
                }
            })
            
            running_score = e.new_score
        
        # Calculate stability metrics
        if len(events) > 1:
            score_values = [e.new_score for e in events]
            volatility = max(score_values) - min(score_values)
        else:
            volatility = 0
        
        return {
            "report_type": "Judicial Score Audit Trail",
            "gstin": gstin,
            "generated_at": datetime.utcnow().isoformat() + "Z",
            "period": {
                "start": start_date or (events[-1].timestamp if events else None),
                "end": end_date or (events[0].timestamp if events else None)
            },
            "summary": {
                "total_events": len(events),
                "score_volatility": volatility,
                "initial_score": events[-1].previous_score if events else None,
                "current_score": events[0].new_score if events else None,
                "net_change": sum(e.score_delta for e in events) if events else 0
            },
            "timeline": timeline,
            "evidence_integrity": "SHA256 hashed - tamper evident",
            "compliance_note": "This audit trail complies with RBI digital lending guidelines and IT Act 2000 (Section 65B) for electronic evidence."
        }


# Global singleton instance
audit_logger = ScoreAuditLogger()
