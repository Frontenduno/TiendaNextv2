"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, MessageCircle, Bot, ChevronDown } from "lucide-react";


type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  text: string;
  ts: number;
  isError?: boolean;
  isStreaming?: boolean;
}

type Status = "idle" | "loading" | "error";


const BACKEND_URL =
  process.env.NEXT_PUBLIC_ASSISTANT_URL ?? "http://localhost:8000";

const SUGGESTED = [
  "¿Cuáles son los horarios de atención?",
  "¿Hacen envíos a todo el país?",
  "¿Cuánto demoran los envíos?",
  "¿Cómo hago una devolución?",
];

const TYPEWRITER_BASE_MS = 12;
const TYPEWRITER_PAUSE_MS = 60;


function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function useTypewriter(
  fullText: string | undefined,
  isStreaming: boolean,
  onDone: () => void
): string {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isStreaming || !fullText) {
      const t = setTimeout(() => {
        setDisplayed(fullText ?? "");
        indexRef.current = fullText?.length ?? 0;
      }, 0);
      return () => clearTimeout(t);
    }

    indexRef.current = 0;
    const resetTimer = setTimeout(() => setDisplayed(""), 0);

    function tick() {
      const i = indexRef.current;
      if (!fullText || i >= fullText.length) {
        onDone();
        return;
      }

      const ch = fullText[i];
      setDisplayed(fullText.slice(0, i + 1));
      indexRef.current = i + 1;

      const isPause = [".", "!", "?", "\n"].includes(ch);
      const jitter = Math.random() * 8 - 4;
      const delay = isPause ? TYPEWRITER_PAUSE_MS : TYPEWRITER_BASE_MS + jitter;

      timerRef.current = setTimeout(tick, delay);
    }

    timerRef.current = setTimeout(tick, 80);

    return () => {
      clearTimeout(resetTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fullText, isStreaming]); // eslint-disable-line react-hooks/exhaustive-deps

  return displayed;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-[#2c1ff1] opacity-60"
          style={{
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40%            { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

function BlinkingCursor() {
  return (
    <>
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .cursor { display:inline-block; width:2px; height:1em; background:currentColor;
                  vertical-align:text-bottom; margin-left:1px;
                  animation: blink 0.8s step-end infinite; }
      `}</style>
      <span className="cursor" aria-hidden />
    </>
  );
}

function MessageBubble({
  msg,
  onStreamDone,
}: {
  msg: Message;
  onStreamDone: (id: string) => void;
}) {
  const isUser = msg.role === "user";

  const displayed = useTypewriter(
    msg.text,
    msg.isStreaming ?? false,
    () => onStreamDone(msg.id)
  );

  const stillTyping = msg.isStreaming && displayed.length < (msg.text?.length ?? 0);

  return (
    <div
      className={`flex gap-2 mb-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2c1ff1] to-[#4c3ff3] flex items-center justify-center shrink-0 mt-1">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div
        className={`max-w-[78%] ${
          isUser ? "items-end" : "items-start"
        } flex flex-col gap-1`}
      >
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-[#2c1ff1] text-white rounded-tr-sm"
              : msg.isError
              ? "bg-red-50 text-red-700 border border-red-200 rounded-tl-sm"
              : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm"
          }`}
        >
          {displayed}
          {stillTyping && !isUser && !msg.isError && <BlinkingCursor />}
        </div>
        <span className="text-[10px] text-gray-400 px-1">
          {formatTime(msg.ts)}
        </span>
      </div>
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [showSuggested, setShowSuggested] = useState(true);
  const [waitNote, setWaitNote] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    };
  }, []);

  const addMessage = useCallback(
    (role: Role, text: string, isError = false, streaming = false) => {
      const msg: Message = {
        id: uid(),
        role,
        text,
        ts: Date.now(),
        isError,
        isStreaming: streaming,
      };
      setMessages((prev) => [...prev, msg]);
      return msg;
    },
    []
  );

  const handleStreamDone = useCallback((id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isStreaming: false } : m))
    );
  }, []);

  const sendMessage = useCallback(
    async (query: string) => {
      const text = query.trim();
      if (!text || status === "loading") return;

      setShowSuggested(false);
      setInput("");
      addMessage("user", text);
      setStatus("loading");
      setWaitNote(false);

      waitTimerRef.current = setTimeout(() => setWaitNote(true), 25_000);

      try {
        const res = await fetch(`${BACKEND_URL}/qa/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: text, top_k: 5, use_cache: true }),
          signal: AbortSignal.timeout(310_000),
        });

        if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
        setWaitNote(false);

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          const errMsg =
            err?.detail?.error === "LLM_TIMEOUT"
              ? "El asistente tardó demasiado en responder. Por favor intenta de nuevo."
              : err?.detail?.error === "NO_RESULTS"
              ? "No encontré información sobre eso. ¿Puedes reformular tu pregunta?"
              : "Hubo un problema al procesar tu consulta. Intenta de nuevo.";
          addMessage("assistant", errMsg, true, false);
        } else {
          const data = await res.json();
          addMessage("assistant", data.answer, false, true);
        }
      } catch {
        if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
        setWaitNote(false);
        addMessage(
          "assistant",
          "No pude conectarme al asistente. Verifica tu conexión e intenta de nuevo.",
          true,
          false
        );
      } finally {
        setStatus("idle");
      }
    },
    [status, addMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            id: uid(),
            role: "assistant",
            text: "¡Hola! 👋 Soy el asistente virtual de J&P. Puedo ayudarte con información sobre envíos, devoluciones, garantías, horarios y más. ¿En qué te ayudo hoy?",
            ts: Date.now(),
            isStreaming: true,
          },
        ]);
      }, 300);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={handleOpen}
          aria-label="Abrir asistente virtual"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full
                     bg-gradient-to-br from-[#2c1ff1] to-[#4c3ff3]
                     shadow-lg hover:shadow-xl hover:scale-105
                     flex items-center justify-center
                     transition-all duration-200 active:scale-95"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          <span className="absolute inset-0 rounded-full bg-[#2c1ff1] opacity-30 animate-ping" />
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50
                     w-[calc(100vw-1.5rem)] max-w-[380px]
                     sm:w-[380px]
                     flex flex-col
                     bg-gray-50 rounded-2xl shadow-2xl
                     overflow-hidden border border-gray-200
                     animate-slide-up"
          style={{ height: "min(600px, calc(100vh - 2rem))" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2c1ff1] to-[#4c3ff3] px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">
                Asistente J&P
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                <p className="text-white/80 text-xs truncate">
                  {status === "loading"
                    ? "Procesando tu consulta..."
                    : "En línea"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Cerrar"
            >
              <ChevronDown className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-hide">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onStreamDone={handleStreamDone}
              />
            ))}

            {status === "loading" && (
              <div className="flex gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2c1ff1] to-[#4c3ff3] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            {waitNote && (
              <p className="text-center text-xs text-gray-400 py-1 px-3">
                ⏳ Procesando respuesta, esto puede tardar hasta 90 seg...
              </p>
            )}

            {showSuggested && messages.length === 1 && (
              <div className="pt-2 space-y-2">
                <p className="text-xs text-gray-400 text-center">
                  Preguntas frecuentes
                </p>
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={status === "loading"}
                    className="w-full text-left text-sm px-3 py-2 rounded-xl
                               border border-[#2c1ff1]/20 text-[#2c1ff1]
                               hover:bg-[#2c1ff1]/5 transition-colors
                               disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="px-3 py-3 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu pregunta..."
                disabled={status === "loading"}
                className="flex-1 px-4 py-2.5 rounded-full border border-gray-200
                           text-sm text-gray-700 placeholder-gray-400
                           focus:outline-none focus:ring-2 focus:ring-[#2c1ff1]/30
                           focus:border-[#2c1ff1] disabled:opacity-50
                           transition-colors bg-gray-50"
                maxLength={500}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={status === "loading" || !input.trim()}
                aria-label="Enviar"
                className="w-10 h-10 rounded-full bg-[#2c1ff1]
                           hover:bg-[#2416c9] disabled:opacity-40
                           flex items-center justify-center shrink-0
                           transition-colors active:scale-95"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-gray-300 text-center mt-1.5">
              Asistente IA · Las respuestas pueden tardar hasta 90 seg
            </p>
          </div>
        </div>
      )}
    </>
  );
}