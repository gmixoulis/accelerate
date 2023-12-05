import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  ButtonGroup,
  Button
} from "@material-tailwind/react";
import { useState } from "react";
import { AiFillCaretDown } from "react-icons/ai";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";



export default function SplitButton({item, onActivate, onEdit, onDelete}) {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const [openMenu, setOpenMenu] = useState(false);

  const options = [
    { title: t("edit"), click: () => onEdit() },
    { title: t("delete"), click: () => onDelete() },
  ];

  return (
    <>
       <ButtonGroup className="divide-gray-400 divide-x dark:divide-gray-600 !p-0 flex min-w-[80px] shadow rounded-md bg-gray-200 dark:bg-gray-700">
        <Button className={`bg-gray-200 capitalize text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:shadow-none shadow-none flex-1 p-1.5 font-medium font-md hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white
        rounded-none rounded-l-md`}
        onClick={() => onActivate()}
        disabled={item.status}
        >{item.status ? t("active") : t("activate")}</Button>
      <Button className="p-0 shadow-none hover:shadow-none bg-gray-200 dark:bg-gray-700">
      <Menu open={openMenu} handler={setOpenMenu} placement="bottom-end">
      <MenuHandler>
        <Button className="font-medium bg-gray-200 capitalize text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-none hover:bg-gray-300 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white rounded-none rounded-r-md shadow-none hover:shadow-none p-2 active:shadow-none">
          <AiFillCaretDown
                className="h-4 w-4 text-gray-600 dark:text-gray-300"
                aria-label="menu"
              />
        </Button>
      </MenuHandler>
      <MenuList
        className="bg-white dark:bg-gray-700 shadow-lg text-sm text-gray-700 dark:text-gray-200 border-none px-0 !z-[999999] w-40"
      >
          {options.map(({title, click}) => (
              <MenuItem key={title} className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
              block px-4 py-2 rounded-none text-start" onClick={click}>
                  {title}
              </MenuItem>
          ))} 
      </MenuList>
      </Menu>
      </Button>
      </ButtonGroup>
    </>
  );
}
/*
import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

const options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];

export default function SplitButton() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleClick = () => {
    console.info(`You clicked ${options[selectedIndex]}`);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}

*/