import React from "react";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
          {/* Navbar */}
            <header className="w-full px-6 py-4 flex justify-between items-center bg-white shadow-sm">
                <h1 className="text-xl font-bold text-gray-800">MyBrand</h1>
                <nav className="space-x-4">
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Home
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Features
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Contact
                    </a>
                </nav>
            </header>
            
            {/* Hero Section */}
            <main className="flex flex-1 items-center justify-center px-6">
                <div className="text-center max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Build Something Simple & Beautiful
                    </h2>

                    <p className="text-gray-600 text-lg mb-6">
                        A clean and minimal landing page built with React and Tailwind CSS.
                        Perfect for your next project.
                    </p>

                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                        Get Started
                    </button>
                </div>
            </main>
            
            {/* Footer */}
            <footer className="text-center py-4 text-gray-500 text-sm">
                © {new Date().getFullYear()} MyBrand. All rights reserved.
            </footer>
        </div>
    );
};

export default LandingPage;