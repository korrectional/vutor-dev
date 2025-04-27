import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
export const API_URL = import.meta.env.VITE_API_URL;

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
        private_last_visit: false,
    });

    //Language selection state vars
    const [langMenuState, setLangMenuState] = useState(false);
    const langs = ["en", "es", "fr", "de", "hi"];
    var temp = "";
    const [langsRem, setLangsRem] = useState([]);
    const [langsToDisp, setLangsToDisp] = useState([]);
    const [langQuery, setLangQuery] = useState("");

    //Teaches selection state vars
    const teaches = [
        "AP Precalculus",
        "AP Calculus AB",
        "AP Calculus BC",
        "Chemistry",
        "Biology",
        "Physics",
        "AP Physics 1",
        "AP Physics 2",
        "AP Physics C",
        "AP Chemistry",
        "AP Biology",
        "AP Environmental Science",
        "AP Computer Science A",
        "AP Computer Science Principles",
        "AP Statistics",
        "AP Psychology",
        "AP US History",
        "AP World History",
        "AP European History",
        "AP Government",
        "AP Economics",
        "AP Human Geography",
    ];
    const [teachesRem, setTeachesRem] = useState([]);

    useEffect(() => {
        fetch(API_URL + "/api/user/user-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authUser.token }),
        }).then(async (res) => {
            const data = await res.json();
            let subjects = [];
            data.teaches.forEach((subject) => {
                subjects.push(removeDashes(subject));
            });
            setSettings(() => ({
                name: data.name,
                role: data.role,
                description: data.description,
                language: data.language,
                state: data.state,
                GPA: data.GPA,
                teaches: subjects,
                private_last_visit: data.private_last_visit,
            }));

            // Populate `teachesRem` with subjects not already selected
            setTeachesRem(
                teaches.filter((teach) => !data.teaches.includes(teach)),
            );
            setLangsRem(langs.filter((lang) => !data.language.includes(lang)));
        });
    }, []);

    function convertShortToLong(shortLang): string {
        switch (shortLang) {
            case "en":
                return "English";
            case "es":
                return "Spanish";
            case "fr":
                return "French";
            case "de":
                return "German";
            case "hi":
                return "Hindi";
            default:
                return shortLang;
        }
    }

    function removeDashes(str: string): string {
        return str.replace(/-/g, " ");
    }

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

    const handleLangChange = (lang, remove: Boolean) => {
        if (remove) {
            setSettings((prev) => ({
                ...prev,
                language: (prev.language || []).filter((l) => l !== lang),
            }));
        } else {
            setSettings((prev) => ({
                ...prev,
                language: [...(prev.language || []), lang],
            }));
        }
    };

    const handleTeachesChange = (teach, remove: boolean) => {
        if (remove) {
            setSettings((prev) => ({
                ...prev,
                teaches: prev.teaches.filter((t) => t !== teach),
            }));
        } else {
            setSettings((prev) => ({
                ...prev,
                teaches: [...(prev.teaches || []), teach],
            }));
        }
    };

    const capitalize = (subject: string) => {
        return subject
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const saveSettings = () => {
        // modify subjects so they fit the database's format
        for (let i = 0; i < settings.teaches.length; i++) {
            settings.teaches[i] = settings.teaches[i]
                .toLowerCase()
                .replace(/\s/g, "-");
        }
        //console.log("Teaches:", settings.teaches);

        //console.log("Updated Settings:", settings);
        fetch(API_URL + "/api/user/user-modify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authUser.token, ...settings }),
        }).then(async (res) => {
            //console.log("data modified", await res.json());
        });
        setLangMenuState(false);
        alert("Settings saved successfully!");
        location.reload();
    };

    function SubjectSelect() {
        const [teachQuery, setTeachQuery] = useState("");
        const [teachMenuState, setTeachMenuState] = useState(false);
        const [displaying, setDisplaying] = useState([]);

        useEffect(() => {
            const filteredTeaches = teachesRem.filter((teach) =>
                teach.toLowerCase().includes(teachQuery.toLowerCase()),
            );
            filteredTeaches.sort();
            setDisplaying(filteredTeaches);
        }, [teachQuery]);

        if (settings.role === "tutor") {
            return (
                <div className="mb-2">
                    <label className="block">Subjects you tutor:</label>

                    {/*Selected subjects*/}
                    {settings.teaches.length ? (
                        <div
                            className={`bg-white relative text-xs ${window.innerWidth > 768 ? "w-80" : ""} flex flex-wrap gap-1 p-2 mb-1`}
                        >
                            {settings.teaches.map((teach: string) => (
                                <div
                                    key={teach}
                                    className={
                                        "rounded-full w-fit py-1 px-2.5 border border-gray-400 bg-gray-50 flex items-center gap-2"
                                    }
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleTeachesChange(
                                            e.currentTarget.getAttribute(
                                                "data-key",
                                            ),
                                            true,
                                        );
                                        setTeachesRem([
                                            ...teachesRem,
                                            e.currentTarget.getAttribute(
                                                "data-key",
                                            ),
                                        ]);
                                    }}
                                    data-key={teach}
                                >
                                    {capitalize(teach)}
                                    <div className="rounded-full p-0.5 hover:bg-gray-200 hover:cursor-pointer">
                                        <X size={15} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 mb-2">
                            No subjects selected
                        </p>
                    )}

                    {/*Select a subject*/}
                    <div
                        className={
                            "relative " +
                            (teachMenuState ? "h-51" : "") +
                            (window.innerWidth < 768 ? " w-full " : " w-80 ") +
                            " mb-2 text-sm rounded-md"
                        }
                    >
                        <div
                            className={
                                "flex items-center bg-white justify-between border border-gray-200 " +
                                (window.innerWidth > 768
                                    ? "py-1 px-2"
                                    : "px-0.5") +
                                " w-full gap-2.5 shadow-md rounded-md"
                            }
                        >
                            {window.innerWidth > 768 ? (
                                <Search size={13} />
                            ) : (
                                ""
                            )}

                            <input
                                type="text"
                                className={
                                    "flex-1 rounded-md py-1 " +
                                    (window.innerWidth > 768 ? "px-2" : "pl-2")
                                }
                                placeholder={
                                    window.innerWidth > 768
                                        ? "Search and add a subject to teach"
                                        : "Search and add a subject"
                                }
                                onChange={(e) => {
                                    setTeachQuery(e.target.value);
                                }}
                                onFocus={() => {
                                    setTeachMenuState(true);
                                }}
                                onBlur={() => {
                                    setTeachMenuState(false);
                                }}
                            />
                        </div>

                        {/*Menu*/}
                        {teachMenuState ? (
                            <div
                                className="shadow-sm rounded-md w-full bg-white absolute max-h-40 mt-2 p-1 flex overflow-y-auto scroll-bar-thin
                            scrollbar-track-slate-50"
                            >
                                <ul className="w-full mb-0 p-1" id="menu">
                                    {displaying.length ? (
                                        displaying.map((teach: string) => (
                                            <li
                                                key={teach}
                                                className="flex items-center justify-between gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                                                onMouseDown={(e) =>
                                                    e.preventDefault()
                                                }
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleTeachesChange(
                                                        teach,
                                                        false,
                                                    );
                                                    setTeachesRem(
                                                        teachesRem.filter(
                                                            (t) => t !== teach,
                                                        ),
                                                    );

                                                    setTeachMenuState(true);
                                                }}
                                            >
                                                {capitalize(teach)}
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-center text-sm text-gray-500">
                                            No subjects found
                                        </p>
                                    )}
                                </ul>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            {settings.name === "LOADING" ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div className="flex gap-5 lg:max-w-1/2 sm:max-w-full md:mb-4">
                        <label className="block mb-2">
                            Name:
                            <input
                                type="text"
                                name="name"
                                value={settings.name}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm px-2 py-1"
                            />
                        </label>

                        <label className="block mb-2">
                            Role:
                            <select
                                name="role"
                                value={settings.role}
                                onChange={handleChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1"
                            >
                                <option value="student">Student</option>
                                <option value="tutor">Tutor</option>
                            </select>
                        </label>
                    </div>

                    <label
                        className={
                            "block mb-2 " +
                            (window.innerWidth > 767 ? "max-w-1/2" : "w-full")
                        }
                    >
                        Description:
                        <textarea
                            name="description"
                            value={settings.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1"
                            style={{ resize: "none", minHeight: "100px" }}
                        />
                    </label>

                    <hr className="my-2 mt-4 border-gray-300" />

                    {window.innerWidth > 767 ? (
                        <div className="flex justify-between mx-5">
                            <div className=" max-w-1/2">
                                <div className="flex ">
                                    <label className="block mb-2">
                                        State:
                                        <input
                                            type="text"
                                            name="state"
                                            value={settings.state}
                                            onChange={handleChange}
                                            className="mt-1 block w-30 border border-gray-300 rounded-md shadow-sm px-2 py-1"
                                        />
                                    </label>

                                    <label className="block mb-2 mx-4">
                                        GPA:
                                        <input
                                            type="number"
                                            name="GPA"
                                            step="0.1"
                                            min="0.0"
                                            max="4.0"
                                            value={settings.GPA}
                                            onChange={handleChange}
                                            className="mt-1 block w-30 border border-gray-300 rounded-md shadow-sm px-2 py-1"
                                        />
                                    </label>
                                </div>

                                <label className="flex items-center gap-2 mb-4">
                                    <input
                                        type="checkbox"
                                        checked={!settings.private_last_visit}
                                        onChange={(e) =>
                                            setSettings((prevSettings) => ({
                                                ...prevSettings,
                                                private_last_visit:
                                                    !e.target.checked,
                                            }))
                                        }
                                    />
                                    Display last visit
                                </label>
                            </div>

                            <SubjectSelect />
                        </div>
                    ) : (
                        <div>
                            <div className="flex gap-2">
                                <label className="block w-2/3 mb-2">
                                    State:
                                    <input
                                        type="text"
                                        name="state"
                                        value={settings.state}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1"
                                    />
                                </label>

                                <label className="block mb-2 w-1/3">
                                    GPA:
                                    <input
                                        type="number"
                                        name="GPA"
                                        step="0.1"
                                        min="0.0"
                                        max="4.0"
                                        value={settings.GPA}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1"
                                    />
                                </label>
                            </div>

                            <SubjectSelect />

                            <label className="flex items-center gap-2 mb-4">
                                <input
                                    type="checkbox"
                                    checked={!settings.private_last_visit}
                                    onChange={(e) =>
                                        setSettings((prevSettings) => ({
                                            ...prevSettings,
                                            private_last_visit:
                                                !e.target.checked,
                                        }))
                                    }
                                />
                                Display last visit
                            </label>
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
