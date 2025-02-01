import { useState, useEffect } from 'react'
import '../App.css'
import { useNavigate } from 'react-router';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import TextField from '../components/TextField'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import axios from 'axios';

interface IUserData { // this is how we tell typescript that auth will return email
    email: string;
    token: string;
};

export default function Home() {
    const navigate = useNavigate();
    const [message, setMessage] = useState({message: ''})
    const isAuthenticated = useIsAuthenticated();
    
    useEffect(() => {
        axios({
            method: 'GET',
            url: 'http://localhost:3000/api',
        }).then(
            response => setMessage(response.data)
        );
    }, [])


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <p className="text-gray-600 mb-4">
                { message.message || "Loading..." }
            </p>
            <p className="text-xl font-semibold mb-6">
                Welcome to the website, hello hello
            </p>
            <a href="/signin" className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-2 hover:bg-blue-600 transition">Sign In</a>
            <a href="/signup" className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded hover:bg-gray-400 transition">Sign Up</a>
        </div>
    )
}