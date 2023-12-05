"use client"
import { IconShare, IconLoader2 } from "@tabler/icons-react";
import { exportToDocx } from "../../utils/exportToDocx";
import { Tooltip } from "@material-tailwind/react";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { convertContentToMarkdown } from "../../utils";
import { OpenAIModel } from "../../utils/constants";
import { useState } from "react";

const ExportBtn = ({ message }) => {
    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");

    const [exporting, setExporting] = useState(false);

    const handleShareClick = async () => {
        setExporting(true);
        const date = new Date();
        const fileName = `powerflow_message_${date.toISOString().split("T")[0]}_${date.getTime()}.doc`;
        let text;
        if (message.model === OpenAIModel.GPT_4_TURBO_VISION.model && message.role === "user") {
            text = await convertContentToMarkdown(message.content);
        } else {
            text = message.content;
        }
        exportToDocx(text, fileName)
        setExporting(false);
    };

    return (
        <Tooltip
        content={t("export")}
        placement="bottom-start" className="sm:max-w-4xl bg-white shadow-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200 border border-gray-500 dark:border-gray-600 z-30 rounded-md p-1.5">
        <button
        className="p-1"
        onClick={handleShareClick}
        >
            {exporting ? <IconLoader2 className="animate-spin" /> : <IconShare className="text-black-700 hover:text-unicred-300 dark:text-gray-400 dark:hover:text-white" size={18} />}
        </button>
        </Tooltip>
                
    );
}

export default ExportBtn;