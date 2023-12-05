"use client"

import { useContext, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Cancel,
  Delete,
  ModeEdit,
  RemoveRedEye,
  Save,
} from "@mui/icons-material"
import { Divider, Grid, Skeleton } from "@mui/material"
import Box from "@mui/material/Box"
import {
  DataGridPro ,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarFilterButton,
  elGR,
  enUS,
} from '@mui/x-data-grid-pro';

import UploadDropZone from "@/app/[lng]/myfiles/components/UploadDropZone"
import UploadUrl from "@/app/[lng]/myfiles/components/uploadUrl"
import { MyFilesContext } from "@/app/[lng]/myfiles/contexts/myFilesContext"
import * as MyFilesServices from "@/app/[lng]/myfiles/services/MyFilesService"
import { UseTranslation } from "@/app/i18n/client"
import { ErrorStatusType, Log } from "@/app/utils/DatadogBrowserLogs"

import * as MyFilesService from "./services/MyFilesService"
import styles from "./styles/myfiles.module.css"

const bytesToMB = (bytes) => {
  return (bytes / (1024 * 1024)).toFixed(2)
}

const fetchFileTypes = async (setFileTypes) => {
  console.log("Fetching filestypes")
  const fileTypes = await MyFilesService.getFileTypes()
  setFileTypes(fileTypes.data)
}
export default function Home() {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "myfile")
  const router = useRouter()
  const [files, setFiles] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [fileTypes, setFileTypes] = useState([])
  const { setNotification } = useContext(MyFilesContext)

  //Locale text based on current lng
  const localeText =
    lng === "el"
      ? elGR.components.MuiDataGrid.defaultProps.localeText
      : enUS.components.MuiDataGrid.defaultProps.localeText

  const fetchFiles = async () => {
    const files = await MyFilesService.getFiles(["FileType,Metadata"], {
      WithoutWebsiteImages: true,
      OnlyParents: true,
    })

    setFiles(files.data)
  }

  function formatDate(dateStr) {
    // const date = new Date(dateStr)
    // const year = date.getFullYear()
    // const month = (date.getMonth() + 1).toString().padStart(2, "0")
    // const day = date.getDate().toString().padStart(2, "0")
    // const hours = date.getHours()
    // const minutes = date.getMinutes()
    // return `${day}/${month}/${year}   ${hours.toLocaleString(undefined, {
    //   minimumIntegerDigits: 2,
    // })}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}`
    return new Date(dateStr)
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleViewClick = (id) => () => {
    router.push(`/${lng}/myfiles/${id}`)
  }

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id) => () => {
    const deleteAsync = async () => {
      await MyFilesServices.deleteFile(id)
      await fetchFiles()
    }

    deleteAsync().then(() => {
      setNotification({
        message: t("File deleted successfully"),
        severity: "success",
      })
    })
  }

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = files.find((row) => row.FileID === id)
    if (editedRow.isNew) {
      setFiles(files.filter((row) => row.FileID !== id))
    }
  }

  const processRowUpdate = async (newRow) => {
    const updatedRow = { ...newRow, isNew: false }

    const updatedInfo = {
      ...(updatedRow.Name !== null && { Name: updatedRow.Name }),
      ...(updatedRow.Title !== null && { Title: updatedRow.Title }),
      ...(updatedRow.Alt !== null && { Alt: updatedRow.Alt }),
    }

    try {
      await MyFilesService.updateFile(updatedRow.FileID, updatedInfo)

      setFiles(
        files.map((row) => (row.FileID === newRow.FileID ? updatedRow : row))
      )
      setNotification({
        message: t("File updated successfully"),
        severity: "success",
      })
      return updatedRow
    } catch (e) {
      Log(
        "Failed to update file",
        ErrorStatusType.error,
        "processRowUpdate",
        "MyFilesService.updateFile",
        e
      )

      setNotification({ message: t("File updated failed"), severity: "error" })
    }
  }

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const renderThumbnail = (params) => {
    let screenshotUrl = null
    if (params.row.FileType.FileTypeFamily === "image") {
      screenshotUrl = params.row.PrivateUrl
    } else {
      const screenshotFile = params.row.RelatedFiles.find(
        (x) => x.Type === "screenshot"
      )

      screenshotUrl = screenshotFile?.RelatedFile?.PrivateUrl
    }

    return (
      <>
        {screenshotUrl ? (
          <picture className={styles.fileTableThumbnail}>
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

  const TypeFilterInput = (props) => {
    const { item, applyValue, focusElementRef } = props
    const [value, setValue] = useState("")

    const handleChange = (event) => {
      setValue(event.target.value)
      applyValue({ ...item, value: event.target.value })
    }

    const fileTypeFamilyUnique = [
      ...new Set(fileTypes.map((fileType) => fileType.FileTypeFamily)),
    ]

    return (
      <Box
        sx={{
          display: "inline-flex",
          flexDirection: "row",
          alignItems: "center",
          height: 48,
          pl: "20px",
        }}
      >
        <select
          value={value}
          onChange={handleChange}
          className="dark:text-white"
        >
          <option key="none" value={""}>
            {t("Please select")}
          </option>
          {fileTypeFamilyUnique.map((fileType) => {
            return (
              <option key={fileType} value={fileType}>
                {fileType}
              </option>
            )
          })}
        </select>
      </Box>
    )
  }

  const typeFilterOperator = {
    label: "equals",
    value: "equals",
    getApplyFilterFn: (filterItem, column) => {
      if (!filterItem.value) {
        return null
      }
      return (params) => {
        return params.value === filterItem.value
      }
    },
    InputComponent: TypeFilterInput,
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
      filterOperators: [typeFilterOperator],
    },
    {
      field: "Date",
      headerName: t("Date"),
      valueGetter: (params) => formatDate(params.row.CreatedAt),
      valueFormatter: (params) => {
        const date = params.value
        const year = date.getFullYear()
        const month = (date.getMonth() + 1).toString().padStart(2, "0")
        const day = date.getDate().toString().padStart(2, "0")
        const hours = date.getHours()
        const minutes = date.getMinutes()
        return `${day}/${month}/${year}   ${hours.toLocaleString(undefined, {
          minimumIntegerDigits: 2,
        })}:${minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })}`
      },
      sortComparator: (v1, v2) => v1.getTime() - v2.getTime(),
      width: 150,
    },
    {
      field: "Size",
      headerName: t("Size"),
      valueGetter: (params) => {
        return `${bytesToMB(params.row.Metadata?.Size)}MB`
      },
      width: 150,
    },
    {
      field: "actions",
      headerName: t("Actions"),
      type: "actions",
      width: 150,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={0}
              icon={<Save className="w-6 h-6 text-blue-500" />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={1}
              icon={<Cancel className="w-6 h-6 text-blue-500" />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

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
            key={1}
            icon={<ModeEdit className="w-6 h-6 text-blue-500" />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
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

  useEffect(() => {
    // noinspection JSIgnoredPromiseFromCall
    fetchFiles(setFiles)
    // noinspection JSIgnoredPromiseFromCall
    fetchFileTypes(setFileTypes)
  }, [])

  function CustomToolbar() {
    return (
      <div>
        <GridToolbarFilterButton />
      </div>
    )
  }

  return (
    <>
      <Grid container className={"mb-10 mt-2"}>
        <Grid item xs={12} sm>
          <UploadDropZone props={{ setFiles, fileTypes }} />
        </Grid>
        <Divider
          sx={{
            display: { xs: "inline-flex", md: "none" },
            width: "100%",
            my: 1,
            "&::before, &::after": { borderColor: "grey.300" },
            "&::before, &::after, .dark &": { borderColor: "grey.500" },
          }}
        >
          {t("OR")}
        </Divider>
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            display: { xs: "none", md: "inline-flex" },
            mx: 2,
            "&::before, &::after": { borderColor: "grey.300" },
            "&::before, &::after, .dark &": { borderColor: "grey.500" },
          }}
        >
          {t("OR")}
        </Divider>
        <Grid item xs={12} sm>
          <UploadUrl setFiles={setFiles} />
        </Grid>
      </Grid>
      <Grid container rowSpacing={4}>
        <Grid item xs={12}>
          <div>
            <DataGridPro 
              initialState={{
                sorting: {
                  sortModel: [{ field: "Date", sort: "desc" }],
                },
              }}
              getRowId={(row) => row.FileID}
              rows={files}
              columns={columns}
              className="dark:text-white"
              editMode="row"
              autoHeight={false}
              rowModesModel={rowModesModel}
              onRowModesModelChange={handleRowModesModelChange}
              onRowEditStop={handleRowEditStop}
              processRowUpdate={processRowUpdate}
              slots={{
                toolbar: CustomToolbar,
              }}
              slotProps={{
                baseSelect: {
                  native: false,
                },
              }}
              localeText={localeText}
            />
          </div>
        </Grid>
      </Grid>
      {/*</main>*/}
    </>
  )
}
