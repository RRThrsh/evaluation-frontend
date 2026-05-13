import { Outlet } from "react-router-dom";
import Sidebar from "../admin/Sidebar";
import Topbar from "../admin/Topbar";

export default function AdminLayout() {
    return (
        <div className="flex min-h-screen bg-slate-950 text-white">

            {/* Sidebar */}
            <Sidebar />

            {/* Main area */}
            <div className="flex flex-1 flex-col">

                {/* Topbar */}
                <Topbar />

                {/* Page content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}