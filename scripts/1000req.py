# generate_devices_json.py
import pandas as pd
import json

# Path to your CSV file
csv_file = r'C:\Users\agney\Downloads\devices_rows.csv'

# Load CSV
df = pd.read_csv(csv_file)

# List of countries
countries = [
    "Hong Kong","Singapore","Colombia","Tajikistan","Slovakia","Finland",
    "Cameroon","Japan","Germany","Sierra Leone","Lebanon","Ghana",
    "Malta","Iraq","Namibia","Bolivia","Rwanda","Norway","Denmark",
    "Netherlands","Czech Republic","Brazil","Macedonia","Tanzania",
    "Syrian","Kenya","Spain","Bosnia","Taiwan","Thailand","Peru","Tunisia",
    "United States","Sudan","Greece","Portugal","India","Zambia","Romania",
    "Ecuador","South Africa","Indonesia","France","Papua New Guinea","Belarus",
    "Sweden","Russia","Kazakhstan","Jordan","Viet Nam","Philippines","Mozambique",
    "Honduras","Jamaica","Greenland","Egypt","Morocco","Seychelles","Uruguay",
    "Switzerland","Nigeria","Dominican","Oman","New Zealand","Yemen","Korea (South)",
    "Belgium","Europe","Hungary","Afghanistan","Haiti","Zimbabwe","Ukraine","Moldova",
    "Israel","UAE Dubai","Armenia","Kuwait","Mauritius","Ethiopia","Italy","Pakistan",
    "Saudi Arabia","Azerbaijan","Poland","Argentina","Algeria","Malaysia","Bahrain",
    "Australia","Mexico","China","Bangladesh","Nepal","Austria","Uganda","Chile",
    "Iran","Qatar","Lithuania","Latvia","Sri Lanka","Montserrat","Solomon Islands",
    "Angola","Venezuela","Madagascar","Puerto Rico","Turkey","United Kingdom","Malawi",
    "Uzbekistan","Canada"
]



# Convert DataFrame to list of dicts
devices_list = df.to_dict(orient='records')



# Write JSON file
with open('devices.json', 'w', encoding='utf-8') as f:
    json.dump(devices_list, f, indent=2, ensure_ascii=False)

print("JSON file generated successfully at devices.json")
