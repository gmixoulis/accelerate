import Sidebar from "@/app/[lng]/components/Sidebar"

import Providers from "./providers"
import "./styles/styles.css"
import {
  Cog8ToothIcon,
  DocumentCheckIcon,
  ChatBubbleOvalLeftIcon,
  QueueListIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline"
import { IoChatbubbleSharp } from "react-icons/io5"

import Navbar from "@/app/[lng]/components/Navbar"
import { UseTranslation } from "@/app/i18n"

import Footer from "../components/Footer"

export default async function PowerflowLayout({ params, children }) {
  const lng = params.lng
  const { t } = await UseTranslation(lng, "powerflow")
  return (
    <section className="bg-white dark:bg-darkslategray-100">
      <Providers>
        <Navbar className="!sticky" />
        <Sidebar
          icon={
            <div className="flex items-center justify-between p-1.5 bg-black rounded-full">
              <IoChatbubbleSharp className="w-6 h-6 text-unic_blue" />
            </div>
          }
          title={"Power Flow"}
          topNavigation={
             [
                  {
                    name: t("prompt"),

                    href: `/${lng}/powerflow`,

                    icon: <ChatBubbleOvalLeftIcon />,
                  },
                  {
                    name: t("my results"),

                    href: `/${lng}/powerflow/my-results`,

                    icon: <DocumentCheckIcon />,
                  },

                  {
                    name: t("my lists"),

                    href: `/${lng}/powerflow/user-lists`,

                    icon: <QueueListIcon className="ml-1" />,
                  },
                ]
          }
        >
          <div className="min-h-[calc(100vh-83.672px)] flex flex-col justify-between">
            <div className="pl-12 pt-2 font-medium text-md">{children}</div>
            <div className="w-full md:w-[78vw] mb-5 text-center">
              <Footer />
            </div>
          </div>
        </Sidebar>
      </Providers>
    </section>
  )
}
