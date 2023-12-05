"use client"

import { createContext, useCallback, useState } from "react"





export const MyFilesContext = createContext()

export function MyFilesProvider({ children }) {
  const [message, setMessage] = useState({
    message: "",
    severity: null,
  })

  const setNotification = useCallback((notification) => {
    setMessage(notification)
  }, [])

  return (
    <MyFilesContext.Provider value={{ message, setNotification }}>
      {children}
    </MyFilesContext.Provider>
  )
}
