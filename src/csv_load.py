"""Load MSME CSVs; synthetic exports occasionally contain merged rows."""
import pandas as pd


def read_msme_csv(path: str) -> pd.DataFrame:
    try:
        return pd.read_csv(path, on_bad_lines="skip")
    except TypeError:
        # pandas < 1.3
        return pd.read_csv(path, error_bad_lines=False, warn_bad_lines=True)
