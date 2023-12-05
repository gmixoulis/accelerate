"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { redirect, useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import logo from "public/images/unic-logo-vert.svg"
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"

import Footer from "../components/Footer"
import axiosRequest from "../hooks/axiosRequest"

export default function VerifyEmail({ params }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    redirect("/verify-email/RETURN-BACK")

    setLoading(false) // When the router is ready, set loading to false

    async function verifyEmail() {
      // const url = `https://stg-api.accelerate.unic.ac.cy/auth/verify-email/${token}`
      const url = BACKEND_URL + "auth/verify-email/${token}"

      try {
        await axiosRequest(url)
        setMessage("Email successfully verified!")
      } catch (error) {
        console.log("Error:", error)
        setError("Email verification failed.")
      }
    }
    verifyEmail()
  }, [])

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-full min-h-screen text-base text-center text-gray-200 bg-whitesmoke font-helvetica-neue">
        <header className="flex flex-col items-center w-full p-4 text-lg text-gray-200 font-helvetica-neue">
          <Image className="w-full h-[20vh]" alt="" src={logo} />
          <h3 className="font-light text-center text-[15px] ">
            Email Verification
          </h3>
        </header>
        <div
          className="flex flex-col font-light items-center justify-center w-full p-4 bg-gray-100 border shadow-md md:max-w-[50vw] max-w-[60vw] rounded-xl border-silver-200"
          id="verificationwindow"
        >
          <h2 className="mb-4 text-4xl font-bold font-helvetica-neue text-dimgray-100">
            Verify Email
          </h2>

          {message && (
            <div className="flex items-center text-green-500">
              <FaCheckCircle />
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:bg-opacity-75 dark:p-2">
              <FaExclamationCircle />
              <p>{error}</p>
            </div>
          )}

          <button
            className="w-[69%] bg-transparent border-none cursor-pointer text-sm text-gray-600 font-light text-[inherit] mb-2"
            onClick={() => router.push(`/${params.lng}/`)}
          >
            Go to Home Page
          </button>
        </div>
        <footer className="w-full p-4 text-sm text-gray-200 font-helvetica-neue">
          <a id="footer1" className="font-light underline">
            Contact Us
          </a>
        </footer>
      </div>
      <Footer />
    </>
  )
}
