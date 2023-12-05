// DataInputModal.js
import React, { useEffect, useState } from "react"
import { BACKEND_URL } from "@/server"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import { useQuery } from "@tanstack/react-query"
import Pluralize from "pluralize"

import { UseTranslation } from "../../../i18n/client"
import axiosRequest from "../../hooks/axiosRequest"
import BasicSelect from "./BasicSelect"
import TransitionsModal from "./TransitionModal"

function capitalizeFLetter(string) {
  return string[0].toUpperCase() + string.slice(1)
}

export default function DataInputModal({
  apiFields,
  open,
  setOpen,
  onSave,
  corporate,
  country,
  lng,
}) {
  const { t } = UseTranslation(lng, "tenant-app")
  const initialModalData = apiFields.reduce((acc, field) => {
    acc[field] = null
    return acc
  }, {})
  const [isFormValid, setIsFormValid] = useState(false)

  const [modalData, setModalData] = useState(initialModalData)
  const [dropdownData, setDropdownData] = useState({})
  const [itemName, setItemName] = useState("")
  const initialErrorState = apiFields.reduce((acc, field) => {
    acc[field] = { hasError: false, message: "" }
    return acc
  }, {})
  const [fieldErrors, setFieldErrors] = useState(initialErrorState)
  useEffect(() => {
    apiFields.forEach(async (field) => {
      if (field.includes("ID")) {
        const fieldNameWithoutID = field.toLowerCase().replace("id", "")
        let data = await fetchDataForDropdown(fieldNameWithoutID)

        data = data[capitalizeFLetter(Pluralize(fieldNameWithoutID))]
        setItemName(capitalizeFLetter(fieldNameWithoutID))
        setDropdownData((prevData) => ({ ...prevData, [field]: data }))
      } else if (field.includes("Country")) {
        setDropdownData((prevData) => ({
          ...prevData,
          [field]: country.Countries.map((country) => country),
        }))
        return field + "ID"
      } else if (field.includes("Corporate")) {
        setDropdownData((prevData) => ({
          ...prevData,
          [field]: corporate.CorporateLegalTypes.map((corporate) => corporate),
        }))
        return field + "ID"
      }
    })
  }, [apiFields])

  const fetchDataForDropdown = async (apiName) => {
    try {
      const response = await axiosRequest(`${BACKEND_URL}${apiName}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching data for ${apiName}:`, error)
      return []
    }
  }

  const handleModalSave = () => {
    onSave(modalData)
    setOpen(false)
  }
  const validateTextField = (value) => {
    return value.trim() === "" // returns true if field is empty
  }

  // Function to validate dropdowns
  const validateDropdown = (value) => {
    return value === null || value === "" // adjust this based on how you determine an empty selection in your dropdowns
  }

  const handleInputChange =
    (field, isDropdown = false) =>
    (event) => {
      const value = isDropdown ? event.target.value : event.target.value || ""
      const isError = isDropdown
        ? validateDropdown(value)
        : validateTextField(value)

      // Update modal data
      setModalData((prevData) => ({
        ...prevData,
        [field]: value,
      }))

      // Update error state for the field and perform actions after state update
      setFieldErrors((prevErrors) => {
        const updatedErrors = {
          ...prevErrors,
          [field]: isError,
        }
        delete updatedErrors.id
        // Debugging output with updated state

        // Perform actions after state update, if needed
        // ...
        if (Object.values(updatedErrors)) {
          const values = Object.values(updatedErrors)
          let sum
          if (Object.values(updatedErrors).length === 1) {
            sum = values?.reduce((accumulator, value) => {
              return !value
            })
            sum = !sum
          } else {
            sum = values?.reduce((accumulator, value) => {
              return !accumulator && !value
            })
          }
          setIsFormValid(sum)
        }
        return updatedErrors
      })
    }

  return (
    <TransitionsModal
      className="dark:bg-darkslategray-100 min-w-[40vw]"
      open={open}
      setOpen={setOpen}
    >
      <div className="p-4 bg-white rounded-md dark:text-white dark:bg-darkslategray-100">
        <div className="grid grid-cols-3 gap-4">
          {apiFields.map((field, index) => {
            if (field === "id") return null
            return (
              <div key={index} className="p-1">
                {field.includes("ID") || dropdownData[field] ? (
                  <BasicSelect
                    label={field}
                    itemName={itemName}
                    className="dark:text-white"
                    data={dropdownData[field]}
                    onChange={handleInputChange(field, index, true)}
                    error={fieldErrors[field]}
                    helperText={
                      fieldErrors[field] ? "This field is required" : ""
                    }
                  />
                ) : (
                  <TextField
                    label={field}
                    variant="outlined"
                    required={true}
                    className="dark:bg-darkslategray-200 dark:text-white"
                    onChange={handleInputChange(field, index)}
                    error={fieldErrors[field]}
                    helperText={
                      fieldErrors[field] ? "This field is required" : ""
                    }
                  />
                )}
              </div>
            )
          })}
        </div>
        <div className="flex justify-end p-4 space-x-2">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setOpen(false)
              setIsFormValid(false)
              setFieldErrors(initialErrorState)
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleModalSave}
            disabled={!isFormValid}
          >
            {t("Save")}
          </Button>
        </div>
      </div>
    </TransitionsModal>
  )
}
