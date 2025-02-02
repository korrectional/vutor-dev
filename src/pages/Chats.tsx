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
    async function startCall() { // when user presses call a new message is sent that envites both to the call
        console.log("STARTING CALL");
        
        const roomName =
        "-voluntor-call-" +
        Math.random().toString() + (Math.random()*2).toString();
        
        const msg = `\n` + userEmail + ` started a call at ` + `https://meet.jit.si/${roomName}` + ` click on the link to join\n`;
        const dataToSend = {
            chatID: parseInt(chatID),
            content: msg,
            user: "SYSTEM",
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
        
        //I wanted to use this but its being constantly blocked by the client 
        //window.location.assign(`https://meet.jit.si/${roomName}`);
    }
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


    function formatMessage(content: string) { // makes links clickable
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return content.split(urlRegex).map((part, index) =>
            part.match(urlRegex) ? (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {part}
                </a>
            ) : (
                part
            )
        );
    }
    

    return (
<div className="flex flex-col h-full p-4 bg-gray-100 rounded-lg shadow-md">
    {/* Chat List */}
    <ul className="mb-4 space-y-2">
        {userChats.map((chatID) => (
            <li key={chatID}>
                <a
                    href={`/chat/${chatID}`}
                    className="block px-4 py-2 bg-white rounded-md shadow-sm hover:bg-gray-200 transition"
                >
                    Chat {chatID}
                </a>
            </li>
        ))}
    </ul>

    {/* Chat Messages */}
    <div className="flex-1 overflow-y-auto bg-white p-4 rounded-md shadow-sm">
        {chatID ? null : <h4 className="text-gray-500 text-center">Click a chat to view it!</h4>}
        <ul className="space-y-2">
            {userMsgs.map((msg) => {
                if (!msg.content) return null;
                return (
                    <li key={msg.createdAt} className="flex items-start">
                        {msg.user === "SYSTEM" ? (
                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md mr-2 inline-block">
                                <strong>{msg.user}</strong>: {formatMessage(msg.content)}
                            </span>
                        ) : (
                            <span className="px-3 py-2 bg-blue-100 rounded-lg shadow-sm">
                                <strong>{msg.user}</strong>: {formatMessage(msg.content)}
                            </span>
                        )}
                    </li>
                );
            })}
        </ul>
    </div>

    {/* Message Input Form */}
    <form className="flex items-center gap-2 mt-4" onSubmit={sendMsg}>
        <TextField
            placeholder="Enter your message"
            type="text"
            name="msginput"
            className="flex-1 px-3 py-2 border rounded-md"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            Send
        </button>
    </form>

    {/* Call Button */}
    <button
        onClick={startCall}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
    >
        Call
    </button>
</div>    );
}
