"use client"

import React from "react"
import { PiBracketsSquareBold } from "react-icons/pi"

const Loading = () => {
  return (
    <div className="flex items-center space-x-7 w-fit ">
      {[...Array(1)].map((_, index) => (
        <div className="flex flex-col items-center w-24 ml-4" key={index}>
          <div className="animate-pulse">
            <div className="flex items-center justify-center w-24 h-24 border rounded-md animate-pulse bg-gainsboro-100">
              <PiBracketsSquareBold className="w-12 h-12 animate-pulse text-lightskyblue" />
            </div>
          </div>
          <div className="mt-2 font-bold text-center animate-pulse text-dimgray-200 dark:text-gainsboro-100">
            Loading...
          </div>
        </div>
      ))}
    </div>
  )
}

export default Loading
