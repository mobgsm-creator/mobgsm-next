// scripts/generateHeaders.js
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  'https://paolzxgjhucubuexdecu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2x6eGdqaHVjdWJ1ZXhkZWN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NDAwMTEsImV4cCI6MjA2NjQxNjAxMX0.MfzZVcfhhP1jUKvmKkINCZAz3vW5YOpv_pg_oZ3nqec'
);

async function generateHeaders() {
  const { data: devices, error } = await supabase
    .from("devices")
    .select("name_url");

  if (error) throw error;

  let headersContent = "";

  devices.forEach(({ name_url }) => {
    headersContent += `/mobile/${name_url}\n`;
    headersContent += `  Cache-Control: public, max-age=31536000, immutable\n\n`;
  });

  const headersPath = path.join(process.cwd(), "public", "_headers");
  fs.writeFileSync(headersPath, headersContent.trim());

  console.log(`✅ _headers file generated with ${devices.length} entries.`);
}

generateHeaders().catch((err) => {
  console.error("❌ Error generating _headers:", err);
  process.exit(1);
});
