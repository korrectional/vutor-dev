import { useState } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";

export default function SignInComponent() {
    const signIn = useSignIn();
    const [formData, setFormData] = useState({ email: "", password: "" });

    const onSubmit = (e) => {
        e.preventDefault();
        fetch("http://api.voluntors.org//api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(async (res) => {
                const data = await res.json(); // Parse JSON response
                if (res.status === 200) {
                    //console.log(data.email);
                    if (
                        signIn({
                            auth: {
                                token: data.token,
                                type: "Bearer",
                                expiresAt: data.exp, // idk why this gives an error
                            },
                            //refresh: data.refreshToken, Ill add this later
                            userState: {
                                email: data.email,
                                token: data.token,
                                _id: data._id,
                                role: data.role,
                                name: data.name,
                            },
                        })
                    ) {
                        //console.log("Sign-in successful!");
                        window.location.reload();
                        //navigate("/dashboard");
                    } else {
                        console.error("Sign-in failed!");
                    }
                } else {
                    console.error("Sign-in failed!");
                }
            })
            .catch((error) => {
                console.error("Error during sign-in:", error);
            });
    };

    return (
        <div className="flex flex-col">
            <form
                className="max-w-md w-full bg-white p-6 rounded-lg shadow-md"
                onSubmit={onSubmit}
            >
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
