import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import QuickLinkButton from "../components/QuickLinkButton";
import { ArrowLeft } from "lucide-react";

export default function Search() {
    const authUser = useAuthUser<any>();
    const navigate = useNavigate();
    const [parameters, setParameters] = useState({
        name: "",
        language: "",
        teaches: "english",
    });
    const [searched, setSearched] = useState(false);
    const [tutors, setTutors] = useState([]); // State to store the list of tutors

    const handleChange = (e) => {
        const { name, value } = e.target;

        console.log("changing to ", name, value);
        setParameters((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const searchTutor = () => {
        setSearched(true);
        console.log("Searching for tutor with parameters:", parameters);
        fetch("http://localhost:3000/api/search-tutor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authUser.token, ...parameters }),
        }).then(async (res) => {
            const data = await res.json();
            console.log("Data sent", data);
            setTutors(data);
        });
    };

    const openTutorPage = (id) => {
        navigate(`/search/tutor/${id}`);
    };

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
            <div className="pt-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Find a tutor for
                </h2>
            </div>
            {/* Search Form */}
            <div className="mt-4 space-y-2">
                <label className="block font-medium">
                    <select
                        name="teaches"
                        value={parameters.teaches}
                        onChange={handleChange}
                        className="block w-full mt-1 p-2 border rounded-md"
                    >
                        <option value="math">Math</option>
                        <option value="english">English</option>
                    </select>
                </label>

                <button
                    onClick={searchTutor}
                    className="flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-6 font-medium hover:bg-blue-700 transition-colors duration-300 rounded-full"
                >
                    Search
                </button>
            </div>

            {/* Tutor List */}
            <div className="mt-6">
                {tutors.length > 0 ? (
                    <ul className="space-y-6">
                        {tutors.map((tutor, index) => (
                            <li
                                key={index}
                                className="p-6 bg-gray-100 rounded-lg shadow-md"
                            >
                                <p className="text-lg font-semibold">
                                    <strong></strong> {tutor.name}
                                </p>
                                <p className="mt-2">
                                    <strong>GPA:</strong> {tutor.GPA}
                                </p>
                                <p className="mt-2">
                                    <strong>Description:</strong>{" "}
                                    {tutor.description}
                                </p>
                                <p className="mt-2"></p>
                                <p>
                                    <strong>Rating:</strong> {tutor.rating}
                                </p>

                                <button
                                    onClick={() => openTutorPage(tutor._id)}
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                                >
                                    More
                                </button>
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
