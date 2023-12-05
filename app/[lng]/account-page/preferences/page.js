"use client"

import { useEffect, useState } from "react"
import { BACKEND_URL } from "@/server"
import jwt_decode from "jwt-decode"
import { toast } from "react-toastify"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"

import { UseTranslation } from "../../../i18n/client"
import getAccessToken from "../../hooks/getAccessToken"
import Button from "../../powerflow/components/Button"
import Accessibility from "./components/Accessibility"
import AutoCompleteDropdown from "./components/AutoCompleteDropdown"
import Dropdown from "./components/Dropdown"
import CustomTable from "./components/Table"

const languages = [
  { name: "English", id: 42 },
  { name: "Greek", id: 57 },
]
const measurements = [
  { name: "Metric", id: 1 },
  { name: "Imperial", id: 2 },
]

export default function Preferences(params) {
  const { t } = UseTranslation(params.lng, "preferences")
  const [selectedLanguage, setSelectedLanguage] = useState({})
  const [selectedMeasurement, setSelectedMeasurement] = useState({})
  const [selectedTimezone, setSelectedTimezone] = useState({})
  const [timezones, setTimezones] = useState([])
  //const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const { UserID, TenantID } = getAccessToken()

  // const fetchTenants = async () => {
  //   const url = `${BACKEND_URL}tenant/userID/${UserID}`
  //   try {
  //     const response = await axiosRequest(url)
  //       if (!response.error) {
  //           return response.data
  //       } else {
  //         return ""
  //       }
  //   } catch (error) {
  //     console.log("error in fetchTenants: ", error)
  //     toast.error("An error occurred: " + error.message, {
  //       toastId: "error1",
  //     })
  //   }
  // }

  const fetchUserPreferences = async (tenantId) => {
    const url = `${BACKEND_URL}user-tenant-prefs/${tenantId}/${UserID}`

    try {
      const response = await axiosRequest(url)
      console.log("response.data", response.data)

      //TODO: use the axiosRequest.js

      if (!response.error) {
        return response.data
      } else {
        return ""
      }
    } catch (error) {
      console.log("error in fetchUserPrefences: ", error)
      const message =
        error?.response?.data?.userTenantPreferenceError || error.message
      /*toast.error('Error fetching user preferences: ' + message, {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        toastId: 'error1',
      })*/
    }
  }

  //TODO: we need to refactor this page to use the axiosRequest js
  const fetchTimezones = async () => {
    const url = `${BACKEND_URL}timezone`

    try {
      const response = await axiosRequest(url)

      if (!response.error) {
        return response.data
      } else {
        return ""
      }
    } catch (error) {
      // console.log("error in fetchTimezones: ", error)
      // toast.error("Error fetching timezones: " + error.message, {
      //   toastId: "error1",
      // })
    }
  }

  const updateUserPreferences = async (tenantId) => {
    //Prevent update if any of the preferences is not selected
    if (
      !selectedLanguage?.id ||
      !selectedMeasurement?.id ||
      !selectedTimezone?.id
    ) {
      toast.error("Please select all preferences", {
        toastId: "error1",
      })
      return
    }
    const preferences = {
      LanguageID: selectedLanguage.id,
      TimezoneID: selectedTimezone.id,
      MeasurementSysID: selectedMeasurement.id,
    }

    const url = `${BACKEND_URL}user-tenant-prefs/${tenantId}/${UserID}`

    // const data = JSON.stringify(preferences)
    const data = preferences
    // console.log("DATA", data)

    await axiosRequest(url, "patch", data)
      .then((res) => {
        // console.log("res==========", res.data)
        toast.success(res.data, {
          toastId: "success1",
        })
      })
      .catch((err) => {
        console.log("err", err)
        toast.error("An error occurred: " + err.data, {
          toastId: "error1",
        })
      })
  }

  useEffect(() => {
    let timezoneOptions = []

    // timezoneOptions =
    fetchTimezones()
      .then((timezonesData) => {
        // setTenants(tenantsData)

        timezoneOptions = timezonesData.TimeZones.map((tz) => ({
          name: tz.TimezoneName,
          id: tz.TimeZoneID,
        }))
        setTimezones(timezoneOptions)

        return fetchUserPreferences(TenantID)
      })
      .then((preferencesData) => {
        if (!preferencesData) {
          throw new Error("Failed to fetch user preferences")
        }

        const language = languages.find(
          (lang) => lang.id === preferencesData[0].LanguageID
        )
        setSelectedLanguage(language)

        const measurement = measurements.find(
          (m) => m.id === preferencesData[0].MeasurementSysID
        )
        setSelectedMeasurement(measurement)

        const timezone = timezoneOptions.find(
          (tz) => tz.id == preferencesData[0].TimeZoneID
        )
        setSelectedTimezone(timezone)
      })
      .catch((error) => {
        console.log("Error fetching data:", error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const handleReset = async () => {
    const userPreferences = await fetchUserPreferences(TenantID)
    if (!userPreferences) return

    // const language = languages.find((lang) => lang.id === 42)
    const language = languages[0].id
    // const measurement = measurements.find((measure) => measure.id === 1)
    const measurement = measurements[0].id
    // const timezone = timezones.find((tz) => tz.id === 596)
    const timezone = 596

    setSelectedLanguage(language)
    setSelectedMeasurement(measurement)
    setSelectedTimezone(timezone)
  }

  const handleApplyChanges = async () => {
    const tenantId = TenantID
    // console.log("TenantID", tenantId)
    await updateUserPreferences(tenantId)
  }

  const general_rows = [
    {
      name: t("Language"),
      content: (
        <AutoCompleteDropdown
          options={languages}
          selected={selectedLanguage}
          setSelected={setSelectedLanguage}
          loading={loading}
        />
      ),
    },
    {
      name: t("Measurements"),
      content: (
        <AutoCompleteDropdown
          options={measurements}
          selected={selectedMeasurement}
          setSelected={setSelectedMeasurement}
          loading={loading}
        />
      ),
    },
    {
      name: t("Time Zone"),
      content: (
        <AutoCompleteDropdown
          options={timezones}
          selected={selectedTimezone}
          setSelected={setSelectedTimezone}
          loading={loading}
        />
      ),
    },
  ]

  return (
    <>
      <div className="flex flex-col  md:w-[50vw] gap-8  min-h-full h-auto">
        <h2 className="top-0 flex-wrap block row-auto p-0 m-0 font-sans text-dimgray-200 text-7xl dark:text-whitesmoke">
          {t("General")}
        </h2>
        <CustomTable rows={general_rows} />
        <div className="flex justify-end gap-4 mb-4">
          {/*<button*/}
          {/*  className="px-3 py-2 font-medium rounded-full cursor-pointer bg-whitesmoke text-dimgray-200 hover:opacity-50"*/}
          {/*  onClick={handleReset}*/}
          {/*>*/}
          {/*  {t("Reset")}*/}
          {/*</button>*/}
          <button
            className="py-3 text-sm font-bold no-underline border border-gray-400 border-solid rounded-lg cursor-pointer px-7 w-35 dark:bg-transparent dark:text-white dark:bg-darkslategray-100 hover:opacity-75 text-bold bg-whitesmoke text-dimgray-100 hover:bg-gray-300 hover:text-dimgray-200 "
            onClick={handleApplyChanges}
          >
            {t("Apply")}
          </button>
        </div>

        <Accessibility />
      </div>
    </>
  )
}
