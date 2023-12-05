"use client"
import { useState } from "react";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Delete from "../Delete";
import Export from "./Export";
import { handleCopyClick, getThread, getDisplayName, convertContentToMarkdown } from "../../utils";
import { useStream } from "../../context/StreamContext";
import { OpenAIModel } from "../../utils/constants";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { IconLoader2 } from "@tabler/icons-react";




const ActionsButton = ({ isHeader = false, disabled, chatIds, refresh, reset }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");

  const [showDelete, setShowDelete] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [copyingConversation, setCopyingConversation] = useState(false);
  const [copyingReplies, setCopyingReplies] = useState(false);

  const { setMessages, setChatId, setStreamTitle, setModel, chatId } = useStream();

  const deletePrompts = async (chatIds) => {
    try {
      setDeleting(true);
      const responses = await Promise.all(chatIds.map(async id => {
        const response = await fetch(`/api/powerflow/prompt/${id}`, {
          method: "DELETE"
        });

        const resData = await response.json();
        return resData;
      }));

      console.log("responses:", responses);

      if (responses.some(res => res.status_code !== 200)) {
        setError(t("deleteFailed"));
        return false;
      }

      const streamChatId = chatIds.find(id => id === chatId);

      if (streamChatId) {
        setChatId("");
        setMessages([{
          role: "assistant",
          content: t("initialMessage"),
          model: OpenAIModel.GPT_4.model,
        }]);
        setStreamTitle("");
        setModel(OpenAIModel.GPT_4.model);
      }

      refresh();
      reset();
      setDeleting(false);
      return true;
    } catch (err) {
      console.log("Error deleting prompts:", err);
    }
  };

  const menuItems = [
    //{title: "Edit", click: () => {}},
    { title: t("copy"), click: () => { } },
    { title: t("export"), click: () => { setShowExport(!showExport); } },
    { title: t("delete"), click: () => { setShowDelete(!showDelete); } },
  ];


  return (
    <Menu open={openMenu} handler={setOpenMenu} offset={10} placement="bottom-end">
      <MenuHandler>
        <Button
          ripple={false}
          variant="text"
          className={`flex items-center gap-3 text-sm font-normal capitalize p-2 text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-400 dark:bg-gray-700 dark:text-gray-300 
          disabled:pointer-events-auto disabled:!cursor-not-allowed disabled:shadow-sm disabled:shadow-inner hover:bg-gray-100 dark:hover:bg-gray-700 font-regular
           cursor-pointer dark:hover:bg-gray-600 active:bg-transparent ${isHeader ? "bg-white" : "bg-gray-200"} `}
          disabled={disabled}
        >
          {t("actions")}{" "}
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3.5 w-3.5 transition-transform ${openMenu ? "rotate-180" : ""
              }`}
          />
        </Button>
      </MenuHandler>
      <MenuList
        className="bg-white dark:bg-gray-700 shadow-lg text-sm text-gray-700 dark:text-gray-200 border-none px-0 !z-[999999] w-44"
      >
        {menuItems.map(({ title, click }) => (
          title === t("copy") ? (
            <MenuItem key={title} className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
              block p-0 rounded-none text-start">
              <Menu key={title} placement="right-start" offset={10} open={openSubMenu || copyingConversation} handler={setOpenSubMenu}>
                <MenuHandler>
                  <div
                    className="flex w-full items-center hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
                block px-4 py-2"
                  >
                    <div className="w-full flex items-center justify-between">
                      {title}
                      <ChevronRightIcon
                        strokeWidth={2.5}
                        className="h-3.5 w-3.5 mr-2"
                      />
                    </div>
                  </div>
                </MenuHandler>
                <MenuList className="bg-white dark:bg-gray-700 shadow-md text-sm text-gray-700 dark:text-gray-200 border-none px-0 !z-[999999] w-44">
                  <MenuItem key="conversation" className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
                    block px-4 py-2 rounded-none text-start"
                    onClick={async () => {
                      setCopyingConversation(true);
                      let copyText = "";
                      const chatThreads = await Promise.all(chatIds.map(chatId => getThread(chatId)));
                      for (const prompt of chatThreads) {
                        let content = "";
                        if (prompt?.chat_json) {
                          content = await Promise.all(prompt.chat_json
                            .map(async (message) => {
                              const model = getDisplayName(prompt?.model);
                              const header =
                                message.role === "assistant"
                                  ? model + ":\n\n"
                                  : `${t("you")}:\n\n`
                              let content = message.content;
                              if (prompt.model === OpenAIModel.GPT_4_TURBO_VISION.model && Array.isArray(message.content)) {
                                content = await convertContentToMarkdown(message.content);
                              }
                              return header + content;
                            })
                          );
                          copyText += content + "\n\n";
                        }
                      }
                      await handleCopyClick({ model: OpenAIModel.GPT_4_TURBO.model, content: copyText });
                      setCopyingConversation(false);
                      reset();
                    }}>
                    <div className="flex items-center">
                      {copyingConversation && <IconLoader2 className="animate-spin h-5 w-5 text-gray-900 dark:text-white mr-2" />}
                      {t("conversation")}
                    </div>
                  </MenuItem>
                  <MenuItem key="replies" className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
                    block px-4 py-2 rounded-none"
                    onClick={async () => {
                      setCopyingReplies(true);
                      let copyText = "";
                      const chatThreads = await Promise.all(chatIds.map(chatId => getThread(chatId)));
                      chatThreads.forEach(prompt => {
                        let content = "";
                        if (prompt?.chat_json) {
                          content = prompt.chat_json
                            .filter((message) => message.role === 'assistant')
                            .map((message) => {
                              return message.content;
                            })
                            .join('\n\n');
                        }
                        copyText += content + "\n\n";
                      });
                      handleCopyClick({ model: OpenAIModel.GPT_4_TURBO.model, content: copyText });
                      setCopyingReplies(false);
                      reset();
                    }}
                  >
                    <div className="flex items-center">
                      {copyingReplies && <IconLoader2 className="animate-spin h-5 w-5 text-gray-900 dark:text-white mr-2" />}
                      {t("replies")}
                    </div>
                  </MenuItem>
                </MenuList>
              </Menu>
            </MenuItem>
          ) : (
            <MenuItem key={title} className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
              block px-4 py-2 rounded-none text-start" onClick={click}>
              {title}
            </MenuItem>
          )
        ))}
      </MenuList>
      <Delete
        open={showDelete}
        onClose={() => {
          setShowDelete(false);
          setError(null);
        }}
        onDelete={async () => {
          const success = await deletePrompts(chatIds).catch(err => {
            console.log('Error:', err);
          });
          if (success) {
            setShowDelete(false);
          }
        }}
        errorMessage={error}
        deleting={deleting}
      />
      <Export open={showExport} chatIds={chatIds} onClose={() => setShowExport(false)} reset={reset} />
    </Menu>
  );
}

export default ActionsButton

