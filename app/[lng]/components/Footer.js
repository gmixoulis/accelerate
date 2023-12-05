"use client"

import { useParams } from "next/navigation"
import { Trans } from "react-i18next"

import { UseTranslation } from "@/app/i18n/client"

export default function Footer() {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "footer")

  return (
    <footer className="flex text-[12px] flex-wrap items-center justify-center w-auto max-w-full p-1 m-auto font-light !z-99999 text-dimgray-200 dark:text-white">
      <Trans
        i18nKey="footer:Footer"
        shouldUnescape={true}
        values={{
          link1: t("Terms & Conditions"),
          link2: t("Privacy Policy"),
          link3: t("Cookie Policy"),
          link4: t("Contact Us"),
          link5: t("Status"),
          link6: t("Releases"),
        }}
        components={[
          <a
            key="terms"
            href="https://www.unic.ac.cy/terms-and-conditions/"
            rel="noopener noreferrer"
            target="_blank"
            className="px-1 underline cursor-pointer "
          />,
          <a
            key="privacy"
            href="https://www.unic.ac.cy/privacy-policy/"
            rel="noopener noreferrer"
            target="_blank"
            className="px-1 underline cursor-pointer "
          />,
          <a
            key="cookie"
            href="https://www.unic.ac.cy/cookie-policy/"
            rel="noopener noreferrer"
            target="_blank"
            className="px-1 underline cursor-pointer "
          />,
          <a
            key="contact"
            rel="noopener noreferrer"
            target="_blank"
            className="px-1 underline cursor-pointer "
            href="mailto:support@accelerate.unic.ac.cy"
          />,
          <a
            key="status"
            rel="noopener noreferrer"
            target="_blank"
            className="px-1 underline cursor-pointer "
            href="https://uptime.unic.ac.cy/"
          />,
          <a
            key="releases"
            rel="noopener noreferrer"
            className="px-1 underline cursor-pointer "
            href="/posts/releases"
          />,
        ]}
      />
    </footer>
  )
}
