import { useState, useEffect } from 'react';
import '../App.css';
import TextField from '../components/TextField';
import SettingsButton from '../components/SettingsButton';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

export default function Dashboard() {
    const authUser = useAuthUser<any>();
    const [message, setMessage] = useState({ message: '' });

    useEffect(() => {
        fetch("http://localhost:3000/api").then(
            response => response.json()
        ).then(
            data => setMessage(data)
        );
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center flex-1 bg-gray-100 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
                <h1 className="text-3xl font-semibold mb-6 text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mb-4">
                    {message.message || "Loading..."}
                </p>
                <p className="text-gray-600 mb-4">
                    {authUser ? authUser.email : "Not authenticated"}
                </p>
                <div className="mb-6">
                    <TextField type='default' placeholder='Enter some text here' />
                </div>
                <div className="mt-4 space-y-4">
                    <a href="/contact" className="text-blue-600 hover:underline block">Contact</a>
                    <a href="/search" className="text-blue-600 hover:underline block">Find tutor</a>
                    <a href="/chat" className="text-blue-600 hover:underline block">Chat</a>
                    {authUser?.role === "tutor" && (
                        <a href={`/search/tutor/${authUser._id}`} className="text-blue-600 hover:underline block">Your page</a>
                    )}
                </div>
                <div className="mt-6">
                    <SettingsButton />
                </div>
            </div>
        </div>
    );
}
