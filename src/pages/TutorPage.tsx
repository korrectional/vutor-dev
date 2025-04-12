import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useNavigate } from "react-router";
import defualtProfile from "../assets/default_profile_img.jpg";
import { ArrowLeft } from "lucide-react"; // Import the ArrowLeft icon
export const API_URL = import.meta.env.VITE_API_URL;

export default function TutorPage() {
    const [tutor, setTutor] = useState<any>();
    const [notification, setNotification] = useState<string | null>(null); // State for notifications

    let { tutorID } = useParams();
    const authUser = useAuthUser<any>();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(API_URL + "/api/get-tutor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: tutorID }),
        }).then(async (res) => {
            const data = await res.json();
            setTutor(data);
        });
    }, []);

    const startChat = () => {
        fetch(API_URL + "/api/user/start-chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                _id: tutorID,
                token: authUser.token,
                tutorName: tutor.name,
            }),
        }).then(async (res) => {
            const data = await res.json();
            if (res.status === 400) {
                setNotification("Chat already exists!"); // Set notification message
                setTimeout(() => setNotification(null), 3000); // Clear notification after 3 seconds
            } else {
                navigate(`/chat/${data.chatID}`);
            }
        });
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
            {/* Back Arrow */}
            <div
                className="flex items-center gap-2 mb-4 text-blue-600 hover:cursor-pointer hover:text-blue-800 transition"
                onClick={() => navigate("/search")}
            >
                <ArrowLeft size={20} />
            </div>

            {notification && ( // Conditionally render notification
                <div className="mb-4 text-red-500 text-sm">
                    {notification}
                </div>
            )}
            <h1 className="text-3xl font-semibold mb-6 text-gray-900">
                Tutor Information
            </h1>
            <img
                className="w-32 h-32 object-cover rounded-full mb-6 m-auto"
                src={tutor?.profileImg || defualtProfile}
                alt="Tutor profile"
            />
            <p className="text-gray-600 mb-4">
                <strong>Name:</strong> {tutor?.name}
            </p>
            <p className="text-gray-600 mb-4">
                <strong>GPA:</strong> {" "}
                {tutor?.GPA != 2.5 ? tutor?.GPA : "This tutor has no ratings yet"}
            </p>
            <p className="text-gray-600 mb-4">
                <strong>Description:</strong> {tutor?.description}
            </p>
            <p className="text-gray-600 mb-4">
                <strong>Rating:</strong> {tutor?.rating}
            </p>
            <button
                onClick={startChat}
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
            >
                Start chat
            </button>
        </div>
    );
}
