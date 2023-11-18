import {createContext, useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import User from "../models/User";
import AppConfig from "../models/AppConfig";
import {useCookies} from "react-cookie";

export const AuthContext = createContext({
    isAuthenticating: false,
    isAuthenticated: false,
    isRedirectingToLogin: false,
    checkAuth: () => {},
    setIsRedirectingToLogin: () => {},
    logout: () => {},
    user: new User()
});

export function AuthContextProvider(props) {
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRedirectingToLogin, setIsRedirectingToLogin] = useState(false);
    const [userData, setUserData] = useState(new User());

    const [cookies, setCookie, removeCookie] = useCookies(['vtcm_session']);

    const context = {
        checkAuth,
        isAuthenticating,
        isAuthenticated,
        isRedirectingToLogin,
        setIsRedirectingToLogin,
        logout,
        user: userData
    };

    function checkAuth() {
        if (!localStorage.getItem('authtoken'))
            return;

        setIsAuthenticating(true);

        let url = AppConfig.server_url + 'api/webapp/check';

        fetch(url, { headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Accept': 'application/json' }) })
            .then(res => res.json())
            .then(
                (result) => {
                    if (result["id"]) {
                        const user = new User();
                        user.ID = result["id"];
                        user.username = result["VCC_User"]["user"]["username"];
                        user.bank_balance = result["bank_balance"];
                        user.company_data = result["company"];
                        setUserData(user);

                        setIsAuthenticated(true);
                    } else {

                        /*if (result["error"] === "NO_LICENSE_KEY"){
                            User.ID = result["userId"];
                            setRedirectToActivateAccount(true);
                            setIsAuthenticating(false);
                            return;
                        }*/

                        toast.error('Sorry, but we couldn\'t log you in. Please click "Sign In" on top of the page to try it again.', {
                            position: "bottom-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            toastId: "restoring-session-success",
                        })
                        localStorage.removeItem("authtoken")
                    }
                    setIsAuthenticating(false);
                },
                () => {
                    toast.error('Sorry, but we couldn\'t log you in. Please click "Sign In" on top of the page to try it again.', {
                        position: "bottom-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        toastId: "restoring-session-success",
                    });
                    setIsAuthenticating(false);
                }
            )
    }

    async function logout() {
        let url = AppConfig.server_url + 'api/auth/web-app/logout';

        let res = await fetch(url, { headers: new Headers({ 'Authorization': 'Bearer ' + localStorage.getItem('authtoken'), 'Accept': 'application/json' }) });
        res = await res.json();
        if (res.message === "OK") {
            setIsAuthenticated(false);
            localStorage.removeItem("authtoken");
            removeCookie('vtcm_session');
            toast.success('You have been logged out successfully!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                toastId: "logout-success",
            });
        } else {
            toast.error('Sorry, but we couldn\'t log you out.', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                toastId: "logout-failed",
            })
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={context}>
            {props.children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);