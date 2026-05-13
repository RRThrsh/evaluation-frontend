import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Settings,
    Shield,
} from "lucide-react";

const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
        isActive
            ? "bg-blue-500/20 text-blue-400"
            : "hover:bg-white/10 text-slate-300"
    }`;

export default function Sidebar() {
    return (
        <aside className="w-64 border-r border-white/10 bg-slate-950 p-4">

            <h1 className="mb-8 px-2 text-xl font-bold">
                Admin Panel
            </h1>

            <nav className="space-y-2">

                <NavLink to="/admin" end className={linkClass}>
                    <LayoutDashboard size={18} />
                    Dashboard
                </NavLink>

                <NavLink to="/admin/users" className={linkClass}>
                    <Users size={18} />
                    Users
                </NavLink>

                <NavLink to="/admin/roles" className={linkClass}>
                    <Shield size={18} />
                    Roles
                </NavLink>

                <NavLink to="/admin/settings" className={linkClass}>
                    <Settings size={18} />
                    Settings
                </NavLink>

            </nav>
        </aside>
    );
}