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
    const userName = useAuthUser<IUserData>().name;
    const [file, setFile] = useState(null);

    let { chatID } = useParams();
    let chats = []; //This because react isnt letting me append to the state variables directly, so im doing appending and then setting.
    let msgs = new Array<Message>(); //Same here
    const [userChats, setUserChats] = useState([]);
    const [participants, setParticipants] = useState([]);
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

    async function startCall() {
        // when user presses call a new message is sent that envites both to the call
        console.log("STARTING CALL");

        const roomName =
            "-voluntor-call-" +
            Math.random().toString() +
            (Math.random() * 2).toString();

        const msg =
            `\n` +
            "[click to join " + userEmail.split('@')[0] + `'s call](https://meet.jit.si/${roomName})` +
            `\n`;
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
            url: `http://localhost:3000/api/chats/send`,
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
            console.log("Sending file");
            const formData = new FormData();
            formData.append("content", "Hello world");
            formData.append("createdAt", new Date().toISOString());
            formData.append("file", file);
            axios({
                url: `http://localhost:3000/api/chats/upload`,
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
                console.log("stored at " + response.data.fileURL);
                // if upload was successful, create message with link to file
                console.log(file.name);
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
                    url: `http://localhost:3000/api/chats/send`,
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
        window.scrollTo(0, document.body.scrollHeight);
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
            <div className="w-1/4 p-4 bg-white shadow-md">
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
            </div>

            <div className="flex-1 flex flex-col ml-4 p-4 bg-white shadow-md">
                <div className="flex-1 overflow-y-auto p-4">
                    {chatID ? null : (
                        <h4 className="text-gray-500 text-center">
                            Click a chat to view it!
                        </h4>
                    )}
                    <ul className="space-y-2">
                        {userMsgs.map((msg) => {
                            if (!msg.content) return null;
                            return (
                                <li
                                    key={msg.createdAt}
                                    className="flex items-start"
                                >
                                    {msg.user === "SYSTEM" ? (
                                        <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md mr-2 inline-block">
                                            <strong>{}</strong>{" "}
                                            {formatMessage(msg.content)}
                                        </span>
                                    ) : (
                                        <span className="px-3 py-2 bg-green-100 rounded-lg shadow-sm">
                                            <strong>{msg.user.split('@')[0]}</strong>:{" "}
                                            {formatMessage(msg.content)}
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <hr className="my-6 border-gray-300" />

                <form
                    className="flex items-center gap-2 mt-4"
                    onSubmit={sendMsg}
                >
                    <TextField
                        placeholder="Message"
                        type="text"
                        name="msginput"
                        className="flex-1 px-3 py-2 border rounded-full"
                        autocomplete="off"
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                    />

                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                    >
                        Send
                    </button>
                </form>

                <button
                    onClick={startCall}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                >
                    Call
                </button>
            </div>
        </div>
    );
}
