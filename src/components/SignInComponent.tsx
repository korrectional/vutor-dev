import { useState } from 'react';
import useSignIn from 'react-auth-kit/hooks/useSignIn';


export default function SignInComponent() {

    const signIn = useSignIn();
    const [formData, setFormData] = useState({email: '', password: ''})


    const onSubmit = (e) => {
        fetch("http://localhost:3000/api/signin", {
            method: "POST",
            body: JSON.stringify(formData)
        }).then((res) => {
            if(res.status == 200){
                console.log("first worked");
            }
        })
    }

    return (
        <form onSubmit={onSubmit}>
            <input type={"email"} onChange={(e)=>setFormData({...formData, email: e.target.value})}/>
            <input type={"password"} onChange={(e)=>setFormData({...formData, password: e.target.value})}/>

            <button>Submit</button>
        </form>
    )
}