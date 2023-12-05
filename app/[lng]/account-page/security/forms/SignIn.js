"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import Cookies from "js-cookie"
import jwt_decode from "jwt-decode"
import path from "public/images/icon-edit1.svg"
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"

// ###### DEFAULT ROW ######
const SignInRow = ({ name, data, topBorder, handler }) => {
  const borderStyle = topBorder
    ? "border-t border-gray-300 border-solid border-r-0 border-b-0 border-l-0"
    : ""

  return (
    <div className={`w-full grid grid-cols-3 py-4 ${borderStyle}`}>
      <div className="flex items-center pl-3 font-light text-center text-md text-dimgray-200">
        {name}
      </div>
      <div className="flex items-center justify-start pl-20 font-bold text-md text-dimgray-200">
        {data}
      </div>
      <div className="flex justify-end pr-3">
        <Image
          className="transition duration-200 transform cursor-pointer w-7 hover:scale-110"
          alt=""
          src={path}
          onClick={handler}
        />
      </div>
    </div>
  )
}

// ###### EDIT ROW ######
const EditRow = ({ name, data, topBorder, handler }) => {
  const borderStyle = topBorder
    ? "border-t border-gray-300 border-solid border-r-0 border-b-0 border-l-0"
    : ""

  return (
    <div className={`w-full grid grid-cols-3 py-4 ${borderStyle}`}>
      <div className="flex items-center pl-3 font-light text-center text-md text-dimgray-200">
        {name}
      </div>
      <div className="flex items-center justify-center font-bold text-md text-dimgray-200">
        {data}
      </div>
      <div className="flex justify-end pr-3">
        <div className="flex items-center gap-2">
          {" "}
          <FaCheckCircle
            size={30}
            className="text-green-500 transition duration-200 transform cursor-pointer w-7 hover:scale-110"
          />
          <FaTimesCircle
            size={30}
            className="text-red-100 transition duration-200 transform cursor-pointer w-7 hover:scale-110"
            onClick={handler}
          />
        </div>
      </div>
    </div>
  )
}
// ###### INPUT FIELD ######
const passwordField = () => {
  return (
    <input
      type="password"
      className="w-full p-2 border border-gray-300 border-solid rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
    />
  )
}

// ###### MAIN COMPONENT ######
export default function SignIn() {
  const [email, setEmail] = useState("Not available")
  const [showEdit, setShowEdit] = useState(false)
  const showHandler = () => {
    setShowEdit(!showEdit)
  }

  async function getUserEmail() {
    let refreshToken = ""
    try {
      refreshToken = Cookies.get("refreshToken")
    } catch (e) {
      console.log(e)
    }

    const user_email = jwt_decode(refreshToken).UserEmail
    setEmail(user_email)
  }

  useEffect(() => {
    async function fetchEmail() {
      await getUserEmail()
    }

    fetchEmail()
  }, [])
  return (
    <main>
      <h2 className="p-0 pb-4 m-0 font-bold text-dimgray-200">Sign In</h2>

      {/* ##### TABLE ##### */}
      <div className="flex flex-col rounded-md bg-whitesmoke">
        <SignInRow name="Email" data={email} />

        {showEdit ? (
          <EditRow
            name="Password"
            data={passwordField()}
            topBorder={true}
            handler={showHandler}
          />
        ) : (
          <SignInRow
            name="Password"
            data="****"
            topBorder={true}
            handler={showHandler}
          />
        )}
      </div>
    </main>
  )
}
