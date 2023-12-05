"use client"

import { BsPersonVcard } from "react-icons/bs"
import { FiSettings } from "react-icons/fi"
import { GoShieldCheck } from "react-icons/go"

import Footer from "@/app/[lng]/components/Footer"
import Sidebar from "@/app/[lng]/components/Sidebar"

import { UseTranslation } from "../../i18n/client"
import Navbar from "../components/Navbar"
import dbStructure from "./acceleratedb.json"

export default function AccountLayout({ params, children }) {
  const { t } = UseTranslation(params.lng, "sidebar-personal-info")
  const topNavigation = Object.keys(dbStructure.AccelerateDB).map(
    (tableName) => ({
      name: tableName,
      href: `/${params.lng}/system-app/${tableName.toLowerCase()}`,
      icon: <BsPersonVcard size={30} />, // You can map different icons based on tableName if needed
    })
  )
  return (
    <>
      <Navbar />
      <div>
        <div className="flex flex-wrap w-auto h-auto overflow-hidden dark:bg-darkslategray-100">
          <div className="flex ">
            <Sidebar className="z-10 " topNavigation={topNavigation}>
              <div className="min-h-[calc(100vh-83.672px)] flex flex-col justify-between">
                <div className="pl-12 pt-2 font-medium text-md">{children}</div>
                <div className="w-[95vw] md:w-[78vw] mb-5 text-center">
                  <Footer />
                </div>
              </div>
            </Sidebar>
          </div>
        </div>
      </div>
    </>
  )
}
