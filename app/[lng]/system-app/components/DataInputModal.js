// DataInputModal.js
import React, { useEffect, useState } from "react"
import { BACKEND_URL } from "@/server"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Pluralize from "pluralize"

import axiosRequest from "../../hooks/axiosRequest"
import BasicSelect from "./BasicSelect"
import TransitionsModal from "./TransitionModal"

function capitalizeFLetter(string) {
  return string[0].toUpperCase() + string.slice(1)
}

export default function DataInputModal({ apiFields, open, setOpen, onSave }) {
  const initialModalData = apiFields.reduce((acc, field) => {
    acc[field] = null
    return acc
  }, {})

  const [modalData, setModalData] = useState(initialModalData)
  const [dropdownData, setDropdownData] = useState({})
  const [itemName, setItemName] = useState("")
  useEffect(() => {
    apiFields.forEach(async (field) => {
      if (field.includes("ID")) {
        const fieldNameWithoutID = field.toLowerCase().replace("id", "")
        let data = await fetchDataForDropdown(fieldNameWithoutID)

        data = data[capitalizeFLetter(Pluralize(fieldNameWithoutID))]
        setItemName(capitalizeFLetter(fieldNameWithoutID))
        setDropdownData((prevData) => ({ ...prevData, [field]: data }))
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

  const handleInputChange = (field) => (event) => {
    setModalData((prevData) => ({
      ...prevData,
      [field]: event.target.value || "",
    }))
  }

  const handleModalSave = () => {
    onSave(modalData)
    setOpen(false)
  }

  return (
    <TransitionsModal
      className="dark:bg-darkslategray-100 min-w-[40vw]"
      open={open}
      setOpen={setOpen}
    >
      <div className="p-4 bg-white rounded-md dark:text-white dark:bg-darkslategray-100">
        <table className="text-left table-auto ">
          <tbody>
            <tr>
              {apiFields.map((field, index) => {
                if (field === "id") return null
                if (field.includes("ID") && dropdownData[field]) {
                  return (
                    <td key={index} className="p-1 ">
                      <BasicSelect
                        label={field}
                        itemName={itemName}
                        required={true}
                        className="dark:text-white"
                        data={dropdownData[field]}
                        onChange={handleInputChange(field)}
                      />
                    </td>
                  )
                } else {
                  return (
                    <td key={index} className="p-1 ">
                      <TextField
                        label={field}
                        variant="outlined"
                        required={true}
                        className="dark:bg-darkslategray-200 dark:text-white"
                        onChange={handleInputChange(field)}
                      />
                    </td>
                  )
                }
              })}
              <td className="flex justify-end p-4 space-x-2 ">
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleModalSave}
                >
                  Save
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </TransitionsModal>
  )
}
