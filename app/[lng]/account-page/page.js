"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import jwt_decode from "jwt-decode"
import { FaRegUser } from "react-icons/fa"

import { UseTranslation } from "../../i18n/client"
import fetchPersonalInfo from "../hooks/fetchPersonalInfo"

export default function AccountPage({ params }) {
  const { t } = UseTranslation(params.lng, "account-page")
  const [loading, setLoading] = useState(true)
  const [personalInfo, setPersonalInfo] = useState(true)
  const [tenant, setTenant] = useState("")
  const router = useRouter()

  async function getTenant() {
    let refreshToken = ""
    try {
      refreshToken = Cookies.get("refreshToken")
    } catch (e) {
      console.log(e)
    }

    const TenantNativeName = jwt_decode(refreshToken).TenantNativeName
    setTenant(TenantNativeName)
  }

  React.useEffect(() => {
    router.replace("account-page/personal-info")
    return
    async function fetchPersonalInf() {
      const personalInfo = await fetchPersonalInfo()
      setPersonalInfo(personalInfo)
    }
    setTimeout(() => {
      setLoading(false)
    }, 1000)
    getTenant()
    fetchPersonalInf()
  }, [])

  return (
    <>
      <div className="!pb-0 !mb-0 dark:bg-slate-600">
        <div className="grid items-center w-full h-full grid-cols-8 gap-4 ml-12 ">
          <div className="flex items-center justify-center p-6 rounded-full bg-whitesmoke">
            <FaRegUser size={40} className="text-gray-600 " />
          </div>

          <div className="col-span-2 text-center">
            <div className="flex flex-col items-start gap-2">
              <div className="w-full text-left text-black align-left dark:text-white">
                {loading ? (
                  <div
                    role="status"
                    className="h-2.5 w-full animate-pulse bg-gray-300 rounded-full dark:bg-gray-700  "
                  ></div>
                ) : (
                  <div className="pl-0 ml-0 font-light text-dimgray-100 dark:text-white">
                    {" "}
                    {personalInfo.DisplayName != null
                      ? personalInfo.DisplayName
                      : personalInfo.FirstName != null &&
                        personalInfo.LastName != null
                      ? personalInfo.FirstName + " " + personalInfo.LastName
                      : personalInfo.UserHandle
                      ? personalInfo.UserHandle
                      : " "}
                  </div>
                )}
              </div>
              <div className="w-full text-left text-black align-left dark:text-gainsboro-400">
                {loading ? (
                  <div
                    role="status"
                    className="h-2.5 w-full animate-pulse bg-gray-300 rounded-full dark:bg-gray-700  "
                  ></div>
                ) : (
                  <div className="pl-0 ml-0 font-light text-dimgray-100 dark:text-whitesmoke">
                    {tenant || " "}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2 text-center">
            <Link
              href={`/${params.lng}/account-page/personal-info`}
              className="px-4 py-3 text-sm font-light no-underline border border-gray-400 border-solid rounded-lg cursor-pointer bg-whitesmoke w-36 text-dimgray-100 hover:bg-gray-300 hover:text-dimgray-200 "
            >
              {t("Edit Personal Info")}
            </Link>
          </div>

          <div className="col-span-2 mr-12 text-center">
            <Link
              href={`/${params.lng}/account-page/security`}
              className="py-3 text-sm font-light no-underline border border-gray-400 border-solid rounded-lg cursor-pointer bg-whitesmoke w-36 text-dimgray-100 px-7 hover:bg-gray-300 hover:text-dimgray-200 "
            >
              {t("Edit Security")}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
