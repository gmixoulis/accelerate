/**
 * <CustomDropdown
          title={t("export")}
          menuItems={[
            {
              button: 
              <Button onClick={() => {
                const exportText = prompt.conversations
                  .map((message) => {
                    const model = prompt.metadata.model === 'gpt-4' ? '4' : '3.5';
                    const header = message.role === 'assistant' ? 'ChatGPT ' + model + ':\n\n'
                      : `${t("you")}:\n\n`
                    return header + message.content;
                  })
                  .join('\n\n') || "";
                handleExportClick(exportText, "conv");
              }} copy={false}>
                {t("conversation")}
                </Button>
            },
            {
              button: 
              <Button  onClick={() => {
                const exportText = prompt.conversations.filter((message) => message.role === 'assistant')
                  .map((message) => {
                    return message.content;
                  })
                  .join('\n\n') || "";
                handleExportClick(exportText, "replies");
              }} copy={false}>
                {t("replies")}                     
                </Button>
            },
          ]}
        />
 */
"use client"
import {useState} from "react";
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";
import { ChevronDownIcon, ChevronRightIcon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { handleCopyClick, getThread } from "../../utils";
import { useStream } from "../../context/StreamContext";
import { OpenAIModel } from "../../utils/constants";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
        
        
        
        
        const ActionsButton= ({disabled, chatIds, refresh, reset}) => {
          const { lng } = useParams();
          const { t } = UseTranslation(lng, "powerflow");
        
          const [showDelete, setShowDelete] = useState(false);
          const [showExport, setShowExport] = useState(false);
          const [openMenu, setOpenMenu] = useState(false);
          const [openSubMenu, setOpenSubMenu] = useState(false);
          const [error, setError] = useState(null);
        
          const { setMessages, setChatId, setStreamTitle, setModel, chatId } = useStream();
        
        
          const menuItems = [
            //{title: "Edit", click: () => {}},
            {title: t("copy"), click: () => {}},
            {title: t("edit"), click: () => {setShowExport(!showExport);}},
            {title: t("delete"), click: () => {setShowDelete(!showDelete);}},
          ];
            
         
          return (
            <Menu open={openMenu} handler={setOpenMenu} offset={10}>
              <MenuHandler>
                  <EllipsisVerticalIcon className="w-8 h-8 text-gray-800 dark:text-white cursor-pointer" />
              </MenuHandler>
              <MenuList
                className="hidden w-40 z-30 px-0 grid-cols-1 overflow-visible grid bg-white shadow dark:bg-gray-700 border-none"
              >
                <ul className="flex w-full flex-col text-sm text-gray-700 dark:text-gray-200" aria-labelledby="multiLevelDropdownButton">
                  {menuItems.map(({title, click}) => (
                    title === t("copy") ? (            
                      <Menu key={title} placement="right-start" offset={10} open={openSubMenu} handler={setOpenSubMenu}>
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
                      <MenuList className="hidden w-40 z-30 px-0 grid-cols-1 overflow-visible grid bg-white shadow text-sm text-gray-700 dark:text-gray-200 focus:outline-none dark:bg-gray-700 border-none">
                        <MenuItem key="conversation" className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
                            block px-4 py-2 rounded-none text-start" 
                            onClick={async () => {
                              let copyText = "";
                              let prompts = await Promise.all(chatIds.map(async chatId => await getThread(chatId)));
                              prompts.forEach(prompt => {
                                let content = prompt?.conversations
                                  .map((message) => {
                                    const model = prompt?.metadata.model === "gpt-4" ? "4" : "3.5"
                                    const header =
                                      message.role === "assistant"
                                        ? "ChatGPT " + model + ":\n\n"
                                        : `${t("you")}:\n\n}`
                                    return header + message.content;
                                  })
                                  .join("\n\n") || "";
                                copyText += content + "\n\n";
                              });
                              handleCopyClick(copyText);
                              reset();
                            }}>
                             {t("conversation")}
                            </MenuItem>
                        <MenuItem key="replies" className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
                            block px-4 py-2 rounded-none"
                            onClick={ async () => {
                                let copyText = "";
                                let prompts = await Promise.all(chatIds.map(async chatId => await getThread(chatId)));
                                prompts.forEach(prompt => {
                                  let content = prompt?.conversations.filter((message) => message.role === 'assistant')
                                  .map((message) => {
                                    return message.content;
                                  })
                                  .join('\n\n') || "";
                                  copyText += content + "\n\n";
                                });
                                handleCopyClick(copyText);
                                reset();
                              }}
                            >
                              {t("replies")}
                            </MenuItem>
                      </MenuList>
                    </Menu>
                    ) : (
                      <MenuItem key={title} className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
                      block px-4 py-2 rounded-none text-start" onClick={click}>
                          {title}
                      </MenuItem>
                    )
                  ))} 
                </ul>
              </MenuList>
              </Menu>
          );
        }
        
        export default ActionsButton
        
        