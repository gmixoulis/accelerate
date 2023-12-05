import * as React from "react"
import AddIcon from "@mui/icons-material/Add"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import { DataGrid } from "@mui/x-data-grid"

import { UseTranslation } from "../../../i18n/client"

const columns = [
  { field: "id", headerName: "ID", width: 150 },
  {
    field: "Loading1",
    headerName: "Loading1",
    width: 150,
    editable: false,
  },
  {
    field: "Loading2",
    headerName: "Loading2",
    width: 150,
    editable: false,
  },
  {
    field: "Loading3",
    headerName: "Loading3",
    width: 110,
    editable: false,
  },
]

const rows = [
  {
    id: 1,
    Loading1: "Loading...",
    Loading2: "Loading...",
    Loading3: "Loading...",
  },
]

export default function DataGridDemo({ lng }) {
  const { t } = UseTranslation(lng, "tenant-app")

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
      <Button variant="contained" color="error" startIcon={<AddIcon />}>
        {t("Add New Data")}
      </Button>
      <br />
      <div className="!mt-5">
        <DataGrid
          className="dark:bg-darkslategray-100 dark:text-white min-w-[40vw]  "
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </Box>
  )
}
