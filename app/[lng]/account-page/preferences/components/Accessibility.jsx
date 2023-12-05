"use client"

import React from "react"
import { useParams } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  styled,
  tableCellClasses,
} from "@mui/material"
import Cookies from "js-cookie"
import { useTheme } from "next-themes"
import { BsToggleOff, BsToggleOn } from "react-icons/bs"
import { IoContrast } from "react-icons/io5"

import { UseTranslation } from "../../../../i18n/client"
import CustomTable from "./Table"

// ###### STYLING CELLS & ROWS (MUI WAY) ######
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "12px 20px",
  },

  "&:nth-of-type(1)": {
    width: "50%",
    "@media (min-width:1536px)": {
      width: "60%",
    },
  },
  "&:nth-of-type(2)": {
    width: "50%",
    "@media (min-width:1536px)": {
      width: "40%",
    },
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },

  " &:last-child th": {},
}))

const Accessibility = () => {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "accessibility")
  const { theme, setTheme, resolvedTheme } = useTheme()

  function handleToggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
    localStorage.setItem("theme", resolvedTheme === "dark" ? "light" : "dark")
    Cookies.set("theme", resolvedTheme === "dark" ? "light" : "dark")
  }

  const Mode = (
    <div className="flex items-center gap-2 text-md">
      <div
        className={`${
          resolvedTheme === "light"
            ? "text-unicred-400 font-bold"
            : "font-regular dark:text-gainsboro-400"
        }`}
      >
        {t("Light")}
      </div>
      <div onClick={() => handleToggle()} className="cursor-pointer">
        {resolvedTheme === "dark" ? (
          <BsToggleOn size={30} />
        ) : (
          <BsToggleOff size={30} />
        )}
      </div>
      <div
        className={`${
          resolvedTheme === "dark"
            ? "text-unicred-400 font-bold"
            : "font-regular"
        }`}
      >
        {t("Dark")}
      </div>
    </div>
  )

  const FontSize = (
    <div className="flex items-end gap-4">
      <div className="text-sm">Aa</div>
      <div className="text-md">Aa</div>
      <div className="text-lg">Aa</div>
    </div>
  )

  const ColorContrast = (
    <div className="flex items-center justify-between sm:justify-start sm:gap-8">
      <div className="flex items-center gap-2">
        <IoContrast size={30} className="text-gray-500" />
        <div>Normal</div>
      </div>
      <div className="flex items-center gap-2">
        <IoContrast size={30} className="font-bold" />
        <div>High</div>
      </div>
    </div>
  )

  const accessibility_rows = [
    { name: "Mode", content: Mode },
    { name: "Font Size", content: FontSize },
    { name: "Color Contrast", content: ColorContrast },
  ]

  return (
    <div className="flex flex-col gap-8">
      <h2 className="top-0 flex-wrap block row-auto p-0 m-0 font-sans text-dimgray-200 text-7xl dark:text-whitesmoke">
        {t("Accessibility")}
      </h2>
      {/* Commented out table because font size and color contrast are not implemented yet 
            <CustomTable rows={accessibility_rows}/>
            */}

      {/* Temporary table with mode only*/}
      <div className="flex  md:min-w-[49vw]">
        <TableContainer style={{ overflow: "visible" }}>
          <Table aria-label="simple table">
            <TableBody className="dark:bg-gray-700">
              <StyledTableRow
                key={"mode"}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  th: { borderTopLeftRadius: "15px" },
                  "td, th:last-child": { borderTopRightRadius: "15px" },
                  "th:first-of-type": { borderBottomLeftRadius: "15px" },
                  "td:last-child, th:last-child": {
                    borderBottomRightRadius: "15px",
                  },
                }}
              >
                <StyledTableCell component="th" scope="row">
                  <span className="font-regular text-md dark:text-gainsboro-400">
                    {t("Mode")}
                  </span>
                </StyledTableCell>
                <StyledTableCell align="right">{Mode}</StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  )
}

export default Accessibility
