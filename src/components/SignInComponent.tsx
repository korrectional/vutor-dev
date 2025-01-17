import { useState } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from 'react-router';


export default function SignInComponent() {

    const signIn = useSignIn();
    const [formData, setFormData] = useState({email: '', password: ''})
    const nav = useNavigate();
    
    

    const onSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3000/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }).then(async (res) => {
            const data = await res.json(); // Parse JSON response
            if (res.status === 200) {
                if (
                    signIn({
                        auth: {
                            token: data.token,
                            type: "Bearer",
                            expiresAt: data.exp,
                        },
                        //refresh: data.refreshToken,
                        userState: { email: data.email, token: data.token },
                    })
                ) {
                    alert("Sign-in successful!");
                    nav('/');
                } else {
                    console.error("Sign-in failed!");
                }
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
            <input type={"email"} placeholder='Email' onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
            <input type={"password"} placeholder='Password' onChange={(e)=>setFormData({...formData, password: e.target.value})}/>

            <button>Submit</button>
        </form>
    )
}