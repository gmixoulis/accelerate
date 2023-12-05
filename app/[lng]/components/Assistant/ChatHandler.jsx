"use client"
import {useRef, useState } from "react";
import { Chat } from "./Chat/Chat";
import Alert from "./Alert";
import { tokenHandler } from "@/app/[lng]/powerflow/utils";
import { useAssistant } from "@/context/AssistantContext";

const ChatHandler = ({isBottomDrawer}) => {
    const {
      messages, 
      model,
      setMessages,
      } = useAssistant();
    const [loading, setLoading] = useState(false);
    const [incomingResponse, setIncomingResonse] = useState(false);
    const [alert, setAlert] = useState({title: "", message: "", show: false});

    const stopResponseRef = useRef(false);  
    const messagesEndRef = useRef(null);

   
    const handleSend = async (message) => {
      const updatedMessages = [...messages, message];
      stopResponseRef.current = false;

      setMessages(updatedMessages);
      setLoading(true);
      
         
      let outputList = await tokenHandler(updatedMessages, model);

      
      try {

         const response = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            fullMessages: updatedMessages,
            messages: outputList,
            model: model,
          })
        }) 
        
  
      if (!response.ok) {
        setLoading(false);
        const body = await response.json();
        console.log(body)
        console.log("error: ", body.error)
        throw new Error(body.error.message, {cause: body.error});
      }
  
      const data = response.body;

      if (!data) {
        return;
      }
  
      setLoading(false);

      const reader = data.getReader();
      const decoder = new TextDecoder();
      let isFirst = true;
      let done = false;

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
                model: model,
              }
            ]);
          } else {
            setMessages((prevMessages) => {
              const lastMessage = prevMessages[prevMessages.length - 1];
              const updatedMessage = {
                ...lastMessage,
                content: lastMessage.content + chunkValue,
                model: model
              };
              return [...prevMessages.slice(0, -1), updatedMessage];
            }); 
          }
          setIncomingResonse(!done && !stopResponseRef.current);
      }
    } catch (e) {
      if (e.cause) {
        const title = e.cause.type ? `${e.cause.type}: ${e.cause.code}` : e.cause.title;
        setAlert({title: title, message: e.message, show: true});
        console.log(e);
      } else {
      setAlert({title: "Network Error", message: `Failed to send message to API. ${e.message}`, show: true});
      console.log(e);
      }
  };   
};


    const handleStop = () => {
      setLoading(false);
      setIncomingResonse(false);
      stopResponseRef.current = true;
    };
    
    return (
        <>
            <div className="flex-1 px-4">
              <Chat
                messages={messages || []}
                loading={loading}
                onSend={handleSend}
                onStop={handleStop}
                disabled={incomingResponse}
                isBottomDrawer={isBottomDrawer}
              />
            <div ref={messagesEndRef} />
            <Alert alert={alert} setAlert={setAlert} />
          </div>
        </>
      );
};

export default ChatHandler;