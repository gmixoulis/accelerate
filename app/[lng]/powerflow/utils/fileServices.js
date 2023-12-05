import { BACKEND_URL } from "@/server";
import axiosRequest from "../../hooks/axiosRequest"
import axiosRequestWithoutBearer from "../../hooks/axiosRequestWithoutBearer";

const saveFile = async (file) => {
  return await axiosRequest(BACKEND_URL + "powerflow", "post", file)
}

const getFile = async (id) => {
  return await axiosRequest(`${BACKEND_URL}powerflow/${id}`)
}

export const getFileName = async (id) => {
  try {
    const response = await getFile(id)
    return response.data.Name
  } catch (e) {
    //Generate filename using date
    const date = new Date()
    return `image_${date.toISOString().split("T")[0]}_${date.getTime()}`;
  }
}

export const handleFileUpload = async (file, fileTypes, chatId) => {
  let response = null;
  try {
    response = await axiosRequest(
      BACKEND_URL + "powerflow/upload-request",
      "post",
      {
        fileName: file.name,
        contentType: file.type,
        chatID: chatId,
      }
    )
    const uploadRequestPayload = response.data

    const formData = new FormData()

    for (const field in uploadRequestPayload.fields) {
      formData.append(field, uploadRequestPayload.fields[field])
    }
    formData.append("Content-Type", file.type)
    formData.append("file", file)

    await axiosRequestWithoutBearer(uploadRequestPayload.url, "post", formData)

    const fileType = fileTypes.find(
      (fileType) => fileType.FileTypeMime === file.type
    )

    const newFile = {
      Path: uploadRequestPayload.fields.key,
      Name: file.name,
      FileTypeID: fileType.FileTypeID,
      FileSize: file.size,
    }

    const newFileInfo = await saveFile(newFile)
    const { FileID } = newFileInfo.data
    const fileData = await getFile(FileID)
    const PrivateUrl = fileData.data.PrivateUrl
    return { FileID, PrivateUrl }
  } catch (e) {
    console.log(e);
    return null;
  }
}


export async function getDownloadUrl(id, downloadAsAttachment = true) {
  try {
    const response = await axiosRequest(`${BACKEND_URL}powerflow/download-request`, "post",
      {
        FileID: id,
        DownloadAsAttachment: downloadAsAttachment,
      })
    return response.data.downloadUrl;
  } catch (e) {
    console.log(e);
    return null;
  }
}