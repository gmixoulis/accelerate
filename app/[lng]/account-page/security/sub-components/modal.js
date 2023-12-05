import React, { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import {
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react"

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { FaEye, FaEyeSlash } from "react-icons/fa"

import { UseTranslation } from "@/app/i18n/client"

import axiosRequest from "../../../hooks/axiosRequest"

export default function DialogCustomAnimation({
  open,
  handleClose,
  qr,
  code,
  email,
  setEnabled,
  setValidated,
  setSwitchChecked,
  UserID,
}) {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "security-page")
  const [errors, setErrors] = useState("")
  const [formData, setFormData] = useState({
    email: email,
    password: "",
    code: "",
  })
  const [showPassword2, setShowPassword2] = useState(false)

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }
  async function getEnabled2FA() {
    try {
      const url2FA = BACKEND_URL + `2FA/checkEnabled/${UserID}`
      const response = await axiosRequest(url2FA)
      setEnabled(response.data.enabled)
      setSwitchChecked(response.data.enabled)
      setValidated(response.data.validated)
    } catch (error) {
      console.log("Error:", error)
    }
  }

  React.useEffect(() => {
    setErrors("")
  }, [])

  async function handleFormSubmit() {
    setErrors("")
    try {
      await axiosRequest(
        BACKEND_URL + `2FA/enable-qr/${UserID}`,
        "patch",
        formData
      )
      await getEnabled2FA()
      await handleClose()
    } catch (e) {
      setErrors("Invalid code or password")
    }
  }

  function removeBackslashes(input) {
    const withoutBackslashes = input?.replace(/\\"/g, '"')
    const withHttps = withoutBackslashes?.replace(/http:/g, "https:")
    return withHttps
  }
  return (
    <div className="!w-[30vw] max-w-[40vw] !h-[70vh] z-1000">
      <Dialog id="modal" open={open} size={"md"} handler={handleClose}>
        <div className="flex items-center justify-between dark:text-white dark:bg-darkslategray-100">
          <DialogTitle className="dark:text-white">
            {t("Enable two-factor Authenticator")}
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
        <DialogContent className="dark:text-white dark:bg-gray-600">
          <h3 className="mb-2 text-lg font-medium dark:text-white text-dimgray-100">
            {t("Scan the QR code with your two-factor authentication")}
          </h3>
          <div
            className="w-[200px] mx-auto text-center mb-4 dark:text-white dark:bg-white"
            dangerouslySetInnerHTML={{ __html: removeBackslashes(qr) }}
          />
          <h3 className="mb-2 text-lg font-medium dark:text-white text-dimgray-100">
            {t(
              "If your app does not recognize the QR code, type the following key:"
            )}
          </h3>
          <div className="p-4 mx-auto mb-4 bg-gray-100 rounded !text-[13px] dark:text-white dark:bg-darkslategray-100 text-dimgray-100">
            {code}
          </div>
          <h3 className="mb-2 text-lg font-medium dark:text-white text-dimgray-100">
            {t("To finish the setup, enter the 6-digit code from the app")}
          </h3>
          <input
            type="number"
            name="code"
            value={formData.code}
            onChange={handleFormChange}
            placeholder={t("Type the 6-digit code here")}
            className="w-full p-2 mb-2 bg-white border rounded-md dark:text-white text-dimgray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
          />
          <div className="relative flex flex-col justify-center w-full mt-4 dark:text-white ">
            <input
              name="password"
              className="w-full p-2 bg-white border rounded-md dark:text-white text-dimgray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800"
              value={formData.password}
              onChange={handleFormChange}
              placeholder={t("Enter your password for verification")}
              type={showPassword2 ? "text" : "password"}
              id="password2"
            />
            {showPassword2 ? (
              <FaEyeSlash
                size={20}
                className="absolute right-9 bottom-2 lg:right-9 dark:text-white text-dimgray-200"
                onClick={() => setShowPassword2(false)}
              />
            ) : (
              <FaEye
                size={20}
                className="absolute right-9 bottom-2 lg:right-9 dark:text-white text-dimgray-200"
                onClick={() => setShowPassword2(true)}
              />
            )}
          </div>
          {errors && (
            <p className="text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:bg-opacity-75 dark:p-2">
              {errors}
            </p>
          )}
        </DialogContent>
        <DialogActions className="dark:text-white dark:bg-gray-600">
          <Button
            onClick={handleClose}
            className="capitalize hover:bg-whitesmoke !text-white !bg-gray-400 !dark:bg-gray-400  border-[0.5px] border-dimgray-200 border-solid font-light rounded-lg h-11 w-44"
          >
            {t("Cancel")}
          </Button>

          <div className="w-5" />
          {formData.email && formData.password ? (
            <Button
              onClick={handleFormSubmit}
              className="font-light capitalize rounded-lg !dark:text-white !dark:bg-dimgray-200 !bg-dimgray-200 hover:bg-dimgray-100 !text-whitesmoke h-11 w-44"
            >
              {t("Continue")}
            </Button>
          ) : (
            <Button
              disabled
              className="font-light capitalize rounded-lg !dark:text-white !dark:bg-darkslategray-200 !bg-darkslategray-200 0 !text-whitesmoke h-11 w-44"
            >
              {t("Continue")}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  )
}
