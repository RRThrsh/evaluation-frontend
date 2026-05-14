import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const Homepage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* Header */}
            <Header />

            {/* Hero Section */}
            <main className="flex flex-1 items-center justify-center px-6">
                <div className="text-center max-w-2xl">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to the Evaluation System
                    </h2>

                    <p className="text-gray-600 text-lg mb-6">
                        A simple platform for staff, moderators, and users to manage and
                        submit evaluations efficiently and securely.
                    </p>

                    <div className="flex justify-center gap-4">
                        <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition">
                            Get Started
                        </button>

                        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition">
                            Learn More
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Homepage;