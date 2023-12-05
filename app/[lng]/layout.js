// import { cookies } from "next/headers"
import { ToastContainer } from "react-toastify"

import "./global.css"
import { cookies } from "next/headers"
import { dir } from "i18next"
import { ErrorBoundary } from "react-error-boundary"

import "react-toastify/dist/ReactToastify.css"
import { Suspense } from "react"
import { useDeviceData } from "react-device-detect"

import Error500 from "../global-error"
// import { usePathname } from "next/navigation"
// import { BACKEND_URL } from "@/server"
// import Cookies from "js-cookie"
// import { useTheme } from "next-themes"
import { languages } from "../i18n/settings"

// import axiosRequest from "./hooks/axiosRequest"
// import Providers from "./providers"

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default function RootLayout({ children, params: { lng } }) {
  // const scrollRef = useRef(null)
  // const ref = useRef(null)
  // const [loading, setLoading] = useState(true)
  // const pingFunction = async () => {
  //   // ping the backend every 5 minutes to keep the server awake
  //   await axiosRequest(BACKEND_URL + "health")
  // }
  // useEffect(() => {
  //   Gleap.initialize("5aZOPkUNM9SVC2mmnTa1m5QP5p48bpZR")

  //   ref.current = setInterval(pingFunction, 5 * 60 * 1000) // 5 minutes

  //   if (scrollRef.current) {
  //     scrollRef.current.scrollTo(0, 0)
  //   }
  //   return () => {
  //     // clear the interval when the component is unmounted
  //     if (ref.current) {
  //       clearInterval(ref.current)
  //     }
  //   }
  // }, [usePathname()])
  const cookieShop = cookies()
  const theme = cookieShop.get("theme")?.value

  return (
    <body
      lang={lng}
      dir={dir(lng)}
      className={
        theme + " object-fit scale-auto max-w-screen" ||
        "light  object-fit scale-auto max-w-screen"
      }
      suppressHydrationWarning
    >
      {/* <WagmiConfig config={config}> */}
      <Suspense>
        <ErrorBoundary fallback={<Error500 />}>
          {/* <ConnectKitProvider debugMode> */}
          <div className="absolute overflow-hidden row dark:bg-darkslategray-100">
            <div id="child" className="w-screen h-screen overflow-x-hidden ">
              {/* <FreshChat
                    className="dark:bg-transparent"
                    style={{
                      zIndex: "9999999 !important",
                      backGroundColor: "red !important",
                    }}
                    token={"1ecc185c-6b63-49c5-97ac-f9924ea8a621"}
                    host="https://universityofnicosia-org.freshchat.com"
                    email="john.doe@gmail.com"
                    first_name="John"
                    tags={["accelerate"]}
                    onInit={(widget) => {
                      widget.user.setProperties({
                        plan: "Pro",
                        status: "Active",
                      })
                    }}
                  /> */}

              {children}
            </div>
            <ToastContainer
              containerStyle={{
                zIndex: "9999999 !important",
              }}
              className="z-[9999999]"
              style={{ zIndex: "9999999 !important" }}
              position="bottom-right"
              autoClose="5000"
              hideProgressBar="false"
              closeOnClick="true"
              pauseOnHover="true"
              draggable="true"
              theme="light"
            />
          </div>
          {/* </ConnectKitProvider> */}
        </ErrorBoundary>
      </Suspense>
      {/* </WagmiConfig> */}
    </body>
  )
}
