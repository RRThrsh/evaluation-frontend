import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Settings,
    Shield,
} from "lucide-react";

const links = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/roles", label: "Roles", icon: Shield },
    { to: "/admin/settings", label: "Settings", icon: Settings },
];

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
                {links.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={linkClass}
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}