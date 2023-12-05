"use client"

import React, {useState, useEffect} from "react"

import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react"
import {
  PlusCircleIcon,
  Cog8ToothIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline"
import { 
  IconArrowBarLeft, 
  IconArrowBarRight, 
  IconListDetails,
  IconMoon,
  IconSun
} from '@tabler/icons-react'
import { IoChatbubbleSharp } from "react-icons/io5"
import Link from 'next/link';
import { useTheme } from "next-themes"
import { usePathname} from "next/navigation"



const Sidebar = ({children})  => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme} = useTheme();
  const currentPath = usePathname().substring(3);

  useEffect(() => {
    setMounted(true)
  }, [])

  const top_navigation = [
    { name: 'New Task', href: `/powerflow`, icon: <PlusCircleIcon />},
    { name: 'My Tasks', href: `/powerflow/my-tasks` , icon: <IconListDetails className="ml-1"/>},
  ]

  const bottom_navigation = [
    { name: 'Help & FAQ', href: `#`, icon: <QuestionMarkCircleIcon />},
    { name: 'Settings', href: `#`, icon: <Cog8ToothIcon />},
  ]
  
  useEffect(() => {
    // Set sidebarOpen based on window width after component has mounted
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 768);
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!mounted) {
    return null
  }

  
  
 
  return (
    <>
    <aside  className={`fixed left-0 z-40 w-56 h-[90vh] transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`} aria-label="Sidebar">
    <div className="flex flex-col h-full">
    <Card className="flex flex-col h-full sticky top-0 p-4 bg-gainsboro-100 dark:bg-darkslategray-200 rounded-none">
      <div>
      <div className="flex items-center gap-1">
      <div className="flex items-center justify-between p-1.5 bg-black rounded-full">
        <IoChatbubbleSharp className="h-6 w-6 text-unic_blue" />
      </div>
      <Typography className="text-black text-2xl font-bold">Power Flow</Typography>
      </div>
      <List>
        {top_navigation.map((item, index) => (
            <Link key={item.name} href={item.href} legacyBehavior >
            <ListItem  className={`
                ${item.href === currentPath ? '' : 'text-gray-500 hover:text-unicred-300'}
                px-3 py-2 text-sm font-medium`} disabled={item.href === '#'}>
            <ListItemPrefix>
              <span className={`h-8 w-8 ${item.href === currentPath ? 'text-unicred-400' : ''}`}>
                {item.icon}
              </span>
            </ListItemPrefix>
            <span className={`${item.href === currentPath ? 'font-bold' : ''} dark:text-gainsboro-400`}>
            {item.name}
            </span>
          </ListItem>
          </Link>
        ))}
      </List>
      </div>
      <div className="mt-auto">
      <hr className="my-2 border-gray-300 full" />
      <List>
        {bottom_navigation.map((item, index) => (
            <Link key={item.name} href={item.href} legacyBehavior >
            <ListItem  className={`
                ${item.href === currentPath ? '' : 'text-gray-500 hover:text-unicred-300'}
                rounded-md px-3 py-2 text-sm font-medium`}>
            <ListItemPrefix>
            <span className={`h-8 w-8 ${item.href === currentPath ? 'text-unicred-400' : ''}`}>
                {item.icon}
              </span>
            </ListItemPrefix>
            <span className={`${item.href === currentPath ? 'font-bold' : ''} dark:text-gainsboro-400`}>
            {item.name}
            </span>
          </ListItem>
          </Link>
        ))}

        <ListItem className="text-gray-500 px-3 py-2 text-sm hover:text-unicred-300 dark:text-gainsboro-400"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <ListItemPrefix>
              {theme === "dark" ? <IconSun className="h-8 w-8"/> : <IconMoon className="h-8 w-8"/>}
          </ListItemPrefix>
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </ListItem>
      </List>
      </div>
    </Card>
    </div>
    <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-56 z-50 h-8 w-8 p-1 bg-gainsboro-100 dark:bg-darkslategray-200 rounded-r-lg border-r border-t border-b border-gray-500"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? (
            <IconArrowBarLeft className="h-5 w-5" />
          ) : (
            <IconArrowBarRight className="h-5 w-5" />
          )}
        </button>
    </aside>
    <main
      className={`flex-1 h-full min-h-screen px-4 py-2 transition-margin transition-bg-color duration-500 ease-in-out bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-left ${
        sidebarOpen ? "ml-56" : "ml-0"
      }`}>
      {children}
    </main>
    </>
  );
}

export default Sidebar;
