import { LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import useSignOut from "react-auth-kit/hooks/useSignOut";

export default function TopNavBar() {
    const [signoutDialogOpen, setSignoutDialogOpen] = useState(false);
    const authUser = useAuthUser();
    const signOut = useSignOut();
    const navigate = useNavigate();

    useEffect(() => {
        const b = document.getElementsByClassName(
            "toBlur",
        )[0] as HTMLDivElement;
        b.style.zIndex = signoutDialogOpen ? "10" : "-1";
        b.style.backdropFilter = signoutDialogOpen ? "blur(3px)" : "";
        b.style.backgroundColor = signoutDialogOpen ? "rgba(0, 0, 0, 0.3)" : "";
    }, [signoutDialogOpen]);

    return (
        <nav className="flex w-full bg-white py-2 px-4 justify-between shadow-sm">
            <div className="flex-start">
                <a
                    className={
                        "text-blue-600 text-3xl font-bold pb-0.5 pr-5 border-gray-400" +
                        (authUser ? " border-r-2" : "")
                    }
                    href="/dashboard"
                >
                    Voluntors
                </a>
                {authUser ? (
                    <a href="/dashboard" className="font-normal text-xl ml-5">
                        Dashboard
                    </a>
                ) : (
                    <div></div>
                )}
            </div>

            {authUser ? (
                <div className="flex self-end items-center gap-4">
                    <a
                        onClick={() => setSignoutDialogOpen(true)}
                        className="flex items-center gap-2 rounded-full bg-red-500 text-white font-semibold py-2 px-4 hover:cursor-pointer hover:bg-red-600 transition-colors duration-300"
                    >
                        <LogOut size={18} />
                        Sign Out
                    </a>
                    <a
                        href="/settings"
                        className="flex items-center rounded-full justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-100 transition-colors duration-300"
                    >
                        <Settings size={18} />
                    </a>
                </div>
            ) : (
                <div className="flex self-end items-center gap-4">
                    <a
                        href="/signin"
                        className="bg-blue-600 text-white font-bold py-1.5 px-4 rounded-full hover:bg-green-700 transition"
                    >
                        Sign In
                    </a>
                    <a
                        href="/signup"
                        className="bg-gray-300 text-gray-700 font-bold py-1.5 px-4 rounded-full hover:bg-gray-400 transition"
                    >
                        Sign Up
                    </a>
                </div>
            )}

            <dialog
                className={
                    "flex flex-col items-center justify-center z-100 bg-gray-50 w-1/2 justify-self-center rounded p-4 shadow-lg shadow-gray-500 backdrop-blur-sm"
                }
                hidden={!signoutDialogOpen}
                style={{ alignSelf: "anchor-center" }}
            >
                <a
                    className="self-end hover:cursor-pointer"
                    onClick={() => {
                        setSignoutDialogOpen(false);
                    }}
                >
                    <X size={15} />
                </a>
                <h1 className="font-bold text-2xl mb-5">
                    Are you sure you want to sign out?
                </h1>
                <div className="flex gap-60 items-center mb-4">
                    <a
                        onClick={() => setSignoutDialogOpen(false)}
                        className="bg-blue-500 text-white font-bold py-2 px-3 rounded hover:bg-blue-600 transition hover:cursor-pointer"
                    >
                        Go back
                    </a>
                    <button
                        onClick={() => {
                            setSignoutDialogOpen(false);
                            signOut();
                            navigate("/");
                            window.location.reload();
                        }}
                        className="bg-red-500 text-white font-bold py-2 px-3 rounded hover:bg-red-600 transition"
                    >
                        Sign Out
                    </button>
                </div>
            </dialog>
        </nav>
    );
}
