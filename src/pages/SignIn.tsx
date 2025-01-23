import SignInComponent from "../components/SignInComponent"

export default function SignIn() {

    return (
        <div>
            <a href="/">Go back</a>
            <br/>
            <a>Login</a>
            <SignInComponent/>
            <br/>
            <a href="/signup">Create account</a>
        </div>
    )
}