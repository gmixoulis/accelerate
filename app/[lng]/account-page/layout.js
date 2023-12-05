"use client"

import { BsPersonVcard } from "react-icons/bs"
import { FiSettings } from "react-icons/fi"
import { GoShieldCheck } from "react-icons/go"

import Sidebar from "@/app/[lng]/components/Sidebar"

import { UseTranslation } from "../../i18n/client"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

export default function AccountLayout({ params, children }) {
  const { t } = UseTranslation(params.lng, "sidebar-personal-info")

  return (
    <>
      <Navbar />
      <div>
        <div className="flex flex-wrap w-auto h-auto overflow-hidden dark:bg-darkslategray-100">
          <div className="flex ">
            <Sidebar
              className="z-10 "
              topNavigation={[
                // {
                //   name: t("Your Account"),
                //   href: `/${params.lng}/account-page`,
                //   icon: <FaRegUser size={30} />,
                // },
                {
                  name: t("Personal Info"),
                  href: `/${params.lng}/account-page/personal-info`,
                  icon: <BsPersonVcard size={30} />,
                },
                {
                  name: t("Sign In & Security"),
                  href: `/${params.lng}/account-page/security`,
                  icon: <GoShieldCheck size={30} />,
                },
                // {
                //   name: "Knowledge Graph",
                //   href: `/account-page/knowledge-bio`,
                //   icon: <SlBookOpen size={30} />,
                // },
                {
                  name: t("Preferences"),
                  href: `/${params.lng}/account-page/preferences`,
                  icon: <FiSettings size={30} />,
                },
                // {
                //   name: "Action Log",
                //   href: `/account-page/action-log`,
                //   icon: <PiNotepad size={30} />,
                // },
              ]}
            >
              <div className="min-h-[calc(100vh-83.672px)] flex flex-col justify-between">
                <div className="pl-12 pt-2 font-medium text-md">{children}</div>
                <div className="w-full md:w-[78vw] mb-5 text-center">
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
