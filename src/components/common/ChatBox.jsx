import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import { MessageCircle, X, Send, Megaphone, Check, CheckCheck, Reply, ArrowLeft, Loader2 } from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const SOCKET_URL = import.meta.env.VITE_API_URL || "";
const ICON_CHECK = <Check size={12} />;
const ICON_CHECK_ALL = <CheckCheck size={12} />;

export default function ChatBox() {
  const { user: authUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [tab, setTab] = useState("global");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const listRef = useRef(null);
  const socketRef = useRef(null);
  const conversationRef = useRef({ tab: "global", userId: null });
  const fetchGenRef = useRef(0);

  const isSuperadmin = authUser?.role === "superadmin";
  const token = localStorage.getItem("token");

  useEffect(() => {
    conversationRef.current = { tab, userId: selectedUser?.id ?? null };
  }, [tab, selectedUser]);

  useEffect(() => {
    if (!token || !authUser) return;
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });
    socket.on("receiveMessage", (data) => {
      const conv = conversationRef.current;
      const inGlobal = conv.tab === "global" && !data.recipient_id;
      const isBroadcast = data.is_broadcast === true;
      const inPrivate = conv.tab === "private" && conv.userId &&
        (data.recipient_id === conv.userId || data.user_id === conv.userId);
      if (inGlobal || isBroadcast || inPrivate) {
        setMessages((prev) => [...prev, data]);
      }
    });
    socket.on("messagesSeen", ({ message_ids }) => {
      setMessages((prev) => prev.map((m) => message_ids.includes(m.id) ? { ...m, status: "seen" } : m));
    });
    socket.on("userOnline", (userId) => setOnlineUsers((prev) => new Set(prev).add(userId)));
    socket.on("userOffline", (userId) => setOnlineUsers((prev) => { const next = new Set(prev); next.delete(userId); return next; }));
    socket.on("onlineUsers", (ids) => setOnlineUsers(new Set(ids)));
    socketRef.current = socket;
    socket.emit("joinChat");
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [token, authUser]);

  const fetchMessages = useCallback(async () => {
    if (!token || !authUser) return;
    setLoading(true);
    const gen = ++fetchGenRef.current;
    const conv = conversationRef.current;
    try {
      const params = {};
      if (conv.tab === "private" && conv.userId) params.recipient_id = conv.userId;
      const res = await api.get("/api/chat/messages", { params });
      if (gen !== fetchGenRef.current) return;
      setMessages(res.data ?? []);
    } catch (e) {
    } finally {
      if (gen === fetchGenRef.current) setLoading(false);
    }
  }, [token, authUser]);

  const fetchUsers = useCallback(async () => {
    if (!token || !authUser) return;
    try {
      const res = await api.get("/api/chat/users");
      setUsers(res.data?.filter((u) => u.id !== authUser.id) ?? []);
    } catch (e) {
    }
  }, [token, authUser]);

  useEffect(() => {
    if (open) {
      if (tab === "private") fetchUsers();
      fetchMessages();
    }
  }, [open, tab, selectedUser, fetchMessages, fetchUsers, authUser]);

  useEffect(() => {
    if (tab === "global") setSelectedUser(null);
  }, [tab]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending || !socketRef.current) return;
    setSending(true);
    try {
      const payload = {
        message: text,
        is_broadcast: broadcastMode,
        recipient_id: tab === "private" && selectedUser ? selectedUser.id : null,
        reply_to_id: replyTo?.id || null,
      };
      socketRef.current.emit("sendMessage", payload);
      setInput("");
      setBroadcastMode(false);
      setReplyTo(null);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const markSeen = useCallback(() => {
    const unseen = messages
      .filter((m) => m.recipient_id === authUser?.id && m.status !== "seen")
      .map((m) => m.id);
    if (unseen.length > 0 && socketRef.current) {
      socketRef.current.emit("messagesSeen", { message_ids: unseen });
    }
  }, [messages, authUser]);

  useEffect(() => {
    if (open && tab === "private" && selectedUser) {
      const timer = setTimeout(markSeen, 0);
      return () => clearTimeout(timer);
    }
  }, [open, tab, selectedUser, markSeen]);

  if (!token || !authUser) return null;

  const roleColors = {
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    superadmin: "bg-red-100 text-red-700 border-red-200",
    evaluator: "bg-blue-100 text-blue-700 border-blue-200",
  };

  function StatusIcon({ status, isMine }) {
    if (!isMine || !status || status === "sent") return null;
    if (status === "seen") return <span className="text-blue-500"><CheckCheck size={12} /></span>;
    if (status === "delivered") return <span className="text-slate-400"><CheckCheck size={12} /></span>;
    return null;
  }

  function formatTime(t) {
    const d = new Date(t);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString();
  }

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
             style={{ maxHeight: "calc(100vh - 160px)", height: 520 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-gradient-to-r from-primary-600 to-primary-500 text-white shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle size={16} />
              <h3 className="text-sm font-semibold">
                {replyTo ? "Reply" : tab === "private" && selectedUser ? selectedUser.full_name : "Chat"}
              </h3>
            </div>
            <span className="text-[10px] text-white/70">{authUser.full_name || authUser.email}</span>
          </div>

          <div className="flex border-b border-slate-100 shrink-0">
            <button
              onClick={() => setTab("global")}
              className={`flex-1 py-2 text-[11px] font-semibold uppercase tracking-wide transition ${
                tab === "global" ? "text-primary-600 border-b-2 border-primary-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setTab("private")}
              className={`flex-1 py-2 text-[11px] font-semibold uppercase tracking-wide transition ${
                tab === "private" ? "text-primary-600 border-b-2 border-primary-600" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Private
            </button>
          </div>

          {tab === "private" && (
            <div className="max-h-24 overflow-y-auto border-b border-slate-100 bg-slate-50/50 shrink-0">
              <div className="flex gap-1 p-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedUser(null)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium border transition ${
                    !selectedUser ? "bg-primary-600 text-white border-primary-600" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  All
                </button>
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium border transition whitespace-nowrap ${
                      selectedUser?.id === u.id
                        ? "bg-primary-600 text-white border-primary-600"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {onlineUsers.has(u.id) && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                    {u.full_name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
            {loading ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">Loading...</div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                {tab === "private" && !selectedUser ? "Select a user to chat" : "No messages yet"}
              </div>
            ) : (
              messages.map((m) => {
                const isMine = m.user_id === authUser.id;
                const isBroadcast = m.is_broadcast === true;
                const isPrivate = m.recipient_id !== null;
                return (
                  <div key={m.id} className={`group flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[85%] min-w-0">
                      {m.reply && (
                        <div className={`mb-0.5 px-3 py-1.5 rounded-lg text-[10px] border-l-2 ${
                          isMine ? "mr-2 bg-primary-500/20 border-primary-300 text-primary-100" : "ml-2 bg-slate-100 border-slate-300 text-slate-500"
                        }`}>
                          <span className="font-medium">{m.reply.user_name}</span>
                          <p className="truncate">{m.reply.message}</p>
                        </div>
                      )}
                      <button
                        onClick={() => { if (!isMine) { setReplyTo(m); setTab("private"); setSelectedUser(users.find(u => u.id === m.user_id) || null); } }}
                        className={`text-left w-full rounded-xl px-3 py-2 text-sm transition ${
                          isBroadcast
                            ? "bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-sm shadow-sm"
                            : isMine
                              ? "bg-primary-600 text-white rounded-br-sm"
                              : "bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm hover:bg-slate-50"
                        }`}
                      >
                        {isBroadcast && (
                          <div className="flex items-center gap-1 mb-1.5">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 uppercase tracking-wide">
                              <Megaphone size={12} /> Broadcast
                            </span>
                          </div>
                        )}
                        {isPrivate && !isMine && (
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
                        <p className="leading-relaxed break-words">{m.message}</p>
                        <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}>
                          <span className={`text-[10px] ${isMine ? "text-white/60" : isBroadcast ? "text-rose-400" : "text-slate-400"}`}>
                            {formatTime(m.created_at)}
                          </span>
                          <StatusIcon status={m.status} isMine={isMine} />
                        </div>
                      </button>
                      {!isMine && (
                        <button
                          onClick={() => setReplyTo(m)}
                          className="opacity-0 group-hover:opacity-100 text-[10px] text-slate-400 hover:text-slate-600 ml-2 transition"
                        >
                          <Reply size={11} /> Reply
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {replyTo && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 border-t border-slate-200 shrink-0">
              <button onClick={() => setReplyTo(null)} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-medium text-slate-500">Replying to {replyTo.full_name}</span>
                <p className="text-[10px] text-slate-400 truncate">{replyTo.message}</p>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 bg-white shrink-0">
            {isSuperadmin && tab === "global" && (
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
                placeholder={
                  sending ? "Sending..." :
                  broadcastMode ? "Type broadcast message..." :
                  replyTo ? "Type your reply..." :
                  tab === "private" && !selectedUser ? "Select a user first..." :
                  "Type a message..."
                }
                disabled={sending || (tab === "private" && !selectedUser)}
                className="input-field flex-1 py-2 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sending || (tab === "private" && !selectedUser)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 transition shrink-0"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
