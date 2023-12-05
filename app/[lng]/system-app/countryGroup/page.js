"use client"

// CountryGrid.js
import React, { useEffect, useState } from "react"
import { BACKEND_URL } from "@/server"
import { set } from "date-fns"

// Update the path accordingly
import axiosRequest from "../../hooks/axiosRequest"
import Loading from "../../hooks/loading"
import GenericGrid from "../components/genericGrid"

const inferPrimaryKey = (data) => {
  if (data.length === 0) return "id" // default to "id" if no data

  const firstItem = data[0]
  const commonKeys = ["id", "ID", "CountryID", "countryID"]
  for (const key of commonKeys) {
    if (firstItem.hasOwnProperty(key)) {
      return key
    }
  }
  return "id" // default to "id" if no common key is found
}

const CountryGrid = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true) // Add a loading state
  const [fields, setFields] = useState([]) // Add a loading state
  const [primaryKey, setPrimaryKey] = useState("id") // Add a loading state

  const fetchCountries = async () => {
    const response = await axiosRequest(`${BACKEND_URL}country/`)
    const countriesData =
      response?.data?.Countries.map((country) => ({
        id: country.CountryID,
        name: country.EnglishName,
        CountryCode_2: country.CountryCode_2,
        CountryCode_3: country.CountryCode_3,
        Nationality: country.Nationality,
        ContinentID: country.Continent.ContinentID,
        ContinentDescription: country.Continent.Description,
      })) || []
    return countriesData
  }
  useEffect(() => {
    async function loadData() {
      const countries = await fetchCountries()
      setData(countries)

      setFields(Object.keys(countries[0]))
      setPrimaryKey(inferPrimaryKey(data))
      setLoading(false)
    }

    loadData()
  }, [])

  // If loading is true, display a loading message
  if (loading) {
    return <Loading />
  }
  return (
    <GenericGrid
      data={data}
      apiName="country"
      fields={fields}
      primaryKey={primaryKey}
      length={data.length}
      fetchApi={fetchCountries}
      apiFields={[
        "EnglishName",
        "CountryCode_2",
        "CountryCode_3",
        "Nationality",
        "ContinentID",
        "CountryPolygon",
      ]}
    />
  )
}

export default CountryGrid
