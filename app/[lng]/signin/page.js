"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { BACKEND_URL } from "@/server"
import Cookies from "js-cookie"
import logo from "public/images/unic-logo-vert.svg"
import image from "public/signin.png"
import { AiOutlineLoading3Quarters } from "react-icons/ai"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { toast } from "react-toastify"

import Footer from "../components/FooterSignin"
import axiosRequest from "../hooks/axiosRequestWithoutBearer"
//import { UseTranslation } from "../../i18n"
import DialogCustomAnimation from "./sub-components/modal"

export default function Page({ params: { lng } }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isitProcessing, setIsProcessing] = useState(false)
  const [showDialog, setShowDialog] = React.useState(false)

  //const { t } = UseTranslation(lng, "second-page")
  useEffect(() => {
    try {
      axiosRequest(`${BACKEND_URL}health`)
      localStorage.setItem("theme", "system")
    } catch (e) {
      console.log(e)
    }
  }, [])

  async function sendPostRequest(email, password) {
    const url = BACKEND_URL + "auth/login"
    const data = {
      email: email,
      password: password,
    }

    try {
      const response = await axiosRequest(url, "post", data)
      if (response.status === 202) {
        setShowDialog(true)
      } else {
        setIsProcessing(true)
        Cookies.set("accessToken", response.data.accessToken)
        Cookies.set("refreshToken", response.data.refreshToken)
        const accessToken = response.data.accessToken
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
      }
    } catch (error) {
      console.log("Error:", error)
      setIsProcessing(false)
      // toast.error(error.message, {
      toast.error("Wrong password or e-mail", {
        autoClose: true,
        theme: "light",
      })
    }
  }

  return (
    <div className="flex">
      {/* Left Half (Image + Logo) */}
      <div className="relative w-1/2 h-screen">
        <Image
          className="absolute z-0 object-cover w-full h-full"
          src={image} // Replace with your background image path
          alt="Background Image"
          layout="background"
          width="50vw"
          objectFit="cover"
          quality={100}
        />
        <div className="pl-10 font-bold mt-9 pt-7 3xl:pt-0 3xl:mt-0">
          <Image
            className="max-h-[20vh] z-10 relative"
            alt=""
            layout="cover"
            src={logo}
            width="auto"
            height="auto"
          />
        </div>
      </div>

      {/* Right Half (Form) */}
      <div className="w-1/2 !max-h-screen bg-unicgray">
        <div className="flex flex-col h-screen items-left justify-top">
          <main className="w-full mt-2">
            {showDialog && (
              <div className="w-[30vw]">
                <DialogCustomAnimation
                  open={showDialog}
                  lng={lng}
                  handleClose={() => setShowDialog(false)}
                  password={password}
                  email={email}
                />
              </div>
            )}
            {/* ###### MAIN FORM WINDOW ######*/}
            <h2 className="pl-10 mt-10 font-bold pt-7 text-9xl text-dimgray-100 dark:text-white">
              Log in
            </h2>
            <div className="flex flex-wrap gap-1 pl-10 mt-10 text-sm font-light text-dimgray-200 dark:text-white">
              <div>New user?</div>
              <Link
                href={`/${lng}/signup`}
                className="underline cursor-pointer dark:text-white"
              >
                Create an account
              </Link>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendPostRequest(email, password)
              }}
              className="w-full pt-6 md:pt-[20vh]"
            >
              {/* ###### EMAIL INPUT ######*/}
              <div className="flex flex-col items-center justify-center w-full lg:grid lg:grid-cols-5 lg:px-20">
                <p className="w-3/5 col-span-1 pb-1 font-light text-dimgray-200 md:pb-0 md:w-auto dark:text-white">
                  {" "}
                  Email address
                </p>
                <input
                  className="w-3/4 h-10 px-1 bg-white border rounded-md lg:col-span-4 border-silver-200 lg:w-full dark:bg-gray-600"
                  type="email"
                  value={email}
                  placeholder="email@unic.ac.cy"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* ###### PASSWORD INPUT ######*/}
              <div className="relative flex flex-col items-center w-full mt-4 lg:grid lg:grid-cols-5 lg:px-20">
                <p className="w-3/5 col-span-1 pb-1 font-light text-dimgray-200 md:pb-0 md:w-auto dark:text-white">
                  {" "}
                  Password
                </p>
                <input
                  className="w-3/4 h-10 px-1 bg-white border rounded-md lg:col-span-4 border-silver-200 lg:w-full dark:bg-gray-600"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {showPassword ? (
                  <FaEyeSlash
                    size={20}
                    className="absolute lg:right-24 text-dimgray-200 dark:text-white"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    size={20}
                    className="absolute right-16 bottom-2 lg:right-24 text-dimgray-200 dark:text-white"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>

              {/* ###### FORGOT PASS - CONTINUE BUTTON ######*/}
              <div className="flex flex-col items-center justify-center w-full mt-8 md:px-20 lg:grid lg:grid-cols-5 lg:gap-0">
                <div className="col-span-2 text-sm font-light underline text-dimgray-100 dark:text-white">
                  <a href={`/${lng}/forgot-password`}> Forgot password?</a>
                </div>
                {!isitProcessing ? (
                  <button
                    className="w-32 col-span-2 col-start-4 mt-4 font-bold rounded-lg cursor-pointer md:w-3/4 lg:ml-6 lg:mt-0 bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto "
                    type="submit"
                    onClick={(e) => (
                      sendPostRequest(email, password), e.preventDefault()
                    )}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    className="flex items-center justify-center w-32 col-span-2 col-start-4 gap-3 mt-4 font-light rounded-lg cursor-pointer md:w-3/4 lg:ml-6 lg:mt-0 bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto"
                    type="button"
                    disabled
                  >
                    <AiOutlineLoading3Quarters
                      className="animate-spin"
                      size={20}
                    />
                    <div>Loading...</div>
                  </button>
                )}
              </div>
            </form>
            <div className="!top-90 !bottom-10 lg:pt-[10vh] pt-5 p-0.5 bg-unicgray dark:bg-transparent">
              <p className="pl-10 text-dimgray-200  text-[13px] font-medium bg-unicgray  dark:text-white dark:bg-transparent text-left leading-relaxed sm:leading-normal">
                By logging in you agree with the{" "}
                <a
                  href="https://www.unic.ac.cy/terms-and-conditions/"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="px-1 underline cursor-pointer dark:text-white "
                >
                  Terms & Conditions
                </a>
                and{" "}
                <a
                  href="https://www.unic.ac.cy/privacy-policy/"
                  rel="noopener noreferrer"
                  target="_blank"
                  className="px-1 underline cursor-pointer dark:text-white "
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </main>
          <div
            id="signinfooter"
            className="p-1 mx-0 mt-auto footer bg-unicgray "
          >
            <Footer className="!text-[9px] footer" />
          </div>
        </div>
      </div>
    </div>
  )
  //   <div className="flex flex-col items-center justify-center w-screen h-[93vh] max-h-screen bg-whitesmoke">
  //     <header className="flex flex-col items-center justify-center gap-2">
  //       <Image className="h-[20vh]" alt="" src={logo} />
  //       <h1 className="font-light text-dimgray-200">
  //         Sign in or create an account
  //       </h1>
  //     </header>

  //     <main className="w-full mt-2">
  //       {showDialog && (
  //         <div className="w-[30vw]">
  //           <DialogCustomAnimation
  //             open={showDialog}
  //             handleClose={() => setShowDialog(false)}
  //             password={password}
  //             email={email}
  //           />
  //         </div>
  //       )}
  //       {/* ###### MAIN FORM WINDOW ######*/}
  //       <div className="w-4/5 sm:w-1/2 border-[0.5px] bg-white border-gray-400 rounded-md mx-auto flex flex-col items-center justify-center py-8">
  //         <h2 className="font-bold text-9xl text-dimgray-100">Log in</h2>
  //         <div className="flex gap-1 mt-2 text-sm font-light text-dimgray-200">
  //           <div>New user?</div>
  //           <Link href={`/${lng}/signup`} className="underline cursor-pointer">
  //             Create an account
  //           </Link>
  //         </div>
  //         <form
  //           onSubmit={(e) => {
  //             e.preventDefault()
  //             sendPostRequest(email, password)
  //           }}
  //           className="w-full mt-10"
  //         >
  //           {/* ###### EMAIL INPUT ######*/}
  //           <div className="flex flex-col items-center justify-center w-full lg:grid lg:grid-cols-5 lg:px-20">
  //             <p className="col-span-1 font-light text-dimgray-200">
  //               {" "}
  //               Email address
  //             </p>
  //             <input
  //               className="w-3/4 h-10 px-1 bg-white border rounded-md lg:col-span-4 border-silver-200 lg:w-full"
  //               type="email"
  //               value={email}
  //               placeholder="email@unic.ac.cy"
  //               onChange={(e) => setEmail(e.target.value)}
  //             />
  //           </div>
  //           {/* ###### PASSWORD INPUT ######*/}
  //           <div className="relative flex flex-col items-center justify-center w-full mt-4 lg:grid lg:grid-cols-5 lg:px-20">
  //             <p className="col-span-1 font-light text-dimgray-200">
  //               {" "}
  //               Password
  //             </p>
  //             <input
  //               className="w-3/4 h-10 px-1 bg-white border rounded-md lg:col-span-4 border-silver-200 lg:w-full"
  //               type={showPassword ? "text" : "password"}
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //             />
  //             {showPassword ? (
  //               <FaEyeSlash
  //                 size={20}
  //                 className="absolute lg:right-24 text-dimgray-200"
  //                 onClick={() => setShowPassword(false)}
  //               />
  //             ) : (
  //               <FaEye
  //                 size={20}
  //                 className="absolute right-16 bottom-2 lg:right-24 text-dimgray-200"
  //                 onClick={() => setShowPassword(true)}
  //               />
  //             )}
  //           </div>

  //           {/* ###### FORGOT PASS - CONTINUE BUTTON ######*/}
  //           <div className="flex flex-col items-center justify-center w-full px-20 mt-8 lg:grid lg:grid-cols-5 lg:gap-0">
  //             <Link
  //               href={`/${lng}/forgot-password`}
  //               className="col-span-2 text-sm font-light underline text-dimgray-100"
  //             >
  //               Forgot password?
  //             </Link>
  //             {!isitProcessing ? (
  //               <button
  //                 className="w-3/4 col-span-2 col-start-4 mt-4 font-bold rounded-lg cursor-pointer lg:ml-6 lg:mt-0 bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto "
  //                 type="submit"
  //                 onClick={(e) => (
  //                   sendPostRequest(email, password), e.preventDefault()
  //                 )}
  //               >
  //                 Continue
  //               </button>
  //             ) : (
  //               <button
  //                 className="flex items-center justify-center w-3/4 col-span-2 col-start-4 gap-3 mt-4 font-light rounded-lg cursor-pointer lg:ml-6 lg:mt-0 bg-dimgray-200 h-11 text-whitesmoke hover:bg-dimgray-100 lg:w-auto"
  //                 type="button"
  //                 disabled
  //               >
  //                 <AiOutlineLoading3Quarters
  //                   className="animate-spin"
  //                   size={20}
  //                 />
  //                 <div>Loading...</div>
  //               </button>
  //             )}
  //           </div>
  //         </form>
  //         <div className="pt-4">
  //           <p className="px-3 text-gray-400 bg-white text-[13px] font-medium  dark:text-white dark:bg-gray-900 text-center leading-relaxed sm:leading-normal">
  //             By logging in you agree with the{" "}
  //             <a
  //               href="https://www.unic.ac.cy/terms-and-conditions/"
  //               rel="noopener noreferrer"
  //               target="_blank"
  //               className="px-1 text-black underline cursor-pointer "
  //             >
  //               Terms & Conditions
  //             </a>
  //             and{" "}
  //             <a
  //               href="https://www.unic.ac.cy/privacy-policy/"
  //               rel="noopener noreferrer"
  //               target="_blank"
  //               className="px-1 text-black underline cursor-pointer "
  //             >
  //               Privacy Policy
  //             </a>
  //           </p>
  //         </div>
  //       </div>{" "}
  //     </main>
  //   </div>
  // )
}
