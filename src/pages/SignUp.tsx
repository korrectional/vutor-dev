import SignUpComponent from "../components/SignUpComponent"

export default function SignUp() {

    return (
    <div>
        <a href="/">Go back</a>
        <br/>
        <a>Register</a>
        <SignUpComponent/>
        <br/>
        <a href="/signin">I already have an account</a>
    </div>
    )
}