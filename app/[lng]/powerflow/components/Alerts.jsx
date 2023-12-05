"use client"
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useEffect } from "react";
import { useState } from "react"
import Alert from '@mui/material/Alert';
export function Info({title, message, onClose = null}) {
    const [show, setShow] = useState(true);
        // <Alert severity="info" onClose={() => {
        //     setShow(false);
        //     if (onClose) {
        //         onClose();
        //     }
        // }}>
        //     {message}
        // </Alert>
    return (
        show &&
        <div id="alert-info" className="relative flex items-center flex-1 p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert">
        <svg className="absolute top-4 left-1 flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div className="flex flex-wrap gap-1 ml-3 font-medium text-md" style={{overflowWrap: 'break-word', wordWrap: 'break-word'}}>
            <span className="font-semibold">{title}</span> {message}
        </div>
            <button type="button" className="absolute top-2 right-2 ml-auto -mx-1.5 mb-4 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-800 hover:text-white inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700" aria-label="Close"
            onClick={() => {
                setShow(false);
                if (onClose) {
                    onClose();
                }
            }}
            >
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
        </div> 
   )
}

export function Success({title, message}) {
    const [show, setShow] = useState(true);

    return (
        show &&
        <div id="alert-success" className="flex items-center flex-1 p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
        <CheckCircleIcon className="h5 w-5" aria-hidden="true" />
        <span className="sr-only">Info</span>
        <div className="flex flex-wrap gap-1 ml-3 font-medium text-md" style={{overflowWrap: 'break-word', wordWrap: 'break-word'}}>
            <span className="font-semibold">{title}</span> {message}
        </div>
        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-800 hover:text-white inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700" aria-label="Close"
        onClick={() => setShow(false)}
        >
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
    )
}


export function Danger({title, message, onClose = null}) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        setShow(true);
    }, [message])

    return (
        show &&
        <div id="alert-2" className="relative flex items-center flex-1 p-4 mb-4 text-red-100 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800" role="alert">
        <svg className="absolute top-4 left-1 flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div className="flex flex-wrap gap-1 ml-3 font-medium text-md" style={{overflowWrap: 'break-word', wordWrap: 'break-word'}}>
            <span className="font-semibold">{title}</span> {message}
        </div>
        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 hover:text-white inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700" aria-label="Close"
        onClick={() => {
            setShow(false);
            if (onClose) {
                onClose();
            }
        }}
        >
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
        </div>
    )
}

export function Warning({title, message, onClose = null}) {
    const [show, setShow] = useState(true);

    return (
        show &&
        <div id="alert-4" className="relative flex items-center flex-1 p-4 mb-4 border border-yellow-300 rounded-lg text-brown-800 bg-yellow-50 dark:bg-gray-800 dark:text-yellow-500 dark:border-yellow-800" role="alert">
        <svg className="absolute top-4 left-1 flex-shrink-0 w-4 h-4 text-yellow-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div className="flex flex-wrap gap-1 ml-3 font-medium text-md" style={{overflowWrap: 'break-word', wordWrap: 'break-word'}}>
            <span className="font-semibold">{title}</span> {message}
        </div>
        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-yellow-50 text-yellow-800 rounded-lg focus:ring-2 focus:ring-yellow-400 p-1.5 hover:bg-yellow-800 hover:text-white inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700" aria-label="Close"
         onClick={() => {
            setShow(false);
            if (onClose) {
                onClose();
            }
        }}
        >
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
        </button>
      </div>
    )
}

export function Dark({title, message}) {
    const [show, setShow] = useState(true);

    return (
        show &&
        <div id="alert-dark" className="flex items-center flex-1 p-4 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300" role="alert">
        <svg className="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
        </svg>
        <span className="sr-only">Info</span>
        <div className="flex flex-wrap gap-1 ml-3 font-medium text-gray-800 text-md dark:text-gray-300" style={{overflowWrap: 'break-word', wordWrap: 'break-word'}}>
            <span className="font-semibold">{title}</span> {message}
        </div>
        <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-gray-50 text-gray-500 rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-800 hover:text-white inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white" aria-label="Close"
        onClick={() => setShow(false)}
        >
            <span className="sr-only">Close</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
        </button>
        </div>
    )
}





