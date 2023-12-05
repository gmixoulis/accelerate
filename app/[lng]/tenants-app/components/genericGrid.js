"use client"

import * as React from "react"
import { BACKEND_URL } from "@/server"
import AddIcon from "@mui/icons-material/Add"
import CancelIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Skeleton from "@mui/material/Skeleton"
import Typography from "@mui/material/Typography"
import {
  DataGridPro,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  handleRowModesModelChange,
} from "@mui/x-data-grid-pro"
import { useQuery } from "@tanstack/react-query"
import PropTypes, { object } from "prop-types"

import { UseTranslation } from "../../../i18n/client"
import axiosRequest from "../../hooks/axiosRequest"
import DataInputModal from "../components/DataInputModal"
import fetchContinent from "../components/fetchContinent"
import fetchCorporateLegalType from "../components/fetchCorporate"
import fetchCountry from "../components/fetchCountry"

const dicti = {
  TenantNativeName: "Native Name",
  TenantEnglishName: "English Name",
  RoleName: "Name",
  Description: "Description",
  Continent: "Continent",
  Country: "Country",
  Domain: "Domain",
}

function GenericGrid({
  data,
  apiName,
  fields,
  apiFields,
  fetchApi,
  columnsToIgnore,
  capitalizeFLetter,
  lng,
}) {
  const [rows, setRows] = React.useState(data || [])
  const [rowModesModel, setRowModesModel] = React.useState({})
  const [openModal, setOpenModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { t } = UseTranslation(lng, "tenant-app")

  //const [columns, setColumns] = React.useState([])
  const { data: corporate } = useQuery({
    queryKey: ["CorporateLegalType"],
    queryFn: fetchCorporateLegalType,
    suspense: true,
    cacheTime: Infinity,
    refetchOnMount: false,
    refreshInterval: 10000 * 90 * 60,
  })
  const { data: country } = useQuery({
    queryKey: ["Country"],
    queryFn: fetchCountry,
    suspense: true,
    cacheTime: Infinity,
    refreshInterval: 10000 * 90 * 60,

    refetchOnMount: false,
  })
  const { data: continent } = useQuery({
    queryKey: ["Continent"],
    queryFn: fetchContinent,
    suspense: true,
    cacheTime: Infinity,
    refetchOnMount: false,
    refreshInterval: 10000 * 90 * 60,
  })
  const rowsUpdate = (rows) => {
    const updatedRows = rows.map((row) => {
      const updatedRow = {}
      for (const key in row) {
        if (row.hasOwnProperty(key)) {
          // Check if the key contains an underscore
          if (key.includes("_")) {
            // Replace the key with the substring after the last underscore
            updatedRow[key.split("_").pop()] = row[key]
            if (key.split("_").pop().includes("EnglishName")) {
              updatedRow["Country"] = row[key]
            }
            if (key.split("_").pop().includes("Continent")) {
              continent.Continents.map((continent) => {
                if (continent.ContinentID === row[key]) {
                  updatedRow["Continent"] = continent.Description
                }
              })
            }
          } else {
            // If no underscore, keep the key unchanged
            updatedRow[key] = row[key]
          }
        }
      }
      return updatedRow
    })
    return updatedRows
  }
  React.useEffect(() => {
    setRows(rowsUpdate(rows))
  }, [])

  if (loading) {
    return <Typography variant="h1">{loading ? <Skeleton /> : rows}</Typography>
  }

  const oppositeBuilder = (rowToUpdate) => {
    if (Object.keys(rowToUpdate)?.includes("CountryID")) {
      rowToUpdate.Country = rowToUpdate.CountryID
      delete rowToUpdate.CountryID
    }

    if (Object.keys(rowToUpdate)?.includes("CorporateLegalTypeID")) {
      rowToUpdate.LegalTypeName = corporate.CorporateLegalTypes.filter(
        (corporate) =>
          corporate.CorporateLegalTypeID === rowToUpdate.CorporateLegalTypeID
      )[0].LegalTypeDescription
      delete rowToUpdate.CorporateLegalTypeID
    }
    if (Object.keys(rowToUpdate)?.includes("CountryID")) {
      rowToUpdate.Country = country.Countries.filter(
        (country) => country.CountryID === rowToUpdate.CountryID
      )[0].EnglishName
      delete rowToUpdate.CountryID
    }
    return rowToUpdate
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }
  const handleAdd = async (rowToUpdate) => {
    if (
      Object.keys(rowToUpdate).includes("Country") &&
      !Object.keys(rowToUpdate).includes("CountryID")
    ) {
      rowToUpdate.CountryID = rowToUpdate.Country
      delete rowToUpdate.Country
    }
    if (Object.keys(rowToUpdate).includes("id")) {
      delete rowToUpdate.id
    }
    if (Object.keys(rowToUpdate).includes("TenantEnglishName")) {
      rowToUpdate.Source = ""

      rowToUpdate.TenantLegalName = ""
      rowToUpdate.TenantGovIDNumber = ""
      rowToUpdate.TenantVATNumber = ""
    }
    if (
      Object.keys(rowToUpdate).includes("CorporateLegalType") &&
      !Object.keys(rowToUpdate).includes("CorporateLegalTypeID")
    ) {
      rowToUpdate.CorporateLegalTypeID = rowToUpdate.CorporateLegalType
      delete rowToUpdate.CorporateLegalType
    }
    try {
      const response = await axiosRequest(
        `${BACKEND_URL}${apiName}/`,
        "post",
        rowToUpdate
      )
      return response.data
    } catch (error) {
      console.error(`Error adding ${apiName}:`, error)
      throw error
    }
  }

  const handleEdit = async (apiName, id, updatedData) => {
    try {
      const response = await axiosRequest(
        `${BACKEND_URL}${apiName}/${id}`,
        "patch",
        updatedData
      )
      return response.data
    } catch (error) {
      console.error(`Error editing ${apiName}:`, error)
      throw error
    }
  }

  const handleDelete = async (apiName, id) => {
    try {
      await axiosRequest(`${BACKEND_URL}${apiName}/${id}`, "delete")
    } catch (error) {
      console.error(`Error deleting ${apiName}:`, error)
      throw error
    }
  }

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const processRowUpdate = async (newRow) => {
    const originalRow = rows.find(
      (row) => row.id === newRow.id // Use row.id here
    )

    const updatedRow = { ...originalRow, ...newRow }
    let updatedInfo = {}
    fields.forEach((field) => {
      if (
        updatedRow[field] !== null &&
        field !== "id" && // Use "id" here
        field !== "isNew"
      ) {
        updatedInfo[field] = updatedRow[field]
      }
    })

    try {
      await handleEdit(apiName, updatedRow.id, updatedInfo) // Use updatedRow.id here
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === newRow.id // Use row.id here
            ? { ...row, ...updatedInfo }
            : row
        )
      )
    } catch (error) {
      console.log(error)
    }
    return updatedRow
  }

  const handleSaveClick = (id) => async () => {
    const rowToUpdate = rows.find((row) => row.id === id) // Use row.id here
    await processRowUpdate(rowToUpdate)
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }

  const handleDeleteClick = (id) => async () => {
    try {
      await handleDelete(apiName, id)
      setRows(rowsUpdate(rows.filter((row) => row.id !== id)))
    } catch (error) {
      console.error("Error deleting data:", error)
    }
  }

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })
    const editedRow = rows.find((row) => row.id === id)
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id))
    }
  }

  // Generate columns based on the first item's keys

  let columns =
    data && data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          minWidth: 150,
          resizable: true,
          editable: true,
        }))
      : []
  columns = columns.map((column) => {
    if (column.field.includes("_")) {
      // If underscore exists, replace the headerName with the substring after the last underscore
      column.field = column.field.split("_").pop()
    }
    if (column.headerName.includes("_")) {
      // If underscore exists, replace the headerName with the substring after the last underscore
      column.headerName = column.headerName.split("_").pop()
    }
    // You can add additional logic here if needed
    return column
  })

  columns = columns.filter((column) => !columnsToIgnore.has(column.field))

  columns.forEach(async (column) => {
    if (Object.keys(dicti).includes(column.headerName)) {
      column.headerName = t(dicti[column.headerName]) || t(column.headerName)
    }
    if (
      (column.headerName?.includes("Name") ||
        column.headerName?.includes("ID")) &&
      !column.headerName.startsWith(capitalizeFLetter(apiName))
    ) {
      const startingText = column.headerName?.match(/^(.*?)(?=Name|ID)/)

      if (startingText[0] === "LegalType") {
        column.headerName = t("Legal Type")
        column.field = "LegalTypeName"
        column.type = "singleSelect"
        column.valueOptions = corporate.CorporateLegalTypes.map(
          (country) => country.LegalTypeDescription
        )
      }
    }
    return column
  })

  columns.push({
    field: "actions",
    type: "actions",
    headerName: "Actions",
    minWidth: 150,
    resizable: true,
    getActions: ({ id }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            icon={<SaveIcon />}
            label="Save"
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            icon={<CancelIcon />}
            label="Cancel"
            onClick={handleCancelClick(id)}
          />,
        ]
      }

      return [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={handleEditClick(id)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
        />,
      ]
    },
  })

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <Button
        variant="contained"
        className="pb-5 mb-5"
        color="error"
        startIcon={<AddIcon />}
        onClick={() => setOpenModal(true)}
      >
        {t("Add New Data")}
      </Button>
      <br />
      <div className="!mt-5">
        <DataInputModal
          className="dark:bg-darkslategray-100 dark:text-white min-w-[40vw] "
          open={openModal}
          onClose={() => setOpenModal(false)}
          apiFields={apiFields}
          setOpen={setOpenModal}
          fields={fields}
          corporate={corporate}
          country={country}
          onSave={async (newData) => {
            // Handle the new data addition here
            // For example, you can update the rows state with the new data
            const newID = await handleAdd(newData)

            newData = oppositeBuilder(newData)
            const newDatas = await fetchApi()
            newData.id = newID.TenantID
            if (Object.keys(newData)[0].includes("Tenant")) {
              setRows((prevRows) => [...prevRows, newData])
            } else {
              setRows(newDatas)
            }
          }}
          // Pass the necessary props to the modal

          // Add any other necessary props
        />
        <DataGridPro
          sx={{ height: "auto", minWidth: "25vw" }}
          className="dark:!text-white w-fit w-max-[95%] text-[15px]"
          key={rows.id}
          rows={rows}
          loading={loading}
          columns={columns}
          editMode="row"
          columnBuffer={2}
          columnThreshold={2}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
        />
      </div>
    </Box>
  )
}

GenericGrid.propTypes = {
  data: PropTypes.array.isRequired,
  apiName: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
}

export default GenericGrid
