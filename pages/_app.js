import {MaintenanceChecker} from "../components/MaintenanceChecker";
import {PageLoaderContextProvider} from "../contexts/PageLoaderContext";
import {Navbar} from "../components/Navbar";
import {useEffect, useState} from "react";
import {Footer} from "../components/Footer";
import {ToastContainer} from "react-toastify";
import {AuthContextProvider, useAuth} from "../contexts/AuthContext";
import Script from "next/script";

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import {SideBar} from "../components/Sidebar";
import {DefaultLayout} from "../layouts/DefaultLayout";
import CookieConsent from "../components/CookieConsent";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {CookiesProvider} from "react-cookie";
import {SidebarContextProvider} from "../contexts/SidebarContext";
import NextNProgress from 'nextjs-progressbar';
import {useRouter} from "next/router";

const theme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    useEffect(() => {
        router.push("https://nextgendrive.net/")
    }, []);

    return <>Redirecting... <a href="https://nextgendrive.net/">https://nextgendrive.net/</a></>;

    return (
        <div className="App min-h-screen bg-dark-1 text-white">
            <ThemeProvider theme={theme}>
                <PageLoaderContextProvider>
                    <MaintenanceChecker>
                        <CookiesProvider>
                            <AuthContextProvider>
                                <SidebarContextProvider>
                                    <DefaultLayout>
                                        <Component {...pageProps} />
                                    </DefaultLayout>
                                </SidebarContextProvider>
                            </AuthContextProvider>
                        </CookiesProvider>
                    </MaintenanceChecker>
                </PageLoaderContextProvider>
                <CssBaseline />
            </ThemeProvider>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
                theme="dark"
            />

            <CookieConsent />
            <NextNProgress color="#2163fc" height={3} options={{showSpinner: false}} />
        </div>
    )
}

export default MyApp
