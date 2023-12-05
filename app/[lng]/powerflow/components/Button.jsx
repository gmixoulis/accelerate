"use client"

const Button = ({children, onClick, copy}) => {
    return (
        <div className={`min-w-[130px] w-full p-2 text-md text-gray-700 font-regular 
                  ${copy ? "bg-gray-100 hover:text-gray-900 dark:bg-gray-700 dark:text-white" : "dark:text-gray-200 dark:bg-gray-700 hover:dark:bg-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:dark:text-white text-gray-700"}`} 
                    onClick={onClick}>
                    {children}
                  </div>
    )
}

export default Button;