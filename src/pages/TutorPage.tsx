import { useEffect, useState } from "react";
import { useParams } from "react-router"

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
            const data = await res.json()
            console.log("Data recieved", data);
            setTutor(data)
        })
    }, [])

    
    const joinMeeting = () => {
        const roomName = tutor?.name.replace(" ", "-") + "-voluntor-call-" + Math.random().toString(); 
        window.location.assign(`https://meet.jit.si/${roomName}`);
    };
      

    
    return (
        <div>
            <h1>ABC</h1>
            <strong>Name:</strong> {tutor?.name} <br />
            <strong>GPA:</strong> {tutor?.GPA} <br />
            <strong>Description:</strong> {tutor?.description} <br />
            <strong>RATING:</strong> {tutor?.rating}

            <br />
            <button onClick={joinMeeting}>Join Meeting</button>
        </div>
    )
}