import Link from "next/link"
import { useParams } from "next/navigation"
import { Typography } from "@material-tailwind/react"

import * as MyFilesService from "@/app/[lng]/myfiles/services/MyFilesService"
import { UseTranslation } from "@/app/i18n/client"
import { ErrorStatusType, Log } from "@/app/utils/DatadogBrowserLogs"

const bytesToMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2)
}

export default function DownloadFile({ file }) {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "myfile")

  const handleDownloadLink = (e) => {
    e.preventDefault()
    const handleDownloadLinkBackendCall = async () => {
      return await MyFilesService.getDownloadUrl(file.FileID)
    }

    handleDownloadLinkBackendCall()
      .then((response) => {
        window.open(response.data.downloadUrl)
      })
      .catch((err) => {
        Log(
          "Failed to get download url",
          ErrorStatusType.error,
          "SingleFileView",
          "handleDownloadLink",
          err
        )
        throw err
      })
  }

  return (
    <>
      {file && (
        <>
          <Typography className={"text-2xl pb-3"}>Downloads</Typography>
          <Typography>
            {t("Download:")}
            <Link
              href="#"
              onClick={handleDownloadLink}
              className="underline decoration-1 focus:text-blue-600"
            >
              {t("Original")}
            </Link>
            {"   "}
            <span className="text-sm">
              {file.Metadata?.Width && (
                <>
                  ({file.Metadata?.Width} x {file.Metadata?.Height} px )
                </>
              )}
              {` - ` + bytesToMB(file.Metadata?.Size)} MB
            </span>
          </Typography>
        </>
      )}
    </>
  )
}
