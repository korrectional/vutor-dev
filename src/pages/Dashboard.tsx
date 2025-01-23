import { useState, useEffect } from 'react'
import '../App.css'
import TextField from '../components/TextField'
import SettingsButton from '../components/SettingsButton';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';


export default function Dashboard() {
    const authUser = useAuthUser<any>();
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
            <div>
                <p>DASHBOARD</p>
            </div>
            <p className="read-the-docs">
                {message.message || "Loading..."}
            </p>
            <p>
                {email || "Loading"}
            </p>
            <TextField placeholder='Enter some text here'/>
            <a href="/contact">Contact</a>
            <br/>
            <a href="/search">Find tutor</a>
            <div/>
            <SettingsButton/>
        </div>
    )
}