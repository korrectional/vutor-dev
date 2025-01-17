import axios from "axios";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { useNavigate } from "react-router";

interface IUserData {
    email: string,
    token: string
}

export default function Chats() {  //Retrive the userInfo
    const isAuthed = useIsAuthenticated();
    const nav = useNavigate();
    var userData : IUserData;
    if (!isAuthed) {
        alert("ERROR: You are not logged in. Redirecting to sign-in");
        nav('/signin');
    }
    userData = useAuthUser<IUserData>();

    axios({
        url: 'http://localhost:3000/api/chats',
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + userData.token},
        data: {
            email: userData.email
        }
    }).then(response => {
        if (response.data.status === 401) {
            alert(response.data.message);
        }
        console.log(response.data);
    });

    return (
        <div>    
            <h1>Chats</h1>
            <ul></ul>
        </div>
    )
}