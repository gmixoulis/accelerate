import { useState, useEffect, useRef } from "react";
import autosize from "autosize"; 
import { getMaxTokens } from "@/app/[lng]/powerflow/utils/constants";
import { fetchTokens } from "@/app/[lng]/powerflow/utils";
import Alert from "../Alert";
import { useAssistant } from '@/context/AssistantContext';
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import SpeechToText from "@/app/[lng]/powerflow/components/SpeechToText";

export const ChatInput = ({ content, setContent, onSend, disabled }) => {
  const { model } = useAssistant();
  const [alert, setAlert] = useState({title: "", message: "", show: false});
  const [listening, setListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [transcript, setTranscript] = useState("");

  const textareaRef = useRef(null);

  const maxTokensReached = async () => {
    const tokensInInput = await fetchTokens(model, content);
    return  tokensInInput > getMaxTokens(model) * 0.8;
  }

  const handleChange = (e) => {
    const value = e.target.value;

    setContent(value);
  }

  const handleSend = async () => {
    if (disabled) {
      return;
    }

    if (!content) {
      setAlert({title: "Empty message", message: "Please type a message before sending.", show: true});
      return;
    }

    if (await maxTokensReached()) {
      setAlert({title: "Token limit reached", message: "You've used over 80% of the token limit. Please reduce your input size.", show: true});
      return;
    }
    
    onSend({ role: "user", content });
    setContent("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      //change height to fit content
      autosize.update(textareaRef.current);
    }
  }, [content]);

  useEffect(() => {
    if (transcript) {
      setContent(prevContent => prevContent + transcript)
      setTranscript("");
    }
  }, [transcript, setContent]);

  return (
    <>
    <div className="relative">
    <textarea
        name="stream-input"
        ref={textareaRef}
        className="min-h-[44px] max-h-64 rounded-lg p-2 pr-20 w-full overflow-y-auto border border-gray-500"
        placeholder="Type a message..."
        value={content.concat(interimTranscript)}
        style={{resize: "none"}}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
       <div className='absolute bottom-0 right-0 p-1 mb-1 flex justify-end gap-2'> 
       {window.webkitSpeechRecognition && 
                <SpeechToText 
                color={"text-lightskyblue"}
                listening={listening}
                setListening={setListening}
                setInterimTranscript={setInterimTranscript} 
                setTranscript={setTranscript} />}
      <button onClick={() => handleSend()}>
        <PaperAirplaneIcon className="h-8 w-8 hover:cursor-pointer p-1 hover:opacity-80 text-lightskyblue" />
      </button>
      </div>
    </div>
    <Alert alert={alert} setAlert={setAlert}/>
    </>
  );
};