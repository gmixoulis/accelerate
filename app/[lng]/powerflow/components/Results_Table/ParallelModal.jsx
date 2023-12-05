import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
  Typography
} from "@material-tailwind/react";
import { useParams, useRouter } from 'next/navigation';
import { UseTranslation } from '@/app/i18n/client';
import { formatDate, getStatusBadge } from "../../utils";
import ActionsButton from "./ActionsButton";
import Checkbox from "./Checkbox";
import { useState } from "react";
 
export function ParallelModal({open, setOpen, prompt}) {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");

    const router = useRouter();

    const TABLE_HEAD = [
        { id: t("title"), sort: "" },
        { id: t("mode"), sort: "" },
        { id: t("status"), sort: "" },
        { id: t("created at"), sort: "desc" },
        { id: t("updated at"), sort: "" },
    ];
 
  const handleOpen = () => setOpen(!open);

  const handleCheckAllChange = (event) => {
    setCheckedItems(new Array(prompt?.batch.length).fill(event.target.checked));
  };

const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
};

  const [checkedItems, setCheckedItems] = useState([]);
 
  return (
    <>
      <Dialog open={open} handler={handleOpen} size="xl" className="bg-white dark:bg-darkslategray-200 text-gray-800 dark:text-white focus:ring-none">
        <DialogHeader className="flex justify-between w-full pr-11 text-gray-800 dark:text-white">
            <span className="opacity-0">Batch Title</span>
            <ActionsButton
                disabled={checkedItems.every(item => item === false)} 
                chatIds={prompt?.batch.filter((prompt, index) => checkedItems[index])
                        .map((prompt) => prompt.chat_id)} 
                refresh={() => router.refresh()}    
                reset={() => {
                                setCheckedItems((prevCheckedItems) =>
                                    prevCheckedItems.map(() => false));
                            }} />
        </DialogHeader>
        <DialogBody divider className="overflow-auto p-0 max-h-[30rem] md:max-h-[32rem] 3xl:max-h-[40rem]">
        <table className="w-full table-auto text-left">
        <thead className="bg-gray-200 dark:bg-gray-700 sticky z-20">
        <tr>
            <th scope="col" className="border-y border-gray-300 dark:border-gray-200 p-4">
            <div className="flex items-center justify-center h-5"> 
            <input id="hs-table-pagination-checkbox-all" type="checkbox" checked={checkedItems.filter((item) => item === true).length === checkedItems.length && checkedItems.length > 1} onChange={handleCheckAllChange} className="border-gray-400 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-300 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800"/>
                <label htmlFor="hs-table-pagination-checkbox-all" className="sr-only">Checkbox</label>
            </div>
            </th>
            {TABLE_HEAD.map((head) => (
                <th
                key={head.id}
                className="border-y border-gray-300 dark:border-gray-200 p-4" //hover:cursor-pointer hover:bg-gainsboro-100 dark:hover:bg-gray-600
                onClick={head.click}
                >
                <div className="flex items-center justify-center gap-2 leading-none opacity-70 text-md font-medium text-gray-600 dark:text-gray-300 uppercase">
                    {head.id}{" "}
                </div>
                </th>
            ))}
             <th
                className="border-y border-gray-300 dark:border-gray-200 p-4"
                >
                <Typography as="div"
                    variant="small"
                    className="flex items-center justify-center gap-2 leading-none opacity-70 text-md font-medium text-gray-600 dark:text-gray-300 uppercase"
                >
                    {t("actions")}{" "}
                </Typography>
                </th>
        </tr>
        </thead>
        <tbody className="divide-gray-200 dark:divide-gray-700">  
        { prompt?.batch.map((prompt, index) => {
                return (              
                <tr key={index}>
                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                        <Checkbox 
                        id={`hs-table-pagination-checkbox-${index}`}
                        checked={checkedItems[index] || false}
                        onChange={() => handleCheckboxChange(index)}
                        htmlFor={`hs-table-pagination-checkbox-${index}`}
                        />
                    </td>
                    <td onClick={() => router.push(`/${lng}/powerflow/my-tasks/${prompt.chat_id}`)} 
                    className="max-w-[15rem] min-w-[15rem] px-4 py-2 border-b border-gray-300 dark:border-gray-700 text-md text-justify font-medium text-gray-800 hover:text-red-100 dark:text-gray-200 dark:hover:text-white hover:cursor-pointer">
                        <div className="w-full whitespace-nowrap overflow-ellipsis overflow-hidden">
                        <Tooltip placement="bottom-start" className="sm:max-w-4xl bg-gainsboro-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 border border-gray-500 dark:border-gray-300 !z-[99999]" content={prompt.title}>
                            {prompt.title}
                        </Tooltip>
                        </div>
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap text-center text-md text-gray-800 dark:text-gray-200 min-w-0 capitalize">{t(prompt.mode)}</td>
                     <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap text-center text-md text-gray-800 dark:text-gray-200 min-w-0">
                        {getStatusBadge(prompt.status, t(prompt.status))}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap text-center text-md text-gray-800 dark:text-gray-200 min-w-0">{formatDate(prompt.created_at)}</td>
                    <td className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 whitespace-nowrap text-center text-md text-gray-800 dark:text-gray-200 min-w-0">{formatDate(prompt.updated_at)}</td>
                    <td className="px-4 py-2 text-md border-b border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 min-w-0">
                    <div className="flex justify-center items-center">
                      <ActionsButton disabled={false}
                        chatIds={[prompt.chat_id]}
                        reset={() => {
                                        setCheckedItems((prevCheckedItems) =>
                                        prevCheckedItems.map(() => false)
                                        );
                                    }} 
                        refresh={() => router.refresh()}
                                    /> 
                    </div>
                    </td>
                    </tr> 
            )
        })
        }
        </tbody>
    </table>
        </DialogBody>
        <DialogFooter>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-md font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 dark:hover:bg-gray-200 sm:mt-0 sm:w-auto"
          onClick={handleOpen}
        >
          {t("cancel")}
        </button>          
        </DialogFooter>
      </Dialog>
    </>
  );
}