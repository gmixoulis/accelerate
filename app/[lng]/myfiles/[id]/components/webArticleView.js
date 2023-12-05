"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import { Typography } from "@material-tailwind/react"
import { Button, Grid } from "@mui/material"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import CopyButton from "@/app/[lng]/myfiles/[id]/components/CopyButton"
import MarkdownMessage from "@/app/[lng]/powerflow/components/Chat/MarkdownMessage"
import { UseTranslation } from "@/app/i18n/client"

const redirectToPowerFlowBtn = (router, lng, article) => {
  localStorage.setItem("myfiles", article)

  router.push(`/${lng}/powerflow?redirectedFrom=myfiles`)
}

export default function WebArticleView({ monitoredWebsiteID }) {
  const [article, setArticle] = useState({})
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "myfile")
  const router = useRouter()

  useEffect(() => {
    const fetchArticle = async () => {
      return await axiosRequest(
        `${BACKEND_URL}my-files/webscraping/${monitoredWebsiteID}/get-articles`,
        "get",
        null
      )
    }

    fetchArticle()
      .then((res) => {
        setArticle(res.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [monitoredWebsiteID])

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={2}>
          <Typography variant={"h1"} className={"text-7xl"}>
            {t("Website Article")}
            <CopyButton content={article?.ArticleContent} />
          </Typography>
        </Grid>
        <Grid item xs={12} sm={2} textAlign={"center"}>
          <Button
            type="button"
            variant="outlined"
            onClick={() =>
              redirectToPowerFlowBtn(router, lng, article?.ArticleContent)
            }
            disabled={!article?.ArticleContent}
          >
            {t("Send to Powerflow")}
          </Button>
        </Grid>
      </Grid>
      <Typography id="transition-modal-title" variant="h6" component="h2">
        {article?.ArticleTitle ?? t("Website text is processing")}
      </Typography>
      <MarkdownMessage
        message={article?.ArticleContent ?? t("Website text is processing")}
      ></MarkdownMessage>
    </>
  )
}
