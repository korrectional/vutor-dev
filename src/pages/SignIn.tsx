import SignInComponent from "../components/SignInComponent"

export default function SignIn() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <a href="/" className="text-blue-500 hover:underline">Go back</a>
            <h1 className="mt-4 text-2xl font-bold">Login</h1>
            <SignInComponent />
            <a href="/signin" className="mt-2 text-blue-500 hover:underline">I already have an account</a>
        </div>
    )
}