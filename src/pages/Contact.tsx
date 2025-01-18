import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { useEffect, useState } from 'react';

/*
Some knowledge:

useIsAuthenticated JUST checks if theres a supposed session at all
http://localhost:3000/api/verify-session WILL provide information on the validity of the token

*/




export default function Contact() {

    const authUser = useAuthUser<any>();
    const isAuthenticated = useIsAuthenticated();
    const authenticated = isAuthenticated ? "You are authenticated" : "You are not logged in";
    const [valid, setValid] = useState(Boolean);

    useEffect(() => {
        fetch("http://localhost:3000/api/verify-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({token: authUser.token}),
        }).then(async (res) => {
            const data = await res.json();
            if(data.valid == true){
                setValid(true);
            }
            else{
                setValid(false);
            }
        })
    }, [])
    


    return (
        <div>
            <div>This is the contact page, also I use it for my silly tests</div>
            <div>{authenticated || "loading"}</div>
            <div>{valid ? "valid" : "invalid" || "loading"}</div>
        </div>
    )
}