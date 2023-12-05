import React, { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import { PersonOff } from "@mui/icons-material"
import { useQueryClient } from "@tanstack/react-query"
import DOMPurify from "dompurify"
import { useTheme } from "next-themes"
import path from "public/images/icon-edit1.svg"
import path_dark from "public/images/icon-pen-dark.svg"
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillDelete,
} from "react-icons/ai"
import { shallow } from "zustand/shallow"

import Delete from "@/app/[lng]/components/Delete"
import usePersonalStore from "@/app/store/storeApps"

import axiosRequest from "../../../hooks/axiosRequest"
import getAccessToken from "../../../hooks/getAccessToken"

let svgPath

export default function ConditionButtons({
  data,
  noErrors,
  clicked, // Pass the correct value for the clicked prop
  setClicked,
  setData,
  setValue,
  handleDelete,
  url,
  errors,
  setErrors,
  reload,
}) {
  const [showDelete, setShowDelete] = useState(false)
  const router = useRouter()
  const { ProfileID } = getAccessToken()
  const [urlPath, setUrlPath] = useState(url)
  const { personalInformation, setInformation } = usePersonalStore(
    (state) => ({
      personalInformation: state.personalInformation,
      setInformation: state.setInformation,
    }),
    shallow
  ) //determine if theme is in dark mode and set the source of the path accordingly
  const { theme, resolvedTheme } = useTheme()
  resolvedTheme === "dark" ? (svgPath = path_dark) : (svgPath = path)
  const handleRefresh = () => {
    router.refresh()
    router.push(".")
  }

  const handleEditClick = (flag) => {
    setClicked(() => !clicked)

    try {
      if (!flag && !Object.keys(data).includes("UserHandle")) {
        const key = Object.keys(data)[0]
        errors[key] = " "
        setErrors((prev) => ({ ...prev, errors }))
        setValue(localStorage.getItem(key))
      } else if (!flag) {
        setErrors("")
        setValue(localStorage.getItem(Object.keys(data)[0]))
      }
    } catch (e) {
      console.log(e)
    }
  }
  const handleDeleteClick = () => {
    // Show the delete confirmation popup
    setShowDelete(true)
  }

  const handleConfirmDelete = async () => {
    setShowDelete(false) // Close the delete confirmation popup

    try {
      await axiosRequest(
        `${BACKEND_URL}user-social/${data.org.state.UserSocialID}`,
        "delete"
      )
      // You might want to perform additional actions here after successful deletion, e.g., set state or refresh data.
      console.log("Data deleted successfully!")
      handleDelete(data.index)
      //handleRefresh()
    } catch (error) {
      console.log("Error:", error)
    }
  }

  useEffect(() => {
    if (url === "user-profile") {
      setUrlPath(`${BACKEND_URL}user-profile/${ProfileID}`)
    } else if (url === "user-social") {
      setUrlPath(`${BACKEND_URL}user-social/${data.index + 1}`)
    }
  }, [data.index, url, setClicked]) // Include data.index and url in the dependency array

  async function sendPostRequest(data) {
    if (url === "user-profile") {
      try {
        data = DOMPurify.sanitize(JSON.stringify(data))
        data = JSON.parse(data)

        await axiosRequest(urlPath, "patch", data)
        personalInformation[Object.keys(data)] = data[Object.keys(data)]
        setInformation(personalInformation)
        let keys = Object.keys(data)
        keys.forEach(function (key) {
          setData(data[key])
        })
        handleEditClick(true)
      } catch (error) {
        console.log("Error:", error)
        handleEditClick(true)
      }
    } else if (url === "user-social") {
      try {
        data.org.state.SocialProfileHandle = data.userHandle
        const url_path =
          BACKEND_URL + "user-social/" + data.org.state.UserSocialID
        await axiosRequest(url_path, "patch", data.org.state)

        let keys = Object.keys(data)
        keys.forEach(function (key) {
          setData(data[key])
        })

        // Use a separate variable to toggle the state

        setClicked(false)
        setClicked(true)
        setData(data.org)
      } catch (error) {
        console.log("Error:", error)
        handleEditClick(true)
      }
    } else if (url === "user-social-post") {
      try {
        data.org.SocialProfileHandle = data.userHandle
        data.org.Description = ""
        data.org.Source = ""
        const url_path = BACKEND_URL + "user-social/"
        await axiosRequest(url_path, "post", data.org)

        let keys = Object.keys(data.org)
        keys.forEach(function (key) {
          setData(data[key])
        })

        // Use a separate variable to toggle the state
        setData(data.org)
        setClicked(false)
        handleRefresh()
        //setClicked(true)
      } catch (error) {
        console.log("Error:", error)
        handleEditClick(true)
      }
    }
  }

  return (
    <div className="float-right">
      {clicked ? (
        <button
          id="edit"
          onClick={() => handleEditClick(true)}
          className="text-[inherit] flex-wrap cursor-pointer bg-transparent border-none self-end float-right p-0 m-0 flex flex-col items-center"
        >
          <Image
            className="transition duration-200 transform w-7 hover:scale-110 dark:text-white"
            alt=""
            src={svgPath}
          />
        </button>
      ) : (
        <div className="flex">
          {data.index !== undefined && (
            <button
              onClick={() => handleDeleteClick()}
              className="text-[inherit] cursor-pointer bg-transparent border-none self-end float-right p-0 m-0 flex flex-col items-center dark:text-red-500"
            >
              <AiFillDelete
                size={30}
                className="duration-100 text-dimgray-200 hover:text-orange-800 opacity-80 hover:opacity-100 dark:text-white"
              />
            </button>
          )}
          <button
            onClick={() => {
              !reload ? handleEditClick(false) : handleRefresh()
            }}
            className=" text-[inherit] cursor-pointer bg-transparent border-none self-end float-right p-0 m-0 flex flex-col items-center dark:text-white"
          >
            <AiFillCloseCircle
              size={30}
              className="duration-100 text-dimgray-200 opacity-80 hover:opacity-100 hover:text-red-500 dark:text-white"
            />
          </button>
          {!noErrors ? (
            <button
              disabled
              className=" text-[inherit] flex-wrap  cursor-default bg-transparent border-none self-end float-right p-0 m-0 flex flex-col items-center dark:text-white"
            >
              <AiFillCheckCircle
                size={30}
                className="duration-100 text-dimgray-200 opacity-80 hover:opacity-100 hover:text-green-900 dark:text-white"
              />
            </button>
          ) : (
            <button
              onClick={() => sendPostRequest(data)}
              className=" text-[inherit] flex-wrap  cursor-pointer bg-transparent border-none self-end float-right p-0 m-0 flex flex-col items-center dark:text-white"
            >
              <AiFillCheckCircle
                size={30}
                className="duration-100 text-dimgray-200 opacity-80 hover:opacity-100 hover:text-green-500 dark:text-white"
              />
            </button>
          )}
        </div>
      )}
      <Delete
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onDelete={handleConfirmDelete}
        item={"this item"}
      />
    </div>
  )
}
