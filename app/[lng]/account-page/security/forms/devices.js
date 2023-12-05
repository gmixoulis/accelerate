"use client"

import React from "react"
import { useParams } from "next/navigation"
import { BACKEND_URL } from "@/server"
import { Button } from "@material-tailwind/react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { format } from "date-fns"
import Cookies from "js-cookie"
import jwt_decode from "jwt-decode"

import axiosRequest from "@/app/[lng]/hooks/axiosRequest"
import logout from "@/app/[lng]/hooks/logout"

import { UseTranslation } from "../../../../i18n/client"

// Update the path

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))
export default function Devices() {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "devices")
  const [data, setData] = React.useState(null)
  function createData(CreatedAt, Ip, DeviceInfo, deletebutton) {
    return { CreatedAt, Ip, DeviceInfo, deletebutton }
  }

  async function getRequest() {
    let accessToken = ""
    try {
      accessToken = JSON.stringify(jwt_decode(Cookies.get("accessToken")))
    } catch (e) {
      console.log(e)
    }
    const UserID = JSON.parse(accessToken).UserID
    const url = BACKEND_URL + `session/active/nonRevoked/${UserID}`

    try {
      const response = await axiosRequest(url)
      setData(await response.data)
    } catch (error) {
      console.log("Error:", error)
    }
  }
  async function handleRevoke(SessionID, index) {
    const response = await axiosRequest(
      BACKEND_URL + `session/revoke/${SessionID}`,
      "patch"
    )
    if (response.status === 200) {
      handleDelete(index)
    }
  }
  const handleDelete = (postIndex) => {
    setData((prevPosts) => prevPosts.filter((_, index) => index !== postIndex))
  }
  React.useEffect(() => {
    getRequest()
  }, [])

  const rows = data?.map((sessionData, index) =>
    createData(
      <h2 className="m-0 font-light text-dimgray-100 text-md dark:text-white">
        {format(new Date(sessionData.CreatedAt), "MM/dd/yyyy, HH:mm:ss")}
      </h2>,
      <h2 className="m-0 font-light text-dimgray-100 text-md dark:text-white">
        {sessionData.IpAddress}
      </h2>,
      <h2 className="m-0 font-light text-dimgray-100 text-md dark:text-white">
        {sessionData.Email}
      </h2>,

      data.length !== index + 1 ? (
        <Button
          color="gray"
          onClick={() => handleRevoke(sessionData.SessionID, index)}
          className=" text-[inherit] !capitalize cursor-pointer border-darkslategray-100 py-2 px-[0.8rem] self-end float-right m-0 flex flex-col items-center dark:border-whitesmoke dark:text-gainsboro-100 hover:opacity-50"
          variant="outlined"
        >
          {t("Revoke")}
        </Button>
      ) : (
        <Button
          color="gray"
          onClick={() => logout()}
          className=" text-[inherit] !capitalize cursor-pointer border-darkslategray-100 py-2 px-[0.8rem] self-end float-right m-0 flex flex-col items-center dark:border-whitesmoke dark:text-gainsboro-100 hover:opacity-50"
          variant="outlined"
        >
          {t("Log out")}
        </Button>
      )
    )
  )
  return (
    <div className="relative  mt-12 !overflow-hidden w-fit row dark:bg-darkslatedimgray-100">
      <h2 className="top-0 flex-wrap block row-auto p-0 m-0 font-sans text-dimgray-200 text-7xl dark:text-white">
        {t("Active Sessions")}
      </h2>

      <br />

      <main className="left-0 flex flex-wrap object-contain pt-2 mt-0 overflow-hidden text-center row max-w-fit w-fit">
        <TableContainer
          sx={{ width: "49.7vw", objectFit: "contain", borderRadius: "15px" }}
        >
          <Table aria-label="customized table">
            <TableHead className=" bg-dimgray-200 dark:bg-gray-800">
              <TableRow>
                <StyledTableCell>{t("Created")}</StyledTableCell>
                <StyledTableCell align="left">
                  {t("IP Address")}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {t("User Email")}
                </StyledTableCell>
                <StyledTableCell align="right"> </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody className="dark:bg-gray-700">
              {rows?.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {row.CreatedAt}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.Ip}</StyledTableCell>

                  <StyledTableCell align="left">
                    {row.DeviceInfo}
                  </StyledTableCell>

                  <StyledTableCell align="right">
                    {row.deletebutton}
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
