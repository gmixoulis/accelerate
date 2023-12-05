import { createContext, useContext, useState, useMemo } from "react";
import { OpenAIModel } from "../utils/constants";
import { useEffect } from "react";

const StreamContext = createContext({});

export const useStream = () => {
  return useContext(StreamContext);
};


export const StreamProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "",
      model: OpenAIModel.GPT_4.model,
    }
  ]); // Set the default messages
  const [model, setModel] = useState(OpenAIModel.GPT_4.model); // Set the default model
  const [chatId, setChatId] = useState("");
  const [streamTitle, setStreamTitle] = useState("");
  const [activeTab, setActiveTab] = useState("stream");
  const [shouldUpdate, setShouldUpdate] = useState(false);

  useEffect(() => {
    const editStream =  async () => {
      let content;
      if (model === OpenAIModel.GPT_4_TURBO_VISION.model) {
        content = messages[1].content[0].text;
      } else {
        content = messages[1].content;
      }
      const promptTitle = streamTitle.trim() === "" ? content.substring(0, 201) : streamTitle.substring(0, 201);
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
      }

      setShouldUpdate(false);
    }

    if (shouldUpdate) {
      editStream();
    }
  }, [shouldUpdate, messages, model, chatId, streamTitle])



  
  
  const value = useMemo(() => ({
    messages,
    setMessages,
    model,
    setModel,
    chatId,
    setChatId,
    streamTitle,
    setStreamTitle,
    activeTab,
    setActiveTab,
    setShouldUpdate,
    shouldUpdate,
  }), [messages, model, chatId, streamTitle, activeTab, shouldUpdate]);




  return (
    <StreamContext.Provider value={value}>
      {children}
    </StreamContext.Provider>
  );
};