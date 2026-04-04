import asyncio
import logging
import time
from typing import List, Dict, Any
import ollama

logger = logging.getLogger(__name__)

class LLMAdvisoryService:
    def __init__(self, model: str = "llama3", base_url: str = "http://localhost:11434"):
        self.model = model
        self.base_url = base_url
        self.client = ollama.AsyncClient(host=base_url)

    async def generate_advisory_structured(self, score: int, shap_reasons: List[str], sentinel_signals: List[str]) -> Dict[str, Any]:
        """
        Generates a structured credit advisory (Dict) using local Ollama.
        """
        start_time = time.time()
        
        system_prompt = (
            "You are an Indian MSME Credit Expert. Convert raw financial ML data into a professional, "
            "high-trust credit report. You MUST provide exactly three sections: Banker's Verdict, Risk Context, "
            "and a list of 3 bullet points for The 30-Day Fix."
        )
        
        user_prompt = f"""
        Score: {score}/900.
        Top SHAP Reasons: {', '.join(shap_reasons)}.
        Sentinel Alerts: {', '.join(sentinel_signals) if sentinel_signals else 'None'}.
        
        Format your response exactly as follows:
        VERDICT: [One sentence]
        CONTEXT: [Explanation]
        FIXES: [Bullet 1], [Bullet 2], [Bullet 3]
        """

        try:
            response = await asyncio.wait_for(
                self.client.generate(
                    model=self.model,
                    system=system_prompt,
                    prompt=user_prompt,
                    stream=False
                ),
                timeout=5.0
            )
            
            raw_text = response.get('response', "").strip()
            if raw_text:
                logger.info(f"LLM Advisory generated in {time.time() - start_time:.2f}s")
                # Simple parser for the standard format
                parsed = self._parse_llm_response(raw_text)
                if parsed: return parsed
            
        except Exception as e:
            logger.error(f"Ollama/Parsing error: {e}. Falling back to heuristics.")

        return self._generate_heuristic_fallback_dict(score, shap_reasons, sentinel_signals)

    def _parse_llm_response(self, text: str) -> Dict[str, Any]:
        """Rudimentary parser for LLM output."""
        try:
            lines = text.split('\n')
            verdict = ""
            context = ""
            fixes = []
            
            for line in lines:
                if line.startswith("VERDICT:"): verdict = line.replace("VERDICT:", "").strip()
                elif line.startswith("CONTEXT:"): context = line.replace("CONTEXT:", "").strip()
                elif line.startswith("FIXES:"):
                    fixes_parts = line.replace("FIXES:", "").split(',')
                    fixes = [p.strip().strip('•').strip('-') for p in fixes_parts if p.strip()]
            
            if verdict and context and fixes:
                return {
                    "bankers_verdict": verdict,
                    "risk_context": context,
                    "thirty_day_fix": fixes[:3]
                }
        except:
            pass
        return None

    def _generate_heuristic_fallback_dict(self, score: int, shap_reasons: List[str], sentinel_signals: List[str]) -> Dict[str, Any]:
        """Provides a structured advisory if the LLM is slow or unavailable."""
        
        # Reason-Aware Phrases
        reasons_text = " ".join(shap_reasons).lower()
        
        # 1. Dynamic Verdict
        if score >= 750:
            if "velocity" in reasons_text: verdict = "Excellent growth trajectory with high transaction velocity, indicating a robust market position."
            else: verdict = "Strong creditworthiness with low default probability; highly recommended for prime lending rates."
        elif score >= 600:
            if "compliance" in reasons_text or "filing" in reasons_text: verdict = "Demonstrates core reliability, though credit flow is slightly throttled by administrative bottlenecks or tax filing delays."
            else: verdict = "Moderate credit profile; borrower demonstrates reliability but carries sectoral or transaction-level sensitivities."
        else:
            if "bounce" in reasons_text or "risk" in reasons_text: verdict = "High-risk liquidity profile detected; immediate cash-flow hardening and debt-trap prevention strategies are required."
            else: verdict = "Sub-optimal credit history; immediate intervention in operational liquidity is recommended."

        # 2. Context Engineering
        strength_count = sum(1 for r in shap_reasons if "(+)" in r)
        risk_count = sum(1 for r in shap_reasons if "(-)" in r)
        
        top_risk = next((r for r in shap_reasons if "(-)" in r), "general volatility")
        risk_context = f"The profile is currently anchored by {strength_count} operational strengths, but {risk_count} critical flags—primarily {top_risk.replace('(-) High Risk Flag: ', '')}—are causing score compression."
        
        if sentinel_signals:
            risk_context += f" Sentinel telemetry ({len(sentinel_signals)} signals) confirms active friction in real-time collections."

        # 3. Targeted 30-Day Fixes
        fixes = []
        if "compliance" in reasons_text: fixes.append("Resolve the recent GST filing slippage to unlock a better CMR band.")
        if "velocity" in reasons_text: fixes.append("Diversify the buyer network to reduce reliance on single-party transaction clusters.")
        if "bounce" in reasons_text: fixes.append("Standardize POS collection cycles to ensure zero cheque/UPI bounces.")
        
        # Fallbacks to ensure 3
        while len(fixes) < 3:
            if score < 700: fixes.append("Improve transaction density and maintain a consistent digital audit trail.")
            else: fixes.append("Maintain the current trend to qualify for pre-approved limit expansions.")
            if len(fixes) < 3: fixes.append("Clear any pending minor tax arrears to stabilize the Reliability Index.")
        
        if not fixes: # For elite scores
            fixes.append("Maintain current transaction velocity to stay in the CMR-1 band.")
            fixes.append("Explore limit expansion with Tier-1 banks.")
            fixes.append("Diversify vendor group further to reduce supply chain risk.")
        
        # Ensure we have at least 3 bullets
        while len(fixes) < 3:
            fixes.append("Maintain consistent filing compliance records.")

        return {
            "bankers_verdict": verdict,
            "risk_context": risk_context,
            "thirty_day_fix": fixes[:3]
        }

# Singleton instance for the app
llm_service = LLMAdvisoryService()
