// generateDevicesJSON.js
import fs from 'fs';
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
const supabaseUrl = 'https://paolzxgjhucubuexdecu.supabase.co'
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2x6eGdqaHVjdWJ1ZXhkZWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDAwMTEsImV4cCI6MjA2NjQxNjAxMX0.MfzZVcfhhP1jUKvmKkINCZAz3vW5YOpv_pg_oZ3nqec"

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
console.log(createClient)
const supabase = createClient();

// List of countries
const countries = [
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
];

async function main() {
  console.log('Fetching devices from Supabase...');
  const { data: devices, error } = await supabase.from('devices').select('*');

  if (error) {
    console.error('Supabase error:', error);
    return;
  }

  console.log(`Fetched ${devices.length} devices.`);

  // Create a JSON object per country
  const output = 

  countries.forEach((country) => {
    output[country] = devices.map((device) => ({
      id: device.id,
      name: device.name,
      name_url: device.name_url,
      brand_name: device.brand_name,
      main_price: device.main_price,
      description: device.description,
      keywords: device.keywords,
      image: device.image,
      specs: device.specs,
      json: device.json
    }));
  });

  // Write to a JSON file in public/ or data/ folder
  fs.writeFileSync('public/devices.json', JSON.stringify(output, null, 2));

  console.log('JSON file generated successfully at public/devices.json');
}

main();
