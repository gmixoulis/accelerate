import { useAssistant } from "@/context/AssistantContext";
import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import ChatMessage from "./ChatMessage";
import { StopChat } from "./StopChat";
import { useState, useEffect, useRef, useLayoutEffect } from "react";


export const Chat = ({ messages, loading, onSend, onStop, disabled, isBottomDrawer }) => {
  const [content, setContent] = useState("");

  const scrollRef = useRef(null);
  const { scrollPosition, setScrollPosition } = useAssistant();

  const leeway = 60;

  function debounce(func, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(null, args), wait);
    };
  }

  // Save scroll position
  useEffect(() => {
    const currentScrollRef = scrollRef.current;

    const handleScroll = debounce(() => {
      if (currentScrollRef) {
        setScrollPosition(currentScrollRef.scrollTop);
      }
    }, 100);

    if (currentScrollRef) {
      currentScrollRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollRef, setScrollPosition]);

  // Restore scroll position when the component mounts
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollPosition);
    }
  }, [scrollRef, scrollPosition]);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      const isAtBottom =
        currentScrollRef.scrollHeight - currentScrollRef.scrollTop <=
        currentScrollRef.clientHeight + leeway;
      if (isAtBottom) {
        currentScrollRef.scrollTop = currentScrollRef.scrollHeight;
      }
    }
  }, [messages, leeway]);

  //Scroll to bottom when new user message is sent
  useEffect(() => {
    const currentScrollRef = scrollRef.current;
    if (currentScrollRef && messages.length > 0 && messages[messages.length - 1].role === "user") {
      currentScrollRef.scrollTop = currentScrollRef.scrollHeight;
    }
  }, [messages]);
  
  return (
    <>
       <div className={`flex flex-col rounded-lg px-2 sm:p-4 ${isBottomDrawer ? "max-h-[45vh]" : "max-h-[55vh]"}`}>
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className="my-1 sm:my-1.5"
          >
            <ChatMessage message={message} />
          </div>
        ))}

        {loading && (
          <div className="my-1 sm:my-1.5">
            <ChatLoader />
          </div>
        )}
        </div>

        <div className="pt-4 mt-4 sm:mt-8 sticky bottom-0 left-0 w-full gap-1 flex items-center">
          <div className="flex-1">
          <ChatInput content={content} setContent={setContent} onSend={onSend} disabled={disabled}/>
          </div>
          <StopChat onStop={onStop}/>
        </div>
      </div> 

    </>
  );
};
