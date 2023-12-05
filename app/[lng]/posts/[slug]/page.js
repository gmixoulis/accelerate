import { getPostBySlug } from "../../../../lib/api"
import markdownToHtml from "../../../../lib/markdownToHtml"
import Footer from "../../components/Footer"
import Navbar from "../../components/NavbarWithout"
import markdownStyles from "./markdown-styles.module.css"

export default async function Post({ params }) {
  const post = getPostBySlug(params.slug, ["title", "author", "content"])

  const content = await markdownToHtml(post.content || "")

  return (
    <div className="h-auto py-0 my-0">
      <Navbar />
      <div className="top-0 object-contain pt-0 mt-0 ">
        <div className="flex items-center overflow-y-auto justify-top">
          {" "}
          {/* Added flex utilities and min-h-screen */}
          <div className="w-auto p-12 mx-auto border rounded-lg shadow-lg bg-inherit dark:text-white">
            {" "}
            {/* Added padding, border, rounded corners, shadow, and background color */}
            <main className="">
              <div className="w-full h-auto text-black dark:text-white">
                {" "}
                {/* Changed text color to black for better contrast */}
                <p className="text-2xl">{post.title}</p>
                <p className="text-gray-400">{post.author}</p>
                <div
                  className={markdownStyles["markdown"]}
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </main>
          </div>
        </div>
      </div>
      <Footer className="pt-5" />
    </div>
  )
}
