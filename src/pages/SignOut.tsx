import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router';
export default function SignOut() {
    const signOut = useSignOut();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">   
            <a href="/" className="text-blue-500 hover:underline">
                Go back
            </a>
            <h1 className="mt-4 text-2xl font-bold"></h1>
            <button
                onClick={() => {signOut(); navigate('/')}}
                className="w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition"
            >
                Sign Out
            </button>
        </div>
    );
}
