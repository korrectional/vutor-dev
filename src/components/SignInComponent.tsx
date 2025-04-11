import { useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
export const API_URL = import.meta.env.VITE_API_URL;

export default function SignInComponent() {
    const signIn = useSignIn();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState(""); // State for error messages

    const onSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(""); // Clear previous error messages
        fetch(API_URL + "/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(async (res) => {
                const data = await res.json(); // Parse JSON response
                if (res.status === 200) {
                    if (
                        signIn({
                            auth: {
                                token: data.token,
                                type: "Bearer",
                                expiresAt: data.exp,
                            },
                            userState: {
                                email: data.email,
                                token: data.token,
                                _id: data._id,
                                role: data.role,
                                name: data.name,
                            },
                        })
                    ) {
                        window.location.reload();
                    } else {
                        setErrorMessage("Sign-in failed! Please try again.");
                    }
                } else if (res.status === 401) {
                    setErrorMessage("Incorrect email or password."); // Handle incorrect credentials
                } else {
                    setErrorMessage("Sign-in failed! Please try again later.");
                }
            })
            .catch((error) => {
                console.error("Error during sign-in:", error);
                setErrorMessage("An unexpected error occurred. Please try again.");
            });
    };

    return (
        <div className="flex flex-col">
            <form
                className="max-w-md w-full bg-white p-6 rounded-lg shadow-md"
                onSubmit={onSubmit}
            >
                {errorMessage && ( // Conditionally render error message
                    <div className="mb-4 text-red-500 text-sm">{errorMessage}</div>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition"
                >
                    Submit
                </button>
            </form>

            <p className="mt-4 flex justify-between">
                <a href="/signup" className="text-blue-500 hover:underline">
                    Don't have an account? Register
                </a>

                <a href="/" className="text-blue-500 hover:underline">
                    Go back
                </a>
            </p>
        </div>
    );
}
