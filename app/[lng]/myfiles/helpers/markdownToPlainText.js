import MarkdownIt from "markdown-it"
import plainText from "markdown-it-plain-text"





export function markdownToPlainText(text) {
  const md = new MarkdownIt()
  md.use(plainText)

  md.render(text)

  return md.plainText
}
