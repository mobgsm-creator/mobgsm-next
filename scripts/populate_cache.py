import pandas as pd
import subprocess
from tqdm import tqdm
from multiprocessing import Pool, cpu_count
import numpy as np

# Country code mapping
countryNameMap = {
    "ae": "united-arab-emirates",
    "af": "afghanistan",
    "am": "armenia",
    "ao": "angola",
    "ar": "argentina",
    "at": "austria",
    "au": "australia",
    "az": "azerbaijan",
    "ba": "bosnia-and-herzegovina",
    "bd": "bangladesh",
    "be": "belgium",
    "bh": "bahrain",
    "bo": "bolivia",
    "br": "brazil",
    "by": "belarus",
    "ca": "canada",
    "ch": "switzerland",
    "cl": "chile",
    "cm": "cameroon",
    "cn": "china",
    "co": "colombia",
    "cz": "czech-republic",
    "de": "germany",
    "dk": "denmark",
    "do": "dominican-republic",
    "dz": "algeria",
    "ec": "ecuador",
    "eg": "egypt",
    "es": "spain",
    "et": "ethiopia",
    "eu": "europe",
    "fi": "finland",
    "fr": "france",
    "gh": "ghana",
    "gl": "greenland",
    "gr": "greece",
    "hk": "hong-kong",
    "hn": "honduras",
    "ht": "haiti",
    "hu": "hungary",
    "id": "indonesia",
    "il": "israel",
    "in": "india",
    "iq": "iraq",
    "ir": "iran",
    "it": "italy",
    "jm": "jamaica",
    "jo": "jordan",
    "jp": "japan",
    "ke": "kenya",
    "kr": "south-korea",
    "kw": "kuwait",
    "kz": "kazakhstan",
    "lb": "lebanon",
    "lk": "sri-lanka",
    "lt": "lithuania",
    "lv": "latvia",
    "ma": "morocco",
    "md": "moldova",
    "mg": "madagascar",
    "mk": "north-macedonia",
    "ms": "montserrat",
    "mt": "malta",
    "mu": "mauritius",
    "mw": "malawi",
    "mx": "mexico",
    "my": "malaysia",
    "mz": "mozambique",
    "na": "namibia",
    "ng": "nigeria",
    "nl": "netherlands",
    "no": "norway",
    "np": "nepal",
    "nz": "new-zealand",
    "om": "oman",
    "pe": "peru",
    "pg": "papua-new-guinea",
    "ph": "philippines",
    "pk": "pakistan",
    "pl": "poland",
    "pr": "puerto-rico",
    "pt": "portugal",
    "qa": "qatar",
    "ro": "romania",
    "ru": "russia",
    "rw": "rwanda",
    "sa": "saudi-arabia",
    "sb": "solomon-islands",
    "sc": "seychelles",
    "sd": "sudan",
    "se": "sweden",
    "sg": "singapore",
    "sk": "slovakia",
    "sl": "sierra-leone",
    "sy": "syria",
    "th": "thailand",
    "tj": "tajikistan",
    "tn": "tunisia",
    "tr": "turkey",
    "tw": "taiwan",
    "tz": "tanzania",
    "ua": "ukraine",
    "ug": "uganda",
    "uk": "united-kingdom",
    "us": "united-states",
    "uy": "uruguay",
    "uz": "uzbekistan",
    "ve": "venezuela",
    "vn": "vietnam",
    "ye": "yemen",
    "za": "south-africa",
    "zm": "zambia",
    "zw": "zimbabwe",
}

def process_row(args):
    """Process a single row for all countries"""
    index, original_url = args
    
    for c in countryNameMap:
        url_to_get = original_url.replace("mobgsm", f"{c}.mobgsm")
        url_to_get_2 = url_to_get + "-price-in-" + countryNameMap[c] + "/"
        
        # Build the curl commands
        cmd_1 = [
            "curl",
            "-I", "-X", "GET",
            "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            url_to_get + "/"
        ]
        cmd_2 = [
            "curl",
            "-I", "-X", "GET",
            "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            url_to_get_2
        ]
        
        try:
            # Run curl via subprocess
            result = subprocess.run(cmd_1, capture_output=True, text=True, check=True, timeout=10)
            html_1 = result.stdout
            
            result = subprocess.run(cmd_2, capture_output=True, text=True, check=True, timeout=10)
            html_2 = result.stdout
            if len(html_1) > 0 and len(html_2)>0:
                print(f"Found both {url_to_get} and {url_to_get_2}")
            
        except subprocess.CalledProcessError as e:
            print(f"Error fetching {url_to_get}: {e}")
        except subprocess.TimeoutExpired:
            print(f"Timeout fetching {url_to_get}")
    
    return index

def process_batch(batch_data):
    """Process a batch of rows"""
    batch_num, rows = batch_data
    print(f"Processing batch {batch_num} with {len(rows)} rows")
    
    results = []
    for index, url in tqdm(rows, desc=f"Batch {batch_num}", position=batch_num % 15):
        result = process_row((index, url))
        results.append(result)
    
    return results

def main():
    # Read CSV
    df = pd.read_csv(r"C:\Users\agney\Downloads\devices_rows(1).csv")
    
    # Skip first 2 rows and extract data
    df_to_process = df[2:].copy()
    rows_data = [(idx, row['urlss']) for idx, row in df_to_process.iterrows()]
    
    # Split into batches of 1000
    batch_size = 1000
    batches = []
    for i in range(0, 7000, batch_size):
        batch = rows_data[i:i + batch_size]
        batches.append((i // batch_size + 1, batch))
    
    print(f"Total rows: {len(rows_data)}")
    print(f"Number of batches: {len(batches)}")
    print(f"Processing with 7 workers...")
    
    # Process batches in parallel with 15 workers
    with Pool(processes=7) as pool:
        results = pool.map(process_batch, batches)
    
    print("All batches processed!")

if __name__ == "__main__":
    main()