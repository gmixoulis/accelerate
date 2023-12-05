"use client"

import * as React from "react"
import { redirect } from "next/navigation"
import { BACKEND_URL } from "@/server"
import AddIcon from "@mui/icons-material/Add"
import CancelIcon from "@mui/icons-material/Close"
import DeleteIcon from "@mui/icons-material/DeleteOutlined"
import EditIcon from "@mui/icons-material/Edit"
import SaveIcon from "@mui/icons-material/Save"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import {
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
  GridRowModes,
  GridToolbarContainer,
} from "@mui/x-data-grid"
import { randomId } from "@mui/x-data-grid-generator"
import PropTypes from "prop-types"
import { toast } from "react-toastify"

import axiosRequest from "../hooks/axiosRequest"

let lnth = 0
const fetchCountries = async () => {
  const response = await axiosRequest(`${BACKEND_URL}country/`)
  lnth = response?.data?.Countries.length + 1
  console.log(response.data?.Countries)
  const countriesData =
    response?.data?.Countries.map((country) => ({
      id: country.CountryID,
      name: country.EnglishName,
      CountryCode_2: country.CountryCode_2,
      CountryCode_3: country.CountryCode_3,
      Nationality: country.Nationality,
      ContinentID: country.Continent.ContinentID,
      ContinentDescription: country.Continent.Description,
    })) || []

  return countriesData
}

const addCountry = async (newCountry) => {
  try {
    const response = await axiosRequest(
      `${BACKEND_URL}country/`,
      "post",
      newCountry
    )
    return response.data
  } catch (error) {
    console.error("Error adding country:", error)
    throw error
  }
}

const deleteCountry = async (countryid) => {
  try {
    const response = await axiosRequest(
      `${BACKEND_URL}country/${countryid}`,
      "delete"
    )
    return response.data
  } catch (error) {
    console.error("Error editing country:", error)
    throw error
  }
}
FullFeaturedCrudGrid.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  handleEditCountry: PropTypes.func, // Function to handle editing countries
}

