"use client"

import { useContext, useState } from "react"
import { useParams } from "next/navigation"
import { BACKEND_URL } from "@/server"
import FileUploadIcon from "@mui/icons-material/FileUpload"
import { Chip } from "@mui/material"
import Box from "@mui/material/Box"
import { useDropzone } from "react-dropzone"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import { MyFilesContext } from "@/app/[lng]/myfiles/contexts/myFilesContext"
import { trimText } from "@/app/[lng]/myfiles/helpers/trimText"
import * as MyFilesService from "@/app/[lng]/myfiles/services/MyFilesService"
import { getFiles, saveFile } from "@/app/[lng]/myfiles/services/MyFilesService"
import { UseTranslation } from "@/app/i18n/client"
import { ErrorStatusType, Log } from "@/app/utils/DatadogBrowserLogs"
import UploadWorker from "@/app/web-workers/upload.worker.js"

const metadataExtractionAllowedFiletypes = ["image", "document", "video"]
const metadataExtractionIgnoredFileExtensions = ["txt"]
const convertFileTypesToAccept = (fileTypes) => {
  if (fileTypes.length === 0) return

  return fileTypes.reduce((acc, fileType) => {
    if (false === acc.hasOwnProperty(fileType.FileTypeMime)) {
      acc[fileType.FileTypeMime] = []
    }

    acc[fileType.FileTypeMime].push(`.${fileType.FileTypeExtension}`)

    return acc
  }, {})
}

const getColor = (props) => {
  if (props.isDragAccept) {
    return "border-green-100"
  }
  if (props.isDragReject) {
    return "border-red-100"
  }
  if (props.isFocused) {
    return "border-blue-100"
  }
  return "border-gray-500"
}

const getClass = (props) => {
  return `dropzoneContainer
    ${getColor(props)}
    border-4
    border-dashed
    rounded-md
    p-10
    text-gray-700`
}

const updateFileStateStatus = (
  prevState,
  newStatus,
  file,
  totalParts,
  updateProgress = false
) => {
  // Find the index of the file we want to update
  const index = prevState.findIndex((x) => x.key === file.name)
  if (index === -1) {
    // File not found, return the original state
    return prevState
  }

  // Create a new array with the updated file object
  const newState = [...prevState]
  // in case we dont need to upgrade progress, just keep whatever we had before
  let completedPartsNew = newState[index].completedParts
  let newProgress = newState[index].progress
  if (updateProgress === true) {
    completedPartsNew = completedPartsNew + 1
    newProgress = Math.round((completedPartsNew / totalParts) * 100)
  }

  newState[index] = {
    ...newState[index],
    status: newStatus,
    completedParts: completedPartsNew,
    progress: newProgress,
  }

  return newState
}

const updateFileStateStatusOld = (prevState, newStatus, file) => {
  // Find the index of the file we want to update
  const index = prevState.findIndex((x) => x.key === file.name)
  if (index === -1) {
    // File not found, return the original state
    return prevState
  }

  // Create a new array with the updated file object
  const newState = [...prevState]

  newState[index] = {
    ...newState[index],
    status: newStatus,
  }

  return newState
}

const requestMetadataExtractionBackendCall = async (fileID) => {
  await MyFilesService.requestMetadataExtraction(fileID)
}

const createFileBackendCall = async (s3Path, file, fileTypes) => {
  const fileType = fileTypes.find(
    (fileType) => fileType.FileTypeMime === file.type
  )

  const newFile = {
    Path: s3Path,
    Name: file.name,
    FileTypeID: fileType.FileTypeID,
    FileSize: file.size,
  }

  try {
    return await saveFile(newFile)
  } catch (e) {
    Log(
      "Failed to save new file info",
      ErrorStatusType.error,
      "UploadDropozone",
      "handleFileUpload",
      e
    )
  }
}

const calculateSizePerPart = (fileSize) => {
  if (fileSize <= 1000000000) return 10000000 // <= 1 GB => Part size 10MB
  if (fileSize > 10000000000 && fileSize <= 50000000000) return 100000000 // > 10 GB and <= 50 GB => Part Size 100MB
  return 500000000 // > 50 GB => Part Size 500MB
}

