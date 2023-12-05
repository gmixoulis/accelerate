"use client"

import React from "react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import UnicLogoWhite from "public/images/group-196.svg"
import UnicLogo from "public/images/unic-logo.svg"
import { AiOutlineHome } from "react-icons/ai"

import { UseTranslation } from "../../i18n/client"

export default function Navbar({ lng }) {
  const router = useRouter()
  const pathname = usePathname()
  const { t, i18n } = UseTranslation(lng, "navbar")
  const currentLanguage = i18n.language
  const { resolvedTheme } = useTheme()

  return (
    <>
      <nav className="w-full top-0 bottom-[100%] !sticky bg-white dark:bg-darkslategray-100 max-w-[98%]  !z-[50] ">
        <div className="!sticky  px-4  py-3 !z-[50]">
          <div className="flex items-center justify-between">
            {/* UNIC LOGO */}
            <button
              onClick={() => router.push(`/${currentLanguage}/`)}
              className="bg-transparent border-none cursor-pointer "
            >
              <div className="dark:fill-white">
                <Image
                  src={resolvedTheme === "dark" ? UnicLogoWhite : UnicLogo}
                  className="dark:text-white"
                  alt="UnicLogo"
                />
              </div>
            </button>

            <div className="flex ">
              {/* DASHBOARD */}
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
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
