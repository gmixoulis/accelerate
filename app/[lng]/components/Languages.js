"use client"

import React, { useEffect, useState } from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import { loadingButtonClasses } from "@mui/lab"
import Gleap from "gleap"
import ReactFlagsSelect from "react-flags-select"

const LanguagesDropdown = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { lng } = useParams()

  const languages = {
    en: "GB",
    el: "GR",
  }
  const [selected, setSelected] = useState(languages[lng] || "")
  useEffect(() => {
    Gleap.getInstance().softReInitialize()
    console.log("hello")
    if (localStorage.getItem("language") !== lng) {
      //window.location.reload()
    }
    setSelected(languages[lng] || "")
    localStorage.setItem("language", lng)
  }, [lng])

  const onSelect = (code) => {
    let languageCode = code
    if (code === "GB") languageCode = "EN"
    if (code === "GR") languageCode = "EL"

    setSelected(languageCode)

    const url = pathname.replace(`/${lng}`, `/${languageCode.toLowerCase()}`)
    localStorage.setItem("i18nextLng", languageCode.toLowerCase())
    router.prefetch(url)
    //Gleap.getInstance().softReInitialize()

    router.replace(url)
  }
  const searchable = false
  const placeholder = "Select Language"
  const alignOptionsToRight = true
  const optionsSize = 16
  const customLabels = {
    GB: "EN",
    GR: "EL",
  }
  return (
    <div className="!bg-transparent !border-none w-auto h-auto">
      <ReactFlagsSelect
        selected={selected}
        onSelect={onSelect}
        placeholder={placeholder}
        searchable={searchable}
        className="!bg-transparent border-none !opacity-100 !dark:border-white dark:!text-white dark:bg-slate-200"
        countries={["GB", "GR"]}
        alignOptionsToRight={alignOptionsToRight}
        optionsSize={optionsSize}
        customLabels={customLabels}
      />
    </div>
  )
}
export default LanguagesDropdown
