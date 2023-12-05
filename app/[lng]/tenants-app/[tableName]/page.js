"use client"

import React, { useEffect, useState } from "react"
import { BACKEND_URL } from "@/server"
import { fi } from "date-fns/locale"
import Pluralize from "pluralize"

import axiosRequest from "../../hooks/axiosRequest"
import Loading from "../../hooks/loading"
import dbStructure from "../acceleratedb.json"
import GenericGrid from "../components/genericGrid"
import LoaderTable from "../components/loadertable"

const columnsToIgnore = new Set([
  "CountryID",
  "2",
  "3",
  "CountryPolygon",
  "Nationality",
  "EnglishName",
  "CorporateLegalTypeID",
  "CorporateLegalID",
  "Country",
  "CountryID",
  "ContinentID",
  "Continent",
  "LegalTypeDescription",
  "TenantVatNumber",
  "TenantGovIDNumber",
])

const renameIDtoId = (item) => {
  const newItem = {}
  let count = 0
  for (const key in item) {
    if (key.endsWith("ID") && count === 0) {
      newItem["id"] = item[key]
      count += 1
    } else {
      newItem[key] = item[key]
    }
  }
  return newItem
}

const inferPrimaryKey = (data) => {
  const firstItem = data[0]

  for (const key in Object.keys(firstItem)) {
    // Traverse the keys of the firstItem
    if (key.includes("ID")) {
      // Check if the key is one of the common keys
      return key
    }
  }

  return Object.keys(firstItem)[0] // default to the first key if no common key is found
}

//LegalTypeName
function capitalizeFLetter(string) {
  return string[0].toUpperCase() + string.slice(1)
}
const splitAndCapitalize = (str) => {
  // Define common word boundaries
  const boundaries = ["country", "corporate"]

  let result = str

  // Split based on boundaries and capitalize
  boundaries.forEach((boundary) => {
    if (str.includes(boundary)) {
      result = result.replace(boundary, capitalizeFLetter(boundary))
    }
  })

  return result
}

const isFieldEmptyForAll = (data, field) => {
  return data.every((item) => item[field] === null || item[field] === undefined)
}

// Helper function to extract data from foreign key fields

const DynamicGrid = ({ params: { tableName } }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [fields, setFields] = useState([])
  const [primaryKey, setPrimaryKey] = useState("id")
  const [apifield, setApiField] = useState("")
  const [apiFields, setApiFields] = useState([])
  const fetchData = async () => {
    const response = await axiosRequest(`${BACKEND_URL}${tableName}/`)
    const rawData =
      response?.data[
        splitAndCapitalize(
          capitalizeFLetter(Pluralize(tableName.replace(/[-_]/g, "")))
        )
      ]
    return rawData.map(renameIDtoId)
  }

  const structuresFieldNames = dbStructure.AccelerateDB[
    capitalizeFLetter(tableName)
  ].fields.map((item) => item.name)

  const extractForeignKeyData = (data, field) => {
    return data.map((item) => {
      if (item[field] && typeof item[field] === "object") {
        // Extract the properties of the foreign key object and flatten them into the main object
        Object.keys(item[field]).forEach((subField) => {
          item[`${field}_${subField}`] = item[field][subField]
          if (subField.endsWith("ID")) {
            setApiField(subField)
          }
        })
        delete item[field] // Remove the original foreign key object
      }
      return item
    })
  }
  useEffect(() => {
    async function loadData() {
      let tableData = await fetchData()

      setApiFields(Object.keys(tableData[0]))
      let nonEmptyFields = Object.keys(tableData[0]).filter(
        (field) => !isFieldEmptyForAll(tableData, field)
      )

      tableData = tableData.map((item) => {
        const newItem = {}
        nonEmptyFields.forEach((field) => {
          newItem[field] = item[field]
        })
        return newItem
      })

      // Apply the ignoreColumns function to filter out unwanted columns
      // tableData = ignoreFields(tableData, columnsToIgnore)
      try {
        nonEmptyFields?.forEach((field) => {
          if (
            typeof tableData[0][field] === "object" &&
            Object.keys(tableData[0][field]).some((subField) =>
              subField.endsWith("ID")
            )
          ) {
            tableData = extractForeignKeyData(tableData, field)
          }
        })
      } catch (e) {
        console.log(e)
      }

      setData(tableData)
      setFields(nonEmptyFields)

      setPrimaryKey(inferPrimaryKey(tableData))

      setLoading(false)
    }

    loadData()
  }, [tableName])

  if (loading) {
    return <LoaderTable />
  }

  if (apifield) {
    for (let key in fields) {
      if (apifield.includes(fields[key])) {
        fields[key] = apifield
      }
    }
  }

  return (
    <GenericGrid
      data={data}
      apiName={tableName}
      fields={fields.filter((x) => !columnsToIgnore.has(x))}
      getRowId={(row) => row[primaryKey]}
      length={data.length}
      fetchApi={fetchData}
      apiFields={fields}
      columnsToIgnore={columnsToIgnore}
      capitalizeFLetter={capitalizeFLetter}
    />
  )
}

export default DynamicGrid
