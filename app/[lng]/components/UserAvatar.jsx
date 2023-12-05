"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { BACKEND_URL } from "@/server"
import { Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import fetchPersonalInfo from "app/[lng]/hooks/fetchPersonalInfo.js"
import fetchTenants from "app/[lng]/hooks/fetchTenants.js"
import Cookies from "js-cookie"
import jwt_decode from "jwt-decode"
import { useTheme } from "next-themes"
import { FaRegUser } from "react-icons/fa"
import { FiChevronDown, FiLogOut, FiSettings } from "react-icons/fi"
import { toast } from "react-toastify"

import logout from "@/app/[lng]/hooks/logout"
import { UseTranslation } from "@/app/i18n/client"
import useStore from "@/app/store/storeApps"

const tenantRoleMapping = {
  SYS_ADMIN: "System Administrator",
  STUDENT: "Student",
  USER: "User",
  FACULTY: "Instructor",
  ADMIN_STAFF: "Administrative Personnel",
  DEVELOPER: "Software Engineer",
}

export default function UserAvatar() {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "user-avatar")
  const [loading, setLoading] = useState(true)
  const { personalInformation, setInformation } = useStore()
  const personalInfo = useQuery({
    queryKey: ["personalInfo"],
    queryFn: fetchPersonalInfo,
    suspense: true,
    refreshInterval: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
  })

  const { data } = useQuery({
    queryKey: ["tenants"],
    queryFn: fetchTenants,
    suspense: true,
    refreshInterval: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
  })
  //const [personalInfo?.data, setPersonalInfo?.data] = useState(true)
  //const [tenants, setTenants] = useState([])
  const [loggedTenant, setLoggedTenant] = useState(null)
  const [RoleName, setRoleName] = useState(null)
  const [FirstName, setFirstName] = useState(null)
  const [LastName, setLastName] = useState(null)
  const [name, setName] = useState(null)
  const router = useRouter()
  // const firstName = personalInfo?.data?.FirstName
  // const lastName = personalInfo?.data?.LastName
  // const displayName = personalInfo?.data?.DisplayName
  // const userhandle = personalInfo?.data?.UserHandle
  //const name = `${firstName} ${lastName}`
  const { theme } = useTheme()
  async function getUserId() {
    let accessToken = ""
    try {
      accessToken = Cookies.get("accessToken")

      if (accessToken) {
        const decodedToken = jwt_decode(accessToken)

        if (decodedToken && decodedToken.UserID) {
          const logged_Tenant = decodedToken.TenantNativeName
          const loged_Role = decodedToken.RoleName
          setRoleName(loged_Role)
          setLoggedTenant(logged_Tenant)
        } else {
          console.log("The JWT does not contain UserID.")
        }
      } else {
        console.log("No accessToken found in cookies.")
      }
    } catch (e) {
      console.log("console e")
    }
  }
  // async function switchTenants(RoleID, TenantID) {
  //   switchTenants(RoleID, TenantID).then(() => {
  //     fetchTenant()
  //   })
  // }

  // async function fetchPersonalInf() {
  //   const personalInfo?.data = await fetchPersonalInfo?.data()
  //   setPersonalInfo?.data(personalInfo?.data)
  // }

  // async function fetchTenant() {
  //   const tenants = await fetchTenants()
  //   if (!tenants?.error) {
  //     setTenants(tenants)
  //   }
  // }
  useEffect(() => {
    setInformation(personalInfo?.data)
    setFirstName(personalInformation.FirstName)
    setLastName(personalInformation.LastName)
    setName(FirstName + " " + LastName)
    try {
      // setTimeout(() => {
      //fetchTenant()

      setLoading(false)
      // }, 100)
    } catch (e) {
      toast.error("An error occurred: " + error.message, {
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "error1",
      })
    }

    // fetchPersonalInf()
    getUserId()
    router.prefetch(`/${lng}/account-page/personal-info`)
    router.prefetch(`/${lng}/account-page/preferences`)
  }, [])

  function getInitials(name) {
    if (
      name.includes(null) ||
      name.includes(undefined) ||
      name === "undefined undefined" ||
      name === " " ||
      name.includes("null") ||
      name.includes("undefined") ||
      name.length === 1 ||
      name.length === 19
    )
      return <FaRegUser className="dark:text-darkslategray-200" />
    return (
      <p className=" dark:text-gray-800">
        {name
          ?.split(/\s+/)
          .filter((word) => word)
          .map((word) => word.charAt(0))
          .join("")}
      </p>
    )
  }
  return (
    <div className="!z-99999">
      <Menu placement="bottom-end">
        <MenuHandler className="p-0 mr-0 bg-white border-0 cursor-pointer dark:bg-darkslategray-100">
          <div className="flex justify-center h-full overflow-visible !w-36">
            <div className="relative hover:opacity-80">
              <div
                className="flex items-center justify-center overflow-visible text-2xl font-light border border-gray-100 rounded-full shadow-sm w-14 h-14 bg-gainsboro-200"
                style={{ width: "56px", height: "56px" }}
              >
                {loading ? (
                  <div
                    role="status"
                    className="flex items-center justify-center overflow-visible text-2xl font-light border border-gray-100 rounded-full shadow-sm animate-pulse w-14 h-14 bg-slate-500"
                  ></div>
                ) : (
                  getInitials(name)
                )}
              </div>
              <div className="absolute right-0 flex items-center justify-center w-5 h-5 my-1 ml-4 border-2 border-white rounded-full top-8 bg-dimgray-100 dark:bg-darkslate-200">
                <FiChevronDown size={20} className=" text-whitesmoke" />
              </div>
            </div>
          </div>
        </MenuHandler>
        <MenuList className="md:top-[55px] w-60 rounded-md bg-whitesmoke shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none px-4 py-3 flex flex-col gap-2 dark:bg-darkslategray-200 z-50">
          {data
            ?.filter(
              (tenant) =>
                loggedTenant === tenant.TenantNativeName &&
                RoleName === tenant.RoleName
            )
            .map((tenant, index) => (
              <div
                key={index}
                className="flex items-center py-1 pl-2 font-light text-left rounded-md text-md text-dimgray-200 dark:text-gainsboro-400 hover:bg-dimgray-100 hover:text-white hover:font-light"
              >
                <div>
                  {tenant.TenantNativeName} <br />
                  {tenantRoleMapping[tenant.RoleName]}
                </div>
              </div>
            ))}
          <MenuItem
            className={
              data
                ? "mt-4 hover:text-unicred-300 dark:hover:text-unicred-400 text-dimgray-200 dark:text-gainsboro-400"
                : "hover:text-unicred-300 dark:hover:text-unicred-400 text-dimgray-200 dark:text-gainsboro-400"
            }
          >
            <Link
              href={`/${lng}/account-page/personal-info`}
              className="flex items-center gap-2 text-base font-light"
            >
              <FaRegUser size={25} className="mr-2" />
              <div>{t("Profile")}</div>
            </Link>
          </MenuItem>
          <MenuItem className="hover:text-unicred-300 dark:hover:text-unicred-400 text-dimgray-200 dark:text-gainsboro-400">
            <Link
              href={`/${lng}/account-page/preferences`}
              className="flex items-center gap-2 text-base font-light"
            >
              <FiSettings size={25} className="mr-2" />
              <div>{t("Preferences")}</div>
            </Link>
          </MenuItem>
          <MenuItem className="hover:text-unicred-300 dark:hover:text-unicred-400 text-dimgray-200 dark:text-gainsboro-400">
            <div
              onClick={() => logout()}
              className="flex items-center gap-2 text-base font-light"
            >
              <FiLogOut size={25} className="mr-2" />
              <div>{t("Log out")}</div>
            </div>
          </MenuItem>
        </MenuList>
      </Menu>
    </div>
  )
}
