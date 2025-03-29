import useSignOut from "react-auth-kit/hooks/useSignOut";
import { useNavigate } from "react-router";

export default function SignOut() {
    const signOut = useSignOut();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center bg-gray-50 w-1/2 m-auto rounded">
            <h1 className="my-4 text-3xl font-bold">
                Are you sure you want to sign out?
            </h1>
            <div className="flex gap-70 items-center mb-4">
                <button
                    onClick={() => {
                        signOut();
                        navigate("/");
                        window.location.reload();
                    }}
                    className="bg-blue-500 text-white font-bold py-2 px-3 rounded hover:bg-blue-600 transition"
                >
                    Sign Out
                </button>
                <a href="/" className="text-blue-500 hover:underline">
                    Go back
                </a>
            </div>
        </div>
    );
}
