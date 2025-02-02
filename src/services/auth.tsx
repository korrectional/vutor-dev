import createStore from "react-auth-kit/createStore";

export const store = createStore({
    authName: "_auth",
    authType: "cookie",
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === "https:",
});

/*
This is the page that sets up "store" which is a variable react-auth-kit needs to do auth. It contains various parameters
*/
