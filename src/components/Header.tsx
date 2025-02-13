import { LogOut, Settings } from "lucide-react";

export default function Header() {
    return (
        <nav className="w-full bg-white py-4 px-6 flex justify-between items-center shadow-sm">
            <h1 className="text-blue-600 text-2xl font-bold mx-auto">
                voluntor
            </h1>
            <div className="flex items-center gap-4">
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
        </nav>
    );
}
