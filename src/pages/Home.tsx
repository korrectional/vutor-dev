import { useState, useEffect } from 'react'
import '../App.css'
import TextField from '../components/TextField'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

interface IUserData { // this is how we tell typescript that auth will return email
    email: string;
    token: string;
};


export default function Home() {
    const authUser = useAuthUser<IUserData>();
    let email = "Not authenticated";
    if(authUser)
    {
        email = authUser.email;
    }

    const [message, setMessage] = useState({message: ''})

    useEffect(() => {
        fetch("http://localhost:3000/api").then(
            response => response.json()
        ).then(
            data => setMessage(data)
        )
    
    }, [])


    return (
        <div>
            <p className="read-the-docs">
                {message.message || "Loading..."}
            </p>
            <p>
                {email || "Loading"}
            </p>
            <TextField placeholder='Enter some text here' type='Default'/>
            <a href="/contact">Contact</a>
            <div/>
            <a href="/signin">Sign In</a>
            <div/>
            <a href="/signup">Sign Up</a>
            <div/>
            <a href="/chat">Chats</a>
        </div>
    )
}