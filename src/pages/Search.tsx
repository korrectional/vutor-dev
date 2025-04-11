import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import QuickLinkButton from "../components/QuickLinkButton";
import { ArrowLeft } from "lucide-react";
export const API_URL = import.meta.env.VITE_API_URL;

export default function Search() {
    const authUser = useAuthUser<any>();
    const navigate = useNavigate();
    const [parameters, setParameters] = useState({
        name: "",
        language: "",
        teaches: "select",
    });
    const [searched, setSearched] = useState(false);
    const [tutors, setTutors] = useState([]); // State to store the list of tutors

    const handleChange = (e) => {
        const { name, value } = e.target;

        //console.log("changing to ", name, value);
        setParameters((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    useEffect(() => {
        searchTutor();
    }, [parameters]);

    const searchTutor = () => {
        setSearched(true);
        //console.log("Searching for tutor with parameters:", parameters);
        console.log(parameters);
        fetch(API_URL + "/api/search-tutor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authUser.token, ...parameters }),
        }).then(async (res) => {
            const data = await res.json();
            //console.log("Data sent", data);
            setTutors(data);
        });
    };

    const openTutorPage = (id) => {
        navigate(`/search/tutor/${id}`);
    };

    const teaches = [
        " ",
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

    return (
        <div className="relative bg-white p-8 shadow-xl h-full rounded-2xl">
            {/* Back Link */}
            <div className="absolute top-4 left-4">
                <QuickLinkButton
                    href="/dashboard"
                    icon={<ArrowLeft size={20} />}
                    text="Back"
                />
            </div>
            <div className="pt-12 search-box flex">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Find a tutor for
                    <label className="block font-medium ml-3 text-xl">
                        <select
                            name="teaches"
                            value={parameters.teaches}
                            onChange={handleChange}
                            className="block w-full mt-1 p-2 border rounded-md"
                        >
                            {teaches.map((subject) => (
                                <option
                                    key={subject}
                                    value={subject
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}
                                >
                                    {subject}
                                </option>
                            ))}
                        </select>
                    </label>
                </h2>

                <button
                    onClick={searchTutor}
                    className="flex items-center p-3 justify-center gap-3 bg-blue-600 text-white py-3 px-6 font-medium hover:bg-blue-700 transition-colors duration-300 search-btn"
                >
                    Search
                </button>
            </div>
            {/* Search Form */}
            <div className="mt-4 space-y-2"></div>

            {/* Tutor List */}
            <div className="mt-6">
                {tutors.length > 0 ? (
                    <ul className="space-y-6">
                        {tutors.map((tutor, index) => (
                            <li
                                key={index}
                                className="bg-gray-100 rounded-lg shadow-md"
                            >
                                <a
                                    onClick={() => {
                                        openTutorPage(tutor._id);
                                    }}
                                    className="tutor-card"
                                >
                                    <div className="tutor-card-title bg-green-400 p-1 flex justify-center align-center">
                                        <p className="text-lg font-semibold text-center">
                                            <strong></strong> {tutor.name}
                                        </p>
                                    </div>

                                    <div className="tutor-card-body p-2">
                                        <p className="mt-2">
                                            <strong>GPA:</strong> {tutor.GPA}
                                        </p>
                                        <p className="mt-2">
                                            <strong>Description:</strong>{" "}
                                            {tutor.description
                                                ? tutor.description
                                                : "I am a tutor on Voluntor!"}
                                        </p>
                                        <p className="mt-2"></p>
                                        <p>
                                            <strong>Rating:</strong>{" "}
                                            {tutor.rating != 2.5
                                                ? tutor.rating
                                                : "This tutor has no ratings yet"}
                                        </p>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center mt-4">
                        {searched ? "No tutors found" : "Search for a tutor"}
                    </p>
                )}
            </div>
        </div>
    );
}
