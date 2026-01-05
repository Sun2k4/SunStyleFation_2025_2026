import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Sparkles,
  User,
  Bot,
  MessageCircle,
  X,
  Minimize2,
} from "lucide-react";
import { Chat } from "@google/genai";
import { createStylistChat } from "../../services/geminiService";
import { Link } from "react-router-dom";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
}

const AIOutfitAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "model",
      text: "Hi! I'm Sunny, your personal AI stylist. ✨\n\nI can help you with:\n• Outfit coordination\n• Style advice\n• Finding products in our store",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Summer beach outfit",
    "Casual work attire",
    "Date night ideas",
    "Trending accessories",
  ];

  useEffect(() => {
    const initChat = async () => {
      try {
        chatSessionRef.current = await createStylistChat();
      } catch (error) {
        console.error("Failed to init chat", error);
        setMessages((prev) => [
          ...prev,
          {
            id: "err",
            role: "model",
            text: "I'm currently offline (API Key missing). Please try again later.",
          },
        ]);
      }
    };

    initChat();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || !chatSessionRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const result = await chatSessionRef.current.sendMessage({
        message: userMessage.text,
      });
      const responseText = result.text;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text:
          responseText ||
          "I'm having a bit of trouble connecting to my fashion database right now. Try again?",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chat error", error);

      let errorMessage = "Oops! I lost my train of thought. Please try asking again.";

      // Check for Quota Exceeded (429) or other specific errors
      if (error.message?.includes("429") || error.status === 429 || error.toString().includes("429")) {
        errorMessage = "I'm currently overloaded with requests (API Quota Exceeded). Please try again in a minute! 🕒";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (text: string) => {
    setInput(text);
  };
  const renderMessageText = (text: string, role: "user" | "model") => {
    // Split text by markdown link pattern
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);

    return parts.map((part, index) => {
      // Check if part matches [Text](url)
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        return (
          <Link
            key={index}
            to={match[2]}
            className={`font-bold underline transition-colors ${role === "model"
              ? "text-primary-600 hover:text-primary-800"
              : "text-white hover:text-gray-200"
              }`}
          >
            {match[1]}
          </Link>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${isOpen
          ? "bg-gray-800 text-white rotate-90"
          : "bg-gradient-to-r from-primary-500 to-primary-600 text-white animate-bounce-subtle"
          }`}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-[380px] h-[600px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-fade-in-up origin-bottom-right font-sans">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                <Sparkles className="text-white w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  Stylist Sunny
                </h3>
                <p className="text-primary-100 text-xs flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Always Active
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <Minimize2 size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-200">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100 ${msg.role === "user" ? "bg-gray-100" : "bg-white"
                      }`}
                  >
                    {msg.role === "user" ? (
                      <User size={16} className="text-gray-600" />
                    ) : (
                      <Bot size={16} className="text-primary-500" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                      ? "bg-primary-600 text-white rounded-tr-none"
                      : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
                      }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {renderMessageText(msg.text, msg.role)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                    <Bot size={16} className="text-primary-500" />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white border-t border-gray-100 p-2">
            {!isLoading && messages.length < 5 && (
              <div className="flex gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide mb-1">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleChipClick(prompt)}
                    className="whitespace-nowrap px-3 py-1.5 bg-gray-50 hover:bg-primary-50 text-gray-600 hover:text-primary-600 border border-gray-200 hover:border-primary-200 rounded-full text-xs font-medium transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSend} className="flex gap-2 p-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 text-sm"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-primary-500 hover:bg-primary-600 text-white p-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-primary-500/20"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="text-center pb-1">
              <p className="text-[10px] text-gray-400">
                Powered by Gemini AI • Information may be generated
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIOutfitAssistant;
