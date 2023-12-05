import React from "react"

import Footer from "@/app/[lng]/components/Footer"
import Navbar from "@/app/[lng]/components/Navbar"
import Sidebar from "@/app/[lng]/components/Sidebar"
import MyFilesSnackbar from "@/app/[lng]/myfiles/components/snackbar"
import { MyFilesProvider } from "@/app/[lng]/myfiles/contexts/myFilesContext"

export default function Layout({ children }) {
  return (
    <section className="bg-white dark:bg-darkslategray-100">
      <Navbar />
      <Sidebar
        topNavigation={
          [
            // {
            //   name: "Add New Widget",
            //   href: `#`,
            //   icon: <BsWindowPlus size={30} />,
            // },
            // {
            //   name: "Add New App",
            //   href: `#`,
            //   icon: <MdOutlineDashboardCustomize size={30} />,
            // },
            // {
            //   name: "Edit Dashboard",
            //   href: `#`,
            //   icon: <MdOutlineDashboard size={30} />,
            // },
          ]
        }
      >
        {/*Temporary fix so that table does not cut off because parent elements do not grow with page*/}
        <div className="min-h-[calc(100vh-83.672px)] flex flex-col justify-between">
          <MyFilesProvider>
            <div
              className="px-[40px] pt-2 font-medium text-md overflow-auto"
              id="myfiles"
            >
              <MyFilesSnackbar />
              {children}
            </div>
          </MyFilesProvider>
          <div className="w-full md:w-[78vw] mb-5 text-center">
              <Footer />
          </div>
        </div>
      </Sidebar>
    </section>
  )
}
