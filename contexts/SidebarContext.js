import {createContext, useContext, useEffect, useState} from "react";
import {useMediaQuery} from "@mui/material";
import {useAuth} from "./AuthContext";

export const SidebarContext = createContext({
    isOpen: true,
    setIsOpen: (isLoading) => {}
});

export function SidebarContextProvider(props) {
    const [isOpen, setIsOpen] = useState(false);
    const auth = useAuth();

    const context = {
        isOpen,
        setIsOpen
    };

    const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    useEffect(() => {
        if (isDesktop && !auth.isAuthenticated){
            setIsOpen(false);
            return;
        }

        setIsOpen(isDesktop);
    }, [isDesktop, auth.isAuthenticated]);

    return (
        <SidebarContext.Provider value={context}>
            {props.children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => useContext(SidebarContext);