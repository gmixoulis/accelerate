import { useEffect, useState } from "react"

import * as MyFilesService from "@/app/[lng]/myfiles/services/MyFilesService"





export const FetchFile = (fileID) => {
  const [file, setFiles] = useState(null)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    const fetchFileInfo = async () => {
      return await MyFilesService.getFile(fileID)
    }

    fetchFileInfo().then((fetchFileResponse) => {
      setFiles(fetchFileResponse.data)
    })
  }, [fileID, reload])

  const reloadFile = () => {
    const newValue = !reload
    setReload(newValue)
  }

  return [file, reloadFile]
}
