"use client"

import { useEffect, useState } from "react"
import { Card, CardBody, CardHeader } from "@material-tailwind/react"

import { UseTranslation } from "@/app/i18n/client"

import Textbox from "../../components/Batch/Textbox"
import Button from "../../components/Button"
import ResetChat from "../../components/Chat/ResetChat"
import CustomDropdown from "../../components/CustomDropdown"
import ModelSelect from "../../components/ModelSelect"
import Conversation from "../../components/Stream/Conversation"
import Tab from "../../components/Tab"
import Tabs from "../../components/Tabs"
import { useBatch } from "../../context/BatchContext"
import { useStream } from "../../context/StreamContext"
import useScroll from "../../hooks/useScroll"
import { convertContentToMarkdown, getDisplayName, handleCopyClick, handleExportClick } from "../../utils"
import { OpenAIModel } from "../../utils/constants"
import { Checkbox, FormControlLabel, TextField, IconButton, Button as MuiButton } from "@mui/material"
import ListsAndVariables from "../../components/Batch/ListsAndVariables"
import { Cancel, Edit, ExpandMore, Save, Add } from "@mui/icons-material"
import { CheckCircle } from "@mui/icons-material"
import { IconLoader2 } from "@tabler/icons-react"

export default function Page({ lng }) {
  const { t } = UseTranslation(lng, "powerflow")

  const [copyConversation, setCopyConversation] = useState(false)
  const [copyReplies, setCopyReplies] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [reset, setReset] = useState(false)
  const [useListParallel, setUseListParallel] = useState(false)
  const [useListSequential, setUseListSequential] = useState(false)
  const [savedTitle, setSavedTitle] = useState(false)
  const [listData, setListData] = useState([])

  const {
    model,
    setModel,
    messages,
    setMessages,
    setChatId,
    setActiveTab,
    activeTab,
    streamTitle,
    setStreamTitle,
    chatId
  } = useStream()

  const {
    parallelContent,
    sequentialContent,
    setParallelContent,
    setSequentialContent,
    parallelModel,
    setParallelModel,
    sequentialModel,
    setSequentialModel,
    parallelTitle,
    setParallelTitle,
    sequentialTitle,
    setSequentialTitle,
  } = useBatch()


  //Determine which title and setter to use based on active tab
  let activeTitle, setActiveTitle

  switch (activeTab) {
    case "stream":
      activeTitle = streamTitle
      setActiveTitle = setStreamTitle
      break
    case "parallel":
      activeTitle = parallelTitle
      setActiveTitle = setParallelTitle
      break
    case "sequential":
      activeTitle = sequentialTitle
      setActiveTitle = setSequentialTitle
      break
    default:
      break
  }

  const scrollRef = useScroll(activeTab, messages)

  const editStream = async () => {
    const promptTitle = streamTitle.trim() === "" ? messages[1]?.content.substring(0, 201) : streamTitle.substring(0, 201);
    const response = await fetch("/api/powerflow/update-thread", {
      method: "POST",
      body: JSON.stringify({
        chatId: chatId,
        messages: messages,
        model: model,
        title: promptTitle,
      })
    })

    const body = await response.json();
    if (body.status_code !== 200) {
      console.log("error: ", body);
      return false;
    }

    return true;
  }

  //Reset copy flags after 2 seconds
  useEffect(() => {
    if (copyConversation) {
      setTimeout(() => {
        setCopyConversation(false)
      }, 2000)
    }

    if (copyReplies) {
      setTimeout(() => {
        setCopyReplies(false)
      }, 2000)
    }
  }, [copyConversation, copyReplies])

  //Set initial message
  useEffect(() => {
    if (messages.length === 1) {
      setMessages([
        {
          model: OpenAIModel.GPT_4.model,
          role: "assistant",
          content: t("initialMessage"),
        },
      ])
    }
  }, [lng, setMessages, t])

  //If populate from list is unchecked, clear list data
  useEffect(() => {
    if (!useListParallel) {
      setListData([])
    }
  }, [useListParallel])

  useEffect(() => {
    if (!useListSequential) {
      setListData([])
    }
  }, [useListSequential])

  useEffect(() => {
    if (reset) {
      if (activeTab === "parallel") {
        setUseListParallel(false)
      } else {
        setUseListSequential(false)
      }
    }
  }, [reset, activeTab])

  useEffect(() => {
    //get forked from local storage
    const forked = localStorage.getItem("forked")
    if (forked === "true") {
      setTimeout(() => {
        //set scroll to bottom
        const element = document.getElementById('scrollableDiv');
        if (element) {
          element.scrollTop = element.scrollHeight;
        }
        localStorage.removeItem("forked");
      }, 1000);
    }
  }, [])

  const handleNewPromptClick = () => {
    if (activeTab === "stream") {
      setStreamTitle("")
      setMessages([
        {
          model: OpenAIModel.GPT_4.model,
          role: "assistant",
          content: t("initialMessage"),
        },
      ])
      setChatId("")
    } else {
      setActiveTitle("")
      if (activeTab === "parallel") {
        setParallelContent("")
      } else {
        setSequentialContent("")
      }
    }
  }

  return (
    <div className="pb-16">
      <Card
        shadow={false}
        className="flex max-w-[95vw] md:max-w-[89%] bg-white dark:bg-darkslategray-100 rounded-md pr-6 md:p-0"
      >
        <CardHeader
          floated={false}
          shadow={false}
          className="mx-0 mt-0 sticky top-20 z-20 dark:bg-darkslategray-100 rounded-none"
        >
          <div className="flex flex-wrap items-center gap-3 p-3 pl-0 border-b-2 border-gray-200 rounded-none dark:border-gray-700 pt-1">
            {
              activeTab === "stream" ? (
                <TextField
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder={t("placeholders.title")}
                  label={t("title")}
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="save"
                        size="small"
                        onClick={async () => {
                          let success;
                          if (chatId) {
                            success = await editStream();
                          }

                          if (success !== false) {
                            setSavedTitle(true);
                          }

                          setTimeout(() => {
                            setSavedTitle(false);
                          }, 2000)
                        }}
                        className="dark:text-white"
                      >
                        {savedTitle ? <CheckCircle fontSize="inherit" color="success" /> : <Save fontSize="inherit" />}
                      </IconButton>
                    ),
                  }}
                />

              ) : (
                <TextField
                  value={activeTitle}
                  onChange={(e) => setActiveTitle(e.target.value)}
                  placeholder={t("placeholders.title")}
                  label={t("title")}
                  size="small"
                />
              )
            }
            <div className="hidden h-10 mx-1 border-r border-gray-300 dark:border-gray-500 md:block"></div>
            {
              //Select model based on active tab
              activeTab === "stream" ? (
                <ModelSelect
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  activeTab={activeTab}
                  disabled={chatId && model === OpenAIModel.GPT_4_TURBO_VISION.model}
                />
              ) : activeTab === "parallel" ? (
                <ModelSelect
                  value={parallelModel}
                  onChange={(e) => setParallelModel(e.target.value)}
                  activeTab={activeTab}
                />
              ) : (
                <ModelSelect
                  value={sequentialModel}
                  onChange={(e) => setSequentialModel(e.target.value)}
                  activeTab={activeTab}
                />
              )
            }

            <Tabs>
              <Tab
                label={t("stream")}
                active={activeTab === "stream"}
                onClick={() => setActiveTab("stream")}
              />
              <Tab
                label={t("parallel")}
                active={activeTab === "parallel"}
                onClick={() => setActiveTab("parallel")}
              />
              <Tab
                label={t("sequential")}
                active={activeTab === "sequential"}
                onClick={() => setActiveTab("sequential")}
              />
            </Tabs>
            <CustomDropdown
              title={t("copy")}
              menuItems={[
                {
                  button: (
                    <Button
                      onClick={async () => {
                        //Copy conversation to clipboard
                        const copyText = await Promise.all(
                          messages
                            .map(async (message) => {
                              const modelName = getDisplayName(message.model);
                              const header =
                                message.role === "assistant"
                                  ? modelName + ":\n\n"
                                  : `${t("you")}:\n\n`
                              let content = message.content;
                              if (message.model === OpenAIModel.GPT_4_TURBO_VISION.model && Array.isArray(message.content)) {
                                content = await convertContentToMarkdown(message.content) + '\n\n';
                              }
                              return header + content;
                            })
                        ).then((values) => values.join("\n\n")) || "";
                        handleCopyClick({ model, content: copyText })
                        setCopyConversation(true)
                      }}
                      copy={copyConversation}
                    >
                      <div className="flex items-center gap-1">
                        {copyConversation && <IconLoader2 className="animate-spin h-5 w-5 text-gray-900 dark:text-white mr-2" />}
                        {copyConversation ? t("copying") : t("conversation")}
                      </div>
                    </Button>
                  ),
                },
                {
                  button: (
                    <Button
                      onClick={() => {
                        //Copy replies to clipboard
                        const copyText =
                          messages
                            .filter((message) => message.role === "assistant")
                            .map((message) => {
                              return message.content
                            })
                            .join("\n\n") || ""
                        handleCopyClick({ model, content: copyText })
                        setCopyReplies(true)
                      }}
                      copy={copyReplies}
                    >
                      {copyReplies ? t("copied") : t("replies")}
                    </Button>
                  ),
                },
              ]}
              disabled={activeTab !== "stream"}
              actionInProgress={copyConversation}
            />
            <CustomDropdown
              title={t("export")}
              menuItems={[
                {
                  button: (
                    <Button
                      onClick={async () => {
                        setExporting(true)
                        //Export conversation to doc file
                        const exportText = await Promise.all(
                          messages
                            .map(async (message) => {
                              const modelName = getDisplayName(message.model)
                              const header =
                                message.role === "assistant"
                                  ? modelName + ":\n\n"
                                  : `${t("you")}:\n\n`
                              let content = message.content;
                              if (message.model === OpenAIModel.GPT_4_TURBO_VISION.model && Array.isArray(message.content)) {
                                content = await convertContentToMarkdown(message.content) + '\n\n';
                              }
                              return header + content;
                            })
                        ).then((values) => values.join("\n\n")) || "";
                        handleExportClick(exportText, "conv");
                        setExporting(false);
                      }}
                      copy={false}
                    >
                      <div className="flex items-center gap-1">
                        {exporting && <IconLoader2 className="animate-spin h-5 w-5 text-gray-900 dark:text-white mr-2" />}
                        {exporting ? t("exporting") : t("conversation")}
                      </div>
                    </Button>
                  ),
                },
                {
                  button: (
                    <Button
                      onClick={() => {
                        //Export replies to doc file
                        const exportText =
                          messages
                            .filter((message) => message.role === "assistant")
                            .map((message) => {
                              return message.content
                            })
                            .join("\n\n") || ""
                        handleExportClick(exportText, "replies")
                      }}
                      copy={false}
                    >
                      {t("replies")}
                    </Button>
                  ),
                },
              ]}
              disabled={activeTab !== "stream"}
              actionInProgress={exporting}
            />
            <div className="h-10 mx-1 border-r border-gray-300 dark:border-gray-500"></div>
            {activeTab === "stream" ? (
              <ResetChat
                onReset={() => {
                  setStreamTitle("")
                  setMessages([
                    {
                      model: OpenAIModel.GPT_4.model,
                      role: "assistant",
                      content: t("initialMessage"),
                    },
                  ])
                  setModel(OpenAIModel.GPT_4.model)
                  setChatId("")
                }}
              />
            ) : (
              <button
                className="text-sm sm:text-base font-semibold rounded-md px-3 py-2 primary-button"
                onClick={() => setReset(true)}
              >
                {t("reset")}
              </button>
            )}
            <MuiButton
              color="error"
              aria-label={t("new prompt")}
              variant="contained"
              sx={{ textTransform: "capitalize" }}
              onClick={handleNewPromptClick}
              startIcon={<Add />}
            >{t("new prompt")}</MuiButton>
          </div>
        </CardHeader>
        <CardBody
        id="scrollableDiv"
          className={`z-0 custom-scrollbar p-0  overflow-y-auto ${activeTab === "stream" ? "max-h-[60vh] md:max-h-[calc(100vh-8.8rem)]" : ""}`}
          ref={scrollRef}
        >
          {activeTab === "stream" && <Conversation />}
          {activeTab === "parallel" && (
            <div className="flex flex-col">
              <div className="pr-4">
                <FormControlLabel control={<Checkbox onClick={() => setUseListParallel(!useListParallel)} checked={useListParallel} />} label={t("populate from list")} />
                {useListParallel && <ListsAndVariables useList={useListParallel} listData={listData} setListData={setListData} />}
              </div>
              <Textbox
                processingMode="parallel"
                title={parallelTitle}
                setTitle={setParallelTitle}
                reset={reset}
                setReset={setReset}
                input={parallelContent}
                setInput={setParallelContent}
                model={parallelModel}
                listData={listData}
              />
            </div>
          )}
          {activeTab === "sequential" && (
            <div className="flex flex-col">
              <div className="pr-4">
                <FormControlLabel control={<Checkbox onClick={() => setUseListSequential(!useListSequential)} checked={useListSequential} />} label={t("populate from list")} />
                {useListSequential && <ListsAndVariables useList={useListSequential} listData={listData} setListData={setListData} />}
              </div>
              <Textbox
                processingMode="sequential"
                title={sequentialTitle}
                setTitle={setSequentialTitle}
                reset={reset}
                setReset={setReset}
                input={sequentialContent}
                setInput={setSequentialContent}
                model={sequentialModel}
                listData={listData}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
