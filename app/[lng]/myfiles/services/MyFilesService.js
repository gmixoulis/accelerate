import { BACKEND_URL } from "@/server"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"

const getFile = async (id) => {
  return await axiosRequest(`${BACKEND_URL}my-files/${id}`)
}

const getFiles = async (relations, filter) => {
  const relationsString = relations && `relations=${relations.join(",")}`
  const filterQueryString =
    filter &&
    Object.keys(filter)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(filter[key])}`
      )
      .join("&")

  // Initialize an array to hold query parameters
  const queryParams = []

  // Add relationsString if it exists
  if (relationsString) {
    queryParams.push(relationsString)
  }

  // Add filterQueryString if it exists
  if (filterQueryString) {
    queryParams.push(filterQueryString)
  }

  // Join the query parameters with '&' and prepend '?' if there are any parameters
  const urlQuery = queryParams.length > 0 ? "?" + queryParams.join("&") : ""

  // Make the axios request
  return await axiosRequest(BACKEND_URL + `my-files${urlQuery}`)
}

const getFileTypes = async () => {
  return await axiosRequest(BACKEND_URL + "my-files/file-types")
}

const getLicenses = async () => {
  return await axiosRequest(BACKEND_URL + "my-files/file-licenses")
}
const saveFile = async (file) => {
  return await axiosRequest(BACKEND_URL + "my-files", "post", file)
}

const updateFile = async (fileId, file) => {
  await axiosRequest(BACKEND_URL + `my-files/${fileId}`, "patch", file)
}

const deleteFile = async (fileId) => {
  await axiosRequest(BACKEND_URL + `my-files/${fileId}`, "delete")
}

/**
 * Get a signed URL for downloading a file, if there is a need to render the URL call getPublicUrl
 * @param fileId
 * @param downloadAsAttachment
 * @returns {Promise<*|undefined>}
 */
const getDownloadUrl = async (fileId, downloadAsAttachment = true) => {
  return await axiosRequest(BACKEND_URL + `my-files/download-request`, "post", {
    FileID: fileId,
    DownloadAsAttachment: downloadAsAttachment,
  })
}

/**
 * Returns the public URL for a file
 * @param fileId
 * @returns {Promise<*|undefined>}
 */
const getPublicUrl = async (fileId) => {
  return await axiosRequest(BACKEND_URL + `my-files/download-request`, "post", {
    FileID: fileId,
    DownloadAsAttachment: false,
  })
}

const requestMetadataExtraction = async (fileID) => {
  const payload = {
    FileID: fileID,
  }

  await axiosRequest(BACKEND_URL + `services/extract-metadata`, "post", payload)
}

const requestWebscraping = async (payload) => {
  await axiosRequest(BACKEND_URL + `my-files/webscraping`, "post", payload)
}

export {
  getFiles,
  getFileTypes,
  saveFile,
  updateFile,
  deleteFile,
  getFile,
  requestMetadataExtraction,
  requestWebscraping,
  getLicenses,
  getDownloadUrl,
}
