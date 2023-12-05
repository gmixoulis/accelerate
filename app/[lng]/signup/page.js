"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import Cookies from "js-cookie"
import { useTheme } from "next-themes"
import logoDark from "public/images/group-197.svg"
import logoLight from "public/images/unic-logo-vert.svg"
import { useForm } from "react-hook-form"
import { FaCheck, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa"
import { toast } from "react-toastify"

import Footer from "../components/Footer"
//import { UseTranslation } from "../../i18n/client"
import axiosRequest from "../hooks/axiosRequestWithoutBearer"

export default function Page({ params: { lng } }) {
  //const { t } = UseTranslation(lng, "second-client-page")
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const { resolvedTheme } = useTheme()
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      password2: "",
    },
  })
  const { register, formState, watch } = form
  const { errors } = formState
  const password = watch("password")
  const password2 = watch("password2")
  const email = watch("email")

  const hasMinLength = password?.length >= 10
  const hasUpperAndLowerCase = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const hasSpecialChar = /[!@#$%^&*()\[\]{}|:<>/?=_+-]/.test(password)
  const hasDigit = /\d/.test(password)
  const passwordsMatch = password === password2

  const passwordToSubmit =
    hasDigit &&
    hasMinLength &&
    hasSpecialChar &&
    hasUpperAndLowerCase &&
    passwordsMatch
  useEffect(() => {
    Cookies.set("refreshcount", 0)
  }, [])

  async function sendPostRequest(email, password, password2) {
    const url = BACKEND_URL + "auth/signUp"
    localStorage.setItem("emailSignup", email)
    const data = {
      email: email,
      password: password,
      password2: password2,
    }

    try {
      await axiosRequest(url, "post", data)
      // toast.success(
      //   "User successfully created. Please check your email to activate your account.",
      //   { autoClose: true }
      // )
      router.push(`/${lng}/check-email`)
    } catch (err) {
      toast.error(err.response.data.error, {
        autoClose: true,

        closeOnClick: true,

        theme: "light",
      })
    }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    sendPostRequest(email, password, password2)
  }
  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-[96%] max-h-full pb-3 bg-whitesmoke dark:bg-darkslategray-200">
        <header className="flex flex-col items-center justify-center gap-2 mt-2">
        <a href="/en/signin">  <Image
            className={resolvedTheme === "dark" ? "h-[20vh]" : "h-[20vh]"}
            alt="UnicLogo"
            src={resolvedTheme === "dark" ? logoDark : logoLight}
          /> </a>
        </header>

        <main className="w-full mt-2 h-fit ">
          {/* ###### FORM WINDOW ######*/}
          <div className="w-4/5 dark:bg-dimgray-200 sm:w-1/2 border-[0.5px] bg-white border-gray-400 rounded-md mx-auto flex flex-col items-center justify-center py-4">
            <h2 className="font-bold text-9xl text-dimgray-100 dark:text-white">
              Create an Account
            </h2>

            <div className="flex gap-1 mt-2 text-sm font-light text-dimgray-200 dark:text-white">
              <div>Already have an account?</div>
              <Link
                href={`/${lng}/signin`}
                className="underline cursor-pointer"
              >
                Sign in
              </Link>
            </div>

            <form
              onSubmit={(e) => e.preventDefault()}
              noValidate
              className="w-full mt-10"
            >
              {/* ###### EMAIL INPUT ####### */}
              <div className="flex flex-col items-center justify-center w-full lg:grid lg:grid-cols-5 lg:px-10">
                <p className="col-span-1 font-light text-dimgray-200 dark:text-white">
                  {" "}
                  Email address
                </p>
                <input
                  className="w-3/4 h-10 px-1 bg-white border rounded-md dark:bg-gray-600 lg:col-span-4 border-silver-200 lg:w-full"
                  type="email"
                  id="email"
                  placeholder="email@unic.ac.cy"
                  {...register(
                    "email",

                    {
                      pattern: {
                        value:
                          /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                        message: "invalid email format",
                      },
                    }
                  )}
                />
                {errors.email?.message && (
                  <p className="p-0 mt-0 font-light text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:bg-opacity-75 dark:p-2">
                    {errors.email?.message}
                  </p>
                )}
              </div>
              {/* ###### PASSWORD ####### */}
              <div className="relative flex flex-col items-center justify-center w-full mt-4 lg:grid lg:grid-cols-5 lg:px-10">
                <p className="col-span-1 font-light text-dimgray-200 dark:text-white">
                  {" "}
                  Password
                </p>
                <input
                  className="w-3/4 h-10 px-1 bg-white border rounded-md lg:col-span-4 dark:bg-gray-600 border-silver-200 lg:w-full"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  {...register("password", {
                    required: "password is required",
                  })}
                />
                {showPassword ? (
                  <FaEyeSlash
                    size={20}
                    className="absolute right-16 bottom-2 lg:right-16 text-dimgray-200"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    size={20}
                    className="absolute right-16 bottom-2 lg:right-16 text-dimgray-200"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              {/* ###### CONFIRM PASSWORD ####### */}
              <div className="relative flex flex-col items-center justify-center w-full mt-4 lg:grid lg:grid-cols-5 lg:px-10">
                <p className="col-span-1 font-light text-dimgray-200 dark:text-white">
                  {" "}
                  Confirm Password
                </p>
                <input
                  className="w-3/4 h-10 px-1 bg-white border rounded-md dark:bg-gray-600 lg:col-span-4 border-silver-200 lg:w-full"
                  type={showPassword2 ? "text" : "password"}
                  id="password2"
                  {...register("password2", {
                    required: "confirm password is required",
                  })}
                />
                {showPassword2 ? (
                  <FaEyeSlash
                    size={20}
                    className="absolute right-16 bottom-2 lg:right-16 text-dimgray-200"
                    onClick={() => setShowPassword2(false)}
                  />
                ) : (
                  <FaEye
                    size={20}
                    className="absolute right-16 bottom-2 lg:right-16 text-dimgray-200"
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
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 sm:pl-0 dark:text-white">
                    <FaCheck color="green" />
                    Contain at least 10 characters
                  </p>
                )}
                {!hasMinLength && (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 dark:text-white sm:pl-0">
                    <FaTimes color="red" /> Contain at least 10 characters
                  </p>
                )}
              </div>
              {/* ###### UPPERCASE-LOWERCASE ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-1 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                {hasUpperAndLowerCase && (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 dark:text-white sm:pl-0">
                    <FaCheck color="green" />
                    Contain both lowercase and uppercase characters
                  </p>
                )}
                {!hasUpperAndLowerCase && (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 dark:text-white sm:pl-0">
                    <FaTimes color="red" /> Contain both lowercase and uppercase
                    characters
                  </p>
                )}
              </div>
              {/* ###### SPECIAL CHARACTER ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-1 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                {hasSpecialChar && (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 dark:text-white sm:pl-0">
                    <FaCheck color="green" />
                    {`Include one of these special characters: ! @ # $ % ^ & * ( ) - _ = + [ ] { } | < > / ?`}
                  </p>
                )}
                {!hasSpecialChar && (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 dark:text-white sm:pl-0">
                    <FaTimes color="red" />{" "}
                    {`Include one of these special characters: ! @ # $ % ^ & * ( ) - _ = + [ ] { } | < > / ?`}
                  </p>
                )}
              </div>
              {/* ###### DIGIT ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-1 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                {hasDigit && (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 dark:text-white sm:pl-0">
                    <FaCheck color="green" />
                    Contain at least one digit
                  </p>
                )}
                {!hasDigit && (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 dark:text-white sm:pl-0">
                    <FaTimes color="red" /> Contain at least one digit
                  </p>
                )}
              </div>
              {/* ###### MATCHING PASSWORDS ####### */}
              <div className="flex flex-col items-start justify-center w-full mt-1 sm:items-center lg:grid lg:grid-cols-5 lg:px-10">
                {passwordsMatch && password2 !== "" ? (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 dark:text-white sm:pl-0">
                    <FaCheck color="green" />
                    Passwords match
                  </p>
                ) : (
                  <p className="flex gap-2 pl-2 text-sm font-light sm:col-start-2 sm:col-span-3 text-dimgray-200 dark:text-white sm:pl-0">
                    <FaTimes color="red" /> Passwords do not match
                  </p>
                )}
              </div>
              {/* ###### SUBMIT BUTTON ####### */}
              <div className="flex flex-col items-center justify-center w-full px-10 mt-8 lg:grid lg:grid-cols-5 lg:gap-0 dark:text-white ">
                {passwordToSubmit ? (
                  <button
                    className="w-3/4 col-span-2 col-start-4 mt-4 font-light rounded-lg cursor-pointer lg:ml-6 lg:mt-0 dark:bg-darkslategray-200 dark:hover:dark:bg-darkslategray-100 dark:text-white h-11 text-whitesmoke bg-dimgray-200 hover:bg-dimgray-100 lg:w-auto "
                    type="submit"
                    onClick={handleFormSubmit}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    className="w-3/4 col-span-2 col-start-4 mt-4 font-light rounded-lg cursor-pointer lg:ml-6 lg:mt-0 dark:bg-darkslategray-200 dark:hover:dark:bg-darkslategray-100 dark:!text-white dark:font-bold bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto opacity-30"
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
      <Footer className="pt-12 bottom-2 top-[99%]" />
    </>
  )
}
