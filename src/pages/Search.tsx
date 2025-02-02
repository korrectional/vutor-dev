import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function Search() {
    const authUser = useAuthUser<any>();
    const navigate = useNavigate();
    const [parameters, setParameters] = useState({
        name: "",
        language: "",
        //state: "",
        teaches: "english",
    });
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
<div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
    {/* Back Link */}
    <a href="/dashboard" className="text-blue-500 hover:underline">
        ← Go back
    </a>

    {/* Heading */}
    <h2 className="text-xl font-semibold mt-4">Search</h2>

    {/* Search Form */}
    <div className="mt-4 space-y-2">
        <label className="block font-medium">
            Class:
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
            className="w-full mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
            Search
        </button>
    </div>

    {/* Tutor List */}
    <div className="mt-6">
        {tutors.length > 0 ? (
            <ul className="space-y-4">
                {tutors.map((tutor, index) => (
                    <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                        <p><strong>Name:</strong> {tutor.name}</p>
                        <p><strong>GPA:</strong> {tutor.GPA}</p>
                        <p><strong>Description:</strong> {tutor.description}</p>
                        <p><strong>Rating:</strong> {tutor.rating}</p>

                        <button
                            onClick={() => openTutorPage(tutor._id)}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        >
                            More
                        </button>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-500 text-center mt-4">No tutors found.</p>
        )}
    </div>
</div>
    );
}
