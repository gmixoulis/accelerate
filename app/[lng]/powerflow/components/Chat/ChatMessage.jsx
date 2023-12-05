import MarkdownMessage from "./MarkdownMessage";
import CopyBtn from "./CopyBtn";
import ExportBtn from "./ExportBtn";
import { memo, useState, useEffect, useRef } from "react";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { getDisplayName } from "../../utils";
import { IconPencil } from "@tabler/icons-react";
import { Tooltip } from "@material-tailwind/react";
import { useStream } from "../../context/StreamContext";
import autosize from "autosize";
import { OpenAIModel } from "../../utils/constants";

const ChatMessage = ({ message, updatedMessage, setUpdatedMessage, index }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const model = getDisplayName(message.model);
  const [edit, setEdit] = useState(false);
  const { messages, setMessages } = useStream();
  const textareaRef = useRef(null);

  //update autosize when input changes
  useEffect(() => {
    if (textareaRef?.current) {
      autosize(textareaRef.current);
      autosize.update(textareaRef.current);
    }
  }, [updatedMessage.content]);



  return (
    <>
      <div className="overflow-x-auto">
        <div
          className={`message-bubble custom-box ${message.role === "assistant"
              ? "bg-gray-200 assistant-message"
              : "bg-dimgray-200 user-message text-white"
            }`}
        >
          <div className="message-header">
            {message.role === "assistant" ? model : t("you")}
            <div className="flex gap-2">
              {!edit && message.role === "user" && (
                <Tooltip
                content={t("edit")}
                placement="bottom-start" className="sm:max-w-4xl bg-white shadow-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200 border border-gray-500 dark:border-gray-600 z-30 rounded-sm">
                <button
                className="p-1"
                onClick={() => {
                  setEdit(true);
                  setUpdatedMessage({index: index, content: message.content});
                }}
                >
                    <IconPencil className="text-black-700 hover:text-unicred-300 dark:text-gray-400 dark:hover:text-white" size={18} />
                </button>
                </Tooltip>
              )
                }
              <ExportBtn message={message} />
              <CopyBtn message={message} />
            </div>
          </div>
          <div className="message-content break-words">
            {message.role === "assistant" ? (
               <MarkdownMessage message={message.content} />
            ) : edit ? (
              <div className="flex flex-col gap-2">
                <textarea
                  className="p-2 bg-dimgray-200 text-white custom-box user-message"
                  value={message.model === OpenAIModel.GPT_4_TURBO_VISION.model ? updatedMessage.content[0].text : updatedMessage.content}
                  onChange={(e) => {
                    if (message.model === OpenAIModel.GPT_4_TURBO_VISION.model) {
                      setUpdatedMessage({
                        index: index,
                        content: [
                          {
                            type: "text",
                            text: e.target.value
                          },
                          ...updatedMessage.content.slice(1)
                        ],
                      });
                    } else {
                      setUpdatedMessage({ index: index, content: e.target.value });
                    }
                  }}
                  style={{ resize: "none" }}
                  ref={textareaRef}
                />
                <div className="grid grid-cols-[150px_150px] justify-center gap-2">
                  <button
                    className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border rounded-md p-2 border-gray-600 dark:border-gray-300 hover:opacity-50 shadow"
                    onClick={() => {
                      const newMessages = messages.slice(0, updatedMessage.index);
                      setMessages(newMessages);
                    }}
                  >
                    {t("submit")}
                  </button>
                  <button
                    className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border rounded-md p-2 border-gray-600 dark:border-gray-300 hover:opacity-50 shadow"
                    onClick={() => {
                      setEdit(false);
                      setUpdatedMessage({ index: null, content: "" });
                    }}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words">
                {
                  message.model === OpenAIModel.GPT_4_TURBO_VISION.model ? (
                    <>
                    {message.content[0].text}
                    {message.content.map((item, index) => {
                      if (item.type === 'image_url') {
                        return <img key={index} src={item.image_url.url} alt="" className="my-4"/>;
                      } else {
                        return null;
                      }
                    })}
                    </>
                  ) : (message.content)
                }
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ChatMessage);