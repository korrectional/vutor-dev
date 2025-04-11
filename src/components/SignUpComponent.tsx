import { useState } from "react";
import { useNavigate } from "react-router";
export const API_URL = import.meta.env.VITE_API_URL;

export default function SignUpComponent() {
    const [page, setPage] = useState(0);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        phone: "",
        fName: "",
        lName: "",
        isTutor: false,
    });
    const navigate = useNavigate();

    // For pages before the final step, prevent default and move to the next page.
    const nextPage = (e) => {
        e.preventDefault();
        setPage((prevPage) => prevPage + 1);
    };

    // Final submission on page 3.
    const onSubmit = (e) => {
        e.preventDefault();
        fetch(API_URL + "/api/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
            .then(async (res) => {
                const data = await res.json();
                if (res.status === 201) {
                    //console.log("Account creation successful");
                    navigate("/");
                } else {
                    console.error(
                        `Sign-up failed with status: ${res.status} and error ${data.message}`,
                    );
                }
            })
            .catch((error) => {
                console.error("Error during sign-up:", error);
            });
    };

    return (
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
            {page === 0 && (
                <form onSubmit={nextPage}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition"
                    >
                        Next
                    </button>
                </form>
            )}

            {page === 1 && (
                <form onSubmit={nextPage}>
                    <input
                        type="text"
                        placeholder="First Name"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        onChange={(e) =>
                            setFormData({ ...formData, fName: e.target.value })
                        }
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        onChange={(e) =>
                            setFormData({ ...formData, lName: e.target.value })
                        }
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition"
                    >
                        Next
                    </button>
                </form>
            )}

            {page === 2 && (
                <form onSubmit={nextPage}>
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                        required
                    />
                    <input
                        type="tel"
                        placeholder="123-456-7890"
                        pattern="^\d{3}-\d{3}-\d{4}$"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                    />
                    <label className="flex items-center gap-3 mb-4">
                        <input
                            type="checkbox"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    isTutor: e.target.checked,
                                })
                            }
                        />
                        I want to tutor (you can always change this later)
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition"
                    >
                        Next
                    </button>
                </form>
            )}

            {page === 3 && (
                <form onSubmit={onSubmit}>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition"
                    >
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
}
