import pandas as pd
import subprocess

# List of country codes
country = ['AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AR', 'AS', 'AT', 'AU', 'AW', 'AZ', 'BB', 'BD', 'BE', 'BF', 
           'BG', 'BH', 'BI', 'BJ', 'BM', 'BO', 'BR', 'BS', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 
           'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 
           'ER', 'ES', 'ET', 'FI', 'FJ', 'FR', 'GA', 'GB', 'GD', 'GE', 'GH', 'GM', 'GN', 'GQ', 'GR', 'GT', 'GW', 
           'GY', 'HN', 'HT', 'ID', 'IE', 'IL', 'IN', 'IQ', 'IR', 'IS', 'IT', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 
           'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MD', 
           'MG', 'ML', 'MM', 'MN', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NE', 'NG', 'NI', 
           'NL', 'NO', 'NP', 'NZ', 'OM', 'PA', 'PE', 'PH', 'PK', 'PL', 'PR', 'PT', 'PY', 'QA', 'RO', 'RS', 'RU', 
           'RW', 'SA', 'SC', 'SD', 'SE', 'SG', 'SI', 'SK', 'SL', 'SN', 'SO', 'SR', 'SV', 'SZ', 'TC', 'TD', 'TG', 
           'TH', 'TJ', 'TL', 'TN', 'TR', 'TT', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VC', 'VE', 'VG', 'VN', 'WS', 
           'YE', 'ZA', 'ZM', 'ZW']

# Read CSV
df = pd.read_csv(r"C:\Users\agney\Downloads\devices_rows(1).csv")

# Loop through rows and countries
for index, row in df.iterrows():
    original_url = row['urlss']
    for c in country:
        url_to_get = original_url.replace("mobgsm", f"{c}.mobgsm")
        
        # Build the curl command
        cmd = [
            "curl",
            "-s",                     # silent
            "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            url_to_get
        ]
        
        try:
            # Run curl via subprocess
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            html = result.stdout
            print(f"Fetched {url_to_get} -> {len(html)} chars")
            
        except subprocess.CalledProcessError as e:
            print(f"Error fetching {url_to_get}: {e}")