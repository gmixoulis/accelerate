"use client"

import { useEffect } from "react"

//A component to log errors to the client console to be used in server components
const LogError = ({status, data}) => {
    useEffect(() => {
        console.log("status code:", status);
        console.log("data:", data);
    }, [status, data])

    return null;
}

export default LogError;