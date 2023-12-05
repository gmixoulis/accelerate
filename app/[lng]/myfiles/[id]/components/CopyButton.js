import { useState } from "react"
import ContentCopyIcon from "@mui/icons-material/ContentCopy"
import DoneIcon from "@mui/icons-material/Done"
import { IconButton } from "@mui/material"

import { markdownToPlainText } from "@/app/[lng]/myfiles/helpers/markdownToPlainText"

const copyArticle = async (article, toggleCopyClicked) => {
  const cleanText = markdownToPlainText(article)

  try {
    await navigator.clipboard.writeText(cleanText)
    toggleCopyClicked()
  } catch (err) {
    console.error("Error in copying text: ", err)
  }
}

const ToggleCopyButton = () => {
  const [copyClicked, setCopyClicked] = useState(false)

  const toggleCopyClicked = () => {
    setCopyClicked((prevState) => !prevState)

    setTimeout(() => {
      setCopyClicked(false)
    }, 2000)
  }

  return [copyClicked, toggleCopyClicked]
}

export default function CopyButton({ content }) {
  const [copyClicked, toggleCopyClicked] = ToggleCopyButton()

  return (
    <>
      <IconButton
        aria-label="copy"
        onClick={() => copyArticle(content, toggleCopyClicked)}
        disabled={!content}
      >
        {copyClicked ? <DoneIcon /> : <ContentCopyIcon />}
      </IconButton>
    </>
  )
}
