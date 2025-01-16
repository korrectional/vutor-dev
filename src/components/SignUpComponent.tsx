import { useState } from 'react';
import { useNavigate } from 'react-router';


export default function SignUpComponent() {

    const [formData, setFormData] = useState({email: '', password: ''})
    const navigate = useNavigate();
    

    const onSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3000/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }).then(async (res) => {
            const data = await res.json(); // Parse JSON response
            if (res.status === 201) {
                console.log("account creation sucessful");
                navigate("/")
            } else {
                console.error(`Sign-in failed with status: ${res.status} and error ${data.message}`);
            }
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <input type={"email"} placeholder='Enter an email' onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
            <input type={"password"} placeholder='Enter a password' onChange={(e)=>setFormData({...formData, password: e.target.value})}/>

            <button>Submit</button>
        </form>
    )
}