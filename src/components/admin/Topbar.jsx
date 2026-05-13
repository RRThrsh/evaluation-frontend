import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Topbar() {
    const [user, setUser] = useState({});
    const [openProfile, setOpenProfile] = useState(false);
    const [openNotif, setOpenNotif] = useState(false);

    const profileRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error("Invalid user in localStorage");
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(e.target)
            ) {
                setOpenProfile(false);
            }

            if (
                notifRef.current &&
                !notifRef.current.contains(e.target)
            ) {
                setOpenNotif(false);
            }
        };

        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setOpenProfile(false);
                setOpenNotif(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);

    return (
        <header className="relative flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur-xl">

            {/* LEFT */}
            <div>
                <h2 className="text-lg font-semibold">
                    Welcome back, {user.full_name || "User"}
                </h2>
                <p className="text-sm text-slate-400">
                    Admin control panel
                </p>
            </div>

            {/* RIGHT */}
            <div className="relative flex items-center gap-3">

                {/* NOTIFICATION */}
                <div ref={notifRef}>
                    <button
                        onClick={() => setOpenNotif((v) => !v)}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10"
                    >
                        <Bell size={18} />
                    </button>

                    {openNotif && (
                        <div className="absolute right-14 top-14 w-72 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-xl">
                            <h3 className="mb-2 font-semibold">
                                Notifications
                            </h3>
                            <p className="text-sm text-slate-400">
                                No new notifications
                            </p>
                        </div>
                    )}
                </div>

                {/* PROFILE */}
                <div ref={profileRef} className="relative">
                    <button
                        onClick={() => setOpenProfile((v) => !v)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-400 hover:bg-blue-500/30"
                    >
                        {user.full_name
                            ?.split(" ")
                            ?.map((n) => n[0])
                            ?.join("")
                            ?.slice(0, 2) || "U"}
                    </button>

                    {openProfile && (
                        <div className="absolute right-0 top-14 w-56 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-xl">

                            <div className="mb-3">
                                <p className="font-semibold">
                                    {user.full_name || "User"}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {user.email || "No email"}
                                </p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full rounded-xl bg-red-500/10 px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/20"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}