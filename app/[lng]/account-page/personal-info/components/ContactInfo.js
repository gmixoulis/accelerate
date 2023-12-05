"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
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
import path from "public/images/icon-edit1.svg"
import path_dark from "public/images/icon-pen-dark.svg"
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai"

import { UseTranslation } from "@/app/i18n/client"

import ConditionButtons from "./conditionButtons"

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
  { id: 1, name: "Work Phone", inputValue: "*****" },
  { id: 2, name: "Home Phone", inputValue: "*****" },
  { id: 3, name: "Home Address", inputValue: "*****" },
  { id: 4, name: "Work Address", inputValue: "*****" },
]

// ###### MAIN FUNCTION ######
export default function ContactInfo() {
  const [loading, setLoading] = useState(true)
  const [editingRowId, setEditingRowId] = useState(null)
  const [editedInputValue, setEditedInputValue] = useState("")
  const { lng } = useParams()
  const [data, setData] = useState([])
  const [clicked, setClicked] = useState(false)
  const [errors, setErrors] = useState(false)
  const { t } = UseTranslation(lng, "contact-info")
  function enterEditMode(rowId) {
    setEditingRowId(rowId)
  }

  function exitEditMode() {
    setEditingRowId(null)
    setEditedInputValue("")
  }

  // ###### LOADING STATE (fake fetch)######
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  // ###### CELL COMPONENT ######
  function RowCell({ name, inputValue }) {
    return (
      <>
        {loading ? (
          <div
            role="status"
            className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-5"
          ></div>
        ) : (
          <p className="py-2 m-0 font-light text-md text-dimgray-200 dark:text-white">
            {name || inputValue}
          </p>
        )}
      </>
    )
  }

  // ###### ROWS OBJECT ######
  const rows = contactInfoData.map((org, index) => {
    return {
      name: <RowCell name={t(org.name)} />,
      inputValue:
        editingRowId === org.id ? (
          <input
            value={editedInputValue}
            onChange={(e) => setEditedInputValue(e.target.value)}
            className=" rounded-md pl-3 h-7 z-10 border-[1px] border-gray-300 border-solid dark:text-white"
          />
        ) : (
          <RowCell inputValue={org.inputValue} />
        ),
      edit:
        editingRowId === org.id ? (
          <div className="flex float-right ">
            <AiFillCloseCircle
              size={30}
              onClick={exitEditMode}
              className="duration-100 text-dimgray-200 opacity-80 hover:opacity-100 hover:text-red-500"
            />
            <AiFillCheckCircle
              size={30}
              onClick={exitEditMode}
              className="duration-100 text-dimgray-200 opacity-80 hover:opacity-100 hover:text-green-500"
            />
          </div>
        ) : (
          <ConditionButtons
            data={{ index: index, org: org }}
            clicked={!clicked} // Check if this row is in edit mode
            noErrors={!errors}
            setClicked={setClicked} // Pass setClicked to the child component
            setData={setData}
            url="contact-info"
            setErrors={setErrors}
          />
        ),
    }
  })

  return (
    <div className="mt-12 dark:bg-darkslatedimgray-100">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-dimgray-200 text-7xl dark:text-white">
          {" "}
          {t("Contact Information")}
        </h2>
        <div>
          <button className="px-4 py-3 text-sm font-bold no-underline border border-gray-400 border-solid rounded-lg cursor-pointer dark:bg-transparent dark:text-white dark:bg-gray-500 hover:opacity-75 text-bold bg-whitesmoke w-35 text-dimgray-100 hover:bg-gray-300 hover:text-dimgray-200 ">
            + {t("Add New")}
          </button>
        </div>
      </div>

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
              {rows.map((row) => (
                <StyledTableRow key={row.name}>
                  <StyledTableCell
                    align="left"
                    component="th"
                    scope="col"
                    className="w-[15vw]"
                  >
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {row.inputValue}
                  </StyledTableCell>
                  <StyledTableCell
                    className="p-0 m-0 w-11 max-w-11"
                    align="left"
                  >
                    {row.edit}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </div>
  )
}
