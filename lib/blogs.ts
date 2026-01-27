import fs from "fs"
import path from "path"
import matter from "gray-matter"

const blogsDirectory = path.join(process.cwd(), "/content/blogs")

// Define the Blog type
export type Blog = {
  id: string
  title: string
  date: string
  excerpt: string
  content: string
  coverImage?: string
}

// Get all blog IDs for static paths
export async function getAllBlogIds(): Promise<string[]> {
  const fileNames = fs.readdirSync(blogsDirectory)
  return fileNames.map((fileName) => {
    return fileName.replace(/\.md$/, "")
  })
}

// Get all blogs with basic info for listing
export async function getAllBlogs(): Promise<Blog[]> {
  const fileNames = fs.readdirSync(blogsDirectory)
  const allBlogsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, "")

    // Read markdown file as string
    const fullPath = path.join(blogsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      title: matterResult.data.title || "",
      date: matterResult.data.date || "",
      excerpt: matterResult.data.excerpt || "",
      coverImage: matterResult.data.image || "",
      content: "", // Don't need content for listing
    }
  })

  // Sort blogs by date
  return allBlogsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}
// Get a single blog by ID
export async function getBlogData(id: string): Promise<Blog> {
  const fullPath = path.join(blogsDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, "utf8")

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  // Do NOT convert content into HTML here
  const contentMarkdown = matterResult.content

  // Combine the data with the id and contentMarkdown
  return {
    id,
    title: matterResult.data.title || "",
    date: matterResult.data.date || "",
    excerpt: matterResult.data.excerpt || "",
    coverImage: matterResult.data.image || "",
    content: contentMarkdown, // ← Keep as Markdown
  }
}
