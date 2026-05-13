import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function Topbar() {
    const [user, setUser] = useState({});

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

    return (
        <header className="flex items-center justify-between border-b border-white/10 bg-slate-950/70 px-6 py-4 backdrop-blur-xl">

            <div>
                <h2 className="text-lg font-semibold">
                    Welcome back, {user.full_name || "User"}
                </h2>
                <p className="text-sm text-slate-400">
                    Admin control panel
                </p>
            </div>

            <div className="flex items-center gap-3">

                <button className="rounded-xl border border-white/10 bg-white/5 p-3 hover:bg-white/10">
                    <Bell size={18} />
                </button>

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-400">
                    {user.full_name
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("")
                        ?.slice(0, 2)
                        || "U"}
                </div>

            </div>
        </header>
    );
}