import { useState, useEffect } from 'react'
import '../App.css'


export default function Home() {

    const [message, setMessage] = useState({message: ''})

    useEffect(() => {
        fetch("http://localhost:3001/api").then(
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
            <a href="/contact">Contact</a>
            <div/>
            <a href="/signin">Sign In</a>
            <div/>
            <a href="/signup">Sign Up</a>
        </div>
    )
}