import { Search, X } from "lucide-react";
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
        private_last_visit: false,
    });

    //Language selection state vars
    const [langMenuState, setLangMenuState] = useState(false);
    const langs = ["en", "es", "fr", "de", "hi"];
    const [langsRem, setLangsRem] = useState([]);
    const [langsToDisp, setLangsToDisp] = useState([]);
    const [langQuery, setLangQuery] = useState("");

    //Teaches selection state vars
    const [teachMenuState, setTeachMenuState] = useState(false);
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
    const [teachesToDisp, setTeachesToDisp] = useState([]);
    const [teachQuery, setTeachQuery] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/api/user/user-data", {
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

    useEffect(() => {
        setLangsToDisp(
            langsRem.filter((lang) => {
                return convertShortToLong(lang)
                    .toLowerCase()
                    .startsWith(langQuery.toLowerCase());
            }),
        );
    }, [langQuery, langsRem]);

    useEffect(() => {
        setTeachesToDisp(
            teachesRem.filter((teach) => {
                return teach.toLowerCase().startsWith(teachQuery.toLowerCase());
            }),
        );
    }, [teachQuery, teachesRem]);

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
        fetch("http://localhost:3000/api/user/user-modify", {
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

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Settings</h2>
            {settings.name === "LOADING" ? (
                <p>Loading Page</p>
            ) : (
                <div>
                    <div className="flex gap-5 max-w-1/2">
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

                    <label className="block mb-2 w-70">
                        Description:
                        <textarea
                            name="description"
                            value={settings.description}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-2 py-1"
                            style={{ resize: "none", minHeight: "100px" }}
                        />
                    </label>

                    <hr className="my-6 border-gray-300" />

                    <div className="flex justify-between mx-5">
                        <div className=" max-w-1/2">


                            <div className="flex ">
                                <label className="block mb-2 mx-4">
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

                        {settings.role === "tutor" && (
                            <div className="mb-2 max-w-1/2">
                                <label className="block mb-2">Teaches:</label>

                                {/*Selected subjects*/}
                                {settings.teaches.length ? (
                                    <div className="bg-white w-80 relative text-xs flex flex-wrap gap-1 p-2 mb-1">
                                        {settings.teaches.map(
                                            (teach: string) => (
                                                <div
                                                    key={teach}
                                                    className="rounded-full w-fit py-1 px-2.5 border border-gray-400 bg-gray-50 flex items-center gap-2"
                                                >
                                                    {capitalize(teach)}
                                                    <div
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
                                                        className="rounded-full p-0.5 hover:bg-gray-200 hover:cursor-pointer"
                                                        data-key={teach}
                                                    >
                                                        <X size={15} />
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : (
                                    "No subjects selected"
                                )}

                                {/*Select a subject*/}
                                <div
                                    className={
                                        "relative w-80 " +
                                        (teachMenuState ? "h-51" : "") +
                                        " mb-2 text-sm rounded-md"
                                    }
                                >
                                    <div
                                        className="flex items-center bg-white justify-between border border-gray-200 py-1 px-2 w-80 gap-2.5 shadow-md
                                    rounded-md"
                                    >
                                        <Search size={13} />

                                        <input
                                            type="text"
                                            className="bg-transparent text-sm flex-1 rounded-md px-2 py-1"
                                            placeholder="Search and add a subject to teach"
                                            value={teachQuery}
                                            onChange={(e) => {
                                                setTeachQuery(
                                                    e.currentTarget.value,
                                                );
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
                                            className="shadow-sm rounded-md bg-white absolute w-full max-h-40 mt-2 p-1 flex overflow-y-auto scroll-bar-thin
                                        scrollbar-track-slate-50"
                                        >
                                            <ul className="w-full mb-0 p-1">
                                                {teachesToDisp?.length
                                                    ? teachesToDisp.map(
                                                          (teach) => {
                                                              return (
                                                                  <li
                                                                      key={
                                                                          teach
                                                                      }
                                                                      data-key={
                                                                          teach
                                                                      }
                                                                      className="p-2 cursor-pointer hover:bg-blue-200"
                                                                      onMouseDown={(
                                                                          e,
                                                                      ) =>
                                                                          e.preventDefault()
                                                                      }
                                                                      onClick={(
                                                                          e,
                                                                      ) => {
                                                                          setTeachMenuState(
                                                                              true,
                                                                          );
                                                                          handleTeachesChange(
                                                                              e.currentTarget.getAttribute(
                                                                                  "data-key",
                                                                              ),
                                                                              false,
                                                                          );
                                                                          setTeachesRem(
                                                                              teachesRem.filter(
                                                                                  (
                                                                                      t,
                                                                                  ) =>
                                                                                      t !==
                                                                                      e.currentTarget.getAttribute(
                                                                                          "data-key",
                                                                                      ),
                                                                              ),
                                                                          );
                                                                          setTeachQuery(
                                                                              "",
                                                                          );
                                                                      }}
                                                                  >
                                                                      {capitalize(
                                                                          teach,
                                                                      )}
                                                                  </li>
                                                              );
                                                          },
                                                      )
                                                    : "No More Subjects"}
                                            </ul>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

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
