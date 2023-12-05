"use client"

import React from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import MenuIcon from "@mui/icons-material/Menu"
import { ListItemIcon, ListItemText } from "@mui/material"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import fetchPersonalInfo from "app/[lng]/hooks/fetchPersonalInfo.js"
import { useTheme } from "next-themes"
import UnicLogoWhite from "public/images/group-196.svg"
import UnicLogo from "public/images/unic-logo.svg"
import { AiOutlineAppstore, AiOutlineHome } from "react-icons/ai"
import { BsBagPlus } from "react-icons/bs"

import UserAvatar from "@/app/[lng]/components/UserAvatar"
import usePersonalStore from "@/app/store/storeApps"

import { UseTranslation } from "../../i18n/client"

export default function Navbar({ lng }) {
  const router = useRouter()
  const pathname = usePathname()
  const { t, i18n } = UseTranslation(lng, "navbar")
  const currentLanguage = i18n.language
  const { resolvedTheme } = useTheme()
  const { personalInformation, setInformation } = usePersonalStore((state) => ({
    personalInformation: state.personalInformation,
    setInformation: state.setInformation,
  }))
  const pages = [
    {
      name: t("Dashboard"),
      icon: <AiOutlineHome size={30} />,
      path: `/${currentLanguage}`,
    },
    {
      name: t("My Apps"),
      icon: <AiOutlineAppstore size={30} />,
      path: `/${currentLanguage}/myapps-page`,
    },
    {
      name: t("App Store"),
      icon: <BsBagPlus size={30} />,
      path: `/${currentLanguage}/appstore-page`,
    },
  ]

  const [userhandle, setUserHandle] = React.useState("")
  const [displayName, setDisplayName] = React.useState("")
  async function fetchPersonalInf() {
    const personalInfo = await fetchPersonalInfo()
    setInformation(personalInfo)
    setUserHandle(personalInfo.UserHandle)
    setDisplayName(personalInfo.DisplayName)
  }

  React.useEffect(() => {
    fetchPersonalInf()
    router.prefetch(`/${currentLanguage}/`)
    router.prefetch(`/${currentLanguage}/myapps-page`)
    router.prefetch(`/${currentLanguage}/appstore-page`)
  }, [])

  const [anchorElNav, setAnchorElNav] = React.useState(null)

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  return (
    <>
      <nav className="w-full top-0 bottom-[100%] !sticky bg-white dark:bg-darkslategray-100 max-w-[96%]  !z-[50] ">
        <div className="!sticky  px-4 mx-auto py-3 !z-[50]">
          <div className="flex items-center justify-between">
            {/* UNIC LOGO */}
            <button
              onClick={() => router.replace(`/${currentLanguage}/`)}
              className="hidden bg-transparent border-none cursor-pointer md:flex"
            >
              <div className="dark:fill-white">
                <Image
                  src={resolvedTheme === "dark" ? UnicLogoWhite : UnicLogo}
                  className="dark:text-white"
                  alt="UnicLogo"
                />
              </div>
            </button>

            <Box sx={{ flexGrow: 0, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
              >
                <MenuIcon className="dark:!text-white" />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page.name}
                    onClick={() => router.push(page.path)}
                    className="text-gray-600 dark:text-gainsboro-400"
                  >
                    <ListItemIcon>
                      <span
                        className={`${
                          pathname === page.path ? "text-unicred-400" : ""
                        }`}
                      >
                        {React.cloneElement(page.icon, { size: 24 })}
                      </span>
                    </ListItemIcon>
                    <ListItemText>
                      <p
                        className={`text-black dark:text-gainsboro-400
                    ${pathname === page.path ? "font-bold" : ""}
                `}
                      >
                        {page.name}
                      </p>
                    </ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* UNIC LOGO MOBILE*/}
            <button
              onClick={() => router.replace(`/${currentLanguage}/`)}
              className="flex bg-transparent border-none cursor-pointer md:hidden"
            >
              <div className="dark:fill-white">
                <Image
                  src={resolvedTheme === "dark" ? UnicLogoWhite : UnicLogo}
                  className="dark:text-white"
                  alt="UnicLogo"
                  width={100}
                  height={100}
                />
              </div>
            </button>

            <div className="hidden gap-20 md:flex">
              {pages.map((page) => (
                <div
                  key={page.name}
                  onClick={() => router.push(page.path)}
                  className="flex flex-col items-center justify-center font-light text-gray-600 cursor-pointer dark:text-gainsboro-400 hover:text-unicred-300 dark:hover:text-unicred-300"
                >
                  <span
                    className={`${
                      pathname === page.path ? "text-unicred-400" : ""
                    }`}
                  >
                    {page.icon}
                  </span>
                  <p
                    className={`pt-2 text-black dark:text-gainsboro-400
                    ${pathname === page.path ? "font-bold" : ""}
                `}
                  >
                    {page.name}
                  </p>
                </div>
              ))}
              {/* DASHBOARD
                <div
                  className="flex flex-col items-center justify-center font-light text-gray-600 cursor-pointer dark:text-gainsboro-400 hover:text-unicred-300 dark:hover:text-unicred-300"
                  onClick={() => router.push(`/${currentLanguage}/`)}
                >
                  <AiOutlineHome
                    size={30}
                    className={`${
                      pathname === `/${currentLanguage}` ? "text-unicred-400" : ""
                    }`}
                  />
                  <div
                    className={`pt-2 text-black dark:text-gainsboro-400
                      ${pathname === `/${currentLanguage}` ? "font-bold" : ""}`}
                  >
                    {t("Dashboard")}
                  </div>
                </div> */}
              {/* ALERTS */}
              {/* <div className="flex flex-col items-center justify-center px-12 font-light dark:text-gainsboro-400">
                  <button
                    onClick={() => router.push(`/${currentLanguage}/alerts-page`)}
                    className="bg-transparent border-none cursor-pointer "
                  >
                    <FiAlertCircle
                      size={30}
                      className={`text-${
                        pathname === `/${currentLanguage}/alerts-page`
                          ? "red-300"
                          : "gray-600"
                      }`}
                    />
                  </button>

                  <div className="pt-2 text-black dark:text-gainsboro-400">
                    {t("Alerts")}
                  </div>
                </div> */}
              {/* MYAPPS */}
              {/* <div
                  className="flex flex-col items-center justify-center font-light text-gray-600 cursor-pointer dark:text-gainsboro-400 hover:text-unicred-300 dark:hover:text-unicred-300"
                  onClick={() => {
                    router.prefetch(`/${currentLanguage}/myapps-page`)
                    router.replace(`/${currentLanguage}/myapps-page`)
                  }}
                >
                  <AiOutlineAppstore
                    size={30}
                    className={`${
                      pathname === `/${currentLanguage}/myapps-page`
                        ? "text-unicred-400"
                        : ""
                    }`}
                  />

                  <div
                    className={`pt-2 text-black dark:text-gainsboro-400
                      ${
                        pathname === `/${currentLanguage}/myapps-page`
                          ? "font-bold"
                          : ""
                      }
                  `}
                  >
                    {t("My Apps")}
                  </div>
                </div> */}
              {/* APPSTORE */}
              {/* <div
                  className="flex flex-col items-center justify-center font-light text-gray-600 cursor-pointer dark:text-gainsboro-400 hover:text-unicred-300 dark:hover:text-unicred-300"
                  onClick={() =>
                    router.push(`/${currentLanguage}/appstore-page/`)
                  }
                >
                  <BsBagPlus
                    size={30}
                    className={`${
                      pathname === `/${currentLanguage}/appstore-page`
                        ? "text-unicred-400"
                        : ""
                    }`}
                  />
                  <div
                    className={`pt-2 text-black dark:text-gainsboro-400
                      ${
                        pathname === `/${currentLanguage}/appstore-page`
                          ? "font-bold"
                          : ""
                      }
                  `}
                  >
                    {t("App Store")}
                  </div>
                </div> */}
            </div>
            {/* USER PROFILE AVATAR */}
            <div className="grid grid-cols-2 text-left align-left self-left w-[100px]">
              <div className="flex-wrap col-start-1">
                <UserAvatar />
              </div>

              <div className="sticky grid col-span-1 col-start-2 pt-2 pl-2 grid-cols-auto">
                <p className="text-left t-5 mr-3 whitespace-nowrap text-[10px] md:text-[0.65vw]  col-span-1 ">
                  {personalInformation.UserHandle}
                </p>
                <p className="text-center max-w-12 !mr-5 whitespace-nowrap col-span-1 text-[10px] md:text-[0.65vw]">
                  {personalInformation.DisplayName}
                </p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
