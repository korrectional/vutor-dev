import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

/*
Some knowledge:

useIsAuthenticated JUST checks if theres a supposed session at all
http://localhost:3000/api/verify-session WILL provide information on the validity of the token

*/

export default function Contact() {
    const isAuthenticated = useIsAuthenticated();
    const authenticated = isAuthenticated
        ? "You are authenticated"
        : "You are not logged in";

    return (
        <div>
            <a href="/dashboard">Go back</a>
            <br />
            <div>
                This is the contact page, also I use it for my silly tests
            </div>
            <div>{authenticated || "loading"}</div>
        </div>
    );
}
