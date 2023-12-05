"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import { useTheme } from "next-themes"
import logoDark from "public/images/group-197.svg"
import logoLight from "public/images/unic-logo-vert.svg"
import { useForm } from "react-hook-form"
import { FaCheck, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa"
import { ToastContainer, toast } from "react-toastify"

import { UseTranslation } from "../../../i18n/client"
import Footer from "../../components/Footer"
import axiosRequest from "../../hooks/axiosRequestWithoutBearer"

export default function VerifyEmail({ params: { lng, token } }) {
  const { t } = UseTranslation(lng, "changepassword")

  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })
  const { register, watch } = form
  const password = watch("password")
  const confirmPassword = watch("confirmPassword")
  const email = watch("email")

  const hasMinLength = password?.length >= 10
  const hasUpperAndLowerCase = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)
  const hasDigit = /\d/.test(password)
  const passwordsMatch = password === confirmPassword
  if (passwordsMatch) {
  }
  const passwordToSubmit =
    hasDigit &&
    hasMinLength &&
    hasSpecialChar &&
    hasUpperAndLowerCase &&
    passwordsMatch
  async function changePassword() {
    const url = BACKEND_URL + "verify/forgotMyPassword"
    const data = {
      password: password,
      password2: confirmPassword,
      token: token,
    }
    try {
      await axiosRequest(url, "post", data)
      toast.success("Password changed successfully!", { autoClose: true })
      setTimeout(() => {
        router.push(`/${lng}/signin`)
      }, 2000)
    } catch (error) {
      toast.error(error.response.data.error, { autoClose: true })
      console.log("Error:", error)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-[96%] bg-whitesmoke dark:bg-darkslategray-200">
        <header className="flex flex-col items-center justify-center gap-2">
        <a href="/en/signin"> <Image
            className={resolvedTheme === "dark" ? "h-[20vh]" : "h-[20vh]"}
            alt="UnicLogo"
            src={resolvedTheme === "dark" ? logoDark : logoLight}
          /> </a>
        </header>
        <main className="w-full mt-5">
          <div className="w-4/5 sm:w-1/2 dark:bg-dimgray-200 border-[0.5px] bg-white border-gray-400 rounded-md mx-auto flex flex-col items-center justify-center py-8">
            <h2 className="font-bold text-9xl text-dimgray-100 dark:text-white">
              Change your password
            </h2>
            <form
              onSubmit={(e) => e.preventDefault()}
              noValidate
              className="w-full mt-4"
            >
              {/* ###### PASSWORD ####### */}
              <div className="relative flex flex-col items-center justify-center w-full mt-4 lg:grid lg:grid-cols-5 lg:px-10">
                <p className="col-span-1 font-light text-dimgray-200 dark:text-white">
                  Password
                </p>

                <input
                  className="w-3/4 h-10 px-1 text-gray-800 bg-white border rounded-md lg:col-span-4 dark:text-white dark:bg-gray-600 border-silver-200 lg:w-full"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: t("password is required"),
                  })}
                />

                {showPassword ? (
                  <FaEyeSlash
                    size={20}
                    className="absolute right-16 bottom-2 lg:right-16 text-dimgray-200 dark:text-white"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    size={20}
                    className="absolute right-16 bottom-2 lg:right-16 text-dimgray-200 dark:text-white"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              {/* ###### CONFIRM PASSWORD ####### */}
              <div className="relative flex flex-col items-center justify-center w-full mt-4 lg:grid lg:grid-cols-5 lg:px-10">
                <p className="col-span-1 font-light text-dimgray-200 dark:text-white">
                  Confirm Password
                </p>

                <input
                  className="w-3/4 h-10 px-1 text-gray-800 bg-white border rounded-md dark:bg-gray-600 dark:text-white dark:bg-dark-600 lg:col-span-4 border-silver-200 lg:w-full"
                  type={showPassword2 ? "text" : "password"}
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    required: t("confirm password is required"),
                  })}
                />

                {showPassword2 ? (
                  <FaEyeSlash
                    size={20}
                    className="absolute right-16 bottom-2 lg:right-16 text-dimgray-200 dark:text-white"
                    onClick={() => setShowPassword2(false)}
                  />
                ) : (
                  <FaEye
                    size={20}
                    className="absolute right-16 bottom-2 lg:right-16 text-dimgray-200 dark:text-white"
                    onClick={() => setShowPassword2(true)}
                  />
                )}
              </div>

              {/* ###### PASSWORD RULES ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-4 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                <p className="col-span-2 col-start-2 pl-8 text-sm font-light text-dimgray-200 sm:pl-0 dark:text-white">
                  Your password should:
                </p>
              </div>
              {/* ###### LENGTH ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-1 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                {hasMinLength && (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3dark:text-white text-dimgray-200 sm:pl-0">
                    <FaCheck color="green" />
                    Contain at least 10 characters
                  </p>
                )}
                {!hasMinLength && (
                  <p className="flex gap-2 pl-2 text-sm font-light dark:text-white sm:col-start-2 sm:col-span-3 text-dimgray-200 sm:pl-0">
                    <FaTimes color="red" /> Contain at least 10 characters
                  </p>
                )}
              </div>
              {/* ###### UPPERCASE-LOWERCASE ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-1 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                {hasUpperAndLowerCase && (
                  <p className="flex gap-2 pl-2 text-sm font-light dark:text-white sm:col-start-2 sm:col-span-3 text-dimgray-200 sm:pl-0">
                    <FaCheck color="green" />
                    Contain both lowercase and uppercase characters
                  </p>
                )}
                {!hasUpperAndLowerCase && (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 dark:text-white text-dimgray-200 sm:pl-0">
                    <FaTimes color="red" /> Contain both lowercase and uppercase
                    characters
                  </p>
                )}
              </div>
              {/* ###### SPECIAL CHARACTER ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-1 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                {hasSpecialChar && (
                  <p className="flex gap-2 pl-2 text-sm font-light dark:text-white sm:col-start-2 sm:col-span-3 text-dimgray-200 sm:pl-0">
                    <FaCheck color="green" />
                    {`Include one of these special characters: ! @ # $ % ^ & * ( ) - _ = + [ ] { } | < > / ?`}
                  </p>
                )}
                {!hasSpecialChar && (
                  <p className="flex gap-2 pl-2 text-sm font-light dark:text-white sm:col-start-2 sm:col-span-3 text-dimgray-200 sm:pl-0">
                    <FaTimes color="red" />{" "}
                    {`Include one of these special characters: ! @ # $ % ^ & * ( ) - _ = + [ ] { } | < > / ?`}
                  </p>
                )}
              </div>
              {/* ###### DIGIT ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-1 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                {hasDigit && (
                  <p className="flex gap-2 pl-2 text-sm font-light dark:text-white sm:col-start-2 sm:col-span-3 text-dimgray-200 sm:pl-0">
                    <FaCheck color="green" />
                    Contain at least one digit
                  </p>
                )}
                {!hasDigit && (
                  <p className="flex gap-2 pl-2 text-sm font-light dark:text-white sm:col-start-2 sm:col-span-3 text-dimgray-200 sm:pl-0">
                    <FaTimes color="red" /> Contain at least one digit
                  </p>
                )}
              </div>
              {/* ###### MATCHING PASSWORDS ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-1 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                {passwordsMatch && confirmPassword !== "" ? (
                  <p className="flex gap-2 pl-2 text-sm font-light dark:text-white sm:col-start-2 sm:col-span-3 text-dimgray-200 sm:pl-0">
                    <FaCheck color="green" />
                    Passwords match
                  </p>
                ) : (
                  <p className="flex gap-2 pl-2 text-sm font-light dark:text-white sm:col-start-2 sm:col-span-3 text-dimgray-200 sm:pl-0">
                    <FaTimes color="red" /> Passwords do not match
                  </p>
                )}
              </div>
              {/* ###### SUBMIT BUTTON ####### */}
              <div className="flex flex-col items-center justify-center w-full px-10 mt-8 lg:grid lg:grid-cols-5 lg:gap-0">
                {passwordToSubmit ? (
                  <button
                    className="w-3/4 col-span-2 col-start-4 mt-4 font-light rounded-lg cursor-pointer dark:hover:dark:bg-darkslategray-100 dark:bg-darkslategray-200 dark:text-white lg:ml-6 lg:mt-0 bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto "
                    type="submit"
                    onClick={() => changePassword()}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    className="w-3/4 col-span-2 col-start-4 mt-4 font-light rounded-lg cursor-pointer dark:hover:dark:bg-darkslategray-100 dark:bg-darkslategray-200 dark:text-white lg:ml-6 lg:mt-0 bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto opacity-30"
                    type="submit"
                    disabled
                  >
                    Continue
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
