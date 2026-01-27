import { getBlogData, getAllBlogIds } from "@/lib/blogs"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkSlug from 'remark-slug';
import remarkAutolinkHeadings from 'remark-autolink-headings';
interface Heading {
  id: string;
  text: string;
  level: number;
}
// Generate static params for all blog posts
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const blogIds = await getAllBlogIds()
  return blogIds.map((id) => ({ slug: id }))
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params
  const blog = await getBlogData(slug)

  return {
    title: `${blog.title} | Mobgsm Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage || "/opengraph-image.webp"],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: [blog.coverImage || "/opengraph-image.webp"],
    },
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const blog = await getBlogData(slug)
  function extractHeadings(markdown: string): Heading[] {
    const lines = markdown.split('\n');
    const headingLines = lines.filter(line => /^#{1,2}\s/.test(line));
    return headingLines.map(line => {
      const match = line.match(/^(#{1,6})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return { id, text, level };
      }
      return { id: '', text: '', level: 0 };
    });
  }
  const headings = extractHeadings(blog.content);
  return (
    <div className="flex justify-center items-center min-h-screen py-10 px-4">
      <div className="flex flex-col max-w-screen-xl ">
        <h1 className="text-3xl font-bold mb-4 text-center">{blog.title}</h1>
        <div className="mt-4 flex flex-col items-center justify-center gap-8">
        <nav className="w-full p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="flex items-center justify-center font-bold mb-2 mt-2">Table of Contents</h2>
        <ul className="space-y-2">
          {headings.map((heading, idx) => (
            <li key={idx} className={`flex items-center justify-center ml-${(heading.level - 1) * 4}`}>
              <a href={`#${heading.id}`} className="text-blue-600 hover:underline">
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex items-center justify-center">
        <Image
          src={blog.coverImage || "/placeholder.svg"}
          alt={blog.title}
          width={800}
          height={450}
          className="flex items-center justify-center w-full max-w-screen-xl h-full object-cover rounded-lg mb-6"
        />
        </div>
        </div>
        {/* Render Markdown content */}
       
        <article className="prose prose-lg w-full max-w-none">
        <ReactMarkdown
  // @ts-expect-error vfile deps for remark-slug and remark-autolink-headings+
  remarkPlugins={[remarkGfm, remarkSlug, remarkAutolinkHeadings]}
  components={{
    h1: (props) => <h1 className="text-4xl font-bold my-16" {...props} />,
    h2: (props) => <h2 className="text-3xl font-semibold my-12" {...props} />,
    h3: (props) => <h3 className="text-2xl font-semibold my-8" {...props} />,
    p: (props) => <p className="text-base leading-7 my-4" {...props} />,
    li: (props) => <li className="list-disc ml-6" {...props} />,
    table: (props) => <table className="text-[7px] sm:text-base table-auto w-full border-collapse border border-gray-300 my-4" {...props} />,
    th: (props) => <th className="border border-gray-300 px-4 py-2 font-semibold bg-gray-100" {...props} />,
    td: (props) => <td className="border border-gray-300 px-4 py-2" {...props} />,
  }}
>
  {blog.content}
</ReactMarkdown>

        </article>
        
      </div>
    </div>
  )
}
