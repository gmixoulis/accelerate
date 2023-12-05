"use client"
import { convertContentToMarkdown, getDisplayName, handleCopyClick, handleExportClick } from "../../utils"
import CustomDropdown from "../CustomDropdown";
import Button from "../Button";
import { useState, useEffect } from "react";
import StreamButton from "./StreamButton";
import { UseTranslation } from "@/app/i18n/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button as MuiButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { OpenAIModel } from "../../utils/constants";
import { Tooltip } from "@material-tailwind/react";
import { IconLoader2 } from "@tabler/icons-react";

const Header = ({ prompt, isPromptOwner }) => {
  const { lng } = useParams();
  const router = useRouter();
  const { t } = UseTranslation(lng, "powerflow");

  const [copyConversation, setCopyConversation] = useState(false);
  const [copyReplies, setCopyReplies] = useState(false);
  const [copyLink, setCopyLink] = useState(false);

  const [copying, setCopying] = useState(false);
  const [exporting, setExporting] = useState(false);

  const modelName = getDisplayName(prompt.model);

  useEffect(() => {
    if (copyLink) {
      setTimeout(() => {
        setCopyLink(false);
      }, 2000);
    }

  }, [copyLink]);

  //router.refresh() every 10 seconds
  useEffect(() => {
    if ((prompt.status === "in progress" || prompt.status === "in queue")) {
      const interval = setInterval(() => {
        router.refresh();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [prompt.status, router]);


  return (
    <div className="flex flex-wrap gap-6 mb-4 ml-2 items-center">
      {/* <Link href={`/${lng}/powerflow/my-results`} as={`/${lng}/powerflow/my-results`} className="dark:text-white ml-1">
            <div className="flex gap-1 items-center hover:border-b-2 hover:border-b-gray-500 dark:hover:border-b-gray-200 cursor-pointer">
            <ChevronLeftIcon className="h-5 w-5"/>
            <span>{t("Back")}</span>
            </div>
        </Link> */}
      <MuiButton
        color="error"
        aria-label="Back"
        variant="contained"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.replace(`/${lng}/powerflow/my-results`)}
        className="back-button"
        lang={lng}
      >
        {t("back")}
      </MuiButton>
      <StreamButton prompt={prompt} isPromptOwner={isPromptOwner}/>
      <CustomDropdown title={t("copy")} menuItems={[
        {
          button:
            <Button onClick={async () => {
              setCopyConversation(true);
              const copyText = await Promise.all(prompt.chat_json
                .map(async (message) => {
                  const header = message.role === 'assistant' ? modelName + ':\n\n'
                    : `${t("you")}:\n\n`
                  let content = message.content;
                  if (prompt.model === OpenAIModel.GPT_4_TURBO_VISION.model && Array.isArray(message.content)) {
                    content = await convertContentToMarkdown(message.content) + '\n\n';
                  }
                  return header + content;
                })
              ).then((content) => content.join('\n\n')) || "";
              
              handleCopyClick({ model: prompt.model, content: copyText});
              setCopyConversation(false);
            }} copy={copyConversation}>
              <div className="flex items-center gap-1">
                {copyConversation && <IconLoader2 className="animate-spin h-5 w-5 text-gray-900 dark:text-white mr-2" />}
                {copyConversation ? t("copying") : t("conversation")}
              </div>
            </Button>
        },
        {
          button:
            <Button onClick={() => {
              setCopyReplies(true);
              const copyText = prompt?.chat_json.filter((message) => message.role === 'assistant')
                .map((message) => {
                  return message.content;
                })
                .join('\n\n') || "";
              handleCopyClick({ model: prompt.model, content: copyText});
              setCopyReplies(false);
            }} copy={copyReplies}>
              <div className="flex items-center gap-1">
                {copyReplies && <IconLoader2 className="animate-spin h-5 w-5 text-gray-900 dark:text-white mr-2" />}
                {copyReplies ? t("copying") : t("replies")}
              </div>
            </Button>
        },
      ]}
      actionInProgress={copyConversation}
      />
      <CustomDropdown
        title={t("export")}
        menuItems={[
          {
            button:
              <Button onClick={async () => {
                setExporting(true);
                const exportText = await Promise.all(prompt?.chat_json
                  .map(async (message) => {
                    const header = message.role === 'assistant' ? modelName + ':\n\n'
                      : `${t("you")}:\n\n`

                    let content = message.content;
                    if (prompt.model === OpenAIModel.GPT_4_TURBO_VISION.model && Array.isArray(message.content)) {
                      content = await convertContentToMarkdown(message.content) + '\n\n';
                    }
                    return header + content;
                  })
                ).then((content) => content.join('\n\n')) || "";
                handleExportClick(exportText, "conv");
                setExporting(false);
              }} copy={false}>
                <div className="flex items-center gap-1">
                  {exporting && <IconLoader2 className="animate-spin h-5 w-5 text-gray-900 dark:text-white mr-2" />}
                  {exporting ? t("exporting") : t("conversation")}
                </div>
              </Button>
          },
          {
            button:
              <Button onClick={() => {
                const exportText = prompt?.chat_json.filter((message) => message.role === 'assistant')
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
        actionInProgress={exporting}
      />
      <Tooltip 
      content={t("copy link description")}
      placement="bottom-start"
      className="sm:max-w-4xl bg-white shadow-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200 border border-gray-500 dark:border-gray-600 z-30 rounded-md p-1.5">
      <MuiButton 
      variant="outlined"
      sx={{textTransform: "capitalize", minWidth: lng === "en" ? 110 : 190}}
      onClick={() => {
        //Copy url to clipboard
        navigator.clipboard.writeText(window.location.href);
        setCopyLink(true);
      }}
      className='!font-light !text-md !border-gray-600 dark:!border-gray-300 !text-gray-600'
      >
        {copyLink ? t("copied") : t("copy link")}
      </MuiButton>
      </Tooltip>
    </div>
  )
}

export default Header;