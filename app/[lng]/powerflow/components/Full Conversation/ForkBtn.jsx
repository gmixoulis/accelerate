"use client"
import { UseTranslation } from "@/app/i18n/client";
import { useParams, useRouter } from "next/navigation";
import { IconArrowFork } from "@tabler/icons-react";
import { useStream } from "../../context/StreamContext";
import { useBatch } from "../../context/BatchContext";
import {
  Tooltip,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { fetchTokens, getChatId, getDisplayName } from "../../utils";
import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { OpenAIModel, getMaxTokens } from "../../utils/constants";
import { IconLoader2 } from "@tabler/icons-react";
import { AlertOverlay } from "../Overlay";
import { getFileTypes } from "@/app/[lng]/myfiles/services/MyFilesService";
import { getDownloadUrl, getFileName, handleFileUpload } from "../../utils/fileServices";
import axios from "axios";

const ForkBtn = ({ prompt, index }) => {
  const router = useRouter();
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const [loading, setLoading] = useState(false);

  const {
    setMessages,
    setChatId,
    setStreamTitle,
    setModel,
    setActiveTab,
  } = useStream();

  const {
    setParallelContent,
    setParallelModel,
    setSequentialContent,
    setSequentialModel,
    setParallelTitle,
    setSequentialTitle,
  } = useBatch();


  const [alert, setAlert] = useState({ message: "", show: false });

  const modelName = getDisplayName(prompt.model);

  const createForkedMessages = (index) => {
    const messages = prompt.chat_json.slice(0, index + 1);
    const messagesWithModel = messages.map((message) => {
      return {
        ...message,
        model: prompt.model,
      };
    });

    return messagesWithModel;
  };

  const generateNewFile = async (content, chatId) => {
    try {
      const response = await getFileTypes();
      const fileTypes = response.data;

      const downloadUrl = await getDownloadUrl(content.id);
      const fileName = await getFileName(content.id);

      const fileBufferResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
      const fileBuffer = fileBufferResponse.data;
      const file = new File([fileBuffer], fileName, { type: content.file_type });

      const result = await handleFileUpload(file, fileTypes, chatId);
      if (result) {
        return result;
      } else {
        const error = new Error("file upload failed");
        error.fileName = fileName;
        throw error;
      }

    } catch (error) {
      console.log(error);
      if (error.message === "file upload failed") {
        throw error;
      }
    }
  }

  const forkStream = async (index) => {
    setLoading(true);
    const title = `${prompt.title} - Fork`;

    let newChatId;
    try {
      newChatId = await getChatId(prompt.model, title);


      //Set context values
      let updatedMessages = createForkedMessages(index);

      if (prompt.model === OpenAIModel.GPT_4_TURBO_VISION.model) {
        updatedMessages = await Promise.all(updatedMessages.map(async (message) => {
          if (Array.isArray(message.content)) {
            const content = message.content.map(async (content) => {
              if (content.id) {
                const { FileID, PrivateUrl } = await generateNewFile(content, newChatId);
                return {
                  ...content,
                  id: FileID,
                  image_url: {
                    url: PrivateUrl
                  }
                }
              }
              return content;
            })
            return {
              ...message,
              content: await Promise.all(content)
            }
          }
          return message;
        }))
        console.log(updatedMessages);
      }

      setMessages(updatedMessages);
      setChatId(newChatId);
      setStreamTitle(title);
      setModel(prompt.model);
      setActiveTab("stream");

      //Save chat body
      const requestBody = { chatId: newChatId, title: title, model: prompt.model, messages: updatedMessages }
      const response = await fetch("/api/powerflow/update-thread", {
        method: "POST",
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log(data);
      setLoading(false);

      //set scroll to bottom
      const scrollPositions = JSON.parse(localStorage.getItem("scrollPositions")) || {};
      scrollPositions.stream = Number.MAX_SAFE_INTEGER;
      localStorage.setItem("scrollPositions", JSON.stringify(scrollPositions));
      localStorage.setItem("forked", "true");

      router.push(`/${lng}/powerflow`);
    } catch (error) {
      console.log(error);
      if (error.message === "file upload failed") {
        setAlert({ message: `${t("file upload failed")} ${error.fileName}`, show: true });
      } else {
        setAlert({ message: `${t("chatIdFailed.title")}. ${t("chatIdFailed.message")}`, show: true });
      }
    }
  };

  const forkParallel = async (index) => {
    setLoading(true);
    const title = `${prompt.title}_${t("fork").toLocaleLowerCase()}_${t("parallel").toLocaleLowerCase()}`;
    const updatedMessages = createForkedMessages(index);
    const content = updatedMessages.map((message) => {
      if (message.role === "user") {
        return `${t("you")}: ${message.content}`
      } else {
        return `${modelName}: ${message.content}`
      }
    }).join(" ");


    const firstPrompt = await fetchTokens(prompt.model, content);
    if (firstPrompt > getMaxTokens(prompt.model) - 800) {
      setAlert({ message: `${t("tokenLimit.title")}. ${t("firstPrompt")}`, show: true });
      setLoading(false);
      return;
    }

    setParallelContent(content + " ||");
    setParallelModel(prompt.model);
    setParallelTitle(title);
    setActiveTab("parallel");
    setLoading(false);
    router.push(`/${lng}/powerflow`);
  };

  const forkSequential = async (index) => {
    setLoading(true);
    const title = `${prompt.title}_${t("fork").toLocaleLowerCase()}_${t("sequential").toLocaleLowerCase()}`;
    const updatedMessages = createForkedMessages(index);
    const content = updatedMessages.map((message) => {
      if (message.role === "user") {
        return `${t("you")}: ${message.content}`
      } else {
        return `${modelName}: ${message.content}`
      }
    }).join(" ");

    const firstPrompt = await fetchTokens(prompt.model, content);
    if (firstPrompt > getMaxTokens(prompt.model) - 800) {
      setAlert({ message: `${t("tokenLimit.title")}. ${t("firstPrompt")}`, show: true });
      setLoading(false);
      return;
    }

    setSequentialContent(content + " ||");
    setSequentialModel(prompt.model);
    setSequentialTitle(title);
    setActiveTab("sequential");
    setLoading(false);
    router.push(`/${lng}/powerflow`);
  };

  if (loading) {
    return (
      <IconLoader2 className="animate-spin text-black-700 dark:text-gray-400" size={16} />
    );
  }



  return (
    <>
      {/**Fork menu */}
      <Menu placement="bottom-end">
        <Tooltip
          content={t("fork")}
          placement="bottom-start" className="sm:max-w-4xl bg-white shadow-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200 border border-gray-500 dark:border-gray-600 z-30 rounded-md p-1.5">
          <MenuHandler>
            <Button ripple={false} variant="text" className="p-1 text-black-700 hover:text-unicred-300 dark:text-gray-400 dark:hover:text-white hover:bg-transparent active:bg-transparent"
            >
              <IconArrowFork size={18} />
            </Button>
          </MenuHandler>
        </Tooltip>
        <MenuList className="bg-white dark:bg-gray-700 shadow text-sm text-gray-700 dark:text-gray-200 border-none px-0">
          <MenuItem
            className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
                      block px-4 py-2 rounded-none text-start"
            onClick={async () => await forkStream(index)}
          >
            {t("stream")}
          </MenuItem>
          {prompt.model !== OpenAIModel.GPT_4_TURBO_VISION.model && (
            <>
              <MenuItem
                className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
                          block px-4 py-2 rounded-none text-start"
                onClick={async () => await forkParallel(index)}
              >
                {t("parallel")}
              </MenuItem>
              <MenuItem
                className="hover:bg-gray-100 hover:text-gray-900 hover:dark:bg-gray-600 hover:dark:text-white
                          block px-4 py-2 rounded-none text-start"
                onClick={async () => await forkSequential(index)}
              >
                {t("sequential")}
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>
      <AlertOverlay type="danger" message={alert.message} isOpen={alert.show} setIsOpen={(show) => setAlert({ ...alert, show })} />
    </>
  )
}

export default ForkBtn;