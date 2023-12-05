import { getAllPosts } from "../../../lib/api"
import PostPreview from "../../utils/PostPreview"

export default function Blog() {
  const posts = getAllPosts(["title", "date", "excerpt", "coverImage", "slug"])

  return (
    <div className="container px-5 mx-auto">
      <main>
        <h1 className="text-3xl text-center">All Posts</h1>

        <div className="h-12"></div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-32">
          {posts.map((post, index) => (
            <div key={index}>
              <PostPreview post={post} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
