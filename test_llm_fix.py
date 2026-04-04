import asyncio
import sys
import os

# Add current dir to path
sys.path.append(os.getcwd())

from src.llm_service import llm_service

async def test_llm():
    print("Testing LLM Advisory Service (Timeout/Heuristic Check)...")
    print(f"Ollama Base URL: {llm_service.base_url}")
    
    # This should trigger heuristic fallback if Ollama is hanging or dead
    try:
        print("Starting LLM Advisory Generation...")
        # Note: Internal timeout is 4s, health check is 1s
        res = await asyncio.wait_for(
            llm_service.generate_advisory_structured(
                score=750, 
                shap_reasons=["(+) High Velocity", "(-) Compliance Lag"], 
                sentinel_signals=[]
            ),
            timeout=10.0
        )
        print("\nSUCCESS: Response received.")
        print(f"Verdict: {res.get('bankers_verdict')}")
        print(f"Fixes: {res.get('thirty_day_fix')}")
    except asyncio.TimeoutError:
        print("\nFAILED: Even with my 4s internal timeout, the call stalled for >10s!")
    except Exception as e:
        print(f"\nERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_llm())
