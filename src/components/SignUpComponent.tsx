import { useState } from 'react';
import { useNavigate } from 'react-router';


export default function SignUpComponent() {

    const [formData, setFormData] = useState({email: '', password: '', phone: '', fName: '', lName: '', isTutor: false})
    const navigate = useNavigate();
    

    const onSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:3000/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        }).then(async (res) => {
            const data = await res.json(); // Parse JSON response
            if (res.status === 201) {
                console.log("account creation sucessful");
                navigate("/")
            } else {
                console.error(`Sign-in failed with status: ${res.status} and error ${data.message}`);
            }
        })
        .catch((error) => {
            console.error("Error during sign-in:", error);
        });
    }

    return (
        <form onSubmit={onSubmit}>
            <input 
                type="text" 
                placeholder="First Name" 
                onChange={(e) => setFormData({ ...formData, fName: e.target.value })} 
                required 
            />
            <input 
                type="text" 
                placeholder="Last Name" 
                onChange={(e) => setFormData({ ...formData, lName: e.target.value })} 
                required 
            />
            <input 
                type="email" 
                placeholder="Email" 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                required 
            />
            <input 
                type="password" 
                placeholder="Password" 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                required 
            />
            <input 
                type="tel"
                placeholder="123-456-7890" 
                pattern="^\d{3}-\d{3}-\d{4}$" 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                required 
            />
            <label>
            <input 
                type="checkbox" 
                onChange={(e) => setFormData({ ...formData, isTutor: e.target.checked })} 
            />
            Tutor (you can always change it later)
            </label>

            <button type="submit">Submit</button>
        </form>
    )
}