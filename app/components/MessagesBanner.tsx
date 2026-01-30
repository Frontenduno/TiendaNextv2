"use client";

import messagesData from "@/data/messages.json";

export default function MessagesBanner() {
  const messages = messagesData.messages;
  
  // Duplicar los mensajes para crear el efecto infinito
  const allMessages = [...messages, ...messages];

  return (
    <div className="w-full bg-black text-white py-3 sm:py-4 overflow-hidden relative">
      <div className="flex items-center h-full">
        <div className="animate-scroll flex gap-8 whitespace-nowrap">
          {allMessages.map((message, index) => (
            <span 
              key={index}
              className="text-sm sm:text-base font-medium inline-flex items-center gap-2"
            >
              {message.text}
              <span className="text-yellow-400">•</span>
            </span>
          ))}
        </div>
        {/* Duplicado para efecto continuo sin espacios */}
        <div className="animate-scroll flex gap-8 whitespace-nowrap" aria-hidden="true">
          {allMessages.map((message, index) => (
            <span 
              key={`duplicate-${index}`}
              className="text-sm sm:text-base font-medium inline-flex items-center gap-2"
            >
              {message.text}
              <span className="text-yellow-400">•</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}