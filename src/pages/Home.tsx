import { useEffect, useState } from "react";
import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router";

const Home = () => {
    const [message, setMessage] = useState({ message: "" });
    const authUser = useAuthUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser) {
            navigate("/dashboard");
        }

        axios({
            method: "GET",
            url: "http://localhost:3000/api",
        }).then((response) => setMessage(response.data));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center flex-1 bg-green-100 min-h-screen">
            <div className="p-8 w-full max-w-4xl">
                <h1 className="text-5xl font-bold mb-6 text-gray-900">
                    Welcome to Our Platform
                </h1>
                <p className="text-xl mb-6 text-gray-700">
                    We connect students and tutors from all over the world. Join
                    us to start learning or teaching today!
                </p>

                <hr className="my-6 border-gray-300 w-full" />

                <div className="text-left">
                    <h2 className="text-3xl font-semibold mb-4 text-gray-900">
                        Why Choose Us?
                    </h2>
                    <p className="text-lg mb-4 text-gray-700">
                        Our platform offers a variety of features to help you
                        succeed:
                    </p>
                    <ul className="list-disc list-inside text-lg text-gray-700">
                        <li>Flexible scheduling</li>
                        <li>Personalized learning plans</li>
                        <li>It's Free!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Home;
