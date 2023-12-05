import { cookies } from "next/headers"
import Script from "next/script"

import getServerSideAccessToken from "@/app/[lng]/hooks/getServerSideAccessToken"

import Providers from "./[lng]/providers"

export default async function RootLayout({ children }) {
  const cookieStore = cookies()
  const theme = cookieStore.get("theme")?.value
  const shouldRunDatadogRum = process.env.DATADOG_RUM_ACTIVE === "true"
  const shouldSendDatadogLogs = process.env.DATADOG_LOGGING_ACTIVE === "true"
  const { UserID, UserEmail } = getServerSideAccessToken()
  const isUserSet = UserID !== undefined && UserID !== null && UserID !== ""
  return (
    <html lang="en" className={theme}>
      <head>
        <Script
          id="dd-rum-browser-sync"
          src="https://www.datadoghq-browser-agent.com/us1/v5/datadog-rum.js"
          type="text/javascript"
          strategy="beforeInteractive"
        />
        <Script id={"datadog-rum"} type="text/javascript" strategy="lazyOnload">
          {`
                 if(${shouldRunDatadogRum}) {
                  console.log("Rum is enabled");
                  window.DD_RUM && window.DD_RUM.init({
                    applicationId: "${
                      process.env.NEXT_PUBLIC_DATADOG_RUM_APP_ID
                    }",
                    clientToken: "${
                      process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN
                    }",
                    site: "datadoghq.eu",
                    service: "accelerate-frontend",
                    env: "${process.env.NEXT_PUBLIC_APP_ENV ?? "local"}",
                    sessionSampleRate: 100,
                    sessionReplaySampleRate: 20,
                    trackUserInteractions: true,
                    trackResources: true,
                    trackLongTasks: true,
                    defaultPrivacyLevel: "mask-user-input",
                    beforeSend: (event) => {
                      const ignoredPaths = ["/health"]
                      const currentPath = window.location.pathname
                      if (ignoredPaths.includes(currentPath)) {
                        // Returning false from beforeSend will drop the event
                        return false
                      }
                      // Otherwise, return the event to allow it to be sent to Datadog
                      return event
                    }
                   });

                  if(${isUserSet}){
                    window.DD_RUM && window.DD_RUM.setUser({
                      id: "${UserID}",
                      email: "${UserEmail}"
                    })

                  }
                }else{
                  console.log("Rum is disabled")
                }
              `}
        </Script>

        <Script
          id="dd-rum-browser-log-sync"
          src="https://www.datadoghq-browser-agent.com/eu1/v5/datadog-logs.js"
          type="text/javascript"
          strategy="beforeInteractive"
        />

        <Script
          id={"datadog-browser"}
          type="text/javascript"
          strategy="lazyOnload"
        >
          {`
              if(${shouldSendDatadogLogs}){
               window.DD_LOGS &&
                  window.DD_LOGS.init({
                    clientToken: "${
                      process.env.NEXT_PUBLIC_DATADOG_RUM_CLIENT_TOKEN
                    }",
                    env: "${process.env.NEXT_PUBLIC_APP_ENV ?? "local"}",
                    site: 'datadoghq.eu',
                    service: "accelerate-frontend",
                    forwardErrorsToLogs: true,
                    forwardConsoleLogs: ["error"],
                    sessionSampleRate: 100,
                  })
              }
              `}
        </Script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
