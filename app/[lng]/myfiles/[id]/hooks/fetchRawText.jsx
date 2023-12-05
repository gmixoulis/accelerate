import { useEffect, useState } from "react"
import axios from "axios"

import * as MyFilesService from "@/app/[lng]/myfiles/services/MyFilesService"

export const FetchRawText = (rawTextFileID) => {
  const [rawText, setRawText] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (rawTextFileID === null) return

    if (loading === false) return

    if (rawText) return

    const fetchRawTextFromBackend = async () => {
      const response = await MyFilesService.getDownloadUrl(rawTextFileID, false)

      const downloadUrl = response.data.downloadUrl

      const rawTextReponse = await axios.get(downloadUrl)

      console.log(rawTextReponse.data)
      return rawTextReponse.data
    }

    fetchRawTextFromBackend()
      .then((data) => {
        setLoading(false)
        setRawText(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [loading, rawText, rawTextFileID])

  const fetchRawText = () => {
    const newValue = !loading
    setLoading(newValue)
  }

  return [rawText, fetchRawText]
}
