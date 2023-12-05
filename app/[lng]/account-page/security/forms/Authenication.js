"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BACKEND_URL } from "@/server"
import { Button } from "@material-tailwind/react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  tableCellClasses,
} from "@mui/material"
import Switch from "@mui/material/Switch"
import { styled } from "@mui/material/styles"

import { UseTranslation } from "../../../../i18n/client"
import axiosRequest from "../../../hooks/axiosRequest"
import getAccessToken from "../../../hooks/getAccessToken"
import DialogCustomAnimation from "../sub-components/modal"

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))
export default function Authentication() {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "authentication")
  const [email, setEmail] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [qr, setQR] = useState(null)
  const [code, setCode] = useState(null)
  const [enabled, setEnabled] = useState(false)

  const [validated, setValidated] = useState(false)
  const [switchChecked, setSwitchChecked] = useState(true)
  function createData(name, inputField, deletebutton) {
    return { name, inputField, deletebutton }
  }
  const { UserID, UserEmail } = getAccessToken()

  async function getRequest() {
    setShowDialog(true)

    setEmail(UserEmail)
    try {
      const url2FA = BACKEND_URL + `2FA/generate/${UserID}`

      const response = await axiosRequest(url2FA, "patch")
      setQR(await response.data.qr)
      setCode(await response.data.secret)
      setShowDialog(true)
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const handleSwitchChange = () => {
    setSwitchChecked(!switchChecked)
    const { UserID } = getAccessToken()
    if (switchChecked) {
      handleUnchecked(UserID)
    } else {
      handleChecked(UserID)
    }
  }

  const handleChecked = async (UserID) => {
    await axiosRequest(BACKEND_URL + `2FA/enable/${UserID}`, "patch")
  }

  const handleUnchecked = async (UserID) => {
    await axiosRequest(BACKEND_URL + `2FA/disable/${UserID}`, "patch")
  }

  async function getEnabled2FA() {
    try {
      const url2FA = BACKEND_URL + `2FA/checkEnabled/${UserID}`
      const response = await axiosRequest(url2FA)
      setEnabled(response.data.enabled)
      setSwitchChecked(response.data.enabled)
      setValidated(response.data.validated)
    } catch (error) {
      console.log("Error:", error)
    }
  }
  useEffect(() => {
    getEnabled2FA()
  }, [])
  const rows = [
    createData(
      <div className="!w-full">
        <h2 className="m-auto font-bold text-dimgray-100 text-md dark:text-white">
          {t("Authenticator App")}
        </h2>
        <p className="flex-wrap text-dimgray-200 dark:text-white">
          {t(
            "Set up your account to receive auth code via a mobile application"
          )}
        </p>
      </div>,
      <div className="flex-wrap">
        {!enabled && !validated ? (
          <Button
            onClick={() => getRequest()}
            className=" text-[inherit] !capitalize cursor-pointer border-darkslategray-100 py-2 px-[0.8rem] self-end float-right m-0 flex flex-col items-center dark:border-whitesmoke dark:text-gainsboro-100 hover:opacity-50"
            variant="outlined"
          >
            {t("setup")}
          </Button>
        ) : (
          <div className="flex !ml-[-3rem] xl:ml-4 items-left ">
            <Switch
              id="custom-switch-component"
              className=" checked:bg-[#393939]"
              checked={switchChecked}
              onChange={handleSwitchChange}
              containerProps={{
                className: "w-2 h-5 pr-3",
              }}
              circleProps={{
                className: "before:hidden left-0.5 border-none",
              }}
            />
          </div>
        )}
      </div>
    ),
  ]
  return (
    <div className="relative  mt-12 !overflow-hidden w-fit row dark:bg-darkslatedimgray-100">
      <h2 className="top-0 flex flex-wrap w-[40%] p-0 m-0 font-sans text-dimgray-200 text-7xl dark:text-white">
        {t("Multi Factor Authentication")}
      </h2>

      {showDialog && (
        <div className="w-[30vw]">
          <DialogCustomAnimation
            open={showDialog}
            handleClose={() => setShowDialog(false)}
            qr={qr}
            code={code}
            email={email}
            setEnabled={setEnabled}
            setValidated={setValidated}
            UserID={UserID}
            setSwitchChecked={setSwitchChecked}
          />
        </div>
      )}

      <br />

      <main className="left-0 flex flex-wrap object-contain pt-2 mt-0 overflow-hidden text-center row max-w-fit w-fit">
        <TableContainer
          sx={{ width: "49.7vw", objectFit: "contain", borderRadius: "15px" }}
        >
          <Table aria-label="customized table">
            <TableBody className="dark:bg-gray-700">
              {rows.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.inputField}
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
