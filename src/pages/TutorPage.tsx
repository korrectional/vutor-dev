import { useEffect, useState } from "react";
import { useParams } from "react-router";

export default function TutorPage() {
    const [tutor, setTutor] = useState<any>();

    let { tutorID } = useParams();

    useEffect(() => {
        fetch("http://localhost:3000/api/get-tutor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ _id: tutorID }),
        }).then(async (res) => {
            const data = await res.json();
            console.log("Data recieved", data);
            setTutor(data);
        });
    }, []);

    const joinMeeting = () => {
        const roomName =
            tutor?.name.replace(" ", "-") +
            "-voluntor-call-" +
            Math.random().toString();
        window.location.assign(`https://meet.jit.si/${roomName}`);
    };

    return (
        <div className="flex flex-col items-center justify-center text-center flex-1 bg-gray-100 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
                <h1 className="text-3xl font-semibold mb-6 text-gray-900">Tutor Information</h1>
                <p className="text-gray-600 mb-4">
                    <strong>Name:</strong> {tutor?.name}
                </p>
                <p className="text-gray-600 mb-4">
                    <strong>GPA:</strong> {tutor?.GPA}
                </p>
                <p className="text-gray-600 mb-4">
                    <strong>Description:</strong> {tutor?.description}
                </p>
                <p className="text-gray-600 mb-4">
                    <strong>Rating:</strong> {tutor?.rating}
                </p>
                <button
                    onClick={joinMeeting}
                    className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Join Meeting
                </button>
            </div>
        </div>
    );
}
