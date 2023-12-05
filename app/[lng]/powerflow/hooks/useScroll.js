import { useState, useEffect, useLayoutEffect, useRef } from "react";

export default function useScroll(activeTab, messages) {
  const scrollRef = useRef();

  const [scrollPositions, setScrollPositions] = useState(() => {
    let saved = null;
    if (typeof window !== 'undefined') {
      saved = localStorage.getItem('scrollPositions');
    }
    if (saved) {
      return JSON.parse(saved);
    }
    return {stream: 0, parallel: 0, sequential: 0};
  });

  const leeway = 100;

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
        setScrollPositions((prev) => {
          const updatedPositions = {...prev, [activeTab]: currentScrollRef.scrollTop};
          // Save updated scroll positions in local storage
          if (typeof window !== 'undefined') {
            localStorage.setItem('scrollPositions', JSON.stringify(updatedPositions));
          }
          return updatedPositions;
        });
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
  }, [scrollRef, activeTab]);

  // Restore scroll position when the component mounts or when activeTab changes
  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollTo(0, scrollPositions[activeTab]);
    }
  }, [scrollRef, activeTab, scrollPositions]);


  // Auto-scroll to bottom for new messages
  useEffect(() => {
    const currentScrollRef = scrollRef.current;
    if (currentScrollRef && activeTab === "stream") {
      const isAtBottom =
        currentScrollRef.scrollHeight - currentScrollRef.scrollTop <=
        currentScrollRef.clientHeight + leeway;
      if (isAtBottom) {
        currentScrollRef.scrollTop = currentScrollRef.scrollHeight;
      }
    }
  }, [messages, leeway, activeTab]);

  //Scroll to bottom when new user message is sent
  useEffect(() => {
    const currentScrollRef = scrollRef.current;
    if (currentScrollRef && messages[messages.length - 1].role === "user" && activeTab === "stream") {
      currentScrollRef.scrollTop = currentScrollRef.scrollHeight;
    }
  }, [messages, activeTab]);

  return scrollRef;
}