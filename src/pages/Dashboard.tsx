import { useState, useEffect } from "react";
import "../App.css";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { LogOut, MessageCircle, Search, Settings } from "lucide-react";

export default function Dashboard() {
    const authUser = useAuthUser<any>();
    const [message, setMessage] = useState({ message: "" });

    useEffect(() => {
        fetch("http://localhost:3000/api/hello", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authUser.token }),
        })
            .then((response) => response.json())
            .then((data) => setMessage(data));
    }, [authUser.token]);

    return (
        <div className="flex flex-col min-h-screen bg-green-200 text-gray-900">
            {/* Navbar */}
            <nav className="w-full bg-white py-4 px-6 flex justify-between items-center shadow-sm">
                <h1 className="text-green-600 text-2xl font-bold mx-auto">
                    voluntor
                </h1>
                <div className="flex items-center gap-4">
                    <a
                        href="/signout"
                        className="flex items-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </a>
                    <a
                        href="/settings"
                        className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                    >
                        <Settings size={18} />
                    </a>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="p-8 h-full">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Welcome, {authUser?.name || "User"}!
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        {message.message || "Loading..."}
                    </p>

                    <hr className="border-gray-300 my-4" />

                    {/* Quick Links */}
                    <div className="flex justify-between mb-4">
                        <QuickLinkButton
                            href="/search"
                            icon={<Search size={20} />}
                            text="Find Tutor"
                        />
                        <QuickLinkButton
                            href="/chat"
                            icon={<MessageCircle size={20} />}
                            text="Chat"
                        />
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-4 bg-white text-center text-gray-600 mt-auto">
                <p>
                    Voluntor 2025,{" "}
                    <a href="/contact" className="text-green-600">
                        Contact
                    </a>
                </p>
            </footer>
        </div>
    );
}

function QuickLinkButton({ href, icon, text }) {
    return (
        <a
            href={href}
            className="flex items-center justify-center gap-3 bg-green-600 text-white py-3 px-6 font-medium rounded-lg hover:bg-green-700 transition-colors duration-300"
        >
            {icon}
            {text}
        </a>
    );
}
