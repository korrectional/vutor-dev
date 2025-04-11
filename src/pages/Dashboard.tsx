import { useState, useEffect } from "react";
import "../App.css";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { MessageCircle, Search } from "lucide-react";
import QuickLinkButton from "../components/QuickLinkButton";
export const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
    const authUser = useAuthUser<any>();
    const [message, setMessage] = useState({ message: "" });

    useEffect(() => {
        fetch(API_URL + "/api/hello", {
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
        <div className="bg-white p-8 shadow-xl h-full rounded-2xl">
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
    );
}
