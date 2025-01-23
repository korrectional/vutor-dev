import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

export default function Search() {
    const authUser = useAuthUser<any>();
    const [parameters, setParameters] = useState({
        name: "",
        language: "",
        //state: "",
        teaches: "english",
    });
    const [tutors, setTutors] = useState([]); // State to store the list of tutors



    
    const handleChange = (e) => {
        const { name, value } = e.target;
 
        console.log("changing to ", name,  value)
        setParameters((prevSettings) => ({
        ...prevSettings,
        [name]: value,
        }));
        
    };

      

    const searchTutor = () => {
        console.log("Searching for tutor with parameters:", parameters);
        fetch("http://localhost:3000/api/search-tutor", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ token: authUser.token, ...parameters }),
        }).then(async (res) => {
            const data = await res.json()
            console.log("Data sent", data);
            setTutors(data)
        })
    };



  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
        <a href="/dashboard">Go back</a>
        <h2>Search</h2>
        
        <div>
            <label>
                Class:
                <select name="teaches" value={parameters.teaches} onChange={handleChange}>
                <option value="math">Math</option>
                <option value="english">English</option>
                </select>
            </label>
            <br />


            <button onClick={searchTutor}>Search</button>
        </div>

        <div>
            <ul>
                {tutors.map((tutor, index) => (
                    <li key={index}>
                        <strong>Name:</strong> {tutor.name} <br />
                        <strong>GPA:</strong> {tutor.GPA} <br />
                        <strong>Description:</strong> {tutor.description}
                    </li>
                ))}
            </ul>
        </div>

    </div>
  );
}
