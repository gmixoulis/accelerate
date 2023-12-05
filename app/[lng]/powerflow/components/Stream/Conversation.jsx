import {useRef, useState, useEffect } from "react";
import { Chat } from "../Chat/Chat";
import { useStream } from "../../context/StreamContext";
import { fetchTokens, getChatId, tokenHandler } from "../../utils";
import { UseTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";
import { AlertOverlay } from "../Overlay";
import { OpenAIModel, getMaxTokens } from "../../utils/constants";

const Conversation = () => {

    const { lng } = useParams();
    const { t } = UseTranslation(lng, "powerflow");

    const { 
      messages, 
      setMessages,
      model,
      chatId,
      setChatId,
      streamTitle,
      setShouldUpdate
     } = useStream();

    const [loading, setLoading] = useState(false);
    const [incomingResponse, setIncomingResponse] = useState(false);
    const [alert, setAlert] = useState({message: "", show: false});
    const [failedMessage, setFailedMessage] = useState(null);

    const stopResponseRef = useRef(false);  
    const messagesEndRef = useRef(null);
    const tempChatIdRef = useRef(null);

    useEffect(() => {
      tempChatIdRef.current = chatId;
    }, [chatId])

    const handleSend = async (message, retryCount = 0) => {
      let updatedMessages = [...messages, message];
      stopResponseRef.current = false;
      setFailedMessage(null);

      setMessages(updatedMessages);
      setLoading(true);
      let content;
      if (model === OpenAIModel.GPT_4_TURBO_VISION.model) {
        content = updatedMessages[1].content[0].text;
      } else {
        content = updatedMessages[1].content;
      }
      const promptTitle = streamTitle.trim() === "" ? content.substring(0, 201) : streamTitle.substring(0, 201);
      let tempChatId;

      if (updatedMessages.length === 2 && !tempChatIdRef.current) {
        try {
          tempChatId = await getChatId(model, promptTitle);
          setChatId(tempChatId);
          tempChatIdRef.current = tempChatId;
        } catch (error) {
          setAlert({message: `${t("chatIdFailed.title")}. ${t("chatIdFailed.message")}`, show: true});
        }
      }
      
         
      const outputList = await tokenHandler(updatedMessages, model);

      
      try {
         let promptTokens = 0;
         let endpoint = "stream";
         if (model === OpenAIModel.GPT_3_INSTRUCT.model) {
          promptTokens = await fetchTokens(model, outputList[outputList.length - 1].content);
          } else if (model === OpenAIModel.GPT_4_TURBO_VISION.model) {
            endpoint = "stream-vision";
          }
         let response;
         response = await fetch(`/api/powerflow/${endpoint}`, {
          method: "POST",
          body: JSON.stringify({
            messages: outputList,
            model: model,
            max_tokens: getMaxTokens(model) - 100 - promptTokens 
          })
        }) 
        

      if (!response.ok) {
        const body = await response.json(); 
        const error = body.error;
        console.log("error: ", error);

        if (error.code === "rate_limit_exceeded") {
          //try again            
          setLoading(true);
          if (retryCount < 3) { 
              if (model === OpenAIModel.GPT_4_TURBO.model || model === OpenAIModel.GPT_4_TURBO_VISION.model) {
                error.code = "rate_limit_exceeded_turbo";
                throw error;
              } else {
                console.log(`retrying... ${retryCount + 1}`);
              setTimeout(() => {
                setLoading(true);
                 //remove last message 
                updatedMessages = updatedMessages.slice(0, -1);
                setMessages(updatedMessages);
                return handleSend(message, retryCount + 1);
              }, 250);
            }
          }  else {
            setLoading(false);
            setShouldUpdate(true);
            setFailedMessage(message);
            throw {code: "rate_limit_exceeded"}        
          }
        } else {        
        throw error;
        }
      } else {
  
      const data = response.body;

      const responseModel = response.headers.get("model");

      if (!data) {
        return;
      }

      setLoading(false);

      let reader;
      const decoder = new TextDecoder();
      let isFirst = true;
      let done = false;
      try {
      if (!data.locked) {
          reader = data.getReader();
          while (!done && !stopResponseRef.current) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            
            if (isFirst) {
              isFirst = false;
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  role: "assistant",
                  content: chunkValue,
                  model: responseModel || model,
                }
              ]);
            } else {
              setMessages((prevMessages) => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                const updatedMessage = {
                  ...lastMessage,
                  content: lastMessage.content + chunkValue,
                  model: responseModel || model, // If responseModel is not available, use current model value
                };
                return [...prevMessages.slice(0, -1), updatedMessage];
              }); 
            }
            setIncomingResponse(!done && !stopResponseRef.current);
        }
      }

      if (done || stopResponseRef.current) {
        setShouldUpdate(true);
      }

      } catch (e) {
        console.log("stream catch error: ", e.message);
      } finally {
        reader && reader.releaseLock();
      }
    }
      
    } catch (e) {
      setLoading(false);
      setShouldUpdate(true);
      console.log("error: ", e.message);
      console.log(e); 
      let message;
      if (e.code === "context_length_exceeded") {
        message = t("contextLengthExceeded");
      } else if (e.code === "rate_limit_exceeded") {
        message = t("rateLimitExceeded");
      } else if (e.code === "rate_limit_exceeded_turbo") {
        message = t("rateLimitExceededTurbo");
        if (e.message.includes("try again")) {
          message += ` ${t("try again")}`;
        } 
      }
      setAlert({message: `${t("chatResponseFailed")}. ${message !== undefined ? message : ""}`, show: true});
  };   
};


    const handleStop = () => {
      setLoading(false);
      setIncomingResponse(false);
      stopResponseRef.current = true;
    };
    
    return (
        <>
            <div className="flex-1">
              <Chat
                loading={loading}
                onSend={handleSend}
                onStop={handleStop}
                disabled={incomingResponse}
                failedMessage={failedMessage}
              />
            <div ref={messagesEndRef} />
            <AlertOverlay type="danger" message={alert.message} isOpen={alert.show} setIsOpen={(show) => setAlert({...alert, show})} />
            {/* {showCountdown && <div className="absolute bottom-0 right-0 z-10 flex flex-col gap-6 items-center bg-white dark:bg-darkslategray-100 shadow-lg p-4 rounded-md text-gray-800 dark:text-gray-200">
                <div><CircularWithValueLabel /></div>
                <p>{t("chatResponseRetry")}</p>
                <button className="border rounded-md p-2 border-gray-600 dark:border-gray-300 hover:opacity-50 shadow" onClick={() => {
                  setRetry(false);
                  setShowCountdown(false)}}
                >{t("cancel")}</button>
            </div>} */}


          </div>
        </>
      );
};

export default Conversation;