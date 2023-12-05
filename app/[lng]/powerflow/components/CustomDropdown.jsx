"use client"
import {useState} from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";



const CustomDropdown = ({menuItems, title, disabled, actionInProgress}) => {
  const [openMenu, setOpenMenu] = useState(false);
 
  return (
    <Menu open={openMenu || actionInProgress} handler={setOpenMenu}>
      <MenuHandler>
        <Button
          ripple={false}
          variant="text"
          className={`flex items-center gap-3 text-sm font-normal capitalize tracking-normal rounded-md border-gray-300 shadow-sm custom-box px-2 py-2.5 bg-white text-gray-800 dark:text-gray-300 
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
          disabled={disabled}
        >
          {title}{" "}
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3.5 w-3.5 transition-transform ${
              openMenu ? "rotate-180" : ""
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList
        className="bg-white dark:bg-gray-700 shadow-lg text-sm text-gray-700 dark:text-gray-200 border-none px-0 z-30"
        >
          {menuItems.map(({button}, index) => (
              <MenuItem className="flex w-full p-0" key={index} tabIndex={0}>
                {button}
              </MenuItem>
          ))}
      </MenuList>
      </Menu>
  );
}

export default CustomDropdown;

