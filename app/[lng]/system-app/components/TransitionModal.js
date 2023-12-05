// TransitionsModal.js
import * as React from "react"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Fade from "@mui/material/Fade"
import Modal from "@mui/material/Modal"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
}

export default function TransitionsModal({ open, setOpen, children }) {
  const handleClose = () => setOpen(false)

  return (
    <div className="dark:text-white dark:bg-darkslategray-100">
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            className=" dark:bg-darkslategray-100"
            sx={{ ...style, width: 900 }}
          >
            {children}
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}
