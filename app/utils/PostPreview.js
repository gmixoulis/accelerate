import Image from "next/image"
import Link from "next/link"

import DateFormatter from "./DateFormatter"

export default function PostPreview({ post }) {
  return (
    <>
      <div className="w-full h-screen mx-auto">
        <Link href={`/posts/${post.slug}`}>
          <div className="mt-4 space-y-2">
            <p className="text-xl font-semibold group-hover:underline">
              {post.title}
            </p>
            <DateFormatter dateString={post.date} />
            <p>{post.excerpt}</p>
          </div>
        </Link>
      </div>
    </>
  )
}
