"use client"

import Image from "next/image"
import path from "public/images/icon-edit1.svg"

// ###### DEFAULT ROW ######
const IpAdresssesRow = ({
  deviceName,
  type,
  location,
  lastUsed,
  topBorder,
}) => {
  const borderStyle = topBorder
    ? "border-t border-gray-300 border-solid border-r-0 border-b-0 border-l-0"
    : ""
  return (
    <div className={`w-full grid grid-cols-5 py-4 ${borderStyle}`}>
      <div className="flex items-center pl-3 font-light text-center text-md text-dimgray-200">
        {deviceName}
      </div>
      <div className="flex items-center pl-10 font-light text-md text-dimgray-200">
        {type}
      </div>
      <div className="flex items-center font-bold text-md text-dimgray-200">
        {location}
      </div>
      <div className="flex items-center font-bold text-md text-dimgray-200">
        {lastUsed}
      </div>
      <div className="flex justify-end pr-3">
        <Image
          className="transition duration-200 transform w-7 hover:scale-110"
          alt={`Edit ${type}`}
          src={path}
        />
      </div>
    </div>
  )
}

export default function IpAdressses() {
  return (
    <main className="mt-10">
      <div className="flex items-center justify-between pb-4">
        <h2 className="font-bold text-dimgray-200">Approved IP Adresses</h2>
        <div>
          <button className="py-3 text-sm font-light no-underline border border-gray-400 border-solid rounded-lg cursor-pointer bg-whitesmoke w-36 text-dimgray-100 px-7 hover:bg-gray-300 hover:text-dimgray-200 ">
            Edit
          </button>
        </div>
      </div>

      {/* ##### TABLE ##### */}
      <div className="flex flex-col rounded-md bg-whitesmoke ">
        {/* ##### HEADER ##### */}
        <div className="grid w-full grid-cols-5 py-1 font-light bg-dimgray-100 rounded-t-md">
          <div className="flex col-start-1 pl-3 text-whitesmoke">
            Device Name
          </div>
          <div className="flex col-start-2 pl-10 text-whitesmoke">Type</div>
          <div className="flex col-start-3 text-whitesmoke">Location</div>
          <div className="flex col-start-4 text-whitesmoke">Last Used</div>
        </div>

        <IpAdresssesRow
          deviceName="****"
          type="Laptop"
          location="****"
          lastUsed="****"
        />
        <IpAdresssesRow
          deviceName="****"
          type="Laptop"
          location="****"
          lastUsed="****"
        />
      </div>
    </main>
  )
}
