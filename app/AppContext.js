"use client"

// Because we're inside a server component
import React, { createContext, useContext, useState } from "react"

// Create the context
const AppContext = createContext()
// Create a provider component
export const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState)
  // Define any functions or values you want to provide
  const value = {
    state,
    setState,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
// Export the context
export const useAppContext = () => useContext(AppContext)
