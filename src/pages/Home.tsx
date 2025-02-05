import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useNavigate } from 'react-router';

const Home = () => {
    const [message, setMessage] = useState({ message: '' });
    const authUser = useAuthUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (authUser) {
            navigate('/dashboard');
        }

        axios({
            method: 'GET',
            url: 'http://localhost:3000/api',
        }).then(
            response => setMessage(response.data)
        );
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center flex-1 bg-gray-100 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
                <p className="text-gray-600 mb-4">
                    {message.message || "Loading..."}
                </p>
                <p className="text-3xl font-semibold mb-6 text-gray-900">
                    Welcome to the website
                </p>
                <div className="flex space-x-4">
                    <a href="/signin" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">Sign In</a>
                    <a href="/signup" className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition">Sign Up</a>
                </div>
            </div>
        </div>
    );
};

export default Home;
