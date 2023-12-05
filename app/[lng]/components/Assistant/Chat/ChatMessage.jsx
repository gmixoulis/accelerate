import MarkdownMessage from "@/app/[lng]/powerflow/components/Chat/MarkdownMessage";
import { useState, useEffect, memo } from "react";
import {IconCopy, IconCheck, IconShare} from "@tabler/icons-react";
import { exportToDocx } from "@/app/[lng]/powerflow/utils/exportToDocx";
import { handleCopyClick } from "@/app/[lng]/powerflow/utils";

const ChatMessage = ({ message }) => {

  const [copy, setCopy] = useState(false);

    useEffect(() => {
        if (copy) {
            setTimeout(() => {
                setCopy(false);
            }, 2000);
        }
    }, [copy]);

    const handleShareClick = (text) => {
      const date = new Date();
      const fileName = `powerflow_message_${date.toISOString().split("T")[0]}_${date.getTime()}.doc`;
  
      exportToDocx(text, fileName)
  };

  return (
    <>
      <div className="flex items-start text-start">
        <div
          className={`rounded-lg py-2 px-5 inline-flex flex-col w-full dark:text-white font-regular
           ${message.role === "assistant" ? "bg-blue-100 dark:bg-darkslategray-100" : "bg-neutral-100 dark:bg-silver-200"}`}>
          <div className="font-bold p-1 flex justify-between">
            {message.role === "assistant" ? "ChatGPT" + (message.model === "gpt-4" ? " 4" : " 3.5")
              : "You"}
            <div>
            <button
            className="bg-transparent border-none outline-none p-1 ml-2"
            onClick={() => handleShareClick(message.content)}
            >
                <IconShare className="text-black-700 hover:text-indigo-700 dark:text-gray-400 dark:hover:text-white cursor-pointer" size={16} />
            </button>
              <button
                className="bg-transparent border-none outline-none p-1 ml-2 cursor-pointer"
                onClick={() => {
                    handleCopyClick(message.content);
                    setCopy(true);
                }}
              >
              {copy ? <IconCheck className="text-green-600" size={16} /> :
                          <IconCopy className="hover:text-indigo-700 dark:text-gray-400 dark:hover:text-white" size={16} />}
              </button>
            </div>
          </div>
          <div className="message-content">
            {message.role === "assistant" ? (
               <MarkdownMessage message={message.content} />
            ) : (
              <div style={{ whiteSpace: "pre-wrap" }}>{message.content}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ChatMessage);