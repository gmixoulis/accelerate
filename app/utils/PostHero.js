import Image from "next/image"
import Link from "next/link"
import logo from "public/images/group-5.svg"

import { getPostBySlug } from "../../lib/api"
import DateFormatter from "./DateFormatter"

export default function PostHero() {
  const heroPost = getPostBySlug("hero-post", [
    "title",
    "excerpt",
    "slug",
    "date",
    "coverImage",
  ])

  return (
    <Link href={`/en/posts/${heroPost.slug}`}>
      <div className="w-full mx-auto group">
        <Image
          alt={`cover image for ${heroPost.title}`}
          src={logo}
          width={400}
          height={400}
          style={{ width: "100%" }}
        />

        <div className="grid grid-cols-1 mt-4 md:grid-cols-2">
          <div className="mb-2">
            <p className="text-xl font-semibold group-hover:underline">
              {heroPost.title}
            </p>
            <DateFormatter dateString={heroPost.date} />
          </div>
          <p>{heroPost.excerpt}</p>
        </div>
      </div>
    </Link>
  )
}
