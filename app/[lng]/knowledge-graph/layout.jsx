import {
  Cog8ToothIcon,
  HomeIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline"
import { IconListDetails } from "@tabler/icons-react"
import { PiGraph } from "react-icons/pi"

import Navbar from "@/app/[lng]/components/Navbar"
import Sidebar from "@/app/[lng]/components/Sidebar"
import { UseTranslation } from "@/app/i18n"

import Footer from "../components/Footer"
import "@/app/[lng]/powerflow/styles/styles.css"

export default async function PowerflowLayout({ params, children }) {
  const lng = params.lng
  const { t } = await UseTranslation(lng, "knowledge-graph")

  return (
    <section className="bg-white dark:bg-darkslategray-100">
      <Navbar className="!sticky" />
      <Sidebar
        icon={
          <div className="flex items-center justify-between p-1.5 bg-black rounded-full">
            <PiGraph className="w-6 h-6 text-unic_blue" />
          </div>
        }
        title={"Knowledge Graph"}
        topNavigation={[
          {
            name: t("Dashboard"),
            href: `/${lng}/knowledge-graph`,
            icon: <HomeIcon />,
          },
        ]}
      >
        <div className="min-h-[calc(100vh-83.672px)] flex flex-col justify-between">
            <div className="pl-12 pt-2 font-medium text-md">{children}</div>
            <div className="w-full md:w-[78vw] mb-5 text-center">
              <Footer />
            </div>
          </div>
      </Sidebar>
    </section>
  )
}
