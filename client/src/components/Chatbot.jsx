import React, { useMemo, useRef, useState, useEffect } from "react";
import axios from "axios";
import { clsx } from "clsx";
import Markdown from "markdown-to-jsx";

/* ===== Helpers ===== */
const fmtTime = (t) =>
  new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

const fmtPrice = (p) => new Intl.NumberFormat("vi-VN").format(p) + "đ";

/* ===== Message Content Component với Markdown Support ===== */
const MessageContent = ({ text, isUser }) => {
  if (isUser) {
    return <>{text}</>;
  }

  return (
    <Markdown
      options={{
        overrides: {
          p: { component: 'p', props: { className: 'mb-2 last:mb-0' } },
          strong: { component: 'strong', props: { className: 'font-bold' } },
          em: { component: 'em', props: { className: 'italic' } },
          ul: { component: 'ul', props: { className: 'list-disc list-inside mb-2 space-y-1' } },
          ol: { component: 'ol', props: { className: 'list-decimal list-inside mb-2 space-y-1' } },
          li: { component: 'li', props: { className: 'ml-2' } },
          h1: { component: 'h1', props: { className: 'text-lg font-bold mb-2' } },
          h2: { component: 'h2', props: { className: 'text-base font-bold mb-2' } },
          h3: { component: 'h3', props: { className: 'text-sm font-bold mb-1' } },
          code: { component: 'code', props: { className: 'bg-white/20 px-1 py-0.5 rounded text-xs' } },
        },
      }}
    >
      {text}
    </Markdown>
  );
};

