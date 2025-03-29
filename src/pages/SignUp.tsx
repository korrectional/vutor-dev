import SignUpComponent from "../components/SignUpComponent";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function SignUp() {
    const navigate = useNavigate();
    const authUser = useAuthUser();

    useEffect(() => {
        if (authUser) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="mb-4 text-2xl font-bold">Register</h1>
            
            <SignUpComponent />

            <div className="flex justify-between gap-40">
                <a href="/signin" className="text-blue-500 hover:underline">
                    I already have an account
                </a>
                <a href="/" className="text-blue-500 hover:underline">
                    Go back
                </a>
            </div>
        </div>
    );
}
