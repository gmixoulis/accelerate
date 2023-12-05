"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  tableCellClasses,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { set } from "date-fns"
import { useTheme } from "next-themes"
import path from "public/images/icon-edit1.svg"
import path_dark from "public/images/icon-pen-dark.svg"
import { useForm } from "react-hook-form"
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai"
import { FaCheck, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa"

import getAccessToken from "@/app/[lng]/hooks/getAccessToken"

import { UseTranslation } from "../../../i18n/client"
import SuccessComponent from "../../components/Success"
import axiosRequest from "../../hooks/axiosRequest"
import Authenication from "./forms/Authenication"
import DevicesForm from "./forms/devices"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 10,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))

export default function Security(params) {
  const { t } = UseTranslation(params.lng, "security-page")
  const [clicked, setClicked] = useState(true)
  const [clicked2, setClicked2] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState(
    <div className="h-2.5 animate-pulse dark:bg-gray-500 bg-gray-300 rounded-full  w-12"></div>
  )
  const [errorr, setErrorr] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [reloading, setReloading] = useState(false)
  const { UserEmail, ProfileID } = getAccessToken()
  const router = useRouter()
  const handleRefresh = () => {
    setClicked(true)
    setClicked2(false)
    setErrorr("")
    setValue("password", "")

    router.replace("./security")
  }
  let svgPath
  //determine if theme is in dark mode and set the source of the path accordingly
  const { resolvedTheme } = useTheme()
  resolvedTheme === "dark" ? (svgPath = path_dark) : (svgPath = path)

  useEffect(() => {
    setEmail(UserEmail)
  }, [])

  const handleSuccessAction = async () => {
    // Call sendPostRequest here
    await sendPostRequest(password)

    // Set the reloading state to true
    setReloading(true)
  }

  function createData(name, calories, fat) {
    return { name, calories, fat }
  }
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })
  const { register, watch, setValue } = form
  const password = watch("password")
  const hasMinLength = password?.length >= 10
  const hasUpperAndLowerCase = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const hasDigit = /\d/.test(password)

  const passwordToSubmit =
    hasDigit && hasMinLength && hasSpecialChar && hasUpperAndLowerCase
  function clearThis(target) {
    target.value = ""
  }
  async function sendPostRequest(password) {
    const url = BACKEND_URL + `auth/${ProfileID}/resetPassword`
    setErrorr("")
    const data = {
      password: password,
      password2: password,
    }
    try {
      setClicked2(true)
      await axiosRequest(url, "post", data)
      setClicked2(false)
      setClicked(false)
      setShowSuccess(false)
      setReloading(false)
      handleRefresh()
    } catch (error) {
      console.log("Error:", error)
      setShowSuccess(false)
      setClicked(false)
      setClicked2(false)
      setReloading(false)
      setErrorr("New password cannot be the same as the previous one.")
    }
  }
  const handleX = () => {
    setClicked(true)
    setErrorr("")
    setReloading(false)
  }
  const rows = [
    createData(
      <h2 className="m-0 font-light text-md text-dimgray-200 dark:text-white">
        Email
      </h2>,
      <h2 className="m-0 font-bold text-md text-dimgray-200 dark:text-white">
        {email ? email : "Loading..."}
      </h2>
    ),
    createData(
      <h2 className="top-0 m-0 font-light text-md bottom-12 text-dimgray-200 dark:text-white">
        {t("Password")}
      </h2>,
      <>
        {clicked ? (
          <h2 className="m-0 font-bold text-md text-dimgray-200 dark:text-white">
            *****
          </h2>
        ) : (
          <div className="grid grid-cols-5">
            <div className="relative col-span-5 mr-6">
              <input
                className="z-10 w-full pl-3 bg-white border rounded-md h-7 border-dimgray-200"
                type={showPassword ? "text" : "password"}
                onfocus={(e) => clearThis(e.target)}
                id="password"
                {...register("password", {
                  required: "password is required",
                })}
              />

              {showPassword ? (
                <FaEyeSlash
                  size={20}
                  className="absolute right-0 text-gray-500 top-3 hover:text-gray-700"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <FaEye
                  size={20}
                  className="absolute text-gray-500 right-2 top-1 hover:text-gray-700"
                  onClick={() => setShowPassword(true)}
                />
              )}
              {/* ###### PASSWORD RULES ####### */}
              <div>
                {hasMinLength && (
                  <div className="flex items-center ">
                    <FaCheck color="green" />{" "}
                    <div className="px-1 dark:text-white">
                      {t("Minimum 10 characters")}
                    </div>
                  </div>
                )}
                {!hasMinLength && (
                  <div className="flex items-center">
                    <FaTimes color="red" />
                    <div className="px-1 dark:text-white">
                      {t("Minimum 10 characters")}
                    </div>
                  </div>
                )}
                {hasUpperAndLowerCase && (
                  <div className="flex items-center">
                    {" "}
                    <FaCheck color="green" />
                    <div className="px-1 dark:text-white">
                      {t("Lowercase and uppercase characters")}
                    </div>
                  </div>
                )}
                {!hasUpperAndLowerCase && (
                  <div className="flex items-center p-0 m-0">
                    {" "}
                    <FaTimes color="red" />{" "}
                    <div className="px-1 dark:text-white">
                      {t("Lowercase and uppercase characters")}
                    </div>
                  </div>
                )}
                {hasSpecialChar && (
                  <div className="flex items-center">
                    {" "}
                    <FaCheck color="green" />{" "}
                    <div className="px-1 dark:text-white">
                      {t("Add a special character")}
                    </div>
                  </div>
                )}
                {!hasSpecialChar && (
                  <div className="flex items-center">
                    {" "}
                    <FaTimes color="red" />{" "}
                    <div className="px-1 dark:text-white">
                      {t("Add a special character")}
                    </div>
                  </div>
                )}
                {hasDigit && (
                  <div className="flex items-center">
                    {" "}
                    <FaCheck color="green" />{" "}
                    <div className="px-1 dark:text-white">
                      {t("Contain at least one digit")}
                    </div>
                  </div>
                )}
                {!hasDigit && (
                  <div className="flex items-center">
                    {" "}
                    <FaTimes color="red" />{" "}
                    <div className="px-1 dark:text-white">
                      {t("Contain at least one digit")}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <br />
          </div>
        )}
        {errorr && (
          <div className="text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:bg-opacity-75 dark:p-2">
            {errorr}
          </div>
        )}
      </>,

      <>
        {clicked ? (
          <button
            id="edit"
            onClick={() => setClicked(false)}
            className=" text-[inherit] flex-wradiv  cursor-pointer bg-transparent border-none self-end float-right px-2 m-0 flex flex-col items-center"
          >
            <Image
              className="transition duration-200 transform w-7 hover:scale-110"
              alt=""
              src={svgPath}
            />
          </button>
        ) : (
          <div className="inline-box">
            <button
              onClick={() => handleX()}
              className=" text-[inherit] cursor-pointer bg-transparent border-none self-end float-right p-0 m-0 flex flex-col items-center"
            >
              <AiFillCloseCircle
                size={32}
                className="duration-100 text-dimgray-200 opacity-80 hover:opacity-100 hover:text-red-100 dark:text-white"
              />
            </button>
            <>
              {!passwordToSubmit ? (
                <button
                  disabled
                  onClick={() => setClicked(true)}
                  className=" text-[inherit] flex-wradiv  cursor-default bg-transparent border-none self-end float-right p-0 m-0 flex flex-col items-center"
                >
                  <AiFillCheckCircle
                    size={32}
                    className="duration-100 text-dimgray-200 opacity-80 hover:opacity-100 hover:text-green-500 dark:text-white"
                  />
                </button>
              ) : (
                <>
                  {clicked2 ? (
                    <button
                      disabled
                      className=" text-[inherit] flex-wradiv  cursor-default bg-transparent border-none self-end float-right p-0 m-0 flex flex-col items-center"
                    >
                      <AiFillCheckCircle
                        size={32}
                        className="duration-100 text-dimgray-200 opacity-80 hover:opacity-100 hover:text-green-500 dark:text-white"
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSuccess(true)}
                      className=" text-[inherit] flex-wradiv  cursor-pointer bg-transparent border-none self-end float-right p-0 m-0 flex flex-col items-center"
                    >
                      <AiFillCheckCircle
                        size={32}
                        className="duration-100 text-dimgray-200 opacity-80 hover:opacity-100 hover:text-green-500 dark:text-white"
                      />
                    </button>
                  )}
                </>
              )}
            </>
          </div>
        )}
      </>
    ),
  ]
  return (
    <>
      <div className="w-auto h-auto ">
        <div className="overflow-x-hidden w-fit row dark:bg-darkslategray-100">
          <h2 className="top-0 block row-auto p-0 m-0 font-sans flex-wradiv text-dimgray-200 text-7xl dark:text-white">
            {t("Sign In")}
          </h2>
          <br></br>
          <main className="left-0 flex flex-wrap object-contain pt-2 overflow-hidden text-center row max-w-fit w-fit">
            <TableContainer
              sx={{
                width: "49.7vw",
                objectFit: "contain",
                borderRadius: "15px",
              }}
            >
              <Table aria-label="customized table">
                <TableBody className="dark:bg-gray-700">
                  {rows.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell
                        component="th"
                        scope="row"
                        className="w-[14vw] h-[8vh]"
                      >
                        {row.name}
                      </StyledTableCell>
                      <StyledTableCell align="left" className="max-w-[13vw]">
                        {row.calories}
                      </StyledTableCell>

                      <StyledTableCell align="right">{row.fat}</StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </main>
        </div>
        <Authenication />
        <DevicesForm />
      </div>
      <SuccessComponent
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        onSuccess={handleSuccessAction} // Pass the handleSuccessAction function
        item={t("Reset password confirmation")}
        successMessage={t("Confirm action to proceed")} // Add a success message
        reloading={false}
      />
      {/* <Devices className="pt-10" /> */}
    </>
  )
}
