import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import { IUserData } from '../utils/interfaces'
import axios from 'axios'
import { io, Manager } from 'socket.io-client';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import TextField from '../components/TextField';

export default function Chats() {
    const navigate = useNavigate();
    const userToken = useAuthUser<IUserData>().token;
    const userEmail = useAuthUser<IUserData>().email;

    let { chatID } = useParams();

    const [userChats, setUserChats] = useState([]);
    const [userMsgs, setUserMsgs] = useState([{content: "", user: "", createdAt: ""}]);
    const [socket, setSocket] = useState(null);

    const manager = new Manager('http://localhost:3000', {
        reconnectionDelay: 1000,
        query: {
            "my-key": "my-value",
        }
    })

    useEffect(() => {
        axios({
            url: 'http://localhost:3000/api/chats',
            method: 'POST',
            headers: {'Authorization': 'Bearer ' + userToken},
            data: {
                email: userEmail,
            },
        }).then(response => {
            if (response.status === 401) alert("Unauthorized access. Please sign-in before trying to access this page.");
            setUserChats(response.data.chatIDs);
        }).catch(error => {
            alert("An error occurred while fetching chats. Please try again later.");
            console.error('Error fetching chats:', error);
            navigate('/signin');
        })

        const newSocket = manager.socket('/');
    }, [])

    async function sendMsg(e) {
        e.preventDefault();
        const msg = e.target.elements.msginput.value;
        axios({
            url: `http://localhost:3000/api/chats/send`,
            method: 'POST',
            headers: {'Authorization': 'Bearer '+ userToken},
            data: {
                chatID: chatID,
                content: msg,
                user: userEmail,
                createdAt: new Date()
            }
        }).then(response => {
            if (response.status != 200) {
                alert("Failed to send message");
                console.error('Error sending message:', response.data.message);
            }
            else {
                alert("Sent message");
                console.log(response.data.message);
            }
        }).catch(error => {
            alert("Failed to send message");
            console.error('Error sending message:', error);
        })

        e.target.elements.msginput.value = "";
    }

    if (chatID) {
        useEffect(() => {
            axios({
                url: `http://localhost:3000/api/messages/${chatID}`,
                method: 'POST',
                headers: {'Authorization': 'Bearer '+ userToken},
                data: {
                    email: userEmail,
                }
            }).then(response => {
                if (response.status === 401) alert("Unauthorized access. Please sign-in before trying to access this page.");
                setUserMsgs(response.data.messages);
            }).catch(error => {
                alert("An error occurred while fetching messages. Please try again later.");
                console.error('Error fetching messages:', error);
                navigate('/signin');
            })
        }, [])
    }

    return (
        <div>
            <ul className='chats'>
                {userChats.map(chatID => {
                    return (
                        <li key={chatID}>
                            <a href={`/chat/${chatID}`}>Chat {chatID}</a>
                        </li>
                    )
                })}
            </ul>
            <ul className='chat-messages'>
                {chatID ? <div /> : <h4>Click a chat to view it!</h4>}
                {userMsgs.map(msg => {
                    if (!msg.content) return null;
                    return (
                        <li key={msg.createdAt}>
                            <strong>{msg.user}</strong>: {msg.content}
                        </li>
                    )
                })}
            </ul>
            <form className='chats-form' onSubmit={sendMsg}>
                <TextField placeholder='Enter your message' type='Default' name="msginput" />
                <button type='submit' className='chats-submit'>Send</button>
            </form>
        </div>
    )
}