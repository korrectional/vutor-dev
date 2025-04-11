import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

/*
Some knowledge:

useIsAuthenticated JUST checks if theres a supposed session at all
https://api.voluntors.org//api/verify-session WILL provide information on the validity of the token

*/

export default function Contact() {
    const isAuthenticated = useIsAuthenticated();
    const authenticated = isAuthenticated
        ? "You are authenticated"
        : "You are not logged in";

    return (
        <div className="flex flex-col items-center justify-center text-center flex-1 bg-gray-100 min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
                <a
                    href="/dashboard"
                    className="text-blue-600 hover:underline mb-4 block"
                >
                    Go back
                </a>
                <div className="text-gray-600 mb-4">
                    This is the contact page, also I use it for my silly tests
                </div>
                <div className="text-gray-600">
                    {authenticated || "loading"}
                </div>
            </div>
        </div>
    );
}
