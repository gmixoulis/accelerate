"use client"
import { Typography, Card, CardHeader, CardBody, CardFooter } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { MdSearchOff } from "react-icons/md";
import { CheckCircleIcon, PlusIcon, XCircleIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import SplitButton from "./SplitButton";


const Table = ({
  TABLE_HEAD,
  setShowModal,
  setShowEdit,
  setShowDelete,
  setItem,
  name,
  data,
  properties,
}) => {
  const { lng } = useParams()
  const { t } = UseTranslation(lng, "powerflow")
  const [tableData, setTableData] = useState(data)

    const handleRowClick = (item) => {
        item.status = true;
        //all other items are false
        data.forEach((i) => {
            if (i.model_id !== item.model_id) {
                i.status = false;
            }
        });
        setTableData([...tableData]);
    }

    useEffect(() => {
        setTableData(data);
    }, [data]);

    return (
        <Card shadow={false} className="flex-1 max-w-[80vw] md:max-w-[80%] rounded-md overflow-y-hidden dark:bg-darkslategray-100"> 
            <CardHeader floated={false} shadow={false} className="rounded-none dark:bg-darkslategray-100 m-0 p-0">
                <div className="flex items-center flex-wrap pb-6 gap-4">
                   <button className="primary-button rounded-md text-gray-100 p-2 flex gap-2 items-center" onClick={() => setShowModal(true)}>
                        <PlusIcon className="h-5 w-5"/> {t("add")} {name}
                   </button>
                </div>
            </CardHeader>
        <CardBody className={`overflow-auto custom-scrollbar px-0 z-0 pt-0`}>
        <table className="w-full table-auto text-left">
        <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-20">
        <tr>
            {/*<th scope="col" className="border-y border-gray-300 dark:border-gray-200 p-4">
            <div className="flex items-center justify-center h-5"> 
                <input id="hs-table-pagination-checkbox-all" type="checkbox" className="text-blue-600 border-gray-400 rounded focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-300 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"/>
                <label htmlFor="hs-table-pagination-checkbox-all" className="sr-only">Checkbox</label>
            </div>
    </th>*/}
              {TABLE_HEAD.map((head) => (
                <th
                  key={head.id}
                  className="p-4 border-gray-300 border-b dark:border-gray-200 first-of-type:rounded-tl-md" //hover:cursor-pointer hover:bg-gainsboro-100 dark:hover:bg-gray-600
                  onClick={head.click}
                >
                  <Typography
                    as="div"
                    className="flex items-center gap-2 font-medium leading-none text-gray-500 uppercase tracking-wider text-sm dark:text-gray-300"
                    lang={lng}
                  >
                    {head.name}{" "}
                  </Typography>
                </th>
              ))}
              <th className="p-4 border-gray-300 border-b dark:border-gray-200 rounded-tr-md">
                <Typography
                  as="div"
                  className="flex items-center gap-2 font-medium leading-none text-gray-500 uppercase tracking-wider text-sm dark:text-gray-300"
                  lang={lng}
                >
                  {t("actions")}{" "}
                </Typography>
              </th>
            </tr>
          </thead>
          <tbody className="divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-darkslategray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-36">
                  <div className="flex items-center justify-center gap-2">
                    <MdSearchOff className="w-12 h-12 text-gray-800 dark:text-gray-200" />
                    <Typography
                      as="h2"
                      className="text-2xl font-medium text-gray-800 dark:text-gray-200"
                    >
                      {t("no records")}
                    </Typography>
                  </div>
                </td>
              </tr>
            ) : (
              tableData.map((item) => {
                return (
                  <tr key={item.model_id}>
                    {properties.map((property, propIndx) => (
                        <td
                            key={property}
                            className={`px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap text-gray-800 dark:text-gray-200 min-w-0 `}  
                        >
                            {property === "status" ? (
                                <div className="flex items-center gap-2">
                                    {item[property] ? (
                                        <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                    ) : (
                                        <XCircleIcon className="w-6 h-6 text-red-500" />
                                    )}
                                </div>
                            ) : (
                                item[property]
                            )}
                        </td>
                    ))}
                    <td className="min-w-0 px-4 py-2 text-gray-800 border-b border-gray-300 dark:border-gray-700 dark:text-gray-200">
                      <SplitButton 
                          item={item}
                          onActivate={() => handleRowClick(item)}
                          onEdit={()=> {setShowEdit(true)
                            setItem(item)}}
                          onDelete={() => {
                            setShowDelete(true)
                            setItem(item)
                          }}
                        />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  )
}

export default Table