export default function FullFeaturedCrudGrid({
  title,
  subheader,
  chartData,
  ...other
}) {
  const [rows, setRows] = React.useState([]) // Define setRows as a state setter function
  const [rowModesModel, setRowModesModel] = React.useState({}) // Define setRowModesModel as a state setter function

  React.useEffect(() => {
    redirect("/tenants-app/role")
    async function loadInitialData() {
      const data = await fetchCountries()
      setRows(data)
    }

    loadInitialData()
  }, [])

  const handleEditCountry = async (id, updatedInfo) => {
    try {
      const response = await axiosRequest(
        `${BACKEND_URL}country/${id}`,
        "patch",
        updatedInfo
      )
      return response.data
    } catch (error) {
      console.error("Error editing country:", error)
      throw error
    }
  }

  function EditToolbar(props) {
    const { setRows, setRowModesModel } = props

    const handleClick = () => {
      const id = randomId()
      setRows((oldRows) => [
        {
          id: lnth,
          name: "",
          CountryCode_2: "",
          CountryCode_3: "",
          Nationality: "",
          CountryPolygon: "",
          isNew: true,
        },
        ...oldRows, // Change made here
      ])
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [lnth]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
      }))
    }

    return (
      <GridToolbarContainer>
        <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
          Add record
        </Button>
      </GridToolbarContainer>
    )
  }

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }

  const handleSaveClick = (id) => async () => {
    const rowToUpdate = rows.find((row) => row.id === id)

    const updatedInfo = {
      ...(rowToUpdate.name !== null && { EnglishName: rowToUpdate.name }),
      ...(rowToUpdate.CountryCode_2 !== null && {
        CountryCode_2: rowToUpdate.CountryCode_2,
      }),
      ...(rowToUpdate.CountryCode_3 !== null && {
        CountryCode_3: rowToUpdate.CountryCode_3,
      }),
      ...(rowToUpdate.Nationality !== null && {
        Nationality: rowToUpdate.Nationality,
      }),
      ...(rowToUpdate.ContinentID !== null && {
        ContinentID: rowToUpdate.ContinentID,
      }),
      ...(rowToUpdate.ContinentDescription !== null && {
        ContinentDescription: rowToUpdate.ContinentDescription,
      }),
      // If you have more fields, continue in this pattern
    }

    try {
      if (rowToUpdate.isNew) {
        // If the row is new, send a POST request
        await processRowUpdate(rowToUpdate.id)
      } else {
        // If the row is not new, send a PATCH request
        await handleEditCountry(id, updatedInfo)
      }
      setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
    } catch (error) {
      // Handle error, e.g., show an error message
    }
  }

  const handleDeleteClick = (id) => async () => {
    try {
      await deleteCountry(id)
      setRows(rows.filter((row) => row.id !== id))
    } catch (error) {
      toast.error("Error deleting country")
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

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const processRowUpdate = async (newRow) => {
    //const originalRow = { ...newRow, isNew: false }
    const originalRow = rows.find((row) => row.id === newRow.id)
    const updatedRow = { ...originalRow, ...newRow }

    let updatedInfo = {
      // ...(updatedRow.CountryID !== null && { CountryID: updatedRow.id }),
      ...(updatedRow.name !== null && { EnglishName: updatedRow.name }),
      ...(updatedRow.CountryCode_2 !== null && {
        CountryCode_2: updatedRow.CountryCode_2,
      }),
      ...(updatedRow.CountryCode_3 !== null && {
        CountryCode_3: updatedRow.CountryCode_3,
      }),
      ...(updatedRow.Nationality !== null && {
        Nationality: updatedRow.Nationality,
      }),

      ...(updatedRow.CountryPolygon !== null && { CountryPolygon: null }),
    }

    if (newRow.isNew) {
      updatedInfo = {
        ...updatedInfo,
        ...(updatedRow.ContinentID !== null && {
          ContinentID: updatedRow.ContinentID,
        }),
      }
    } else {
      updatedInfo = {
        ...updatedInfo,
        ...(updatedRow.ContinentID !== null && {
          ContinentID: updatedRow.ContinentID,
        }),
        ...(updatedRow.ContinentDescription !== null && {
          ContinentDescription: updatedRow.ContinentDescription,
        }),
      }
    }
    try {
      if (newRow.isNew) {
        // If the row is new, send a POST request
        await addCountry(updatedInfo)
      } else {
        await handleEditCountry(updatedRow.id, updatedInfo) // Here, we pass the id and the updatedInfo separately
        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)))
      }
    } catch (error) {
      console.log(error)
    }
    delete updatedRow.isNew
    return updatedRow
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      type: "number", // Assuming ID is a number
      width: 80,
      align: "left",
      headerAlign: "left",
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      type: "text",
      width: 180,
      editable: true,
    },
    {
      field: "CountryCode_2",
      headerName: "Country Code (2)",
      type: "text",
      width: 180,
      editable: true,
    },
    {
      field: "CountryCode_3",
      headerName: "Country Code (3)",
      type: "text",
      width: 180,
      editable: true,
    },
    // Add more fields here as needed
    {
      field: "Nationality",
      headerName: "Nationality",
      type: "text",
      width: 150,
      editable: true,
    },

    {
      field: "ContinentID",
      headerName: "Continent ID",
      type: "number",
      width: 120,
      editable: true,
    },
    {
      field: "ContinentDescription",
      headerName: "Continent Description",
      type: "text",
      width: 180,
      editable: true,
    },
    // Add more fields as needed
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",

      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ]
      },
    },
  ]

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
      <DataGrid
        className="dark:!text-white w-fit w-max-[95%] text-[15px]"
        key={rows.id}
        rows={rows}
        columns={columns}
        editMode="row"
        columnBuffer={2}
        columnThreshold={2}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  )
}
