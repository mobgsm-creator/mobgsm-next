// app/pictures/[id]/page.tsx
import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";

const devicesJSONPath = path.join(process.cwd(), "public", "devices.json");
const devicesData = JSON.parse(fs.readFileSync(devicesJSONPath, "utf-8"));

export default function PicturesPage({ params }: { params: { id: string } }) {
  const device = devicesData[params.id];

  if (!device) {
    return <div className="p-6">Device not found.</div>;
  }

  // Normalize fields
  //const id = device.id;
  const name = device.name;
  const nameUrl = device.name_url.toLowerCase().replace(/_/g, "-");
  const brandName = device.brand_name;

  const description =
    device.description ||
    `${name} official pictures and gallery with high-resolution images.`;

  // Replace old domain with new one
  const metaimage = device.image?.replace("wapzon.xyz", "mobgsm.com");
  const pictures1 = device.pictures?.replace("wapzon.xyz", "mobgsm.com") || metaimage;
  const pictures2 = device.pictures2?.replace("wapzon.xyz", "mobgsm.com") || "";

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-600">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        »{" "}
        <Link
          href={`/brand/${brandName.toLowerCase()}-phones`}
          className="hover:underline"
        >
          {brandName}
        </Link>{" "}
        »{" "}
        <Link href={`/mobile/${nameUrl}`} className="hover:underline">
          Specifications
        </Link>{" "}
        » <span>{name} Pictures</span>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-bold">{name} Pictures</h1>

      {/* Images */}
      <div className="space-y-4">
        {pictures1 && (
          <div>
            <Image
              src={pictures1}
              alt={`${name} Picture`}
              width={600}
              height={600}
              className="rounded-lg shadow"
            />
          </div>
        )}
        {pictures2 && (
          <div>
            <Image
              src={pictures2}
              alt={`${name} Picture 2`}
              width={600}
              height={600}
              className="rounded-lg shadow"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-700">
        {name} official pictures. {name} is a mobile from {brandName}. The{" "}
        {description}
      </p>
    </div>
  );
}
