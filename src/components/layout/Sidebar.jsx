import React from "react";

const Sidebar = () => {
    return (
        <aside className="h-screen w-64 bg-white border-r shadow-sm fixed left-0 top-0">
            {/* Brand */}
            <div className="p-6 text-xl font-bold text-gray-800 border-b">
                MyBrand
            </div>

            {/* Nav */}
            <nav className="p-4 flex flex-col gap-2 text-gray-600 text-sm">
                <a
                    href="#"
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900"
                >
                    Dashboard
                </a>

                <a
                    href="#"
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900"
                >
                    Analytics
                </a>

                <a
                    href="#"
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900"
                >
                    Projects
                </a>

                <a
                    href="#"
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900"
                >
                    Settings
                </a>
            </nav>

            {/* Footer section */}
            <div className="absolute bottom-0 w-full p-4 border-t text-xs text-gray-500">
                © {new Date().getFullYear()} MyBrand
            </div>
        </aside>
    );
};

export default Sidebar;