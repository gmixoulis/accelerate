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
import PropTypes from "prop-types"

import axiosRequest from "../../hooks/axiosRequest"
import DataInputModal from "../components/DataInputModal"

function GenericGrid({ data, apiName, fields, apiFields, fetchApi }) {
  const [rows, setRows] = React.useState(data || [])
  const [rowModesModel, setRowModesModel] = React.useState({})
  const [openModal, setOpenModal] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  if (loading) {
    return <Typography variant="h1">{loading ? <Skeleton /> : rows}</Typography>
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }
  const handleAdd = async (rowToUpdate) => {
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
      setRows(rows.filter((row) => row.id !== id))
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
  const columns =
    data && data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1),
          minWidth: 50,
          resizable: true,
          editable: true,
        }))
      : []

  // Add the actions column
  columns.push({
    field: "actions",
    type: "actions",
    headerName: "Actions",
    minWidth: 50,
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
        Add New Data
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
          onSave={(newData) => {
            // Handle the new data addition here
            // For example, you can update the rows state with the new data
            handleAdd(newData)
            setTimeout(() => {
              fetchApi()
                .then((data) => {
                  setRows(data)
                })
                .finally(() => setLoading(false))
            }, 1000)
          }}
          // Pass the necessary props to the modal

          // Add any other necessary props
        />
        <DataGridPro
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
