import SignInComponent from "../components/SignInComponent";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function SignIn() {
    const navigate = useNavigate();
    const authUser = useAuthUser();

    useEffect(() => {
        if (authUser) {
            navigate("/dashboard");
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="mb-5 text-2xl font-bold">Login</h1>
            <SignInComponent />
        </div>
    );
}
