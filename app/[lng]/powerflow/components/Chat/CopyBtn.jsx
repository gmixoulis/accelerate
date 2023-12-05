"use client"

import { IconCopy, IconCheck, IconLoader2 } from "@tabler/icons-react";
import { handleCopyClick } from "../../utils"
import { useState, useEffect } from "react";
import { Tooltip } from "@material-tailwind/react";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

const CopyBtn = ({ message }) => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");

    const [copy, setCopy] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (copy) {
            setTimeout(() => {
                setCopy(false);
            }, 2000);
        }
    }, [copy]);

    return (
        <Tooltip
            content={t("copy")}
            placement="bottom-start"
            className="sm:max-w-4xl bg-white shadow-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200 border border-gray-500 dark:border-gray-600 z-30 rounded-md p-1.5">
            <button
                className="p-1"
                onClick={async () => {
                    setLoading(true);
                    await handleCopyClick({ model: message.model, content: message.content });
                    setLoading(false);
                    setCopy(true);
                }}
            >
                {
                    loading ?
                        <IconLoader2 className="animate-spin" size={18} />
                        : copy ?
                            <IconCheck className="text-green-500 dark:text-green-400" size={18} /> :
                            <IconCopy className="hover:text-unicred-300 dark:text-gray-400 dark:hover:text-white" size={18} />
                }
            </button>
        </Tooltip>
    );
}

export default CopyBtn;