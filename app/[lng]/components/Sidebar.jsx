"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react"
import { IconArrowBarLeft, IconArrowBarRight } from "@tabler/icons-react"

import LanguagesDropdown from "@/app/[lng]/components/Languages"

const Sidebar = ({
  lng,
  children,
  icon = null,
  title = "",
  topNavigation = [],
  bottomNavigation = [],
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const currentPath = usePathname()

  useEffect(() => {
    // Set sidebarOpen based on window width after component has mounted
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768)
    }

    // Initial check
    handleResize()

    // Listen for window resize events
    window.addEventListener("resize", handleResize)

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <aside
        className={`fixed left-0 z-40 w-56 h-[calc(100vh-83.672px)] transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex flex-col h-full">
          <Card className="sticky top-0 flex flex-col h-full p-4 rounded-none bg-gainsboro-100 dark:bg-darkslategray-200">
            <div>
              <div className="flex items-center gap-5">
                {icon}
                <Typography
                  as="div"
                  className="text-lg font-bold dark:text-gainsboro-400"
                >
                  {title}
                </Typography>
              </div>
              <List className="min-w-0">
                {topNavigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    scroll={true}
                    legacyBehavior
                  >
                    <ListItem
                      className={`
                ${
                  item.href === currentPath
                    ? ""
                    : "text-gray-500 hover:text-unicred-300"
                }
                px-0 py-2 text-base font-medium hover:bg-transparent focus:bg-transparent dark:hover:bg-transparent dark:focus:bg-transparent`}
                    >
                      <ListItemPrefix>
                        <span
                          className={`h-8 w-8 ${
                            item.href === currentPath ? "text-unicred-400 dark:!text-unicred-400" : ""
                          }`}
                        >
                          {item.icon}
                        </span>
                      </ListItemPrefix>
                      <span
                        className={`${
                          item.href === currentPath ? "font-bold" : ""
                        } dark:text-gainsboro-400`}
                      >
                        {item.name}
                      </span>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </div>
            <div className="mt-auto">
              <hr className="my-2 border-gray-300 full" />
              <List className="min-w-0">
                {bottomNavigation.map((item, index) => (
                  <Link key={item.name} href={item.href} legacyBehavior>
                    <ListItem
                      className={`
                ${
                  item.href === currentPath || currentPath.includes(item.href)
                    ? ""
                    : "text-gray-500 hover:text-unicred-300"
                }
                rounded-md px-0 py-2 text-base font-medium hover:bg-transparent focus:bg-transparent`}
                    >
                      <ListItemPrefix>
                        <span
                          className={`h-8 w-8 ${
                            item.href === currentPath || currentPath.includes(item.href) ? "text-unicred-400 dark:!text-unicred-400" : ""
                          }`}
                        >
                          {item.icon}
                        </span>
                      </ListItemPrefix>
                      <span
                        className={`${
                          item.href === currentPath || currentPath.includes(item.href) ? "font-bold" : ""
                        } dark:text-gainsboro-400`}
                      >
                        {item.name}
                      </span>
                    </ListItem>
                  </Link>
                ))}
              </List>

              <LanguagesDropdown className=" 3xl:pb-10" />
            </div>
          </Card>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-0 z-50 w-8 h-8 p-1 rounded-r-lg shadow-md left-56 bg-gainsboro-100 dark:bg-darkslategray-200"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? (
            <IconArrowBarLeft className="w-5 h-5" />
          ) : (
            <IconArrowBarRight className="w-5 h-5" />
          )}
        </button>
      </aside>
      <main
        className={`flex-1 h-full px-4 transition-margin transition-bg-color duration-500 ease-in-out bg-white dark:bg-darkslategray-100 ${
          sidebarOpen ? "ml-56" : "ml-0"
        }`}
      >
        {children}
      </main>
    </>
  )
}

export default Sidebar
