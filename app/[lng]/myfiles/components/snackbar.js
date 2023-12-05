"use client"

import * as React from "react"
import { useContext } from "react"
import MuiAlert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import Snackbar from "@mui/material/Snackbar"
import Stack from "@mui/material/Stack"

import { MyFilesContext } from "@/app/[lng]/myfiles/contexts/myFilesContext"

const Alert = React.forwardRef(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
      sx={{ whiteSpace: "pre-line" }}
    />
  )
})

export default function MyFilesSnackbar() {
  const { message, setNotification } = useContext(MyFilesContext)

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setNotification({ message: "" })
  }

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={message.message !== ""}
        autoHideDuration={message.timeout ?? 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={message.severity}
          sx={{ width: "100%" }}
        >
          {message.message}
        </Alert>
      </Snackbar>
    </Stack>
  )
}
