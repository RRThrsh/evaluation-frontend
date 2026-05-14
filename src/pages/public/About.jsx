import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Header */}
            <Header />

            {/* Content */}
            <main className="flex flex-1 items-center justify-center px-6">
                <div className="max-w-3xl text-center">

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Evaluation System Overview
                    </h2>

                    <p className="text-gray-600 text-lg mb-6">
                        This system is designed to help organize and manage evaluations
                        efficiently for users, staff, and moderators. It provides a
                        structured platform where feedback and assessments can be submitted,
                        reviewed, and managed securely.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">

                        <div className="p-4 bg-white border rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-2">Users</h3>
                            <p className="text-sm text-gray-600">
                                Submit evaluations and track their submissions.
                            </p>
                        </div>

                        <div className="p-4 bg-white border rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-2">Staff</h3>
                            <p className="text-sm text-gray-600">
                                Manage and process evaluation data efficiently.
                            </p>
                        </div>

                        <div className="p-4 bg-white border rounded-xl shadow-sm">
                            <h3 className="font-semibold text-gray-800 mb-2">Moderators</h3>
                            <p className="text-sm text-gray-600">
                                Review, validate, and ensure evaluation quality.
                            </p>
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default About;