import { useState, useEffect, useRef } from "react";
import autosize from "autosize";
import { OpenAIModel, getMaxTokens } from "../../utils/constants";
import { useStream } from "../../context/StreamContext";
import { fetchTokens, getChatId } from "../../utils";
import { UseTranslation } from "@/app/i18n/client";
import { useParams, useSearchParams } from "next/navigation";
import { AlertOverlay } from "../Overlay";
import { Button, IconButton, Popover, TextField, Typography } from "@mui/material";
import { styled } from '@mui/material/styles';
import { AttachFile, Send, Image } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { OpenInBrowser } from "@mui/icons-material";
import { getFileTypes } from "@/app/[lng]/myfiles/services/MyFilesService";
import { handleFileUpload } from "../../utils/fileServices";
import { validateUrl } from "../../utils/actions";


export const ChatInput = ({
  content,
  setContent,
  onSend,
  disabled,
  selectedFiles,
  setSelectedFiles }) => {
  const { lng } = useParams();
  const { t } = UseTranslation(lng, "powerflow");
  const { model, chatId, setChatId, streamTitle, messages } = useStream();
  const [alert, setAlert] = useState({ message: "", show: false });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileTypes, setFileTypes] = useState([]);
  const [invalidUrl, setInvalidUrl] = useState(null);

  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get("redirectedFrom");
  const isNotMobile = window.innerWidth > 768;

  const tempChatIdRef = useRef(null);

  const fetchFileTypes = async (setFileTypes) => {
    const fileTypes = await getFileTypes()
    setFileTypes(fileTypes.data)
  }

  useEffect(() => {
    fetchFileTypes(setFileTypes)
  }, [])

  useEffect(() => {
    if (redirectedFrom) {
      const redirectedFromContent = localStorage.getItem(redirectedFrom);
      if (redirectedFromContent) {
        setContent(redirectedFromContent);
        localStorage.removeItem(redirectedFrom);
      }
    }
  }, [redirectedFrom, setContent]);

  const textareaRef = useRef(chatId);

  const maxTokensReached = async () => {
    const tokensInInput = await fetchTokens(model, content);
    return tokensInInput > getMaxTokens(model);
  }

  const handleChange = (e) => setContent(e.target.value);

  const handleSend = async () => {
    if (disabled) {
      return;
    }

    if (!content.trim()) {
      setAlert({ message: `${t("emptyChatInput.title")}. ${t("emptyChatInput.message")}`, show: true });
      return;
    }

    if (await maxTokensReached()) {
      setAlert({ message: `${t("tokenLimit.title")}. ${t("tokenLimit.message")}`, show: true });
      return;
    }

    if (selectedFiles.some(file => file.status === 'uploading')) {
      setAlert({ message: `${t("file upload in progress")}`, show: true });
      return;
    }

    if (model === OpenAIModel.GPT_4_TURBO_VISION.model) {
      onSend({
        role: "user",
        content: [
          {
            type: "text",
            text: content
          },
          ...selectedFiles.map(file => {
            if (file.type === 'file') {
              return {
                type: 'image_url',
                image_url: { url: file.url },
                id: file.fileId,
                file_type: file.file.type,
              }
            } else {
              return {
                type: 'image_url',
                image_url: { url: file.url }
              }
            }
          }
          )

        ],
        model: model
      });
    } else {
      onSend({ role: "user", content: content, model: model });
    }
    setContent("");
    setSelectedFiles([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && isNotMobile) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef?.current) {
      autosize(textareaRef.current);
    }
  }, []);

  useEffect(() => {
    if (textareaRef?.current) {
      //change height to fit content
      autosize.update(textareaRef.current);
    }
  }, [content]);

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files).map(file => ({ file, type: 'file', url: '', status: 'uploading' }));
    const maxSize = 20 * 1024 * 1024; // 20MB

    const invalidFiles = files.filter(file => file.file.size > maxSize);
    if (invalidFiles.length > 0) {
      const fileNames = invalidFiles.map((file, index) => <li key={index}>{file.file.name}</li>);
      setAlert({
        message: (
          <div>
            <p>{t("fileSizeLimit.title")}</p>
            <br />
            <ul className="list-disc ml-6">{fileNames}</ul>
            <br />
            <p>{t("fileSizeLimit.message")}</p>
          </div>
        ),
        show: true
      });
    }

    const validFiles = files.filter(file => file.file.size <= maxSize);

    if (validFiles.length > 0 && !tempChatIdRef.current) {
      //generate chat id
      const promptTitle = streamTitle.trim() === "" ? messages[0].content.substring(0, 201) : streamTitle.substring(0, 201);
      await getChatId(model, promptTitle).then((chatId) => {
        setChatId(chatId);
        tempChatIdRef.current = chatId;
      }).catch((error) => {
        console.log(error);
        setAlert({ message: `${t("chatIdFailed.title")}. ${t("chatIdFailed.message")}`, show: true });
      });
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...validFiles]);

    const updatedFiles = await Promise.all(validFiles.map(async (newFile) => {
      if (tempChatIdRef.current) {
        const result = await handleFileUpload(newFile.file, fileTypes, tempChatIdRef.current);
        if (result !== null) {
          const { FileID, PrivateUrl } = result;
          return { ...newFile, fileId: FileID, url: PrivateUrl, status: 'uploaded' };
        } else {
          // Handle the case where handleFileUpload returns null
          return { ...newFile, status: 'failed' };
        }
      }
      return newFile;
    }));

    const anyFailed = updatedFiles.some(file => file.status === 'failed');
    if (anyFailed) {
      const fileNames = updatedFiles.filter(file => file.status === 'failed').map((file, index) => <li key={index}>{file.file.name}</li>);
      setAlert({
        message: (
          <div>
            <p>{t("file upload failed")}</p>
            <br />
            <ul className="list-disc ml-6">{fileNames}</ul>
            <br />
          </div>
        ),
        show: true
      });
    }

    setSelectedFiles(prevFiles => [...prevFiles.filter(file => file.status === 'uploaded' || file.type === 'url'), ...updatedFiles.filter(file => file.status === 'uploaded')]);
  };


  const handleUrlChange = async (url) => {
    const URL_REGEX = /^https?:\/\/\S+\.(jpeg|jpg|gif|png)$/;
    setLoading(true);
      if (URL_REGEX.test(url)) {
        if (!await validateUrl(url)) {
          setInvalidUrl(t("fetch url error"));
        } else {
          setSelectedFiles(prevFiles => [...prevFiles, { type: 'url', url }]);
          handleClose();
        }
      } else {
        setInvalidUrl(t("invalid url error"));
      }
      setLoading(false);
  };

  const handleImageUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleAddClick = () => {
    handleUrlChange(imageUrl);
    setImageUrl("");
  };


  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setInvalidUrl(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  return (
    <>
      <div className="relative">
        <textarea
          name="stream-input"
          ref={textareaRef}
          className="max-h-40 md:max-h-64 rounded-lg p-3 pb-14 md:pb-3 md:pr-24 w-full custom-box overflow-y-auto custom-scrollbar"
          placeholder={t("placeholders.stream")}
          value={content}
          style={{ resize: "none" }}
          rows={isNotMobile ? 1 : 2}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div className='absolute bottom-3 md:bottom-1 right-0 flex justify-end gap-2 items-center'>
          {
            model === OpenAIModel.GPT_4_TURBO_VISION.model && (
              <>
                <IconButton aria-describedby={id} onClick={handleClick}>
                  <AttachFile />
                </IconButton>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  slotProps={{ paper: { className: "bg-white dark:bg-darkslategray-100 p-2" } }}
                  sx={{marginRight: "2rem"}}
                >
                  <TextField
                    id="standard-basic"
                    label="Image URL"
                    size="small"
                    value={imageUrl}
                    onChange={handleImageUrlChange}
                    error={invalidUrl ? true : false}
                    helperText={invalidUrl ? invalidUrl : ""}
                    sx={{
                      ".dark & .MuiFormHelperText-root.Mui-error": {
                        backgroundColor: "grey.300",
                        padding: "8px",
                        borderRadius: "0.75rem",
                        color: "red !important",
                      } 
                    }}
                  />
                  <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<OpenInBrowser />}
                    variant="outlined"
                    className="mt-0.5"
                    type="button"
                    onClick={handleAddClick}
                    >
                    {t("add")}
                  </LoadingButton>
                </Popover>
                
                <IconButton aria-label="upload-photo" component="label">
                  <VisuallyHiddenInput type="file" accept=".png, .jpg, .jpeg, .webp, .gif" multiple onChange={handleFileChange} />
                  <Image />
                </IconButton>
              </>
            )
          }
          <IconButton aria-label="send" onClick={() => handleSend()}>
            <Send />
          </IconButton>
        </div>
      </div>
      <AlertOverlay type="warning" message={alert.message} isOpen={alert.show} setIsOpen={(show) => setAlert({ ...alert, show })} />
    </>
  );
};