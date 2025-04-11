import axios from "axios";
import { useNavigate, useParams } from "react-router";

// this page exists to display/load uploaded files

export default function File() {
    let { filename } = useParams();
    axios({
        url: `https://api.voluntors.org//api/uploads/${filename}`,
        method: "GET",
        responseType: "blob", // Handle binary data properly
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.open("", "_self")?.close();
    });

    return <></>;
}
