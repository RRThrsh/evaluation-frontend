import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { MessageCircle, X, Send, Megaphone } from "lucide-react";
import api from "../../services/api";

const SOCKET_URL = import.meta.env.VITE_API_URL || "";

export default function ChatBox() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [broadcastMode, setBroadcastMode] = useState(false);
  const isSuperadmin = user.role === "superadmin";
  const listRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!token) return;
    const socket = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socketRef.current = socket;
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const fetchMessages = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get("/api/chat/messages");
      setMessages(res.data ?? []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (open) fetchMessages();
  }, [open, fetchMessages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !socketRef.current) return;
    socketRef.current.emit("sendMessage", { message: text, is_broadcast: broadcastMode });
    setInput("");
    setBroadcastMode(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!token) return null;

  const roleColors = {
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    superadmin: "bg-red-100 text-red-700 border-red-200",
    evaluator: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 transition-all active:scale-95"
        aria-label="Chat"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
             style={{ maxHeight: "calc(100vh - 160px)", height: 480 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-primary-600 to-primary-500 text-white shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} />
              <h3 className="text-sm font-semibold">Chat</h3>
            </div>
            <span className="text-[10px] text-white/70">{user.full_name || user.email}</span>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
            {loading ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">No messages yet</div>
            ) : (
              messages.map((m) => {
                const isMine = m.user_id === user.id;
                const isBroadcast = m.is_broadcast === true;
                return (
                  <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                      isBroadcast
                        ? "bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-sm shadow-sm"
                        : isMine
                          ? "bg-primary-600 text-white rounded-br-sm"
                          : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm"
                    }`}>
                      {isBroadcast && (
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                            <Megaphone size={12} /> Broadcast
                          </span>
                        </div>
                      )}
                      {!isMine && !isBroadcast && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${roleColors[m.role] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {m.role}
                          </span>
                          <span className="text-[10px] font-medium">{m.full_name}</span>
                        </div>
                      )}
                      {isBroadcast && (
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[10px] font-bold">{m.full_name}</span>
                          <span className="text-[10px] text-rose-400">·</span>
                          <span className="text-[10px] font-medium uppercase text-rose-500">{m.role}</span>
                        </div>
                      )}
                      <p className="leading-relaxed">{m.message}</p>
                      <p className={`text-[10px] mt-0.5 ${isMine ? "text-white/60" : isBroadcast ? "text-rose-400" : "text-slate-400"}`}>
                        {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-slate-100 bg-white shrink-0">
            {isSuperadmin && (
              <button
                onClick={() => setBroadcastMode(!broadcastMode)}
                className={`flex items-center gap-1.5 w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition ${
                  broadcastMode ? "bg-rose-50 text-rose-700" : "bg-slate-50 text-slate-400 hover:text-slate-600"
                }`}
              >
                <Megaphone size={12} />
                {broadcastMode ? "Broadcast ON — message will be sent to everyone" : "Send as Broadcast"}
              </button>
            )}
            <div className="flex items-center gap-2 px-3 py-2.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={broadcastMode ? "Type broadcast message..." : "Type a message..."}
                className="input-field flex-1 py-2 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 transition shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
