import { createContext, useContext, useState } from "react";
import { OpenAIModel } from "@/app/[lng]/powerflow/utils/constants";

const AssistantContext = createContext({});

export const useAssistant = () => {
  return useContext(AssistantContext);
};


export const AssistantProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi there! I'm Powerflow Assistant, an AI assistant. I can help you with things like answering questions, providing information, and helping with tasks. How can I help you?`,
      model: OpenAIModel.GPT_4.model,
    }
  ]); // Set the default messages
  const [model, setModel] = useState(OpenAIModel.GPT_4.model); // Set the default model
  const [scrollPosition, setScrollPosition] = useState(0); // Set the default scroll position

  const value = {
    messages,
    setMessages,
    model,
    setModel,
    scrollPosition,
    setScrollPosition,
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
};