/* ===== Main Widget ===== */
export default function ChatbotWidget() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "bot",
      text: "Xin chào! Tôi là trợ lý ảo của Travel Tour. Tôi có thể giúp gì cho bạn?",
      time: Date.now(),
      showTime: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  
  const scRef = useRef(null);

  const quick = useMemo(
    () => ["Tour du lịch đến Đà Nẵng","Tour du lịch Bà Nà Hills","Tour giá rẻ"],
    []
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scRef.current) {
        scRef.current.scrollTop = scRef.current.scrollHeight;
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('chatbot_session_id');
    if (storedSessionId) {
      setSessionId(storedSessionId);
      console.log('📦 Loaded session_id from storage:', storedSessionId);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      sessionStorage.setItem('chatbot_session_id', sessionId);
      console.log('💾 Saved session_id to storage:', sessionId);
    }
  }, [sessionId]);

  const resetConversation = async () => {
    if (!sessionId) {
      setMessages([
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: "Xin chào! Tôi là trợ lý ảo của Travel Tour. Tôi có thể giúp gì cho bạn?",
          time: Date.now(),
          showTime: true,
        },
      ]);
      return;
    }

    try {
      await axios.post(
        `${API_BASE}/chat/api/chat/clear`,
        { session_id: sessionId },
        { headers: { "Content-Type": "application/json" }, timeout: 10000 }
      );
      console.log('🗑️ Cleared chat history on server');
    } catch (e) {
      console.error('Error clearing chat history:', e);
    }

    setSessionId(null);
    sessionStorage.removeItem('chatbot_session_id');
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "bot",
        text: "Xin chào! Tôi là trợ lý ảo của Travel Tour. Tôi có thể giúp gì cho bạn?",
        time: Date.now(),
        showTime: true,
      },
    ]);
    
    console.log('🔄 Conversation reset');
  };

  async function ask(query) {
    if (!query.trim() || loading) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      text: query,
      time: Date.now(),
      showTime: true,
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const requestBody = { query: query };
      
      if (sessionId) {
        requestBody.session_id = sessionId;
        console.log('📤 Sending with session_id:', sessionId);
      } else {
        console.log('📤 Sending without session_id (new session)');
      }

      const res = await axios.post(`${API_BASE}/chat/`, requestBody, {
        headers: { "Content-Type": "application/json" },
        timeout: 30000,
      });

      const responseData = res?.data?.data;
      const answer = responseData?.answer?.trim() || "Xin lỗi, mình chưa tìm thấy câu trả lời phù hợp.";
      
      const newSessionId = responseData?.session_id;
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
        console.log('🆕 Received new session_id:', newSessionId);
      }

      const botMsg = {
        id: crypto.randomUUID(),
        role: "bot",
        text: answer,
        time: Date.now(),
        showTime: true,
      };

      setMessages((m) => [...m, botMsg]);
    } catch (e) {
      console.error("API Error:", e);
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: "⚠️ Đã xảy ra lỗi kết nối. Vui lòng thử lại sau nhé!",
          time: Date.now(),
          showTime: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    ask(input);
  }

  return (
    <>
      {/* ===== Floating Chat Button ===== */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "fixed bottom-6 right-6 z-50",
          "w-18 h-18 rounded-full shadow-2xl",
          "bg-white hover:scale-110 active:scale-95",
          "transition-all duration-300",
          "flex items-center justify-center",
          "border-2 border-purple-300",
          isOpen && "scale-0 opacity-0"
        )}
        aria-label="Open Chatbot"
      >
        <img 
          src="/chatbot/icon.png" 
          alt="Chatbot" 
          className="w-12 h-12 object-contain"
        />
      </button>

      {/* ===== Chatbot Container - COMPACT & GÓCTTRÁI ===== */}
      <div
        className={clsx(
          "fixed z-40",
          "bg-white flex flex-col overflow-hidden",
          "transition-all duration-500 transform",
          "shadow-2xl",
          "border-4 border-purple-400",
          "rounded-3xl",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 invisible"
        )}
        style={{
          right: '20px',
          top: '60%',
          transform: isOpen ? 'translateY(-50%)' : 'translateY(-50%) scale(0.95)',
          width: '18vw',
          minWidth: '300px',
          maxWidth: '450px',
          height: '75vh',
          maxHeight: '700px',
          boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
          borderRadius: '30px'
        }}
      >
        {/* ===== Header - COMPACT ===== */}
        <div className="
          shrink-0 px-3 py-2
          bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700
          text-white relative overflow-hidden
          flex items-center justify-between
        ">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          
          {/* Back Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="
              w-5 h-5 p-0
              hover:bg-white/20
              rounded-full
              transition-colors
              z-50
              relative
              flex items-center justify-center
              scale-75
            "
            aria-label="Close Chatbot"
          >
            <img src="/chatbot/back.png" alt="Back" className="w-4 h-4 object-contain" />
          </button>

          {/* Title & Avatar */}
          <div className="flex flex-col items-center relative z-10 flex-1">
            <img 
              src="/chatbot/avt_robo.png" 
              alt="Bot Avatar"
              className="w-7 h-7 rounded-full object-cover shadow-md"
            />
            <div className="mt-0.5 font-bold text-[10px]">TRAVEL CHATBOT</div>
          </div>

          {/* Reset Button */}
          <button
            onClick={resetConversation}
            className="
              p-0.5
              hover:bg-white/20
              rounded-full
              transition-all duration-200
              z-50
              relative
            "
            aria-label="New Session"
            title="Bắt đầu cuộc trò chuyện mới"
          >
            <img 
              src="/chatbot/new.png"
              alt="New Session"
              className="w-5 h-5 object-contain"
            />
          </button>
        </div>

        {/* ===== Messages Area - COMPACT FONT ===== */}
        <div
          ref={scRef}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-3"
          style={{
            scrollBehavior: 'smooth',
            background: 'linear-gradient(to bottom, #fce4ec, #f8bbd0, #fce4ec)'
          }}
        >
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={clsx(
                  "flex gap-2 animate-slideIn",
                  isUser ? "justify-end" : "justify-start items-start"
                )}
              >
                {!isUser && (
                <img 
                  src="/chatbot/avt_robo.png"
                  alt="Bot Avatar"
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0 shadow-sm"
                />
              )}

                <div className={clsx("max-w-[70%]", isUser && "flex flex-col items-end")}>
                  <div
                    className={clsx(
                      "px-3 py-2 leading-relaxed text-xs shadow-sm",
                      isUser
                        ? "bg-gray-100 text-gray-800 rounded-xl rounded-br-md"
                        : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-xl rounded-tl-md"
                    )}
                  >
                    <MessageContent text={m.text} isUser={isUser} />
                  </div>

                  {m.showTime && (
                    <div className="mt-0.5 text-[9px] text-gray-400 px-2 flex items-center gap-1">
                      {fmtTime(m.time)} {isUser && <span>✓</span>}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-200 text-xs flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-2 animate-slideIn">
              <img 
                  src="/chatbot/avt_robo.png"
                  alt="Bot Avatar"
                  className="w-7 h-7 rounded-full object-cover flex-shrink-0 shadow-sm"
                />
              <div className="px-3 py-2 rounded-xl rounded-tl-md bg-gradient-to-br from-purple-600 to-indigo-700 shadow-sm">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-white/70 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div />
        </div>

        {/* ===== Bottom Input Area - COMPACT ===== */}
        <div className="shrink-0 px-3 pt-2 pb-3 bg-white border-t border-gray-100">
          <div className="flex gap-1 mb-2 overflow-x-auto scrollbar-hide">
            {quick.map((q) => (
              <button
                key={q}
                onClick={() => ask(q)}
                className="
                  px-2 py-1 rounded-full text-[9px] font-medium
                  bg-white text-gray-700
                  shadow-sm border border-gray-200
                  hover:shadow-md hover:border-purple-300
                  active:scale-95 transition-all duration-200
                  whitespace-nowrap flex-shrink-0
                "
              >
                {q}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="flex items-center gap-1">
            <div className="
              flex items-center flex-1
              rounded-full bg-gray-50
              border border-gray-200
              focus-within:border-purple-400 focus-within:bg-white
              transition-all duration-200
            ">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                disabled={loading}
                className="
                  flex-1 bg-transparent px-3 py-2 outline-none 
                  text-xs text-gray-700 placeholder:text-gray-400
                  disabled:opacity-50
                "
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="
                shrink-0 w-8 h-8 rounded-full
                bg-gradient-to-br from-purple-600 to-indigo-700 text-white
                shadow-md hover:shadow-lg hover:scale-105
                active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 grid place-items-center
              "
              aria-label="Send"
            >
              {loading ? (
                <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <img src="/chatbot/send.png" alt="Send" className="w-4 h-4 object-contain" />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ===== Custom Animations ===== */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #c7c7c7;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
