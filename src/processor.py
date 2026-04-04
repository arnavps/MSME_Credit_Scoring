import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MSMEProcessor:
    def __init__(self):
        pass

    @staticmethod
    def calculate_gross_margin_proxy(output_gst: float, input_gst: float) -> float:
        """
        Calculate the Gross Margin Proxy based on Input and Output GST.
        Formula: (Output GST - Input GST) / Output GST
        
        Args:
            output_gst (float): The total GST collected on outward supplies.
            input_gst (float): The total GST paid on inward supplies (Input Tax Credit).
            
        Returns:
            float: The gross margin proxy ratio.
        """
        try:
            if output_gst <= 0:
                logger.warning("Output GST is zero or negative. Returning 0.0 margin proxy.")
                return 0.0
            margin = (output_gst - input_gst) / output_gst
            return margin
        except Exception as e:
            logger.error(f"Error calculating gross margin proxy: {e}")
            return 0.0

if __name__ == "__main__":
    # Test the processor
    margin = MSMEProcessor.calculate_gross_margin_proxy(100000.0, 75000.0)
    logger.info(f"Test Gross Margin Proxy (100k out, 75k in): {margin:.2%}")
