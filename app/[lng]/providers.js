"use client"

import { useEffect, useState } from "react"
import { ThemeProvider as ThemeProvider1 } from "@material-tailwind/react"
import { LicenseInfo } from "@mui/x-license-pro"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental"
import Gleap from "gleap"
import Cookies from "js-cookie"
import { ThemeProvider } from "next-themes"
import {
  isBrowser,
  isMobile,
  isTablet,
  useDeviceData,
} from "react-device-detect"

import i18n from "../i18n/client"

export default function Providers({ children }) {
  const [mounted, setMounted] = useState(false)
  const [queryClient] = useState(new QueryClient())
  const data = useDeviceData()
  useEffect(() => {
    Gleap.initialize(process.env.NEXT_PUBLIC_GLEAP_KEY)
    LicenseInfo.setLicenseKey(process.env.NEXT_PUBLIC_MUI_X_LICENSE_KEY)
    console.log(window.navigator.userAgent, data, isMobile, isBrowser, isTablet)
    setMounted(true)
    // if (!Cookies.get("theme")) {
    //   const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)")
    //   if (darkThemeMq.matches) {
    //     Cookies.set("theme", "dark")
    //   } else {
    //     Cookies.set("theme", "light")
    //   }
    // }
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider1>
      <ThemeProvider enableSystem={true} attribute="class">
        <QueryClientProvider contextSharing={true} client={queryClient}>
          <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </ThemeProvider1>
  )
}
