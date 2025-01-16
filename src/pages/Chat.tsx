import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { redirect } from "react-router";

interface IUserData {
    email: string,
    token: string
}

export default function Chats() {
    const authUser = useAuthUser<IUserData>();  //Retrive the userInfo
    if (!authUser) {
        redirect('/');
    }


    fetch('http://localhost:3000/api/chats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(
        response => response.json()
    ).then(
        data => console.log(data)
    );

    return (
        <div>    
            <h1>Chats</h1>
            <ul></ul>
        </div>
    )
}