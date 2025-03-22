import { LogOut, Settings } from "lucide-react";
import React from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function TopNavBar() {
    const authUser = useAuthUser();
    return (
        <nav className="w-full bg-white py-2 px-4 justify-between flex shadow-sm">
            <a className="text-blue-600 text-3xl font-bold" href="/dashboard">
                Voluntor
            </a>
            {authUser ? (
                <div className="flex self-end items-center gap-4">
                    <a
                        href="/signout"
                        className="flex items-center gap-2 rounded-full bg-red-500 text-white font-semibold py-2 px-4 hover:bg-red-600 transition-colors duration-300"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </a>
                    <a
                        href="/settings"
                        className="flex items-center rounded-full justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-100 transition-colors duration-300"
                    >
                        <Settings size={18} />
                    </a>
                </div>
            ) : (
                <div></div>
            )}
        </nav>
    );
}
