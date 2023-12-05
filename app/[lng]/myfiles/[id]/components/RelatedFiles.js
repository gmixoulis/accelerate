"use client"

import { useContext, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Delete, RemoveRedEye } from "@mui/icons-material"
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft"
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight"
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Pagination,
  PaginationItem,
  Skeleton,
  Typography,
} from "@mui/material"
import { DataGridPro, GridActionsCellItem } from '@mui/x-data-grid-pro';

import { FetchFileWebsiteImages } from "@/app/[lng]/myfiles/[id]/hooks/fetchFileWebsiteImages"
import { MyFilesContext } from "@/app/[lng]/myfiles/contexts/myFilesContext"
import * as MyFilesServices from "@/app/[lng]/myfiles/services/MyFilesService"
import { UseTranslation } from "@/app/i18n/client"
import { ErrorStatusType, Log } from "@/app/utils/DatadogBrowserLogs"

const bytesToMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2)
}

export default function RelatedFiles({ file, reloadFile, view }) {
  const router = useRouter()
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "myfile")
  const [websiteImages, reloadWebsiteImages] = FetchFileWebsiteImages(
    file?.MonitoredWebsiteID
  )
  const [gridPage, setGridPage] = useState(0)
  const { message, setNotification } = useContext(MyFilesContext)

  const relatedFiles = file.RelatedFiles.map((x) => {
    return x.RelatedFile
  })

  const seenFileIDs = {}

  const allRelatedFiles = [...relatedFiles, ...websiteImages].filter((file) => {
    if (seenFileIDs[file.FileID]) {
      return false // Skip this file as its FileID has already been seen.
    } else {
      seenFileIDs[file.FileID] = true // Mark this FileID as seen.
      return true // Include this file in the result.
    }
  })

  const handleViewClick = (id) => () => {
    router.push(`/${lng}/myfiles/${id}?redirect=${file.FileID}`)
    // router.push(`/${lng}/myfiles/${id}?redirect=${file.FileID}`)
  }

  const renderThumbnail = (params) => {
    let screenshotUrl = null
    if (params.row.FileType.FileTypeFamily === "image") {
      screenshotUrl = params.row.PrivateUrl
    } else {
      const screenshotFile = params.row.RelatedFiles?.find(
        (x) => x.Type === "screenshot"
      )

      screenshotUrl = screenshotFile?.RelatedFile?.PrivateUrl
    }

    return (
      <>
        {screenshotUrl ? (
          <picture className={"file-table-thumbnail"}>
            <img src={screenshotUrl} alt={params.row.Alt ?? ""} />
          </picture>
        ) : (
          <Skeleton
            sx={{ bgcolor: "grey.900" }}
            variant="rectangular"
            width={50}
            height={50}
          />
        )}
      </>
    )
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return `${day}/${month}/${year}   ${hours.toLocaleString(undefined, {
      minimumIntegerDigits: 2,
    })}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}`
  }

  const handleDeleteClick = (id) => () => {
    const deleteAsync = async () => {
      await MyFilesServices.deleteFile(id)
    }
    deleteAsync()
      .then(() => {
        reloadFile()
        reloadWebsiteImages()
        setNotification({
          message: t("File deleted successfully"),
          severity: "success",
        })
      })
      .catch((e) => {
        Log(
          "There was an error deleting the file",
          ErrorStatusType.error,
          "RelatedFiles",
          "handleDeleteClick",
          e
        )
        setNotification({
          message: t("There was an error deleting the file"),
          severity: "error",
        })
      })
  }

  const columns = [
    {
      field: "thumbnail",
      headerName: t("Thumbnail"),
      width: 200,
      editable: false,
      align: "center",
      renderCell: (params) => renderThumbnail(params),
    },
    {
      field: "Name",
      headerName: t("Name"),
      width: 150,
      editable: true,
    },
    {
      field: "Title",
      headerName: t("Title"),
      width: 150,
      editable: true,
    },
    {
      field: "Type",
      headerName: t("Type"),
      valueGetter: (params) => params.row.FileType.FileTypeFamily,
      width: 150,
    },
    {
      field: "Date",
      headerName: t("Date"),
      valueGetter: (params) => formatDate(params.row.CreatedAt),
      width: 150,
    },
    {
      field: "Size",
      headerName: t("Size"),
      valueGetter: (params) => {
        return `${bytesToMB(params.row.Metadata?.Size)}MB`},
      width: 150,
    },
    {
      field: "actions",
      headerName: t("Actions"),
      type: "actions",
      width: 150,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            key={0}
            icon={<RemoveRedEye className="w-6 h-6 text-blue-500" />}
            label="Edit"
            className="textPrimary"
            onClick={handleViewClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            key={2}
            icon={<Delete className="w-6 h-6 text-blue-500" />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

  return view === "table" ? (
    <>
      <DataGridPro
        getRowId={(row) => row.FileID}
        rows={allRelatedFiles}
        columns={columns}
        className="dark:text-white"
        autoHeight={false}
      />
    </>
  ) : (
    <>
      <Grid container spacing={3}>
        {allRelatedFiles
          .slice(gridPage * 12, gridPage * 12 + 12)
          .map((file) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={file.FileID}>
              <Card
                sx={{ maxWidth: 345 }}
                className="bg-white dark:bg-darkslategray-200 dark:text-white"
              >
                <CardMedia
                  component="img"
                  sx={{ height: 140 }}
                  image={file.PrivateUrl}
                  title={file.Name}
                  alt={file.Alt ?? t("No alt text")}
                  className="bg-gray-200 dark:bg-gray-700"
                />
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    className="!text-7xl"
                    noWrap
                    title={file.Name}
                  >
                    {file.Name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="dark:text-gray-300"
                  >
                    {file.Title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="dark:text-gray-300"
                  >
                    {file.FileType.FileTypeFamily}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    className="dark:text-gray-300"
                  >
                    {formatDate(file.CreatedAt)}
                  </Typography>
                </CardContent>
                <CardActions style={{ marginTop: "auto" }}>
                  <IconButton onClick={handleViewClick(file.FileID)}>
                    <RemoveRedEye className="w-6 h-6 text-blue-500" />
                  </IconButton>
                  <IconButton onClick={handleDeleteClick(file.FileID)}>
                    <Delete className="w-6 h-6 text-blue-500" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        <Grid item xs={12} container justifyContent="flex-end" paddingY={2}>
          <Pagination
            count={Math.ceil(allRelatedFiles.length / 12)}
            page={gridPage + 1}
            onChange={(e, page) => setGridPage(page - 1)}
            color="primary"
            renderItem={(item) => (
              <PaginationItem
                slots={{
                  previous: KeyboardArrowLeftIcon,
                  next: KeyboardArrowRightIcon,
                }}
                {...item}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  )
}
