import requests
import time
import statistics
import pandas as pd

URL = "http://fwk48scocg0okkw08kc0g0gc.128.199.165.212.sslip.io"
ITERATIONS = 1000

results = []

for i in range(ITERATIONS):
    try:
        start = time.time()
        response = requests.get(URL, stream=True, timeout=60)
        # Force reading the first byte
        next(response.iter_content(1))
        first_byte = time.time()
        
        ttfb = first_byte - start
        results.append({"Run": i + 1, "TTFB_seconds": ttfb, "Status": "Success"})
        
        print(f"Run {i+1}: TTFB = {ttfb:.4f} seconds")
    except Exception as e:
        results.append({"Run": i + 1, "TTFB_seconds": None, "Status": f"Error: {e}"})
        print(f"Run {i+1}: Error - {e}")

# Convert to DataFrame
df = pd.DataFrame(results)

# Save to CSV
csv_file = "ttfb_results.csv"
df.to_csv(csv_file, index=False)

print(f"\n✅ Results saved to {csv_file}")

# Summary stats only for successful runs
successful_runs = [r["TTFB_seconds"] for r in results if r["TTFB_seconds"] is not None]

if successful_runs:
    print("\n--- Summary ---")
    print(f"Total successful runs: {len(successful_runs)}/{ITERATIONS}")
    print(f"Average TTFB: {statistics.mean(successful_runs):.4f} seconds")
    print(f"Median TTFB: {statistics.median(successful_runs):.4f} seconds")
    print(f"Min TTFB: {min(successful_runs):.4f} seconds")
    print(f"Max TTFB: {max(successful_runs):.4f} seconds")
