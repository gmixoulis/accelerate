"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  tableCellClasses,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { useQueryClient } from "@tanstack/react-query"
import { FaTimes } from "react-icons/fa"
import { shallow } from "zustand/shallow"

import ContactInfo from "@/app/[lng]/account-page/personal-info/components/ContactInfo"
import usePersonalStore from "@/app/store/storeApps"

import { UseTranslation } from "../../../i18n/client"
import fetchPersonalInfo from "../../hooks/fetchPersonalInfo"
import Organizations from "./components/Organizations"
import Socials from "./components/Socials"
import ConditionButtons from "./components/conditionButtons"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 10,
  },
}))
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child th, &:last-child td": {
    borderBottom: "none",
  },
}))

export default function PersonalInfo(params) {
  const { t } = UseTranslation(params.lng, "personal-info")
  const [clickedFirstName, setClickedFirstName] = React.useState(true)
  const [clickedLastName, setClickedLastName] = React.useState(true)
  const [clickedMiddleName, setClickedMiddleName] = React.useState(true)
  const [clickedUserHandle, setClickedUserHandle] = React.useState(true)
  const [clickedDisplayName, setClickedDisplayName] = React.useState(true)
  const { personalInformation, setInformation } = usePersonalStore(
    (state) => ({
      personalInformation: state.personalInformation,
      setInformation: state.setInformation,
    }),
    shallow
  )
  const [loading, setLoading] = React.useState(true)
  const [FirstName, setFirstName] = React.useState("")
  const [LastName, setLastName] = React.useState("")
  const [MiddleName, setMiddleName] = React.useState("")
  const [UserHandle, setUserHandle] = React.useState("")
  const [DisplayName, setDisplayName] = React.useState("")
  const [errors, setErrors] = React.useState({
    FirstName: "",
    LastName: "",
    MiddleName: "",
    DisplayName: "",
  })
  const queryClient = useQueryClient()
  const [errorsHandle, setErrorsHandle] = React.useState("")
  // Validate the first name using regex
  const validateFirstName = (value, name, printout) => {
    const nameRegex =
      /^[a-zA-Z\s\u00C0-\u02AF\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0531-\u0556\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F4\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u0600-\u06FF\u0590-\u05FF\u0900-\u097F']+$/u
    let errors = {}
    if (value.length < 2) {
      errors[name] = printout + t("UserHandleMin")
    } else if (!nameRegex.test(value.trim())) {
      errors[name] = printout + t("NamePattern")
    } else if (value.length > 25) {
      errors[name] = printout + t("UserHandleMax")
    } else {
      errors[name] = ""
    }
    if (value.length === 0) {
      errors[name] = ""
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...errors,
    }))
    console.log(errors.FirstName)
    return value // Return undefined if validation passes
  }
  const validateUserHandle = (value, name) => {
    const userHandleRegex = /^[a-zA-Z0-9_@-]+$/

    setErrorsHandle("")
    if (value.length < 3) {
      setErrorsHandle(name + t("UserHandleMin"))
    }
    if (value.length > 25) {
      setErrorsHandle(name + t("UserHandleMax"))
    }
    if (!userHandleRegex.test(value.trim())) {
      setErrorsHandle(name + t("UserHandlePattern"))
    }
    if (value.charAt(0) !== "@") {
      value = "@" + value
    }
    if (value.length === 1) {
      setErrorsHandle("")
    }
    return value // Return undefined if validation passes
  }

  function handleValues(e, value) {
    if (value === "FirstName")
      setFirstName(validateFirstName(e, "FirstName", t("First Name")))
    else if (value === "LastName")
      setLastName(validateFirstName(e, "LastName", t("Last Name")))
    else if (value === "MiddleName")
      setMiddleName(validateFirstName(e, "MiddleName", t("Middle Name")))
    else if (value === "DisplayName")
      setDisplayName(validateFirstName(e, "DisplayName", t("Display Name")))
    else if (value === "UserHandle")
      setUserHandle(validateUserHandle(e, t("User Handle")))
  }

  React.useEffect(() => {
    async function fetchPersonalInf() {
      const data = await queryClient.fetchQuery({
        queryKey: ["personalInfo"],
        queryFn: fetchPersonalInfo,
        refreshInterval: Infinity,
      })
      const personalInfo = data
      setInformation(personalInfo)
      setFirstName(personalInformation.FirstName || t("Add your first name"))
      localStorage.setItem(
        "FirstName",
        personalInfo.FirstName || t("Add your first name")
      )
      setLastName(personalInformation.LastName || t("Add your last name"))
      localStorage.setItem(
        "LastName",
        personalInfo.LastName || t("Add your last name")
      )
      setMiddleName(personalInformation.MiddleName || t("Add your middle name"))
      localStorage.setItem(
        "MiddleName",
        personalInfo.MiddleName || t("Add your middle name")
      )
      setUserHandle(personalInformation.UserHandle || t("Add your user handle"))
      localStorage.setItem(
        "UserHandle",
        personalInfo.UserHandle || t("Add your user handle")
      )
      setDisplayName(
        personalInformation.DisplayName ||
          t("Add a profile name to personalize your account")
      )
      localStorage.setItem(
        "DisplayName",
        personalInformation.DisplayName ||
          t("Add a profile name to personalize your account")
      )
    }
    setTimeout(() => {
      setLoading(false)
    }, 1000)

    fetchPersonalInf()
  }, [])

  function createData(name, inputValue, edit) {
    return { name, inputValue, edit }
  }
  const rows = [
    createData(
      <h2 className="py-2 m-0 font-light text-md text-dimgray-200 dark:text-white">
        {t("First Name")}
      </h2>,
      <>
        {clickedFirstName ? (
          <h2 className="float-left pl-0 m-0 ml-0 font-bold text-md text-dimgray-200 item-left ">
            {" "}
            {loading ? (
              <div
                role="status"
                className="h-2.5 animate-pulse dark:bg-gray-500 bg-gray-300 rounded-full  w-12"
              ></div>
            ) : FirstName === t("Add your first name") ? (
              <p
                id="FirstName"
                className="text-sm italic font-light text-gray-400 "
              >
                {FirstName}
              </p>
            ) : (
              <p id="FirstName" className="dark:text-white">
                {FirstName}
              </p>
            )}
          </h2>
        ) : (
          <>
            <input
              type="text"
              name="FirstName"
              onChange={(e) => handleValues(e.target.value, "FirstName")}
              value={FirstName === t("Add your first name") ? "" : FirstName}
              className="bg-white dark:text-white dark:bg-gray-800"
            />
            {errors.FirstName && (
              <p className="flex flex-wrap text-sm italic text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:p-2 dark:bg-opacity-75">
                <FaTimes color="red" />
                {errors.FirstName}
              </p>
            )}
          </>
        )}
      </>,

      <ConditionButtons
        data={{ FirstName }}
        clicked={clickedFirstName}
        noErrors={!errors.FirstName}
        errors={errors}
        setValue={setFirstName}
        setClicked={setClickedFirstName} // Pass setClicked to child component
        setErrors={setErrors}
        setData={setFirstName}
        url="user-profile"
      />
    ),
    createData(
      <h2 className="py-2 m-0 font-light text-md text-dimgray-200 dark:text-white">
        {t("Middle Name")}
      </h2>,
      <>
        {clickedMiddleName ? (
          <h2 className="float-left pl-0 m-0 ml-0 font-bold text-md text-dimgray-200 item-left">
            {" "}
            {loading ? (
              <div
                role="status"
                className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-12"
              ></div>
            ) : MiddleName === t("Add your middle name") ? (
              <p
                id="MiddleName"
                className="text-sm italic font-light text-gray-400 "
              >
                {MiddleName}
              </p>
            ) : (
              <p id="MiddleName" className="dark:text-white ">
                {MiddleName}
              </p>
            )}
          </h2>
        ) : (
          <>
            <input
              type="text"
              name="MiddleName"
              onChange={(e) => handleValues(e.target.value, "MiddleName")}
              value={MiddleName === t("Add your middle name") ? "" : MiddleName}
              className="bg-white dark:text-white dark:bg-gray-800"
            />
            {errors.MiddleName && (
              <p className="flex flex-wrap float-left text-sm italic text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:p-2 dark:bg-opacity-75">
                {" "}
                {errors.MiddleName}
              </p>
            )}
          </>
        )}
      </>,

      <ConditionButtons
        data={{ MiddleName }}
        clicked={clickedMiddleName}
        noErrors={!errors.MiddleName}
        errors={errors}
        setValue={setMiddleName}
        setClicked={setClickedMiddleName} // Pass setClicked to child component
        setData={setMiddleName}
        setErrors={setErrors}
        url="user-profile"
      />
    ),
    createData(
      <h2 className="py-2 m-0 font-light text-md text-dimgray-200 dark:text-white">
        {t("Last Name")}
      </h2>,
      <>
        {clickedLastName ? (
          <h2 className="float-left pl-0 m-0 ml-0 font-bold text-md text-dimgray-200 item-left">
            {" "}
            {loading ? (
              <div
                role="status"
                className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-12"
              ></div>
            ) : LastName === t("Add your last name") ? (
              <p
                id="LastName"
                className="text-sm italic font-light text-gray-400 "
              >
                {LastName}
              </p>
            ) : (
              <p id="LastName" className="dark:text-white">
                {LastName}
              </p>
            )}
          </h2>
        ) : (
          <>
            <input
              type="text"
              name="LastName"
              onChange={(e) => handleValues(e.target.value, "LastName")}
              value={LastName === t("Add your last name") ? "" : LastName}
              className="bg-white dark:text-white dark:bg-gray-800"
            />
            {errors.LastName && (
              <p className="flex flex-wrap text-sm italic text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:p-2 dark:bg-opacity-75">
                {" "}
                <FaTimes color="red" />
                {errors.LastName}
              </p>
            )}
          </>
        )}
      </>,

      <ConditionButtons
        data={{ LastName }}
        clicked={clickedLastName}
        noErrors={!errors.LastName}
        errors={errors}
        setValue={setLastName}
        setClicked={setClickedLastName} // Pass setClicked to child component
        setData={setLastName}
        setErrors={setErrors}
        url="user-profile"
      />
    ),
    createData(
      <h2 className="py-2 m-0 font-light text-md text-dimgray-200 dark:text-white">
        {t("Display Name")}
      </h2>,
      <>
        {clickedDisplayName ? (
          <h2 className="float-left pl-0 m-0 ml-0 font-bold text-md text-dimgray-200 item-left">
            {" "}
            {loading ? (
              <div
                role="status"
                className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-12"
              ></div>
            ) : DisplayName ===
              t("Add a profile name to personalize your account") ? (
              <p
                id="DisplayName"
                className="text-sm italic font-light text-gray-400 "
              >
                {DisplayName}
              </p>
            ) : (
              <p id="DisplayName" className="dark:text-white">
                {DisplayName}
              </p>
            )}
          </h2>
        ) : (
          <>
            <input
              type="text"
              name="DisplayName"
              onChange={(e) => handleValues(e.target.value, "DisplayName")}
              value={
                DisplayName ===
                t("Add a profile name to personalize your account")
                  ? ""
                  : DisplayName
              }
              className="bg-white dark:text-white dark:bg-gray-800"
            />
            {errors.DisplayName && (
              <p className="flex flex-wrap text-sm italic text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:p-2 dark:bg-opacity-75">
                {" "}
                <FaTimes color="red" />
                {errors.DisplayName}
              </p>
            )}
          </>
        )}
      </>,

      <ConditionButtons
        data={{ DisplayName }}
        clicked={clickedDisplayName}
        noErrors={!errors.DisplayName}
        errors={errors}
        setValue={setDisplayName}
        setClicked={setClickedDisplayName} // Pass setClicked to child component
        setData={setDisplayName}
        setErrors={setErrors} // Pass setErrors to child component
        url="user-profile"
      />
    ),
    createData(
      <h2 className="py-2 m-0 font-light text-md text-dimgray-200 dark:text-white">
        {t("User Handle")}
      </h2>,
      <>
        {clickedUserHandle ? (
          <h2 className="float-left pl-0 m-0 ml-0 font-bold text-md text-dimgray-200 item-left">
            {" "}
            {loading ? (
              <div
                role="status"
                className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-12"
              ></div>
            ) : UserHandle === t("Add your user handle") ? (
              <p
                id="UserHandle"
                className="text-sm italic font-light text-gray-400 "
              >
                {UserHandle}
              </p>
            ) : (
              <p id="UserHandle" className="dark:text-white">
                {UserHandle}
              </p>
            )}
          </h2>
        ) : (
          <>
            <input
              type="text"
              name="UserHandle"
              onChange={(e) => handleValues(e.target.value, "UserHandle")}
              value={UserHandle === t("Add your user handle") ? "" : UserHandle}
              className="bg-white dark:text-white dark:bg-gray-800"
            />
            {errorsHandle && (
              <p className="flex flex-wrap text-sm italic text-red-100 dark:mt-1 rounded-xl dark:bg-gray-300 dark:p-2 dark:bg-opacity-75">
                {" "}
                {errorsHandle}
              </p>
            )}
          </>
        )}
      </>,

      <ConditionButtons
        data={{ UserHandle }}
        clicked={clickedUserHandle}
        noErrors={!errorsHandle}
        errors={errorsHandle}
        setValue={setUserHandle}
        setClicked={setClickedUserHandle} // Pass setClicked to child component
        setData={setUserHandle}
        setErrors={setErrorsHandle}
        url="user-profile"
      />
    ),
  ]
  return (
    <>
      <div className="min-h-screen h-auto pb-2 overflow-x-hidden !overflow-y-hidden md:w-[50vw] row dark:bg-darkslategray-100">
        <h2 className="top-0 flex-wrap block row-auto p-0 m-0 font-sans text-dimgray-200 text-7xl dark:text-white">
          {t("Account Info")}
        </h2>
        <br></br>
        <main className="left-0 flex flex-wrap object-contain pt-2 overflow-hidden text-center row max-w-fit w-fit">
          <TableContainer
            sx={{
              width: "50vw",
              height: "auto",
              objectFit: "contain",
              borderRadius: "15px",
            }}
          >
            <Table aria-label="customized table">
              <TableBody className="dark:bg-gray-700">
                {rows.map((col, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell
                      align="left"
                      component="th"
                      scope="col"
                      className="w-[15vw]"
                    >
                      {col.name}
                    </StyledTableCell>
                    <StyledTableCell align="left" className="max-w-[5vw]">
                      {col.inputValue}
                    </StyledTableCell>

                    <StyledTableCell
                      align="right"
                      className="p-0 m-0 w-11 max-w-11"
                    >
                      {col.edit}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </main>
        <Organizations />
        <ContactInfo />
        <Socials />
      </div>
    </>
  )
}
