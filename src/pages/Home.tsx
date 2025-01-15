import { useState, useEffect } from 'react'
import '../App.css'
import axios from 'axios'
import TextField from '../components/TextField'


export default function Home() {
    const [message, setMessage] = useState({message: ''})

    const fetchAPI = async () => {
        const response = await axios.get('http://localhost:3000/api');
        console.log(response.data);
        setMessage(response.data);
    }

    useEffect(() => {
        fetchAPI();  
    }, [])




    return (
        <div>
            <p className="read-the-docs">
                {message.message || "Loading..."}
            </p>
            <TextField />
            <a href="/contact">Contact</a>
            <div/>
            <a href="/signin">Sign In</a>
        </div>
    )
}