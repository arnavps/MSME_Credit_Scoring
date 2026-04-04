terimport pandas as pd
import io

def clean_csv(file_path):
    print(f"Cleaning {file_path}...")
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Remove large blocks of spaces/newlines that are breaking the parser
    # The corruption seems to be many spaces followed by a newline or vice-versa
    import re
    # Replace sequences of 10 or more spaces/newlines with a single empty string if they are in the middle of a token
    # This is rough, a better way is to use pandas to read and then write
    try:
        # Use python engine to be more tolerant
        df = pd.read_csv(file_path, engine='python')
        print(f"Read {len(df)} rows.")
        # Clean column names
        df.columns = [c.replace('\n', '').strip() for c in df.columns]
        # Clean all string values
        for col in df.select_dtypes(include=['object']):
            df[col] = df[col].apply(lambda x: str(x).replace('\n', '').strip() if isinstance(x, str) else x)
        
        df.to_csv(file_path, index=False)
        print("Successfully cleaned and saved.")
    except Exception as e:
        print(f"Error during cleaning: {e}")

if __name__ == "__main__":
    clean_csv("data/msme_synthetic_3000.csv")
    clean_csv("data/msme_synthetic_3000_v2.csv")
