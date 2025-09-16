import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function escapeXml(unsafe: string) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }
const devicesJSONPath = path.join(process.cwd(), 'public', 'devices.json');
const devicesData = JSON.parse(fs.readFileSync(devicesJSONPath, 'utf-8'));
const countryNameMap: Record<string, string> = {
    ae: "united-arab-emirates",
    af: "afghanistan",
    am: "armenia",
    ao: "angola",
    ar: "argentina",
    at: "austria",
    au: "australia",
    az: "azerbaijan",
    ba: "bosnia-and-herzegovina",
    bd: "bangladesh",
    be: "belgium",
    bh: "bahrain",
    bo: "bolivia",
    br: "brazil",
    by: "belarus",
    ca: "canada",
    ch: "switzerland",
    cl: "chile",
    cm: "cameroon",
    cn: "china",
    co: "colombia",
    cz: "czech-republic",
    de: "germany",
    dk: "denmark",
    do: "dominican-republic",
    dz: "algeria",
    ec: "ecuador",
    eg: "egypt",
    es: "spain",
    et: "ethiopia",
    eu: "europe",
    fi: "finland",
    fr: "france",
    gh: "ghana",
    gl: "greenland",
    gr: "greece",
    hk: "hong-kong",
    hn: "honduras",
    ht: "haiti",
    hu: "hungary",
    id: "indonesia",
    il: "israel",
    in: "india",
    iq: "iraq",
    ir: "iran",
    it: "italy",
    jm: "jamaica",
    jo: "jordan",
    jp: "japan",
    ke: "kenya",
    kr: "south-korea",
    kw: "kuwait",
    kz: "kazakhstan",
    lb: "lebanon",
    lk: "sri-lanka",
    lt: "lithuania",
    lv: "latvia",
    ma: "morocco",
    md: "moldova",
    mg: "madagascar",
    mk: "north-macedonia",
    ms: "montserrat",
    mt: "malta",
    mu: "mauritius",
    mw: "malawi",
    mx: "mexico",
    my: "malaysia",
    mz: "mozambique",
    na: "namibia",
    ng: "nigeria",
    nl: "netherlands",
    no: "norway",
    np: "nepal",
    nz: "new-zealand",
    om: "oman",
    pe: "peru",
    pg: "papua-new-guinea",
    ph: "philippines",
    pk: "pakistan",
    pl: "poland",
    pr: "puerto-rico",
    pt: "portugal",
    qa: "qatar",
    ro: "romania",
    ru: "russia",
    rw: "rwanda",
    sa: "saudi-arabia",
    sb: "solomon-islands",
    sc: "seychelles",
    sd: "sudan",
    se: "sweden",
    sg: "singapore",
    sk: "slovakia",
    sl: "sierra-leone",
    sy: "syria",
    th: "thailand",
    tj: "tajikistan",
    tn: "tunisia",
    tr: "turkey",
    tw: "taiwan",
    tz: "tanzania",
    ua: "ukraine",
    ug: "uganda",
    uk: "united-kingdom",
    us: "united-states",
    uy: "uruguay",
    uz: "uzbekistan",
    ve: "venezuela",
    vn: "vietnam",
    ye: "yemen",
    za: "south-africa",
    zm: "zambia",
    zw: "zimbabwe",
  };
const countryCodeMap: Record<string, string> = Object.fromEntries(
    Object.entries(countryNameMap).map(([code, name]) => [name, code])
  );
type Device = {
  id: string;
  name: string;
  name_url: string;
  countries: string[];
};

export async function GET(
  req: Request,
  { params }: { params: { country: string } }
) {
  const { country } = params;
  
  const countrySlug = countryCodeMap[country] || country;


  const allDevices: Device[] = Object.values(devicesData) as Device[];

  

  // Build XML with updated URL format
  const urls = allDevices
    .map(
      (device) => `<url><loc>${escapeXml(
            `https://${countrySlug}.mobgsm.com/mobile/${device.name_url}-price-in-${country}`
          )}</loc></url>`
    )
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
