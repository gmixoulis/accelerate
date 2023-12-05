"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@mui/material"
import globalCss from "app/[lng]/global.css"
import logout from "app/[lng]/hooks/logout"
import { useTheme } from "next-themes"
import unicLogoWhite from "public/images/group-197.svg"
import unicLogo from "public/images/unic-logo-vert.svg"

export default function GlobalError({ error, reset }) {
  const { resolvedTheme } = useTheme()
  return (
    <html>
      <body>
        <section className="relative z-10 bg-primary h-full w-full py-[120px]">
          <div className="container mx-auto">
            <div className="flex mx-4">
              <div className="w-full ">
                <div className="flex items-center justify-center mb-8">
                  <a href="/">
                    {resolvedTheme === "dark" ? (
                      <Image
                        src={unicLogoWhite}
                        className="h-[10rem]"
                        alt="unicLogoWhite"
                      />
                    ) : (
                      <Image
                        src={unicLogo}
                        className="h-[8rem]"
                        alt="unicLogo"
                      />
                    )}
                  </a>
                </div>
                <div className="mx-auto max-w-[400px] text-center">
                  <h2 className="mb-2 text-[50px] font-bold leading-none text-darkslategray-200 dark:text-white sm:text-[80px] md:text-[100px]">
                    500
                  </h2>
                  <h4 className="mb-3 text-[22px] text-darkslategray-200 dark:text-white  font-semibold leading-tight ">
                    Internal Server Error
                  </h4>
                  <p className="mb-8 text-lg text-darkslategray-200 dark:text-white">
                    {`We're sorry, but something went wrong on our end. Please try
                    again later or contact support if the problem persists.`}
                  </p>
                  <Button
                    variant="outlined"
                    onClick={logout}
                    className="inline-block !capitalize !px-8 py-3 text-base !font-semibold text-center transition border rounded-lg hover:dark:bg-transparent hover:border-darkslategray-100 !border-darkslategray-200 dark:border-white !text-darkslategray-200 dark:text-white hover:bg-white hover:text-primary"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  )
}
