import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import fs from "fs/promises";
import { headers } from 'next/headers'
import path from "path";
import matter from "gray-matter";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import HeaderClientWrapper from "@/components/headerClientWrapper";

// SEO metadata for the categories page
export const metadata: Metadata = {
  title: "Everything you need to know about Mobile Phones!",
  description:
    "Explore research and insights into the mobile phones and find the best specs.",
  openGraph: {
      title: "Blog | Y2Map",
      description: "Read our latest articles about mobiles, specs and reviews",
      images: ["/opengraph-image.webp"],
  },
  twitter:{
    card: "summary_large_image",
    title: "Blog | Y2Map",
    description: "Read our latest articles about mobiles, specs and reviews", 
    images:["/opengraph-image.webp"]
  }
};

// Helper function to read and parse all Markdown files from /content/journals
async function getCategories() {
  const journalsDir = path.join(process.cwd(),"content", "blogs");
  const files = await fs.readdir(journalsDir);

  const categories = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(journalsDir, file);
      const fileContent = await fs.readFile(filePath, "utf8");
      const { data } = matter(fileContent);

      return {
        id: file.replace(/\.md$/, ""), // Use the filename (without extension) as the slug
        title: data.title || "Untitled",
        description: data.description || "",
        image: data.image || "/placeholder.svg",
      };
    })
  );

  return categories;
}

export default async function JournalCategories() {
  // Fetch categories dynamically from Markdown files
  const categories = await getCategories();
  const session = await getServerSession(authOptions);
  const reqHeaders = headers()
    const host =
    reqHeaders.get("x-forwarded-host") ||
    reqHeaders.get("host") ||
    "";
    // Split hostname by dots
    const parts = host.split(".");
    // If it has a subdomain (like "in.mobgsm.com"), take the first part
    // If it's just "mobgsm.com", then no country subdomain exists
    let country_domain: string | null = null;
    if (parts[0].length === 2) {
      country_domain = parts[0]; // "in" from "in.mobgsm.com"
    }
  const country = country_domain ||
    reqHeaders.get('x-geo-country') ||
    reqHeaders.get('cf-ipcountry') ||
    'unknown'

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <HeaderClientWrapper country_value={country} session={session!}/>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/blogs/${category.id}`}
            className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            aria-label={`Read more about ${category.title}`}
          >
            <div className="relative w-full h-56">
              <Image
                src={category.image}
                alt={category.title}
                fill
                style={{ objectFit: "cover" }}
                className="group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors duration-200">
                {category.title}
              </h2>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}