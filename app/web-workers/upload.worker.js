self.onmessage = async (e) => {
  if (e.data.uploadType === "normal") {
    const uploadRequestPayload = e.data.uploadRequestPayload
    const file = e.data.file

    await uploadNormalFile(uploadRequestPayload, file)

    self.postMessage({
      uploadType: "normal",
      status: "completed",
      partNumber: null,
      parts: null,
    })
  } else if (e.data.uploadType === "multipart") {
    const uploadPromises = createUploadPromises(
      e.data.presignedUrls,
      e.data.file,
      e.data.fileSize,
      e.data.fileMimeType
    )

    const uploadedParts = await uploadParts(uploadPromises)

    self.postMessage({
      uploadType: "multipart",
      status: "completed",
      parts: uploadedParts,
    })
  } else {
    throw new Error("Invalid upload type")
  }

  close()
}

const createUploadPromises = (presignedUrls, file, fileSize, fileMimeType) => {
  const partSize = Math.ceil(fileSize / presignedUrls.length)
  let uploadPromises = []

  for (let i = 0; i < presignedUrls.length; i++) {
    const start = i * partSize
    const end = (i + 1) * partSize < fileSize ? (i + 1) * partSize : fileSize
    const filePart = file.slice(start, end)
    const partNumber = presignedUrls[i].partNumber
    uploadPromises.push(
      // uploadPartDummy(
      //   presignedUrls[i].signedUrl,
      //   filePart,
      //   partNumber,
      //   fileMimeType
      // )
      uploadPart(presignedUrls[i].signedUrl, filePart, partNumber, fileMimeType)
    )
  }

  return uploadPromises
}

const uploadPartDummy = async (
  presignedUrl,
  filePart,
  partNumber,
  mimeType
) => {
  const randomTimeout = Math.floor(Math.random() * 1000) + 1

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        partNumber,
        response: {
          headers: {
            get() {
              return { etag: "12121" + partNumber }
            },
          },
        },
      })
    }, randomTimeout)
  })
}

const uploadPart = async (presignedUrl, filePart, partNumber, mimeType) => {
  try {
    const response = await fetch(presignedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": mimeType,
      },
      body: filePart, // The file or data you want to send
    })

    return { partNumber, response }
  } catch (error) {
    self.postMessage({ status: "error", error: error })
  }
}

const uploadParts = async (uploadPromises) => {
  let finishedParts = []

  await Promise.all(
    uploadPromises.map((uploadPartPromise) =>
      uploadPartPromise
        .then((uploadedPart) => {
          const partNumber = uploadedPart.partNumber
          const eTag = uploadedPart.response.headers.get("etag")

          finishedParts.push({
            ETag: eTag,
            PartNumber: partNumber,
          })

          self.postMessage({
            uploadType: "multipart",
            status: "in-progress",
            partNumber: partNumber,
            totalParts: uploadPromises.length,
            parts: null,
          })
        })
        .catch((error) => {
          self.postMessage({ status: "error", error: error })
        })
    )
  )

  // try {
  //   for (let uploadPartPromise of uploadPromises) {
  //     const uploadedPart = await uploadPartPromise
  //
  //     const partNumber = uploadedPart.partNumber
  //     const eTag = uploadedPart.response.headers.get("etag")
  //
  //     finishedParts.push({
  //       ETag: eTag,
  //       PartNumber: partNumber,
  //     })
  //
  //     self.postMessage({
  //       uploadType: "multipart",
  //       status: "in-progress",
  //       partNumber: partNumber,
  //       parts: null,
  //     })
  //   }
  // } catch (error) {
  //   self.postMessage({ status: "error", error: error })
  // }

  return finishedParts
}

const uploadNormalFile = async (uploadRequestPayload, file) => {
  const formData = new FormData()

  for (const field in uploadRequestPayload.fields) {
    formData.append(field, uploadRequestPayload.fields[field])
  }
  formData.append("Content-Type", file.type)
  formData.append("file", file)

  try {
    await fetch(uploadRequestPayload.url, {
      method: "POST",
      body: formData,
    })
  } catch (e) {
    self.postMessage({ status: "error", error: e })
  }
}
