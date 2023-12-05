"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { BACKEND_URL } from "@/server"
import { useTheme } from "next-themes"
import UnicLogoWhite from "public/images/group-197.svg"
import UnicLogo from "public/images/unic-logo-vert.svg"
import { toast } from "react-toastify"

import Footer from "../components/Footer"
import axiosRequest from "../hooks/axiosRequestWithoutBearer"

//import { UseTranslation } from "../../i18n"

export default function Page({ params: { lng } }) {
  const [email, setEmail] = useState("placeholder") //replace placeholder with email from localstorage
  const { resolvedTheme } = useTheme()
  const handleResendEmail = async () => {
    const data = { email: email }
    try {
      const response = await axiosRequest(
        BACKEND_URL + "user-email/resend",
        "patch",
        data
      )
      toast.success(response.data.message, {
        autoClose: true,

     

        theme: "light",
      })
    } catch (error) {
      console.log(error)
      toast.error(error.message, {
        autoClose: true,


        theme: "light",
      })
    }
  }
  //const { t } = UseTranslation(lng, "second-page")
  useEffect(() => {
    setEmail(localStorage.getItem("emailSignup"))
  }, [])
  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-[96%] gap-10 bg-whitesmoke dark:bg-darkslategray-200">
        <header className="flex flex-col items-center justify-center gap-2 pb-0 mb-0">
        <a href="/en/signin">  <Image
            className={resolvedTheme === "dark" ? "h-[20vh]" : "h-[20vh]"}
            alt="UnicLogo"
            src={resolvedTheme === "dark" ? UnicLogoWhite : UnicLogo}
          /> </a>
        </header>

        <main className="w-full pt-0 mt-0">
          <div className="w-4/5 sm:w-1/2 dark:bg-dimgray-200 border-[0.5px] bg-white border-gray-400 rounded-md mx-auto flex flex-col items-center justify-center gap-3 py-8">
            <h2 className="font-bold text-9xl text-dimgray-100 dark:text-white">
              Verify your email
            </h2>
            <div className="text-center">
              <p className="col-span-1 font-light text-dimgray-200 dark:text-white">
                {"We sent an email to"}{" "}
                <strong className="font-bold"> {email || "placeholder"}</strong>{" "}
                {"with a verification link."}
              </p>
              <p className="col-span-1 font-light text-dimgray-200 dark:text-white">
                Check your inbox and click on that link to complete your sign
                up.
              </p>
              <p className="col-span-1 font-light text-dimgray-200">
                {"If you don't see the email, check your spam folder."}
              </p>
            </div>
            <div className="flex flex-col items-center w-full gap-2 mt-8">
              <p className="col-span-2 text-sm font-light text-dimgray-100 dark:text-white">
                {"Still can't find the email?"}
              </p>
              <button
                onClick={() => handleResendEmail()}
                className="w-full max-w-[200px] font-bold rounded-lg cursor-pointer bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 dark:hover:dark:bg-darkslategray-100 dark:bg-darkslategray-200"
              >
                Resend Email
              </button>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
