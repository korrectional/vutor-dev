/*
const newUser = {
    email,
    password: pass, // Store hashed password
    name: (fName + " " + lName),
    phone: phone,
    role: isTutor ? "tutor" : "student",
    chats: [],
    // the following is information which is later defined by the user
    description: "",
    languages: ["en"],
    state: "",
    GPA: 0.0,
    // tutor specific (leave blank for students)
    teaches: [], // all the classes this tutor teaches
    rating: 0.0,

    createdAt: new Date(),
  };
  */

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
                : (prevSettings.language || []).filter(
                      (lang) => lang !== value,
                  ), // Remove if unchecked
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
        <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
            <h2>Settings</h2>
            {settings.name === "LOADING" ? (
                <p>Loading Page</p>
            ) : (
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={settings.name}
                            onChange={handleChange}
                        />
                    </label>
                    <br />

                    <label>
                        Role:
                        <select
                            name="role"
                            value={settings.role}
                            onChange={handleChange}
                        >
                            <option value="student">Student</option>
                            <option value="tutor">Tutor</option>
                        </select>
                    </label>
                    <br />

                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={settings.description}
                            onChange={handleChange}
                        />
                    </label>
                    <br />

                    <label>Language:</label>
                    <div>
                        {["en", "es", "fr", "de"].map((lang) => (
                            <label key={lang}>
                                <input
                                    type="checkbox"
                                    name="language"
                                    value={lang}
                                    checked={settings.language?.includes(lang)} // Check if the language is selected
                                    onChange={handleToggle}
                                />
                                {lang === "en"
                                    ? "English"
                                    : lang === "es"
                                      ? "Spanish"
                                      : lang === "fr"
                                        ? "French"
                                        : "German"}
                            </label>
                        ))}
                    </div>
                    <br />

                    <label>
                        State:
                        <input
                            type="text"
                            name="state"
                            value={settings.state}
                            onChange={handleChange}
                        />
                    </label>
                    <br />

                    <label>
                        GPA:
                        <input
                            type="number"
                            name="GPA"
                            step="0.1"
                            min="0.0"
                            max="4.0"
                            value={settings.GPA}
                            onChange={handleChange}
                        />
                    </label>
                    <br />

                    {settings.role === "tutor" ? (
                        <div>
                            <label>Teaches:</label>
                            <div>
                                {["math", "english", "science", "history"].map(
                                    (subject) => (
                                        <label key={subject}>
                                            <input
                                                type="checkbox"
                                                name="teaches"
                                                value={subject}
                                                checked={settings.teaches.includes(
                                                    subject,
                                                )} // Check if the subject is selected
                                                onChange={handleTeachesToggle}
                                            />
                                            {subject.charAt(0).toUpperCase() +
                                                subject.slice(1)}{" "}
                                            {/* Capitalize the subject */}
                                        </label>
                                    ),
                                )}
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )}

                    <br />

                    <button onClick={saveSettings}>Save</button>
                </div>
            )}
        </div>
    );
}
