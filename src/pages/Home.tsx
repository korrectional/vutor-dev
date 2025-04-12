import { useEffect, useState } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router";
export const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
    const [message, setMessage] = useState({ message: "" });
    const [studentsCount, setStudentsCount] = useState(0);
    const [tutorsCount, setTutorsCount] = useState(0);
    const authUser = useAuthUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser) {
            navigate("/dashboard");
        }

        // Fetch API message
        axios({
            method: "GET",
            url: API_URL + "/api",
        }).then((response) => setMessage(response.data));

        // Simulate fetching student and tutor counts
        setTimeout(() => {
            setStudentsCount(10); // Replace with API call if available
            setTutorsCount(4); // Replace with API call if available
        }, 1000);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center flex-1 bg-white min-h-screen text-gray-900">
            <div className="p-8 w-full max-w-4xl">
                {/* Hero Section */}
                <h1 className="text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                    Welcome to Voluntors
                </h1>
                <p className="text-2xl mb-6 bg-clip-text from-blue-500 via-purple-500 to-pink-500">
                    We connect students and tutors from all over the US. Join us
                    to start learning or teaching today!
                </p>

                <hr className="my-6 border-gray-300 w-full" />

                {/* How It Works Section */}
                <div className="text-left bg-gray-100 text-gray-900 p-6 rounded-lg shadow-lg">
                    <h2 className="text-4xl font-semibold mb-4">
                        How this works:
                    </h2>
                    <p className="text-lg mb-4">
                        <strong>Students:</strong>
                    </p>
                    <ul className="list-disc list-inside text-lg mb-6">
                        <li>Need help with one of your classes?</li>
                        <li>Create a student account</li>
                        <li>Use our search engine to find a tutor</li>
                        <li>You're good to go!</li>
                    </ul>
                    <p className="text-lg mb-4">
                        <strong>Student volunteers:</strong>
                    </p>
                    <ul className="list-disc list-inside text-lg">
                        <li>
                            Do you want to earn volunteer hours by helping
                            students?
                        </li>
                        <li>Create a tutor account</li>
                        <li>Write a nice bio</li>
                        <li>Check your messages regularly!</li>
                    </ul>
                </div>

                {/* Counter Section */}
                <div className="mt-12 bg-gray-100 text-gray-900 p-6 rounded-lg shadow-lg">
                    <h2 className="text-4xl font-semibold mb-6 text-center">
                        Our Community (beta)
                    </h2>
                    <div className="flex justify-around">
                        <div className="text-center">
                            <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                {studentsCount}
                            </h3>
                            <p className="text-xl">Students</p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                                {tutorsCount}
                            </h3>
                            <p className="text-xl">Tutors</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
