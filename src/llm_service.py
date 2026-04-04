import asyncio
import logging
import time
from typing import List, Dict, Any
import ollama
import httpx

logger = logging.getLogger(__name__)

class LLMAdvisoryService:
    def __init__(self, model: str = "llama3", base_url: str = "http://localhost:11434"):
        self.model = model
        self.base_url = base_url
        self.client = ollama.AsyncClient(host=base_url)

    async def _is_ollama_alive(self) -> bool:
        """Fast health check to avoid blocking hangs."""
        try:
            async with httpx.AsyncClient() as check_client:
                # Use a very short timeout for the health check
                response = await check_client.get(f"{self.base_url}/api/tags", timeout=1.0)
                return response.status_code == 200
        except Exception:
            return False

    async def generate_advisory_structured(self, score: int, shap_reasons: List[str], sentinel_signals: List[str]) -> Dict[str, Any]:
        """
        Generates a structured credit advisory (Dict) using local Ollama.
        Defensive implementation with health checks and strict timeouts.
        """
        start_time = time.time()
        
        # 1. Quick Health Check (prevents 20-minute hangs if Ollama is dead)
        if not await self._is_ollama_alive():
            logger.warning("Ollama service unreachable. Stepping into Heuristic Mode.")
            return self._generate_heuristic_fallback_dict(score, shap_reasons, sentinel_signals)

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
            # 2. Strict Generation Timeout
            response = await asyncio.wait_for(
                self.client.generate(
                    model=self.model,
                    system=system_prompt,
                    prompt=user_prompt,
                    stream=False
                ),
                timeout=4.0 # Reduced from 5.0 for tighter dashboard loops
            )
            
            raw_text = response.get('response', "").strip()
            if raw_text:
                logger.info(f"LLM Advisory generated in {time.time() - start_time:.2f}s")
                parsed = self._parse_llm_response(raw_text)
                if parsed: return parsed
            
        except asyncio.TimeoutError:
            logger.error("Ollama generation timed out. Falling back to heuristics.")
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
        reasons_text = " ".join(shap_reasons).lower()
        
        if score >= 750:
            verdict = "Strong creditworthiness with low default probability; highly recommended for prime lending rates."
        elif score >= 600:
            verdict = "Moderate credit profile; borrower demonstrates reliability but carries sectoral sensitivities."
        else:
            verdict = "High-risk liquidity profile detected; immediate cash-flow hardening strategies are required."

        strength_count = sum(1 for r in shap_reasons if "(+)" in r)
        risk_count = sum(1 for r in shap_reasons if "(-)" in r)
        top_risk = next((r for r in shap_reasons if "(-)" in r), "general volatility")
        
        risk_context = f"The profile is currently anchored by {strength_count} operational strengths, but {risk_count} critical flags—primarily {top_risk.replace('(-) High Risk Flag: ', '')}—are causing score compression."
        
        fixes = ["Improve transaction density and maintain a consistent digital audit trail.", 
                 "Resolve minor administrative filing delays to stabilize score.",
                 "Maintain 15% cash reserve for liquidity buffer."]

        return {
            "bankers_verdict": verdict,
            "risk_context": risk_context,
            "thirty_day_fix": fixes[:3],
            "is_heuristic": True
        }

# Singleton instance
llm_service = LLMAdvisoryService()
