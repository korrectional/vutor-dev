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
        <div>
            <p className="read-the-docs">
                {message.message || "Loading..."}
            </p>
            <p>
                Welcome to the website, hello hello
            </p>
        
            <a href="/signin">Sign In</a>
            <div/>
            <a href="/signup">Sign Up</a>
            <div/>
            <a href="/chat">Chats</a>
        </div>
    )
}