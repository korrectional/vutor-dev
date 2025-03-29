import { LogOut, Settings } from "lucide-react";
import React from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function TopNavBar() {
    const authUser = useAuthUser();
    return (
        <nav className="flex w-full bg-white py-2 px-4 justify-between shadow-sm">
            <div className="flex-start">
                <a className={"text-blue-600 text-3xl font-bold pb-0.5 pr-5 border-gray-400" + (authUser ? " border-r-2" : "")} href="/dashboard">
                    Voluntor
                </a>
                {authUser ? (
                        <a 
                            href="/dashboard"
                            className="font-normal text-xl ml-5"
                        >
                            Dashboard
                        </a>
                    )
                    : (
                        <div></div>
                    )
                }
            </div>

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
                <div className="flex self-end items-center gap-4">
                    <a
                        href="/signin"
                        className="bg-blue-600 text-white font-bold py-1.5 px-4 rounded-full hover:bg-green-700 transition"
                    >
                        Sign In
                    </a>
                    <a
                        href="/signup"
                        className="bg-gray-300 text-gray-700 font-bold py-1.5 px-4 rounded-full hover:bg-gray-400 transition"
                    >
                        Sign Up
                    </a>
                </div>
            )}
        </nav>
    );
}
