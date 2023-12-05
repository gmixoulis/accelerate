"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import { useTheme } from "next-themes"
import UnicLogoWhite from "public/images/group-197.svg"
import UnicLogo from "public/images/unic-logo-vert.svg"
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"
import { Oval } from "react-loader-spinner"

import axiosRequest from "../../hooks/axiosRequestWithoutBearer"

export default function VerifyEmail({ params: { token } }) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setLoading] = useState(true)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (token == null) return // If the router is not ready yet, don't do anything
    // setLoading(false) // When the router is ready, set loading to false

    async function verifyEmail() {
      // const url = `https://stg-api.accelerate.unic.ac.cy/verify/emailToken/${token}`
      const url = BACKEND_URL + `verify/emailToken/${token}`

      try {
        const response = await axiosRequest(url, "post")
        setTimeout(() => {
          setLoading(false)
        }, 2500)
        setMessage("Email successfully verified!")
      } catch (error) {
        console.log("Error:", error.message)

        setTimeout(() => {
          setLoading(false)

          if (error.response.data.error.includes("Validated")) {
            setMessage("Email successfully verified!")
          } else {
            setError(error.response.data.error)
          }
        }, 2500)
      }
    }
    verifyEmail()
  }, [token])

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-full min-h-[93vh] text-base text-center dark:bg-darkslategray-200 text-gray-200 bg-whitesmoke font-helvetica-neue">
        <header className="flex flex-col items-center w-full p-4 px-0 py-0 mx-0 my-0 mb-0 text-lg text-white font-helvetica-neue">
          <a href="/en/signin">
            <Image
              className={resolvedTheme === "dark" ? "h-[20vh] " : "h-[25vh] "}
              alt="UnicLogo"
              src={resolvedTheme === "dark" ? UnicLogoWhite : UnicLogo}
            />
          </a>
        </header>
        <div
          className="flex mt-2 mb-10 py-12 flex-col font-light items-center justify-center w-full p-4 dark:bg-dimgray-200 bg-white  shadow-md md:max-w-[30vw] max-w-[60vw] rounded-md border-[0.5px] border-silver-200"
          id="verificationwindow"
        >
          <h1 className="top-0 pt-0 pb-6 mt-0 mb-2 text-2xl font-bold text-gray-600 bottom-40 dark:text-white">
            {" "}
            Verifying your email
          </h1>
          {isLoading ? (
            <Oval
              height={30}
              width={30}
              color="#e60000"
              wrapperStyle={{}}
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#e60000"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          ) : (
            <>
              {" "}
              {message && (
                <div className="flex items-center text-green-500">
                  <FaCheckCircle />
                  <p className="ml-2 dark:tex-white">{message}</p>
                </div>
              )}
              {error && (
                <div className="flex items-center text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:bg-opacity-75 dark:p-2">
                  <FaExclamationCircle />
                  <p className="ml-2 dark:tex-white">{error}</p>
                </div>
              )}
            </>
          )}
          <br />
          <br />
          <button
            className="col-span-2 col-start-4 px-5 mt-4 mr-5 font-light rounded-lg cursor-pointer dark:hover:dark:bg-darkslategray-100 dark:bg-darkslategray-200 lg:ml-6 lg:mt-0 bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto"
            onClick={() => router.push(`/en/signin`)}
          >
            Continue
          </button>
        </div>
        <div className="w-full p-4 text-sm text-gray-700 dark:tex-white">
          <a
            id="footer1"
            className="font-light underline"
            href="mailto:support@accelerate.unic.ac.cy"
            target="blank"
          >
            Contact Us
          </a>
        </div>
      </div>
    </>
  )
}
