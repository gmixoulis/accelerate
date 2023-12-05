"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useTheme } from "next-themes"
import unicLogoWhite from "public/images/group-197.svg"
import unicLogo from "public/images/unic-logo-vert.svg"

import globalcss from "./[lng]/global.css"

export default function NotFound() {
  const { resolvedTheme } = useTheme()

  return (
    <>
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
                    <Image src={unicLogo} className="h-[8rem]" alt="unicLogo" />
                  )}
                </a>
              </div>
              <div className="mx-auto max-w-[400px] text-center">
                <h2 className="mb-2 text-[50px] font-bold leading-none text-darkslategray-200 dark:text-white sm:text-[80px] md:text-[100px]">
                  404
                </h2>
                <h4 className="mb-3 text-[22px] text-darkslategray-200 dark:text-white  font-semibold leading-tight ">
                  Oops! This Page Could Not Be Found
                </h4>
                <p className="mb-8 text-lg text-darkslategray-200 dark:text-white">
                  The page you are looking for might have been removed, had its
                  name changed, or is temporarily unavailable.
                </p>
                <a
                  href="/"
                  className="inline-block px-8 py-3 text-base font-semibold text-center transition border rounded-lg hover:dark:bg-transparent border-darkslategray-200 dark:border-white text-darkslategray-200 dark:text-white hover:bg-white hover:text-primary"
                >
                  Go To Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
