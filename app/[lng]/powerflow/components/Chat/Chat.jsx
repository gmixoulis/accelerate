import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import ChatMessage from "./ChatMessage";
import { StopChat } from "./StopChat";
import MessageDetails from "./MessageDetails";
import { useState } from "react";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { useStream } from "../../context/StreamContext";
import { BsArrowClockwise } from "react-icons/bs";
import { useEffect } from "react";
import { Chip } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

export const Chat = ({ loading, onSend, onStop, disabled, failedMessage }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const [content, setContent] = useState("");
  const { chatId, model, messages } = useStream();
  const [disableRetry, setDisableRetry] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState({ index: null, content: "" });
  const [selectedFiles, setSelectedFiles] = useState([]);



  const SelectedFiles = ({ files }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {files.map((item, index) => (
          <Chip
            title={item.type === 'file' ? item.file.name : item.url}
            key={index}
            label={item.type === 'file' ? `${t(item.status)} - ${item.file.name}` : item.url}
            avatar={item.type === 'file' ? (item.status === 'uploaded' ? <CheckCircleIcon fontSize="small"/> : <HourglassBottomIcon fontSize="small"/>) : null}
          />
        ))}
      </div>
    );
  };


  useEffect(() => {
    if (updatedMessage.index) {
      onSend({ role: "user", content: updatedMessage.content, model: model });
      setUpdatedMessage({ index: null, content: "" });
    }
  }, [messages]);


  useEffect(() => {
    if (!chatId) {
      setSelectedFiles([]);
    }
  }, [chatId]);

  return (
    <>
      <div className="flex flex-col rounded-lg p-4 pl-0 pb-0">
        <div className="flex-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className="my-1 sm:my-1.5"
            >
              <ChatMessage
                message={index === 0 ? { ...message, content: t("initialMessage") } : message}
                updatedMessage={updatedMessage}
                setUpdatedMessage={setUpdatedMessage}
                index={index}
              />
            </div>
          ))}

          {loading && (
            <div className="my-1 sm:my-1.5">
              <ChatLoader />
            </div>
          )}
        </div>
        <div className="sticky bottom-0 left-0 bg-white dark:bg-darkslategray-100 pb-6">
          <div className="pb-0.5 mt-4 w-full gap-2 flex md:items-center">
            {failedMessage && chatId && (
              <button
                disabled={disableRetry}
                className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border rounded-md p-2 border-gray-600 dark:border-gray-300 hover:opacity-50 shadow absolute right-0 -top-8 z-20 flex gap-2"
                onClick={() => {
                  setDisableRetry(true);
                  onStop();
                  onSend(failedMessage);
                  //disable for 250ms to prevent spamming
                  setTimeout(() => setDisableRetry(false), 250);
                }}
              >
                <BsArrowClockwise className={`${disableRetry ? "animate-spin" : ""}`} />
                {t("retry")}
              </button>
            )}
            <div className="flex-1">
              <ChatInput content={content} setContent={setContent} onSend={onSend} disabled={disabled} selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
            </div>
            <StopChat onStop={onStop} />
          </div>
          <div>
            <SelectedFiles files={selectedFiles} />
            <MessageDetails message={content} />
          </div>
        </div>
      </div>

    </>
  );
};
