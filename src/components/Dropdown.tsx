import { useState } from "react";
import SettingsDashboard from "./SettingsDashboard";

interface Props {}

export default function Dropdown(props: Props) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    return (
        <div>
            <button onClick={() => setIsPopupOpen(true)}>Settings</button>
            {isPopupOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        zIndex: 1000,
                    }}
                >
                    <button onClick={() => setIsPopupOpen(false)}>✖</button>
                    <SettingsDashboard />
                </div>
            )}
        </div>
    );
}
