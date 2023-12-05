import React, { useState } from "react"
import { BACKEND_URL } from "@/server"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import Cookies from "js-cookie"
import OtpInput from "react-otp-input"
import { toast } from "react-toastify"

import axiosRequest from "../../hooks/axiosRequestWithoutBearer"

export default function MfaDialog({ open, handleClose, password, email, lng }) {
  const [otp, setOtp] = useState("")
  let response

  // State variable to store error messages
  const [errorMessage, setErrorMessage] = useState("")

  async function handleFormSubmit() {
    const formData = { email: email, password: password, code: otp }

    // Clear error message
    setErrorMessage("")

    try {
      response = await axiosRequest(
        BACKEND_URL + `2FA/validate-qr/`,
        "patch",
        formData
      )
      const accessToken = response.data.accessToken
      Cookies.set("accessToken", response.data.accessToken)
      Cookies.set("refreshToken", response.data.refreshToken)
      if (accessToken) {
        // Make the POST request to the specified endpoint
        const responseCloudFront = await fetch(
          `${BACKEND_URL}system/get-cloudfront-signed-cookie`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (responseCloudFront.error || responseCloudFront.data?.error) {
          throw new Error(`HTTP error! status: ${responseCloudFront.status}`)
        }

        // Parse the response to get cloudFrontCookies
        const cloudFrontCookies = await responseCloudFront.json()
        // Set cookies for .accelerate.unic.ac.cy with required attributes
        for (const [name, value] of Object.entries(cloudFrontCookies)) {
          Cookies.set(name, value, {
            domain: ".accelerate.unic.ac.cy",
            secure: true, // Secured
            sameSite: "none",
          })
        }
      }
      localStorage.setItem("language", lng)
      window.location.reload()
    } catch (e) {
      console.log(e)
      setErrorMessage("Invalid MFA code. Try again.")
    }
  }

  return (
    <div className="absolute z-1000">
      <Dialog
        id="modal"
        open={open}
        size={"sm"}
        handler={handleClose}
        className="w-32 "
      >
        <div className="flex items-center justify-between dark:bg-darkslategray-100 dark:text-white">
          <DialogTitle className="dark:bg-darkslategray-100 dark:text-white">
            Multi-factor Authentication
          </DialogTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 mr-3"
            onClick={handleClose}
          >
            <path
              fillRule="evenodd"
              d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <DialogContent className="dark:bg-darkslategray-100 dark:text-white">
          <h3 className="mb-2 text-lg font-medium text-dimgray-100 dark:text-white ">
            Enter an MFA code to complete sign-in.
          </h3>
          <OtpInput
            value={otp}
            onChange={setOtp}
            inputStyle={{
              height: "3rem",
              margin: "0 1rem",
              fontSize: "2rem",
              borderRadius: "4px",
              border: "1px solid rgba(0, 0, 0, 0.3)",
            }}
            numInputs={6}
            shouldAutoFocus
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
          />
          {errorMessage && (
            <label className="text-red-500 mb-.2 mt-1.5">{errorMessage}</label>
          )}
        </DialogContent>
        <DialogActions className="dark:bg-darkslategray-100 dark:text-white">
          <div className="flex">
            <Button
              onClick={handleClose}
              variant="outlined"
              className="hover:bg-whitesmoke !capitalize  !dark:bg-gray-500 !text-dimgray-200 border-[0.5px] !border-dimgray-200 border-solid font-light rounded-lg h-11 w-44"
            >
              Cancel
            </Button>

            <div className="w-5" />
            <Button
              onClick={handleFormSubmit}
              variant="contained"
              className="font-light !capitalize rounded-lg !bg-dimgray-200 !dark:bg-darkslategray-100 !hover:bg-dimgray-100 !text-whitesmoke h-11 w-44"
            >
              Verify
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  )
}
