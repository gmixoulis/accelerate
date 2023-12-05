"use client"

import React, { useState } from "react"
import Image from "next/image"
//import Link from "next/link"
import { BACKEND_URL } from "@/server"
import { useTheme } from "next-themes"
import logoDark from "public/images/group-197.svg"
import logoLight from "public/images/unic-logo-vert.svg"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { toast } from "react-toastify"

import { UseTranslation } from "../../i18n"
import Footer from "../components/Footer"
import axiosRequest from "../hooks/axiosRequest"

export default function Page({ params: { lng } }) {
  const [email, setEmail] = useState("")
  const [isitProcessing, setIsProcessing] = useState(false)
  // const [errorMessage, setErrorMessage] = useState("")
  // const [successMessage, setSuccessMessage] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(true)
  const { resolvedTheme } = useTheme()
  const validateEmail = (email) => {
    // Regular expression for a basic email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return emailRegex.test(email)
  }

  const handleInputChange = (e) => {
    const newEmail = e.target.value
    setEmail(newEmail)
    setIsValidEmail(validateEmail(newEmail))
  }

  async function sendPostRequest(email) {
    const url = BACKEND_URL + "auth/forgotMyPassword"
    if (!email) {
      toast.info("Please enter your email address.", { autoClose: true })
      return
    }
    const data = {
      email: email,
    }

    try {
      setIsProcessing(true)
      await axiosRequest(url, "post", data)
      toast.info(
        "If an account exists, an email with reset instructions will be sent to your inbox.",
        { autoClose: true }
      )
    } catch (error) {
      console.log("Error:", error)
      setIsProcessing(false)
      toast.info(
        "If an account exists, an email with reset instructions will be sent to your inbox.",
        { autoClose: true }
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-[96%] bg-whitesmoke dark:bg-darkslategray-200">
        <header className="flex flex-col items-center justify-center gap-2">
          <a href="/en/signin">
            {" "}
            <Image
              className={resolvedTheme === "dark" ? "h-[20vh]" : "h-[20vh]"}
              alt="UnicLogo"
              src={resolvedTheme === "dark" ? logoDark : logoLight}
            />{" "}
          </a>
        </header>

        <main className="w-full mt-5">
          {/* ###### MAIN FORM WINDOW ######*/}
          <div className="w-4/5 dark:bg-dimgray-200 sm:w-1/2 border-[0.5px] bg-white border-gray-400 rounded-md mx-auto flex flex-col items-center justify-center py-8">
            <div className="flex flex-col items-center justify-center w-full px-4">
              <h2 className="font-bold text-center text-9xl text-dimgray-100 dark:text-white">
                Forgot your password?
              </h2>
              <div className="flex gap-1 mt-2 text-sm font-light text-dimgray-200">
                <p className="text-center dark:text-white">
                  Enter your email address below and we will send you a link to
                  reset your password.
                </p>
              </div>
            </div>
            {/* ###### EMAIL INPUT ######*/}
            <div className="flex flex-col items-center justify-center w-full mt-4 lg:grid lg:grid-cols-5 lg:px-20">
              <p className="col-span-1 font-light text-dimgray-200 dark:text-white">
                {" "}
                Email address
              </p>
              <input
                className={`w-3/4 h-10 px-1 dark:text-white dark:bg-gray-600 bg-white border rounded-md lg:col-span-4 border-silver-200 lg:w-full ${
                  !isValidEmail ? "border-red-500" : ""
                }`}
                type="email"
                value={email}
                placeholder="email@unic.ac.cy"
                onChange={handleInputChange}
              />
              <br />
              {!isValidEmail && (
                <p className="text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:bg-opacity-75 dark:p-2 w-max">
                  Please enter a valid email address.
                </p>
              )}
            </div>

            <div className="flex flex-col items-center justify-center w-full px-20 mt-8 lg:grid lg:grid-cols-5 lg:gap-0">
              {!isitProcessing ? (
                <button
                  type="submit"
                  disabled={!isValidEmail}
                  className="w-3/4 col-span-2 col-start-4 mt-4 font-light rounded-lg cursor-pointer dark:hover:dark:bg-darkslategray-100 dark:bg-darkslategray-200 lg:ml-6 lg:mt-0 bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto "
                  onClick={() => sendPostRequest(email)}
                >
                  Continue
                </button>
              ) : (
                <button
                  className="flex items-center justify-center w-3/4 col-span-2 col-start-4 gap-3 mt-4 font-light rounded-lg cursor-pointer dark:bg-darkslategray-200 lg:ml-6 lg:mt-0 bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto"
                  type="button"
                  disabled
                >
                  <AiOutlineLoading3Quarters
                    className="animate-spin"
                    size={20}
                  />
                  <div className="dark:text-white">Loading...</div>
                </button>
              )}
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  )
}
