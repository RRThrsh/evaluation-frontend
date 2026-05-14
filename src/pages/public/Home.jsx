import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const Homepage = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Header />

            <main className="min-h-screen">

                {/* HERO */}
                <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                    <div className="text-center space-y-6 px-4">
                        <h1 className="text-5xl font-bold">
                            Build Modern Web Experiences
                        </h1>

                        <p className="text-gray-600 max-w-xl mx-auto">
                            A clean, responsive, and scalable React layout with hero sections,
                            modals, and structured content sections.
                        </p>

                        {/* CTA */}
                        <button
                            onClick={() => setIsOpen(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Get Started
                        </button>
                    </div>
                </section>

                {/* ABOUT */}
                <section className="min-h-screen flex items-center bg-white px-6 py-16">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">

                        <div>
                            <h2 className="text-4xl font-bold mb-4">About Us</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We are focused on building modern, fast, and scalable web applications
                                using React and clean UI principles. Our goal is to help developers
                                create better user experiences with less effort.
                            </p>

                            <p className="text-gray-600 leading-relaxed">
                                This layout demonstrates how to structure a homepage with a strong hero,
                                informative sections, and interactive UI elements like modals.
                            </p>
                        </div>

                        <div className="bg-gray-100 rounded-xl p-8 shadow-sm">
                            <h3 className="text-xl font-semibold mb-3">What we offer</h3>
                            <ul className="space-y-2 text-gray-700">
                                <li>✔ Modern React UI structures</li>
                                <li>✔ Responsive design systems</li>
                                <li>✔ Reusable components</li>
                                <li>✔ Clean UX patterns</li>
                            </ul>
                        </div>

                    </div>
                </section>

                {/* CONTACT */}
                <section className="min-h-screen flex items-center bg-gray-50 px-6 py-16">
                    <div className="max-w-5xl mx-auto w-full grid md:grid-cols-2 gap-10">

                        {/* INFO */}
                        <div>
                            <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
                            <p className="text-gray-600 mb-6">
                                Have questions or want to work with us? Send us a message and we’ll get back to you.
                            </p>

                            <div className="space-y-2 text-gray-700">
                                <p>📍 Laguna, Philippines</p>
                                <p>📧 support@example.com</p>
                                <p>📞 +63 900 000 0000</p>
                            </div>
                        </div>

                        {/* FORM */}
                        <form className="bg-white p-6 rounded-xl shadow space-y-4">
                            <input
                                type="text"
                                placeholder="Your Name"
                                className="w-full p-3 border rounded"
                            />

                            <input
                                type="email"
                                placeholder="Your Email"
                                className="w-full p-3 border rounded"
                            />

                            <textarea
                                placeholder="Your Message"
                                rows="5"
                                className="w-full p-3 border rounded"
                            />

                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
                            >
                                Send Message
                            </button>
                        </form>

                    </div>
                </section>

            </main>

            <Footer />

            {/* MODAL */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white w-[90%] max-w-md p-6 rounded-xl space-y-4">
                        <h3 className="text-xl font-bold">Get Started</h3>

                        <p className="text-gray-600">
                            You can place onboarding steps, signup forms, or product info here.
                        </p>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-gray-600"
                            >
                                Close
                            </button>

                            <button className="px-4 py-2 bg-blue-600 text-white rounded">
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Homepage;