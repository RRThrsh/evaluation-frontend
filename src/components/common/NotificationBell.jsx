import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../services/api";
import SvgIcon from "./SvgIcon";

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.setValueAtTime(523.25, ctx.currentTime);
    o.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
    o.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // audio not supported
  }
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const prevCount = useRef(0);
  const dropdownRef = useRef(null);

  const fetchUnreadCount = useCallback(() => {
    api.get("/api/notifications/unread-count")
      .then((res) => {
        const count = res.data?.count ?? 0;
        if (count > prevCount.current && prevCount.current > 0) {
          playNotificationSound();
        }
        prevCount.current = count;
        setUnreadCount(count);
      })
      .catch(() => {});
  }, []);

  const fetchNotifications = useCallback(() => {
    api.get("/api/notifications?unreadOnly=true")
      .then((res) => setNotifications(res.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();
    const countInterval = setInterval(fetchUnreadCount, 15000);
    const listInterval = setInterval(fetchNotifications, 30000);
    return () => {
      clearInterval(countInterval);
      clearInterval(listInterval);
    };
  }, [fetchUnreadCount, fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch (e) {
      // ignore
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post("/api/notifications/mark-all-read");
      setNotifications([]);
      setUnreadCount(0);
    } catch (e) {
      // ignore
    }
  };

  const typeStyles = {
    info: "bg-blue-100 text-blue-600",
    success: "bg-emerald-100 text-emerald-600",
    warning: "bg-amber-100 text-amber-600",
    error: "bg-red-100 text-red-600",
    broadcast: "bg-purple-100 text-purple-600",
  };

  const typeIcons = {
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z",
    error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
    broadcast: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
  };

  const formatTime = (t) => {
    const d = new Date(t);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-500 hover:text-slate-700 hover:border-slate-300 transition"
      >
        <SvgIcon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-lg">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl border border-slate-200 bg-white shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <SvgIcon path="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">No new notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className="flex items-start gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition last:border-0"
                >
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${typeStyles[n.type] || typeStyles.info}`}>
                    <SvgIcon path={typeIcons[n.type] || typeIcons.info} className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap mt-1">{formatTime(n.created_at)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
