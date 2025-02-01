import { useState } from "react";
import SettingsDashboard from "./SettingsDashboard";

export default function SettingsButton() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    return (
        <div>
            <button
                onClick={() => setIsPopupOpen(true)}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                Settings
            </button>
            {isPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <button
                            onClick={() => setIsPopupOpen(false)}
                            className="text-gray-500 hover:text-gray-700 transition absolute top-4 right-4"
                        >
                            ✖
                        </button>
                        <SettingsDashboard />
                    </div>
                </div>
            )}
        </div>
    );
}