import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { IUserData } from '../utils/interfaces'
import { useNavigate } from 'react-router';
import axios from 'axios'

/*
Some knowledge:

useIsAuthenticated JUST checks if theres a supposed session at all
http://localhost:3000/api/verify-session WILL provide information on the validity of the token

*/

export default function Contact() {
    const navigate = useNavigate();

    const isAuthed = useIsAuthenticated();
    if (!isAuthed) {
        alert('Not authorized, please login before continuing.');
        navigate('/signin');
    }
    
    const userToken = useAuthUser<IUserData>().token
    const userEmail = useAuthUser<IUserData>().email

    axios({
        url: 'http://localhost:3000/api/verify-token',
        method: 'POST',
        data: {
            token: userToken
        }
    }).then(response => {
        if (response.status == 401) {
            alert('Not authorized, please login before continuing.');
            navigate('/signin');
        }
    }).catch(error => {
        alert('Failed to verify token.');
        navigate('/signin');
    });

    var userData;

    axios({
        url: 'http://localhost:3000/api/chats',
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + userToken},
        data: {
            email: userEmail,
        },
    }).then(response => {
        if (response.data.status === 401) {
            alert(response.data.message);
        }
        console.log(response.data);
    });

    return (
        <div>    
            <h1>Chats</h1>
            <ul>
                {userData?.chats?.map((chat, index) => (
                    <li key={index}>{chat.name}</li>
                ))}
            </ul>
        </div>
    )
}