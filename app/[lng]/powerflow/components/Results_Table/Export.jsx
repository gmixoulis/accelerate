import { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { IconFileArrowRight, IconLoader2 } from '@tabler/icons-react';
import { getThread, getDisplayName, convertContentToMarkdown } from '../../utils';
import Tabs from '../Tabs'
import Tab from '../Tab'
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import JSZip from 'jszip';
import { convertMarkdownToHtml } from '../../utils/markdownToHtml';
import { OpenAIModel } from '../../utils/constants';

const Export = ({ open, chatIds, onClose, reset }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const date = new Date();

  const [activeTab, setActiveTab] = useState('conversation');
  const [exporting, setExporting] = useState(null);


  async function getFullConversation(chat_json, model) {
    if (!chat_json) return null;

    const content = await Promise.all(chat_json.map(async (message) => {
      const header = message.role === 'assistant' ? model + ':\n\n'
        : `${t('you')}:\n\n`;
      let content = message.content;
      if (model === getDisplayName(OpenAIModel.GPT_4_TURBO_VISION.model) && Array.isArray(message.content)) {
        content = await convertContentToMarkdown(message.content) + '\n\n';
      }
      return header + content;
    })
    ).then((content) => content.join('\n\n')) || "";

    return content;
  }

  function getReplies(chat_json) {
    if (!chat_json) return null;

    const content = chat_json.filter((message) => message.role === 'assistant')
      .map((message) => {
        return message.content;
      })
      .join('\n\n') || "";

    return content;
  }


  function createTxtFile(content, contentType, id) {
    const fileContent = content;
    const file = new Blob([fileContent], { type: 'text/plain' });
    const filename = `powerflow_${contentType}_${date.toISOString().split("T")[0]}_${id}.txt`;
    const url = URL.createObjectURL(file);
    return { url, filename, file };
  };

  function createDocFile(markdownString, contentType, id) {
    const preHtml = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"> <head><meta charset="utf-8"><title>Shared Powerflow Message</title><style>body { font-family: Calibri, sans-serif; font-size: 11pt; }</style></head><body>';
    const postHtml = "</body></html>";
    const htmlString = convertMarkdownToHtml(markdownString);

    const html = preHtml + htmlString + postHtml;
    const fileContent = html;
    const file = new Blob([fileContent], { type: 'application/vnd.ms-word;charset=utf-8' });
    const filename = `powerflow_${contentType}_${date.toISOString().split("T")[0]}_${id}.doc`;
    const url = URL.createObjectURL(file);

    return { url, filename, file };
  }

  const downloadFile = (href, download) => {
    const element = document.createElement('a');
    element.href = href;
    element.download = download;
    document.body.appendChild(element);
    element.click();
  };


  async function exportToZipTxt(chatThreads) {
    const zip = new JSZip();
    let i = 0;
    for (const prompt of chatThreads) {
      if (!prompt || !prompt.chat_json) continue;

      const model = getDisplayName(prompt.model);
      const exportText = activeTab === 'conversation' ? await getFullConversation(prompt?.chat_json, model) : getReplies(prompt?.chat_json);
      if (exportText) {
        const contentType = activeTab === 'conversation' ? 'conv' : 'replies';
        const { filename, file } = createTxtFile(exportText, contentType, i);
        zip.file(filename, file);
        i++;
      }
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const href = URL.createObjectURL(content);
      const download = `powerflow_${activeTab}_${new Date().toISOString().split("T")[0]}_${new Date().getTime()}.zip`;
      downloadFile(href, download);
    });

  }

  async function exportToZipDoc(chatThreads) {
    const zip = new JSZip();
    const files = await Promise.all(chatThreads.map(async (prompt, i) => {
      if (!prompt || !prompt.chat_json) return null; // skip empty threads

      const model = getDisplayName(prompt.model);
      const exportText = activeTab === 'conversation' ? await getFullConversation(prompt?.chat_json, model) : getReplies(prompt?.chat_json);
      if (exportText) {
        const contentType = activeTab === 'conversation' ? 'conv' : 'replies';
        const { filename, file } = createDocFile(exportText, contentType, i);
        return { filename, file };
      }
      return null;
    }));

    files.filter(file => file !== null).forEach(({ filename, file }) => {
      if (filename && file) {
        zip.file(filename, file);
      }
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const href = URL.createObjectURL(content);
      const download = `powerflow_${activeTab}_${new Date().toISOString().split("T")[0]}_${new Date().getTime()}.zip`;
      downloadFile(href, download);
    });
  }


  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="export-dialog-title"
      aria-describedby="export-dialog-description"
      PaperProps={{ className: "!bg-white dark:!bg-darkslategray-100" }}
      maxWidth="xs"
      fullWidth={true}
    >
      <DialogTitle id="export-dialog-title">
        <Box display="flex" alignItems="center">
          <IconFileArrowRight className='text-blue-600 dark:text-blue-600' />
          <Box ml={1} className='text-gray-800 dark:text-white font-medium'>{`${t("export")}`}</Box>
        </Box>
      </DialogTitle>
      <DialogContent className='flex flex-col items-center'>
        <Tabs>
          <Tab label={t("conversation")} onClick={() => setActiveTab('conversation')} active={activeTab === 'conversation'} />
          <Tab label={t("replies")} onClick={() => setActiveTab('replies')} active={activeTab === 'replies'} />
        </Tabs>
        <div className="flex flex-col mt-4 gap-3">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 dark:bg-blue-700 hover:dark:bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
            onClick={async () => {
              try {
                setExporting("doc");
                const chatThreads = await Promise.all(chatIds.map(chatId => getThread(chatId)));
                if (chatIds.length > 1) {
                  await exportToZipDoc(chatThreads);
                } else {
                  const exportPromises = chatThreads.map(async (prompt) => {
                    if (activeTab === 'conversation') {
                      const model = getDisplayName(prompt.model);
                      const exportText = await getFullConversation(prompt?.chat_json, model);
                      if (exportText) {
                        const { url, filename } = createDocFile(exportText, 'conv', date.getTime());
                        downloadFile(url, filename);
                      }
                    } else {
                      const exportText = getReplies(prompt?.chat_json);
                      if (exportText) {
                        const { url, filename } = createDocFile(exportText, 'replies', date.getTime());
                        downloadFile(url, filename);
                      }
                    }
                  });
                  await Promise.all(exportPromises);
                }
              } catch (e) {
                console.log(e);
              } finally {
                reset();
                setExporting(null);
                onClose();
              }

            }}
          >
            {exporting === "doc" ? <IconLoader2 className="animate-spin h-5 w-5 text-white" /> : "Word Document (.doc)"}
          </button>
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 dark:bg-blue-700 hover:dark:bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
            onClick={async () => {
              try {
                setExporting("txt");
                const chatThreads = await Promise.all(chatIds.map(chatId => getThread(chatId)));
                if (chatIds.length > 1) {
                  await exportToZipTxt(chatThreads);
                } else {
                  const exportPromises = chatThreads.map(async (prompt) => {
                    if (activeTab === 'conversation') {
                      const model = getDisplayName(prompt.model);
                      const exportText = await getFullConversation(prompt?.chat_json, model);
                      if (exportText) {
                        const { url, filename } = createTxtFile(exportText, 'conv', date.getTime());
                        downloadFile(url, filename);
                      }
                    } else {
                      const exportText = getReplies(prompt?.chat_json);
                      if (exportText) {
                        const { url, filename } = createTxtFile(exportText, 'replies', date.getTime());
                        downloadFile(url, filename);
                      }
                    }
                  });
                  await Promise.all(exportPromises);
                }
              } catch (e) {
                console.log(e);
              } finally {
                reset();
                setExporting(null);
                onClose();
              }
            }}
          >
            {exporting === "txt" ? <IconLoader2 className="animate-spin h-5 w-5 text-white" /> : "Text File (.txt)"}
          </button>
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <Button
          onClick={onClose}
          variant='outlined'
          className='!font-medium !text-md !border-gray-600 dark:!border-gray-300 !text-gray-600'
          sx={{ textTransform: "capitalize" }}
        >
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default Export
