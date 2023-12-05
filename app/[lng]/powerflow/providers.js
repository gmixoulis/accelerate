'use client'

import { StreamProvider } from "./context/StreamContext"
import { BatchProvider } from "./context/BatchContext"

export default function Providers({ children }) {
    return (
        <StreamProvider>
            <BatchProvider>
                {children}
            </BatchProvider>
        </StreamProvider>
    )
}