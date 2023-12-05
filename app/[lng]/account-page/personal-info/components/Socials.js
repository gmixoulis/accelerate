"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  tableCellClasses,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import Delete from "@/app/[lng]/components/Delete"
import { UseTranslation } from "@/app/i18n/client"

import fetchSocials from "../../../hooks/fetchSocials"
import ConditionButtons from "./conditionButtons"
import GenericGrid from "./genericGrid"
import SocialMediaModal from "./modalSocial"

// ###### STYLING CELLS & ROWS (MUI WAY) ######
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
// ###### DATA ######
const contactInfoData = [
  // { id: 1, name: "X", inputValue: "Add your X Profile Id" },
  { id: 1, name: "Loading....", inputValue: "Loading...." },
]

// ###### MAIN FUNCTION ######
export default function ContactInfo() {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "socials")
  const [loading, setLoading] = useState(true)
  const [showDialog, setShowDialog] = useState(false)
  const [selectedSocialMedia, setSelectedSocialMedia] = useState(null) // Step 1: Create state for selected social media
  const [userHandle, setUserHandle] = useState("") // Step 2: Create state for user handle
  const [errors, setErrors] = useState("")
  const [settedSocialMedia, setSettedSocialMedia] = useState("DSAD")
  const [clickedItem, setClickedItem] = useState(true)
  const [itemStates, setItemStates] = useState(
    contactInfoData.map((item) => ({
      state: item,
      isItemInEditMode: false, // Initialize as false
    }))
  )

  const handleAddSocialMedia = (socialMedia) => {
    setSelectedSocialMedia(...socialMedia)
  }

  const validateUserHandle = (value, regex, example) => {
    const userHandleRegex = new RegExp(regex)
    setErrors("")
    if (!value) {
      setErrors(t("Please enter a value"))
    }
    if (value.length > 60) {
      setErrors(t("Please enter a value less than 60 characters"))
    }

    if (!userHandleRegex.test(value)) {
      setErrors(t("Not valid url. Here is an example: ") + example)
    }
    return value // Return undefined if validation passes
  }

  // ###### LOADING STATE (fake fetch)######
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
    fetchSocials()
      .then((data) => {
        const socialMediaArray = Object.values(data.UserSocial).map(
          (item, index) => ({
            state: item,
            isItemInEditMode: false,
          })
        )

        setItemStates((prevItemStates) => [...socialMediaArray])
      })
      .catch((error) => {
        console.log("Error fetching social media data: ", error)
      })
  }, [])
  const handleDelete = (postIndex) => {
    setItemStates((prevPosts) =>
      prevPosts.filter((_, index) => index !== postIndex)
    )
  }
  const toggleEditMode = (index) => {
    // Toggle the isItemInEditMode state for the clicked item
    setItemStates((prevState) =>
      prevState.map((item, i) => ({
        ...item,
        isItemInEditMode:
          i === index ? !item.isItemInEditMode : item.isItemInEditMode,
      }))
    )

    // Update the clickedItem state here
  }

  function createData(name, inputValue, edit) {
    return { name, inputValue, edit }
  }

  const rows2 = itemStates.map((org, index) => {
    const handleItemClick = (index) => {
      // Toggle the edit mode for the clicked item
      toggleEditMode(index)
    }

    const isItemInEditMode = org.isItemInEditMode

    return {
      id: index, // Use a unique identifier as the ID
      name: loading ? (
        <div
          role="status"
          className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-5"
        ></div>
      ) : (
        <h2
          id={org.state?.SocialMediaID || index}
          className="py-2 m-0 font-light text-md text-dimgray-200 dark:text-white"
        >
          {org.state?.name || org.state?.SiteName}
        </h2>
      ),
      inputValue: !isItemInEditMode ? (
        <h2 className="float-left pl-0 m-0 ml-0 font-bold text-md text-dimgray-200 item-left max-w-12">
          {" "}
          {loading ? (
            <div
              role="status"
              className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-12 "
            ></div>
          ) : org.state?.inputValue?.includes("Add your") ? (
            <p className="text-sm italic font-light text-gray-400">
              {org.state?.inputValue}
            </p>
          ) : (
            <p className="dark:text-white">{org.state?.SocialProfileHandle}</p>
          )}
        </h2>
      ) : (
        <div className="">
          <input
            className=" rounded-md pl-3 h-7 z-10 border-[1px] border-gray-300 border-solid dark:text-white"
            type="text"
            id={org.state?.name || org.state?.SocialMediaID}
            defaultValue={org.state?.SocialProfileHandle}
            onChange={(e) => {
              setUserHandle(
                validateUserHandle(
                  e.target.value,
                  org.state?.RegexAllowedProfileStructure,
                  org.state?.SocialMediaProfileURL
                )
              )
            }}
          />
          {errors && (
            <p className="text-sm italic text-red-100 dark:p-2 dark:mt-1 rounded-xl dark:bg-gray-300 dark:bg-opacity-75">
              {errors}
            </p>
          )}
        </div>
      ),
      edit: (
        <ConditionButtons
          data={{ index: index, org: org, userHandle: userHandle }}
          clicked={!isItemInEditMode} // Check if this row is in edit mode
          noErrors={!errors}
          setClicked={() => handleItemClick(index)} // Pass setClicked to the child component
          setData={handleItemClick}
          handleDelete={handleDelete}
          url="user-social"
          setErrors={setErrors}
        />
      ),
    }
  })

  const rows1 = itemStates.map((org, index) => {
    const handleItemClick = (index) => {
      // Toggle the edit mode for the clicked item
      toggleEditMode(index)
    }
    // Determine if this row's first name should be in edit mode
    const isItemInEditMode = org.isItemInEditMode
    return createData(
      <>
        {loading ? (
          <div
            role="status"
            className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-5"
          ></div>
        ) : (
          <h2
            id={org.state?.SocialMediaID || index}
            className="py-2 m-0 font-light text-md text-dimgray-200 dark:text-white"
          >
            {org.state?.name || org.state?.SiteName}
          </h2>
        )}
      </>,
      <>
        {!isItemInEditMode ? (
          <h2 className="float-left pl-0 m-0 ml-0 font-bold text-md text-dimgray-200 item-left max-w-12">
            {" "}
            {loading ? (
              <div
                role="status"
                className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-12 "
              ></div>
            ) : org.state?.inputValue?.includes("Add your") ? (
              <p className="text-sm italic font-light text-gray-400">
                {org.state?.inputValue}
              </p>
            ) : (
              <p className="dark:text-white">
                {org.state?.SocialProfileHandle}
              </p>
            )}
          </h2>
        ) : (
          <div className="">
            <input
              className=" rounded-md pl-3 h-7 z-10 border-[1px] border-gray-300 border-solid dark:text-white"
              type="text"
              id={org.state?.name || org.state?.SocialMediaID}
              defaultValue={org.state?.SocialProfileHandle}
              onChange={(e) => {
                setUserHandle(
                  validateUserHandle(
                    e.target.value,
                    org.state?.RegexAllowedProfileStructure,
                    org.state?.SocialMediaProfileURL
                  )
                )
              }}
            />
            {errors && (
              <p className="text-sm italic text-red-100 dark:p-2 dark:mt-1 rounded-xl dark:bg-gray-300 dark:bg-opacity-75">
                {errors}
              </p>
            )}
          </div>
        )}
      </>,

      <ConditionButtons
        data={{ index: index, org: org, userHandle: userHandle }}
        clicked={!isItemInEditMode} // Check if this row is in edit mode
        noErrors={!errors}
        setClicked={() => handleItemClick(index)} // Pass setClicked to the child component
        setData={handleItemClick}
        handleDelete={handleDelete}
        url="user-social"
        setErrors={setErrors}
      />
    )
  })

  return (
    <div className="mt-12 dark:bg-darkslategray-100">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-dimgray-200 text-7xl dark:text-white">
          {t("Socials")}
        </h2>
        <div>
          <button
            onClick={() => setShowDialog(true)}
            className="px-4 py-3 text-sm font-bold no-underline border border-gray-400 border-solid rounded-lg cursor-pointer dark:bg-transparent dark:text-white dark:bg-gray-500 hover:opacity-75 text-bold bg-whitesmoke w-35 text-dimgray-100 hover:bg-gray-300 hover:text-dimgray-200 "
          >
            + {t("Add New")}
          </button>
        </div>
      </div>
      {showDialog && (
        <div className="w-[30vw]">
          <SocialMediaModal
            open={showDialog}
            handleClose={() => setShowDialog(false)}
            onAddSocialMedia={handleAddSocialMedia}
          />
        </div>
      )}

      {/* ###### MAIN TABLE ###### */}
      <main className="left-0 flex flex-wrap object-contain pt-2 mt-0 overflow-hidden text-center row max-w-fit w-fit">
        <TableContainer
          sx={{
            width: "49.7vw",
            height: "auto",
            objectFit: "contain",
            borderRadius: "15px",
          }}
        >
          <Table aria-label="customized table">
            <TableBody className="dark:bg-gray-700">
              {selectedSocialMedia && (
                <StyledTableRow key={selectedSocialMedia.SocialMediaID}>
                  <StyledTableCell
                    component="td"
                    scope="row"
                    className="dark:text-white"
                  >
                    <h2 className="float-left pl-0 m-0 ml-0 font-bold text-md text-dimgray-200 item-left max-w-12 dark:!text-white">
                      {selectedSocialMedia.SiteName}
                    </h2>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {clickedItem ? (
                      <>
                        <input
                          className="rounded-md pl-3 h-7 z-10 border-[1px] border-gray-300 border-solid dark:text-white"
                          type="text"
                          id={selectedSocialMedia.SocialMediaID}
                          onChange={(e) => {
                            setSettedSocialMedia(
                              validateUserHandle(
                                e.target.value,
                                selectedSocialMedia?.RegexAllowedProfileStructure,
                                selectedSocialMedia?.SocialMediaProfileURL
                              )
                            )
                          }}
                          //onChange={(e) => setSettedSocialMedia(e.target.value)}
                        />
                        {errors && (
                          <p className="text-sm italic text-red-100 dark:p-2 dark:mt-1 rounded-xl dark:bg-gray-300 dark:bg-opacity-75">
                            {errors}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="font-bold dark:text-white text-bold">
                        {settedSocialMedia}
                      </p>
                    )}
                  </StyledTableCell>
                  <StyledTableCell
                    align="right"
                    className="p-0 m-0 w-11 max-w-11"
                  >
                    <ConditionButtons
                      data={{
                        org: selectedSocialMedia,
                        userHandle: settedSocialMedia,
                      }}
                      reload={true}
                      clicked={!clickedItem} // Check if this row is in edit mode
                      noErrors={!errors}
                      setClicked={setClickedItem} // Pass setClicked to the child component
                      setData={setSelectedSocialMedia}
                      setErrors={setErrors}
                      url="user-social-post"
                    />
                  </StyledTableCell>
                </StyledTableRow>
              )}
              {rows1.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell
                    align="left"
                    component="th"
                    scope="col"
                    className="w-[15vw]"
                  >
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell
                    align="left"
                    className="pl-0  ml-0 max-w-[5vw]"
                  >
                    {row.inputValue}
                  </StyledTableCell>
                  <StyledTableCell
                    align="right"
                    className="p-0 m-0 w-11 max-w-11"
                  >
                    {row.edit}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <GenericGrid
          data={itemStates.state}
          apiName="social-media" // Replace with your API endpoint name
          fields={["name", "inputValue", "edit"]} // Replace with your data fields
          apiFields={["api_field_1", "api_field_2", "api_field_3"]} // Replace with your API fields
          fetchApi={() => fetchSocials()} // Replace with your fetch function
        /> */}
      </main>
    </div>
  )
}
