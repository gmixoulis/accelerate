"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@material-tailwind/react"
import StarBorderIcon from "@mui/icons-material/StarBorder"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  tableCellClasses,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { te } from "date-fns/locale"
import path from "public/images/icon-edit1.svg"
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai"

import getAccessToken from "@/app/[lng]/hooks/getAccessToken"
import switchTenant from "@/app/[lng]/hooks/switchTenant"

import { UseTranslation } from "../../../../i18n/client"
import fetchTenants from "../../../hooks/fetchTenants"

// ###### STYLING CELLS & ROWS (MUI WAY) ######
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: 10,
  },

  "&:nth-of-type(1)": {
    width: "30%",
  },
  "&:nth-of-type(2)": {
    width: "70%",
  },
}))
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child th, &:last-child td": {
    borderBottom: "none",
  },
}))

// ###### MAIN FUNCTION ######

export default function Organizations() {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "organizations")
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)

  const { UserID, RoleName, TenantNativeName } = getAccessToken()

  const tenantRoleMapping = {
    SYS_ADMIN: "System Administrator",
    STUDENT: "Student",
    USER: "User",
    FACULTY: "Instructor",
    ADMIN_STAFF: "Administrative Personnel",
    DEVELOPER: "Software Engineer",
  }

  useEffect(() => {
    setLoading(true)
    setTenants([
      {
        TenantNativeName: "Tenant 1",
        RoleName: "Role 1",
        TenantID: 1,
      },
    ])
    setTimeout(() => {
      setLoading(false)
    }, 1000)

    fetchTenants()
      .then((data) => {
        if (data.success === false) {
          setLoading(false)

          return
        } else {
          setTenants(data)
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }, [])
  async function swcTnt(RoleID, TenantID) {
    switchTenant(RoleID, TenantID).then((data) => {
      setLoading(true)

      fetchTenants().then((data) => {
        if (data.success === false) {
          window.location.reload()
          return
        } else {
          setTenants(data)
          window.location.reload()
        }
      })
    })
  }

  // ###### ROWS OBJECT ######
  const rows = tenants?.map((tenant, index) => ({
    name: (
      <>
        {loading ? (
          <div
            role="status"
            className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-12"
          ></div>
        ) : (
          <h2 className="py-2 m-0 font-light text-md text-dimgray-200 dark:text-white">
            {tenant?.TenantNativeName}
          </h2>
        )}
      </>
    ),
    role: (
      <h2 className="float-left pl-0 m-0 ml-0 font-bold text-md text-dimgray-200 item-left">
        {loading ? (
          <div
            role="status"
            className="h-2.5 animate-pulse bg-gray-300 rounded-full dark:bg-gray-500 w-12"
          ></div>
        ) : (
          <p className=" dark:text-white">
            {tenantRoleMapping[tenant?.RoleName] || tenant?.TenantNativeName}
          </p>
          // {tenantRoleMapping[tenant?.RoleName] || tenant?.TenantNativeName}
        )}
      </h2>
    ),

    edit: !loading ? (
      tenant?.TenantNativeName === TenantNativeName &&
      tenant?.RoleName === RoleName ? (
        <Button
          color="gray"
          disabled
          aria-label="Selected"
          key={index}
          startIcon={<StarBorderIcon />}
          //onClick={() => handleRevoke(sessionData.SessionID, index)}
          className=" text-[inherit] align-middle !capitalize cursor-pointer border-darkslategray-100 py-2 px-[1rem]    p items-center dark:border-whitesmoke dark:text-gainsboro-100 hover:opacity-50"
          variant="outlined"
        >
          {t("Selected")}
        </Button>
      ) : (
        <Button
          color="gray"
          key={index}
          aria-label="Select"
          onClick={() => swcTnt(tenant?.RoleID, tenant?.TenantID)}
          className=" text-[inherit] text-center !capitalize cursor-pointer border-darkslategray-100 py-2 px-[1.4rem] self-end float-right m-0 flex flex-col items-center dark:border-whitesmoke dark:text-gainsboro-100 hover:opacity-50"
          variant="outlined"
        >
          {t("Switch")}
        </Button>
      )
    ) : (
      <Button
        color="gray"
        variant="outlined"
        disabled
        className=" animate-pulse w-[4rem] h-[2rem]  text-[inherit] !capitalize  border-darkslategray-100 py-2 px-[1rem] self-end float-right m-0 flex flex-col items-center dark:border-whitesmoke dark:text-gainsboro-100 hover:opacity-50"
      ></Button>
    ),
  }))

  return (
    // ###### TITLE AND ADD BUTTON ######
    <div className="mt-12 dark:bg-darkslategray-100">
      <div className="flex items-center justify-between pb-4">
        <h2 className="text-dimgray-200 text-7xl dark:text-white ">
          {t("Organizations")}
        </h2>
        {/* <div>
          <button className="py-3 text-sm font-light no-underline border border-gray-400 border-solid rounded-lg cursor-pointer bg-whitesmoke w-36 text-dimgray-100 px-7 hover:bg-gray-300 hover:text-dimgray-200 ">
            Add new
          </button>
        </div> */}
      </div>
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
              {rows?.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell
                    align="left"
                    component="th"
                    scope="col"
                    className="w-[15vw]"
                  >
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="left">{row.role}</StyledTableCell>
                  <StyledTableCell align="right">{row.edit}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </main>
    </div>
  )
}
