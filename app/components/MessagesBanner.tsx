"use client";

import { useState, useEffect } from "react";
import messagesData from "@/data/messages.json";

export default function MessagesBanner() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const messages = messagesData.messages;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="w-full bg-black text-white py-2 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4">
        <div 
          className={`flex items-center justify-center gap-2 text-sm sm:text-base transition-opacity duration-300 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <p>{messages[currentMessageIndex].text}</p>
        </div>
      </div>
    </div>
  );
}