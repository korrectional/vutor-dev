import { useState } from 'react';
import { useNavigate } from 'react-router';
import useSignIn from 'react-auth-kit/hooks/useSignIn';

export default function SignInComponent() {

    const signIn = useSignIn();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({email: '', password: ''})
    

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
                console.log(data.email);
                if (
                    signIn({
                        auth: {
                            token: data.token,
                            type: "Bearer",
                            expiresAt: data.exp, // idk why this gives an error
                        },
                        //refresh: data.refreshToken, Ill add this later
                        userState: { email: data.email, token: data.token },
                    })
                ) {

                    console.log("Sign-in successful!");
                    navigate("/dashboard")
                } else {
                    console.error("Sign-in failed!");
                }
            } else {
                console.error("Sign-in failed!");
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