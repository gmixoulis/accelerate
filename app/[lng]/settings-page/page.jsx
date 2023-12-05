import { FiHelpCircle, FiSettings } from "react-icons/fi"

import Navbar from "../components/Navbar"
import Sidebar from "../components/Sidebar"

export default function Settings({ params }) {
  return (
    <>
      <Navbar />
      <div className="flex flex-wrap w-auto h-auto overflow-x-hidden dark:bg-darkslategray-100">
        <div className="z-10 flex h-full">
          <Sidebar
            topNavigation={
              [
                // {
                //   name: "Add New Widget",
                //   href: `/`,
                //   icon: <BsWindowPlus size={30} />,
                // },
                // {
                //   name: "Add New App",
                //   href: `/`,
                //   icon: <MdOutlineDashboardCustomize size={30} />,
                // },
                // {
                //   name: "Edit Dashboard",
                //   href: `/`,
                //   icon: <MdOutlineDashboard size={30} />,
                // },
              ]
            }
            bottomNavigation={[
              {
                name: "Help and FAQ",
                href: `#`,
                icon: <FiHelpCircle size={27} />,
              },
              {
                name: "Settings",
                href: `/${params.lng}/account-page/preferences`,
                icon: <FiSettings size={27} />,
              },
            ]}
          />
        </div>
        <h2 className="text-dimgray-200 text-7xl">Settings</h2>
      </div>
    </>
  )
}
