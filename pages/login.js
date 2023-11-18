import {useEffect, useRef} from "react";
import {HTTPRequestUtils} from "../utils/HTTPRequestUtils";
import {useAuth} from "../contexts/AuthContext";

export default function LoginPage() {
    const auth = useRef(useAuth());

    useEffect(() => {
        auth.current.setIsRedirectingToLogin(true);
        window.location.href = HTTPRequestUtils.getUrl(HTTPRequestUtils.API_routes.AuthRedirect);
    }, []);

    return (
        <div className="h-screen w-100 flex items-center justify-center">
            <div>
                <h1 className="text-3xl">Redirecting to the VCC Cloud</h1>
                <p className="text-white text-opacity-75 pt-1 text-center">Please wait...</p>
            </div>
        </div>
    );
}