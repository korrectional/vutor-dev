import { useState } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';


export default function SignInComponent() {

    const signIn = useSignIn();
    const [formData, setFormData] = useState({email: '', password: ''})
    
    

    const onSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3000/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(async (res) => {
                const data = await res.json(); // Parse JSON response
                if (res.status === 200) {
                    console.log(data.email);
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

                        console.log("Sign-in successful!");
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
            <input type={"email"} onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
            <input type={"password"} onChange={(e)=>setFormData({...formData, password: e.target.value})}/>

            <button>Submit</button>
        </form>
    )
}