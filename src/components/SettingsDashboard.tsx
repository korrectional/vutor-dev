import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function SettingsDashboard() {
    const authUser = useAuthUser<any>();
    const [settings, setSettings] = useState({
        name: "LOADING",
        role: "",
        description: "",
        language: [],
        state: "",
        GPA: 4.0,
        teaches: [],
    });

    useEffect(() => {
        fetch("http://localhost:3000/api/user/user-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authUser.token }),
        }).then(async (res) => {
            const data = await res.json();
            setSettings(() => ({
                name: data.name,
                role: data.role,
                description: data.description,
                language: data.language,
                state: data.state,
                GPA: data.GPA,
                teaches: data.teaches,
            }));
        });
    }, []);

    const handleChange = (e) => {
        const { name, value, options } = e.target;
        if (e.target.multiple) {
            const selectedValues = Array.from(options)
                .filter((option) => option?.selected)
                .map((option) => option?.value);

            setSettings((prevSettings) => ({
                ...prevSettings,
                [name]: selectedValues,
            }));
        } else {
            setSettings((prevSettings) => ({
                ...prevSettings,
                [name]: value,
            }));
        }
    };

    const handleToggle = (e) => {
        const { value, checked } = e.target;

        setSettings((prevSettings) => ({
            ...prevSettings,
            language: checked
                ? [...(prevSettings.language || []), value] // Add if checked
                : (prevSettings.language || []).filter((lang) => lang !== value), // Remove if unchecked
        }));
    };

    const handleTeachesToggle = (e) => {
        const { value, checked } = e.target;

        setSettings((prevSettings) => ({
            ...prevSettings,
            teaches: checked
                ? [...prevSettings.teaches, value] // Add if checked
                : prevSettings.teaches.filter((teach) => teach !== value), // Remove if unchecked
        }));
    };

    const saveSettings = () => {
        console.log("Updated Settings:", settings);
        fetch("http://localhost:3000/api/user/user-modify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authUser.token, ...settings }),
        }).then(async (res) => {
            console.log("data modified", await res.json());
        });
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            {settings.name === "LOADING" ? (
                <p>Loading Page</p>
            ) : (
                <div>
                    <label className="block mb-2">
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={settings.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </label>

                    <label className="block mb-2">
                        Role:
                        <select
                            name="role"
                            value={settings.role}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                        </select>
                    </label>

                    <label className="block mb-2">
                        Description:
                        <textarea
                            name="description"
                            value={settings.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </label>

                    <label className="block mb-2">Language:</label>
                    <div className="mb-2">
                        {["en", "es", "fr", "de"].map((lang) => (
                            <label key={lang} className="inline-flex items-center mr-4">
                                <input
                                    type="checkbox"
                                    name="language"
                                    value={lang}
                                    checked={settings.language?.includes(lang)} // Check if the language is selected
                                    onChange={handleToggle}
                                    className="form-checkbox"
                                />
                                <span className="ml-2">
                                    {lang === "en"
                                        ? "English"
                                        : lang === "es"
                                        ? "Spanish"
                                        : lang === "fr"
                                        ? "French"
                                        : "German"}
                                </span>
                            </label>
                        ))}
                    </div>

                    <label className="block mb-2">
                        State:
                        <input
                            type="text"
                            name="state"
                            value={settings.state}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </label>

                    <label className="block mb-2">
                        GPA:
                        <input
                            type="number"
                            name="GPA"
                            step="0.1"
                            min="0.0"
                            max="4.0"
                            value={settings.GPA}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </label>

                    {settings.role === "tutor" && (
                        <div className="mb-2">
                            <label className="block mb-2">Teaches:</label>
                            <div>
                                {["math", "english", "science", "history"].map((subject) => (
                                    <label key={subject} className="inline-flex items-center mr-4">
                                        <input
                                            type="checkbox"
                                            name="teaches"
                                            value={subject}
                                            checked={settings.teaches.includes(subject)} // Check if the subject is selected
                                            onChange={handleTeachesToggle}
                                            className="form-checkbox"
                                        />
                                        <span className="ml-2">
                                            {subject.charAt(0).toUpperCase() + subject.slice(1)} {/* Capitalize the subject */}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={saveSettings}
                        className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
                    >
                        Save
                    </button>

                </div>
            )}
        </div>
    );
}
