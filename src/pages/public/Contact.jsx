import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const Contact = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Header */}
            <Header />

            {/* Content */}
            <main className="flex flex-1 items-center justify-center px-6">
                <div className="w-full max-w-2xl bg-white border rounded-xl shadow-sm p-6">

                    <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                        Get in Touch
                    </h2>

                    <p className="text-gray-600 text-center mb-6">
                        If you have questions about the Evaluation System, feel free to send us a message.
                    </p>

                    {/* Form */}
                    <form className="space-y-4">

                        <div>
                            <label className="text-sm text-gray-700">Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700">Email</label>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-700">Message</label>
                            <textarea
                                rows="4"
                                placeholder="Write your message..."
                                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Send Message
                        </button>

                    </form>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Contact;