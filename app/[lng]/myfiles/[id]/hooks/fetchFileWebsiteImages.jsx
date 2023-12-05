import { useEffect, useState } from "react"

import * as MyFilesService from "@/app/[lng]/myfiles/services/MyFilesService"
import { ErrorStatusType, Log } from "@/app/utils/DatadogBrowserLogs"

export const FetchFileWebsiteImages = (MonitoredWebsiteID) => {
  const [websiteImages, setWebsiteImages] = useState([])
  const [reload, setReload] = useState(false)

  useEffect(() => {
    if (MonitoredWebsiteID === undefined || MonitoredWebsiteID === null) return

    const fetchWebsiteImages = async () => {
      const response = await MyFilesService.getFiles(["FileType"], {
        MonitoredWebsiteID: MonitoredWebsiteID,
        FileTypeFamily: "image",
      })

      return response.data
    }

    fetchWebsiteImages()
      .then((data) => {
        setWebsiteImages(data)
      })
      .catch((error) => {
        Log(
          "Cannot fetch image website",
          ErrorStatusType.error,
          "FetchFileWebsiteImages",
          "fetchWebsiteImages",
          error
        )
        console.log(error)
      })
  }, [MonitoredWebsiteID, reload])

  const reloadWebsiteImages = () => {
    const newValue = !reload
    setReload(newValue)
  }

  return [websiteImages, reloadWebsiteImages]
}
