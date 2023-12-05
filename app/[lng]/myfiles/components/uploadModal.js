import { useContext, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import { OpenInBrowser } from "@mui/icons-material"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import { LoadingButton } from "@mui/lab"
import { Button } from "@mui/material"
import axios from "axios"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import { MyFilesContext } from "@/app/[lng]/myfiles/contexts/myFilesContext"
import * as MyFilesService from "@/app/[lng]/myfiles/services/MyFilesService"
import { UseTranslation } from "@/app/i18n/client"

import { getFiles, saveFile } from "../services/MyFilesService"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

const requestMetadataExtractionBackendCall = async (fileID) => {
  await MyFilesService.requestMetadataExtraction(fileID)
}

export default function UploadModal({
  setFiles,
  fileTypes,
  setErrors,
  setNotification,
}) {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "myfile")
  const [open, setOpen] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleFileUpload = async (event) => {
    event.preventDefault()

    setLoading(true)

    const fileType = fileTypes.find(
      (fileType) => fileType.FileTypeMime === uploadFormData.file.type
    )

    if (fileType === undefined || fileType === null) {
      setNotification({
        message: t("File type not allowed"),
        severity: "error",
      })
      setLoading(false)
      return
    }

    const response = await axiosRequest(
      BACKEND_URL + "my-files/upload-request",
      "post",
      {
        fileName: uploadFormData.file.name,
        contentType: uploadFormData.file.type,
      }
    )

    const uploadRequestPayload = response.data

    const formData = new FormData()

    for (const field in uploadRequestPayload.fields) {
      formData.append(field, uploadRequestPayload.fields[field])
    }
    formData.append("Content-Type", uploadFormData.file.type)
    formData.append("file", uploadFormData.file)

    // S3 does not like us to send the Authorization header, so since
    // axios is configured to include Authroization header by default, create anew instance and remove it
    // just for this request.
    let axiosInstance = axios.create()
    delete axiosInstance.defaults.headers.common["Authorization"]

    try {
      await axiosInstance.post(uploadRequestPayload.url, formData)
    } catch (e) {
      console.log(e)
    }

    const newFile = {
      Path: uploadRequestPayload.fields.key,
      Name: uploadFormData.file.name,
      FileTypeID: fileType.FileTypeID,
    }

    let newFileInfo = null
    try {
      newFileInfo = await saveFile(newFile)
    } catch (e) {
      setNotification({
        message: "There was an error saving the file",
        severity: "error",
      })
      console.log(e.messages)
    }

    const files = await getFiles(["FileType"], { WithoutWebsiteImages: true })

    const findNewFile = files.data.find(
      (file) => file.FileID === newFileInfo.data.FileID
    )

    try {
      if (findNewFile.FileType.FileTypeFamily === "image") {
        await requestMetadataExtractionBackendCall(findNewFile.FileID)
      }
    } catch (e) {
      console.log(e)
    }

    setFiles(files.data)
    setUploadFormData({})
    fileInputRef.current.value = ""
    setLoading(false)
    setNotification({
      message: t("File uploaded successfully"),
      severity: "success",
    })
  }

  const uploadForm = useRef()
  const fileInputRef = useRef(null)

  return (
    <>
      <form
        onSubmit={handleFileUpload}
        ref={uploadForm}
        encType="multipart/form-data"
      >
        <Button
          component="label"
          variant="outlined"
          startIcon={<FileUploadIcon />}
        >
          {t("Select")}
          <input
            ref={fileInputRef}
            type="file"
            name="file"
            hidden
            onChange={(event) => {
              setUploadFormData({
                ...uploadFormData,
                file: event.target.files[0],
              })
            }}
          />
        </Button>

        <LoadingButton
          loading={loading}
          loadingPosition="start"
          startIcon={<OpenInBrowser />}
          variant="outlined"
          type="submit"
          disabled={uploadFormData.file == null}
        >
          {t("Upload")}
        </LoadingButton>
      </form>

      {/*<Button onClick={handleOpen}>Upload</Button>*/}
      {/*<Modal*/}
      {/*  open={open}*/}
      {/*  onClose={handleClose}*/}
      {/*  aria-labelledby="child-modal-title"*/}
      {/*  aria-describedby="child-modal-description"*/}
      {/*>*/}
      {/*  <Box sx={{ ...style, width: 200 }}>*/}

      {/*    <Button onClick={handleClose}>Close Child Modal</Button>*/}
      {/*  </Box>*/}
      {/*</Modal>*/}
    </>
  )
}
