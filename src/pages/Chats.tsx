import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { IUserData } from "../utils/interfaces";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import TextField from "../components/TextField";
import { ClipboardIcon, Paperclip, PhoneCall } from "lucide-react";
export const API_URL = import.meta.env.VITE_API_URL;

interface Message {
    content: string;
    user: string;
    createdAt: string;
}

export default function Chats() {
    const navigate = useNavigate();
    const userToken = useAuthUser<IUserData>().token;
    const userEmail = useAuthUser<IUserData>().email;
    const userName = useAuthUser<IUserData>().name;
    const [file, setFile] = useState(null);

    let { chatID } = useParams();
    let chats = []; //This because react isnt letting me append to the state variables directly, so im doing appending and then setting.
    let msgs = new Array<Message>(); //Same here
    const [userChats, setUserChats] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [userMsgs, setUserMsgs] = useState<Message[]>([]);

    const socket: Socket = io(API_URL + "/");

    //Runs on page load
    useEffect(() => {
        //Retrieve chats accessable by user
        axios({
            url: API_URL + "/api/chats",
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

                setParticipants(response.data.chatParticipants);
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
        console.log("Socket connected to " + API_URL + "/");

        //Looking at a specific chat room
        if (chatID) {
            socket.emit("joinChatRoom", chatID);
            //Request for all Msgs in chat room
            axios({
                url: `https://api.voluntors.org/api/messages/${chatID}`,
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

    async function startCall() {
        // when user presses call a new message is sent that envites both to the call
        //console.log("STARTING CALL");

        const roomName =
            "-voluntor-call-" +
            Math.random().toString() +
            (Math.random() * 2).toString();

        const msg =
            `\n` +
            "[click to join " +
            userEmail.split("@")[0] +
            `'s call](https://meet.jit.si/${roomName})` +
            `\n`;
        const dataToSend = {
            chatID: parseInt(chatID),
            content: msg,
            user: "SYSTEM",
            createdAt: new Date(),
        };
        socket.emit("send", dataToSend);

        axios({
            url: `https:/api.voluntors.org/api/chats/send`,
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
                alert("Failed to send message (Server)");
                console.error("Error sending message:", error);
            });

        //I wanted to use this but its being constantly blocked by the client
        //window.location.assign(`https://meet.jit.si/${roomName}`);
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

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

        // send message
        axios({
            url: `https:/api.voluntors.org/api/chats/send`,
            method: "POST",
            headers: { Authorization: "Bearer " + userToken },
            data: dataToSend,
        })
            .then((response) => {
                socket.emit("send", dataToSend);
            })
            .catch((error) => {
                if (error.response) {
                    if (
                        error.response.status === 400 &&
                        error.response.data.message === "Profanity detected"
                    ) {
                        alert(
                            "Profanity detected. More attempts will result in a ban.",
                        );
                    } else {
                        alert("Failed to send message");
                    }
                    console.error(
                        "Error sending message:",
                        error.response.data.message,
                    );
                } else {
                    alert("Failed to send message due to network error.");
                    console.error("Error sending message:", error);
                }
            });

        // if file to be uploaded, upload file
        if (file) {
            //console.log("Sending file");
            const formData = new FormData();
            formData.append("content", "Hello world");
            formData.append("createdAt", new Date().toISOString());
            formData.append("file", file);
            axios({
                url: `https:/api.voluntors.org/api/chats/upload`,
                method: "POST",
                headers: { Authorization: "Bearer " + userToken },
                data: formData,
            }).then((response) => {
                if (response.status != 200) {
                    alert("Failed to upload file");
                    console.error(
                        "Error uploading file:",
                        response.data.message,
                    );
                }
                //console.log("stored at " + response.data.fileURL);
                // if upload was successful, create message with link to file
                //console.log(file.name);
                const msg =
                    userEmail +
                    ` - [${file.name}](http://localhost:5173/${response.data.fileURL})`;
                const dataToSend = {
                    chatID: parseInt(chatID),
                    content: msg,
                    user: "SYSTEM",
                    createdAt: new Date(),
                };

                // send message
                axios({
                    url: `https:/api.voluntors.org/api/chats/send`,
                    method: "POST",
                    headers: { Authorization: "Bearer " + userToken },
                    data: dataToSend,
                });
            });
        }

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

    const displayUser = (users) => {
        let display = "";
        users.forEach((user) => {
            if (user !== userName) {
                display += user;
            }
        });
        return display;
    };

    //Scroll to bottom of page if there are new messages
    useEffect(() => {
        document;
        const msgArea = document.getElementById("msg-area");
        if (msgArea) {
            msgArea.scrollTop = msgArea.scrollHeight;
        }
    }, [userMsgs]);

    function formatMessage(content: string) {
        // Regex for [name](link) format
        const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

        // Replace markdown links while keeping other text
        const parts = [];
        let lastIndex = 0;

        content.replace(markdownLinkRegex, (match, text, url, offset) => {
            parts.push(content.slice(lastIndex, offset)); // Push text before match
            parts.push(
                <a
                    key={offset}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 underline"
                >
                    {text}
                </a>,
            );
            lastIndex = offset + match.length;
            return match;
        });

        parts.push(content.slice(lastIndex)); // Push remaining text

        return parts;
    }

    return (
        <div className="flex h-full p-4 bg-gray-100">
            {/* Sidebar for Chats */}
            <aside className="w-1/4 p-4 bg-white shadow-md">
                <h2 className="text-2xl font-bold mb-4">Chats</h2>
                <ul className="space-y-2">
                    {participants.map((users, index) => (
                        <li key={userChats[index]}>
                            <a
                                href={`/chat/${userChats[index]}`}
                                className="block px-4 py-2 bg-gray-200 rounded-full shadow-sm hover:bg-gray-300 transition"
                            >
                                {displayUser(users)}
                            </a>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col ml-4 p-4 bg-white shadow-md">
                {chatID ? (
                    <>
                        {/* Chat Header */}
                        <header className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold"></h3>
                            <button
                                onClick={startCall}
                                className="px-3 py-2 bg-green-500 flex items-center text-white rounded-lg hover:bg-green-600 transition"
                            >
                                <PhoneCall size={17} className="mr-2" />
                                Call
                            </button>
                        </header>

                        {/* Messages List */}
                        <ul
                            className="space-y-2 h-80 overflow-y-scroll"
                            id="msg-area"
                        >
                            {userMsgs.map((msg) => {
                                if (!msg.content) return null;
                                return (
                                    <li
                                        key={msg.createdAt}
                                        className="flex items-start"
                                    >
                                        {msg.user === "SYSTEM" ? (
                                            <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md">
                                                {formatMessage(msg.content)}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-2 bg-green-100 rounded-lg shadow-sm">
                                                <strong>
                                                    {msg.user.split("@")[0]}
                                                </strong>
                                                : {formatMessage(msg.content)}
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                ) : (
                    <h4 className="text-gray-500 text-center">
                        Click a chat to view it!
                    </h4>
                )}

                <hr className="my-6 border-gray-300" />

                {/* Message Input Form */}
                <form onSubmit={sendMsg} className="flex items-center gap-2">
                    <TextField
                        placeholder="Message"
                        type="text"
                        name="msginput"
                        classes="flex-1 px-3 py-1.5 border rounded disabled:bg-gray-200 disabled:cursor-not-allowed"
                        autoComplete="off"
                        disabled={!chatID}
                    />
                    <label
                        htmlFor="files"
                        className={`bg-green-500 p-1.5 rounded-full transition hover:bg-green-600 ${
                            chatID ? "" : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        <Paperclip color="white" />
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        id="files"
                        style={{ display: "none" }}
                        disabled={!chatID}
                    />
                    <button
                        type="submit"
                        disabled={!chatID}
                        className="px-4 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </form>
            </main>
        </div>
    );
}
