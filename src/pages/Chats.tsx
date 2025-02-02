import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUserData } from "../utils/interfaces";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import TextField from "../components/TextField";

interface Message {
    content: string;
    user: string;
    createdAt: string;
}

export default function Chats() {
    const navigate = useNavigate();
    const userToken = useAuthUser<IUserData>().token;
    const userEmail = useAuthUser<IUserData>().email;

    let { chatID } = useParams();
    let chats = []; //This because react isnt letting me append to the state variables directly, so im doing appending and then setting.
    let msgs = new Array<Message>(); //Same here
    const [userChats, setUserChats] = useState([]);
    const [userMsgs, setUserMsgs] = useState<Message[]>([]);

    var socket: Socket = io("http://localhost:3000/");

    //Runs on page load
    useEffect(() => {
        //Retrieve chats accessable by user
        axios({
            url: "http://localhost:3000/api/chats",
            method: "POST",
            headers: { Authorization: "Bearer " + userToken },
            data: {
                email: userEmail,
            },
        })
            .then((response) => {
                if (response.status === 401)
                    alert(
                        "Unauthorized access. Please sign-in before trying to access this page.",
                    );
                chats = response.data.chatIDs;
                setUserChats(chats);
            })
            .catch((error) => {
                alert(
                    "An error occurred while fetching chats. Please try again later.",
                );
                console.error("Error fetching chats:", error);
                navigate("/signin");
            });

        //Initialize socket (keep here so it runs only once)
        socket.on("connect", () => {
            console.log("Connected to websocket server");
        });

        //Looking at a specific chat room
        if (chatID) {
            socket.emit("joinChatRoom", chatID);
            //Request for all Msgs in chat room
            axios({
                url: `http://localhost:3000/api/messages/${chatID}`,
                method: "POST",
                headers: { Authorization: "Bearer " + userToken },
                data: {
                    email: userEmail,
                },
            })
                .then((response) => {
                    if (response.status === 401)
                        alert(
                            "Unauthorized access. Please sign-in before trying to access this page.",
                        );
                    msgs = response.data.messages;
                    setUserMsgs(msgs);
                })
                .catch((error) => {
                    alert(
                        "An error occurred while fetching messages. Please try again later.",
                    );
                    console.error("Error fetching messages:", error);
                    navigate("/signin");
                });
        }
    }, []);

    //Send message to server
    async function sendMsg(e) {
        e.preventDefault();
        const msg = e.target.elements.msginput.value;
        const dataToSend = {
            chatID: parseInt(chatID),
            content: msg,
            user: userEmail,
            createdAt: new Date(),
        };

        socket.emit("send", dataToSend);

        axios({
            url: `http://localhost:3000/api/chats/send`,
            method: "POST",
            headers: { Authorization: "Bearer " + userToken },
            data: dataToSend,
        })
            .then((response) => {
                if (response.status != 200) {
                    alert("Failed to send message");
                    console.error(
                        "Error sending message:",
                        response.data.message,
                    );
                }
            })
            .catch((error) => {
                alert("Failed to send message");
                console.error("Error sending message:", error);
            });

        e.target.elements.msginput.value = "";
    }

    //Handles new message in chat room
    socket.on("newMessage", (arg) => {
        const nMsg = {
            content: arg.content,
            user: arg.user,
            createdAt: arg.createdAt,
        };
        msgs.push(nMsg);
        setUserMsgs([...msgs]);
    });

    //Scroll to bottom of page if there are new messages
    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, [userMsgs]);

    return (
        <div>
            <ul className="chats">
                {userChats.map((chatID) => {
                    return (
                        <li key={chatID}>
                            <a href={`/chat/${chatID}`}>Chat {chatID}</a>
                        </li>
                    );
                })}
            </ul>
            <ul className="chat-messages">
                {chatID ? <div /> : <h4>Click a chat to view it!</h4>}
                {userMsgs.map((msg) => {
                    if (!msg.content) return null;
                    return (
                        <li key={msg.createdAt}>
                            <strong>{msg.user}</strong>: {msg.content}
                        </li>
                    );
                })}
            </ul>
            <form className="chats-form" onSubmit={sendMsg}>
                <TextField
                    placeholder="Enter your message"
                    type="Default"
                    name="msginput"
                />
                <button type="submit" className="chats-submit">
                    Send
                </button>
            </form>
        </div>
    );
}
