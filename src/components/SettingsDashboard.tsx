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

import React, { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function SettingsDashboard() {
    const authUser = useAuthUser<any>();
    const [settings, setSettings] = useState({
        name: "ERROR",
        role: "ERROR",
        description: "",
        language: "ERROR",
        state: "",
        GPA: 4.0,
        teaches: "ERROR",
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
                description: data.role,
                language: data.role,
                state: data.state,
                GPA: data.GPA,
                teaches: data.teaches,
            }))
        })
    },[])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => ({
        ...prevSettings,
        [name]: value,
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
        })
    };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Settings</h2>
      {settings.name === "ERROR" ? (
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
                <select name="role" value={settings.role} onChange={handleChange}>
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

            <label>
                Language:
                <select name="language" value={settings.language} onChange={handleChange}>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                </select>
            </label>
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

            <label>
                Teaches:
                <select name="teaches" value={settings.teaches} onChange={handleChange}>
                <option value="math">Math</option>
                <option value="english">English</option>
                </select>
            </label>
            <br />

            <button onClick={saveSettings}>Save</button>
        </div>
    )}
    </div>
  );
}