export default function UploadDropZone({ props }) {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "myfile")
  const { setFiles, fileTypes } = props
  const [filesPendingUpload, setFilesPendingUpload] = useState([])
  const { setNotification } = useContext(MyFilesContext)
  const [uploadNoticeVisible, setUploadNoticeVisible] = useState(false)

  const toggleUploadNoticeVisible = () => {
    setUploadNoticeVisible((prevState) => !prevState)
  }

  const onDrop = async (acceptedFiles) => {
    console.log(acceptedFiles[0])

    for (const file of acceptedFiles) {
      setFilesPendingUpload((prevState) => [
        ...prevState,
        {
          key: file.name,
          status: "pending",
          progress: 0,
          completedParts: 0,
        },
      ])

      if (file.size > 100000000) {
        // > 100 MB = 100000000

        await handleMultipartUpload(file)
      } else {
        await handleFileUpload(file)
      }
    }
  }

  const onDropRejected = (rejectedFiles) => {
    const rejectedErrors = rejectedFiles.reduce((acc, fileError) => {
      const fileName = fileError.file.name
      fileError.errors.forEach((error) => {
        const errorKey = error.code
        if (false === acc.hasOwnProperty(errorKey)) {
          acc[errorKey] = {
            message: error.message,
            files: [],
          }
        }

        acc[errorKey].files.push(fileName)
      })
      return acc
    }, {})

    const rejectedErrorsArray = Object.values(rejectedErrors)

    const rejectErrorStr = rejectedErrorsArray
      .map((error) => {
        const affectedFiles = error.files.join("\n")
        return `${error.message}\n ${affectedFiles}`
      })
      .join("\n\n")

    console.log(
      rejectedErrorsArray.length * 6000 > 30000
        ? 30000
        : rejectedErrorsArray.length * 6000
    )
    const delayPerError = 8000
    const maxDelay = 30000
    setNotification({
      message:
        t("Following files were rejected by the server \n\n") + rejectErrorStr,
      severity: "error",
      timeout:
        rejectedErrorsArray.length * delayPerError > maxDelay
          ? maxDelay
          : rejectedErrorsArray.length * delayPerError,
    })
  }

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      onDropRejected,
      maxSize: 500000000,
      maxFiles: 5,
      accept: convertFileTypesToAccept(fileTypes),
    })

  const submitMetadataExtractionRequest = async (file) => {
    try {
      if (
        metadataExtractionAllowedFiletypes.includes(
          file.FileType.FileTypeFamily
        )
      ) {
        if (
          false ===
          metadataExtractionIgnoredFileExtensions.includes(
            file.FileType.FileTypeExtension
          )
        ) {
          setFilesPendingUpload((prevState) =>
            updateFileStateStatus(
              prevState,
              t("Submitting for metadata extraction"),
              file,
              null,
              false
            )
          )
          await requestMetadataExtractionBackendCall(file.FileID)
        }
      }
    } catch (e) {
      Log(
        "Failed requestMetadataExtractionBackendCall",
        ErrorStatusType.error,
        "UploadDropozone",
        "handleFileUpload",
        e
      )
    }
  }

  const handleFileUpload = async (file) => {
    toggleUploadNoticeVisible()
    setFilesPendingUpload((prevState) =>
      updateFileStateStatus(prevState, "uploading...", file, 1, true)
    )

    const response = await axiosRequest(
      BACKEND_URL + "my-files/upload-request",
      "post",
      {
        fileName: file.name,
        contentType: file.type,
      }
    )

    const uploadRequestPayload = response.data

    const formData = new FormData()

    for (const field in uploadRequestPayload.fields) {
      formData.append(field, uploadRequestPayload.fields[field])
    }
    formData.append("Content-Type", file.type)
    formData.append("file", file)

    const s3Key = uploadRequestPayload.fields.key
    const uploadWorker = new UploadWorker()

    uploadWorker.onmessage = (e) =>
      handleUploadWorkerMessage(e, { s3Key, uploadId: null, file })

    uploadWorker.postMessage({
      uploadType: "normal",
      uploadRequestPayload,
      file,
    })
  }

  const handleMultipartUpload = async (file) => {
    toggleUploadNoticeVisible()
    const sizePerPart = calculateSizePerPart(file.size)
    const numberOfParts = Math.ceil(file.size / sizePerPart)

    // get the presigned urls from backend

    const uploadMultipartResponse = await axiosRequest(
      BACKEND_URL + "my-files/upload-multipart-request",
      "post",
      {
        fileName: file.name,
        contentType: file.type,
        numberOfParts: numberOfParts,
      }
    )

    const s3Key = uploadMultipartResponse.data.s3Key
    const uploadId = uploadMultipartResponse.data.uploadId
    const presignedUrls = uploadMultipartResponse.data.parts
    const fileSize = file.size
    const fileMimeType = file.type

    const uploadWorker = new UploadWorker()

    uploadWorker.onmessage = (e) =>
      handleUploadWorkerMessage(e, { s3Key, uploadId, file })

    uploadWorker.postMessage({
      uploadType: "multipart",
      presignedUrls,
      file,
      fileSize,
      fileMimeType,
    })
  }

  /**
   * When worker will finish uploading it will call this function
   * @param e
   * @param s3Key
   * @param uploadId
   * @param file
   * @returns {Promise<void>}
   */
  const handleUploadWorkerMessage = async (e, { s3Key, uploadId, file }) => {
    if (e.data.status === "error") {
      setFilesPendingUpload((prevState) =>
        updateFileStateStatus(prevState, "Error", file, null, false)
      )

      setTimeout(() => {
        //remove file from array where key == file.name
        setFilesPendingUpload((currentFiles) => {
          return currentFiles.filter((x) => x.key !== file.name)
        })
      }, 2000)

      return
    }
    //Call the backend to finalize the upload
    const uploadType = e.data.uploadType
    if (e.data.status === "completed") {
      if (uploadType === "multipart") {
        const uploadedParts = e.data.parts

        await axiosRequest(
          BACKEND_URL + "my-files/complete-multipart-upload",
          "post",
          {
            s3Key: s3Key,
            uploadId: uploadId,
            parts: uploadedParts,
          }
        )
      }

      const newFileInfo = await createFileBackendCall(s3Key, file, fileTypes)

      const files = await getFiles(["FileType,Metadata"], {
        WithoutWebsiteImages: true,
        OnlyParents: true,
      })

      const findNewFile = files.data.find(
        (file) => file.FileID === newFileInfo.data.FileID
      )

      await submitMetadataExtractionRequest(findNewFile)

      setFiles(files.data)

      setFilesPendingUpload((prevState) =>
        updateFileStateStatus(prevState, "Done", file, null, false)
      )

      setTimeout(() => {
        //remove file from array where key == file.name
        setFilesPendingUpload((currentFiles) => {
          return currentFiles.filter((x) => x.key !== file.name)
        })
        toggleUploadNoticeVisible()
      }, 2000)
    } else {
      if (uploadType === "multipart") {
        const totalParts = e.data.totalParts

        setFilesPendingUpload((prevState) =>
          updateFileStateStatus(
            prevState,
            `Uploading...`,
            file,
            totalParts,
            true
          )
        )
      }
    }
  }

  return (
    <>
      <Box>
        <div
          {...getRootProps()}
          className={getClass({ isFocused, isDragAccept, isDragReject })}
        >
          <input {...getInputProps()} />
          {isDragReject ? (
            <p>{t("Some files are not accepted")}</p>
          ) : filesPendingUpload.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <FileUploadIcon fontSize="large" />
              <p className="dark:text-white">{t("Drag n drop")}</p>
              <p className="dark:text-white">{t("Limit")}</p>
            </div>
          ) : null}
          {filesPendingUpload.map((file) => {
            return (
              <Chip
                color="primary"
                label={trimText(
                  `${file.key} - ${file.status} - ${file.progress}%`
                )}
                key={file.key}
              />
            )
          })}
        </div>
      </Box>
      <div
        className={`border border-blue-400 text-blue-500 px-4 py-3 rounded relative mt-4 transition-opacity ${
          uploadNoticeVisible ? "opacity-100" : "opacity-0"
        } duration-1000`}
        role="alert"
        data-my-custom-identifier="uniqueValue"
      >
        <strong className="font-bold">Info: </strong>
        <span className="block sm:inline">
          Please do not reload/close the page, uploading in progress...
        </span>
      </div>
    </>
  )
}
