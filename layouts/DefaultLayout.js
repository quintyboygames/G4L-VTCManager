import {Navbar} from "../components/Navbar";
import {SideBar} from "../components/Sidebar";
import {Footer} from "../components/Footer";
import {useAuth} from "../contexts/AuthContext";
import {useState} from "react";
import Head from "next/head";

export function DefaultLayout({children}) {
    const auth = useAuth();

    const [isSigningOut, setIsSigningOut] = useState(false);

    return (
        <>
            <Head>
                <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
                <title>VTCManager - ETS2/ATS Job Tracker</title>
                <meta content="VTCManager - Free ETS2/ATS VTC Manager" property="og:title" />
                <meta content="Bring your virtual company to the next level with extensive, community-suggested features with a modern design."
                      property="og:description" />
                <meta content="VTCManager" property="og:site_name" />
                <meta content="/logo192.png" property="og:image"/>
            </Head>
            <Navbar isUserSigningOut={isSigningOut} />

            <div className="flex">
                <SideBar />

                <div className={"min-w-full transition-all duration-700 ease-in-out " + (auth.isAuthenticated && "lg:pl-60")}>
                    {children}

                    <Footer />
                </div>
            </div>
        </>
    )
}