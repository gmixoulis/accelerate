"use client"

import React, { useState } from "react"
import Image from "next/image"
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
import appImage from "public/images/appimg@2x.png"
import icondismiss from "public/images/icondismiss.svg"
import iconmute from "public/images/iconmute.svg"
import { BsWindowPlus } from "react-icons/bs"
import { FiHelpCircle, FiLogOut, FiSettings } from "react-icons/fi"
import { MdOutlineDashboard, MdOutlineDashboardCustomize } from "react-icons/md"

import Sidebar from "@/app/[lng]/components/Sidebar"

// import Assistant from "../Assistant"
// import AssistantBottom from "../AssistantBottom"
import Navbar from "../components/Navbar"

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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData(
    <Image
      className="mr-4 rounded-xl w-[74px] h-[74px] z-0 object-cover"
      alt=""
      src={appImage}
    />,
    <h2 className="m-0 text-2xl font-bold">XXXXXXXXXX</h2>,

    <h4 className="m-0 text-lg leading-[21px] font-medium">
      <p className="m-0">7 June 2023</p>
      <p className="m-0">8:00 AM</p>
    </h4>,
    <a
      href="#"
      className=" text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[45.42px] h-[45.42px]" alt="" src={icondismiss} />
      <span className="text-[inherit]">Dismiss</span>
    </a>,
    <a
      href="#"
      className="text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[37.78px] max-h-full" alt="" src={iconmute} />
      <span className="text-[inherit]">Mute</span>
    </a>
  ),
  createData(
    <Image
      className="mr-4 rounded-xl w-[74px] h-[74px] z-0 object-cover"
      alt=""
      src={appImage}
    />,
    <h2 className="m-0 text-2xl font-bold">XXXXXXXXXX</h2>,

    <h4 className="m-0 text-lg leading-[21px] font-medium">
      <p className="m-0">7 June 2023</p>
      <p className="m-0">8:00 AM</p>
    </h4>,
    <a
      href="#"
      className=" text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[45.42px] h-[45.42px]" alt="" src={icondismiss} />
      <span className="text-[inherit]">Dismiss</span>
    </a>,
    <a
      href="#"
      className="text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[37.78px] max-h-full" alt="" src={iconmute} />
      <span className="text-[inherit]">Mute</span>
    </a>
  ),
  createData(
    <Image
      className="mr-4 rounded-xl w-[74px] h-[74px] z-0 object-cover"
      alt=""
      src={appImage}
    />,
    <h2 className="m-0 text-2xl font-bold">XXXXXXXXXX</h2>,

    <h4 className="m-0 text-lg leading-[21px] font-medium">
      <p className="m-0">7 June 2023</p>
      <p className="m-0">8:00 AM</p>
    </h4>,
    <a
      href="#"
      className=" text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[45.42px] h-[45.42px]" alt="" src={icondismiss} />
      <span className="text-[inherit]">Dismiss</span>
    </a>,
    <a
      href="#"
      className="text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[37.78px] max-h-full" alt="" src={iconmute} />
      <span className="text-[inherit]">Mute</span>
    </a>
  ),
  createData(
    <Image
      className="mr-4 rounded-xl w-[74px] h-[74px] z-0 object-cover"
      alt=""
      src={appImage}
    />,
    <h2 className="m-0 text-2xl font-bold">XXXXXXXXXX</h2>,

    <h4 className="m-0 text-lg leading-[21px] font-medium">
      <p className="m-0">7 June 2023</p>
      <p className="m-0">8:00 AM</p>
    </h4>,
    <a
      href="#"
      className=" text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[45.42px] h-[45.42px]" alt="" src={icondismiss} />
      <span className="text-[inherit]">Dismiss</span>
    </a>,
    <a
      href="#"
      className="text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[37.78px] max-h-full" alt="" src={iconmute} />
      <span className="text-[inherit]">Mute</span>
    </a>
  ),
  createData(
    <Image
      className="mr-4 rounded-xl w-[74px] h-[74px] z-0 object-cover"
      alt=""
      src={appImage}
    />,
    <h2 className="m-0 text-2xl font-bold">XXXXXXXXXX</h2>,

    <h4 className="m-0 text-lg leading-[21px] font-medium">
      <p className="m-0">7 June 2023</p>
      <p className="m-0">8:00 AM</p>
    </h4>,
    <a
      href="#"
      className=" text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[45.42px] h-[45.42px]" alt="" src={icondismiss} />
      <span className="text-[inherit]">Dismiss</span>
    </a>,
    <a
      href="#"
      className="text-[inherit] self-end float-right p-0 m-0 flex flex-col items-center"
    >
      <Image className="w-[37.78px] max-h-full" alt="" src={iconmute} />
      <span className="text-[inherit]">Mute</span>
    </a>
  ),
]

export default function Alerts({ params }) {
  // const [drawerChange, setDrawerChange] = useState(true)
  // const [isOpen, setIsOpen] = useState(false)
  // const toggleDrawer = () => {
  //   setIsOpen((prevState) => !prevState)
  // }
  // const swapDrawer = () => {
  //   setDrawerChange((prev) => !prev)
  //   setIsOpen(true)
  // }

  return (
    <>
      <Navbar />

      <div className="flex w-full h-auto overflow-x-hidden row dark:bg-darkslategray-100">
        <div className="z-10 flex h-full">
          <Sidebar
            topNavigation={[
              {
                name: "Add New Widget",
                href: `#`,
                icon: <BsWindowPlus size={30} />,
              },
              {
                name: "Add New App",
                href: `#`,
                icon: <MdOutlineDashboardCustomize size={30} />,
              },
              {
                name: "Edit Dashboard",
                href: `#`,
                icon: <MdOutlineDashboard size={30} />,
              },
            ]}
            bottomNavigation={[
              {
                name: "Help and FAQ",
                href: `#`,
                icon: <FiHelpCircle size={27} />,
              },
              {
                name: "Settings",
                href: `/${params.lng}/account-page/preferences`,
                icon: <FiSettings size={27} />,
              },
            ]}
          />
        </div>
        <main className="left-0 flex object-contain pt-10 overflow-hidden text-center max-w-fit w-fit">
          <TableContainer
            sx={{ width: "73vw", objectFit: "contain", borderRadius: "15px" }}
          >
            <Table aria-label="customized table">
              <TableHead className=" bg-silver-200 border-silver-200 border-[2px] border-solid  ">
                <TableRow>
                  <StyledTableCell sx={{ color: "whitesmoke" }}>
                    App
                  </StyledTableCell>
                  <StyledTableCell align="right">Notification</StyledTableCell>
                  <StyledTableCell align="right">Time</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                  <StyledTableCell align="right">Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <StyledTableRow key={row.name}>
                    <StyledTableCell component="th" scope="row">
                      {row.name}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.calories}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.fat}</StyledTableCell>
                    <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.protein}
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/*drawerChange ? (
            <Assistant
              swapDrawer={swapDrawer}
              toggleDrawer={toggleDrawer}
              isOpen={isOpen}
            />
          ) : (
            <AssistantBottom
              swapDrawer={swapDrawer}
              toggleDrawer={toggleDrawer}
              isOpen={isOpen}
            />
          )*/}
        </main>
      </div>
    </>
  )
}
