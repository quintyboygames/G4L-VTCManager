import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import User from '../../models/User';
import {useAuth} from "../../contexts/AuthContext";
import {useSidebar} from "../../contexts/SidebarContext";
import {useMediaQuery} from "@mui/material";
import Image from "next/image";
import LoginIcon from "../../public/svg/login-white.svg";
import {AiOutlineInfoCircle, AiOutlineHome, AiOutlineUser} from "react-icons/ai";
import {MdOutlineExplore} from "react-icons/md";
import {RiDiscordFill, RiBuilding3Line, RiBankLine} from "react-icons/ri";
import {FaServer, FaUser, FaBuilding} from "react-icons/fa";
import {HiOutlineLogin, HiOutlineClipboardList} from "react-icons/hi";
import {FiDownload, FiServer} from "react-icons/fi";
import {useRouter} from "next/router";

const SubMenuItem = ({ title, to }) => {
    const sidebarCtx = useSidebar();
    const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    return (
        <Link href={to}>
            <a className="text-left flex bg-sidebar items-center shadow-none py-3 pl-11 pr-4 border-l-4 border-transparent text-white hover:bg-dark-6 hover:bg-opacity-40 active:bg-opacity-60 text-xs"
               onClick={() => !isDesktop && sidebarCtx.setIsOpen(false)}>
                {title}
            </a>
        </Link>
    );
}

/*const SidebarFooter = (props) => {
  return (
    <div className="absolute bottom-0 right-0">
      {props.children}
    </div>
  );
}*/

const MenuItem = ({title, to, icon, className = ""}) => {
    const sidebarCtx = useSidebar();
    const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'));

    let content = (
        <a className={("flex items-center text-left bg-dark-2 shadow-none py-2 px-4 border-l-4 border-transparent hover:bg-dark-6 hover:bg-opacity-40 active:bg-opacity-60 " + className)}
           onClick={() => !isDesktop && sidebarCtx.setIsOpen(false)}>
            <div className="text-xl text-grey-darker mr-2">
                {icon}
            </div>
            <div className="text-white text-xs">{title}</div>
        </a>
    )

    if (to) {
        content = (
            <Link href={to}>
                {content}
            </Link>
        )
    }

    return (
        <div className="group relative sidebar-item with-children">
            {content}
        </div>
    )
}

const SubMenuItems = ({children, title, icon}) => {
    return (
        <>
            <div className="group relative sidebar-item with-children">
                <div className="flex items-center text-left shadow-none py-2 px-4 border-l-4 border-blue-dark opacity-90 bg-dark-2">
                    <div className="text-xl mr-2">
                        {icon}
                    </div>
                    <div className="text-white text-xs select-none">{title}</div>
                </div>
            </div>
            <div className="pin-t left-full pin-none w-auto group-hover:block z-auto">
                {children}
            </div>
        </>
    )
}

const AuthSidebar = () => {
    const auth = useAuth();
    return (
        <div className="py-2">
            <MenuItem title="Dashboard" to="/dashboard" icon={<AiOutlineHome />}/>
            <MenuItem title="Logbook" to="/logbook" icon={<HiOutlineClipboardList />}/>
            <SubMenuItems title="Company" icon={<RiBuilding3Line />}>
                {auth.user.company_data ? null : <SubMenuItem title="Create Company" to="/company/create" />}
                {auth.user.company_data ? <SubMenuItem title="Dashboard" to="/company/dashboard" /> : null}
                {auth.user.company_data ? <SubMenuItem title="Logbook" to="/company/logbook" /> : null}
                {auth.user.company_data && auth.user.isOwnerOfCompany() ? <SubMenuItem title="Applications" to="/company/applications" /> : null}
                {auth.user.company_data ? <SubMenuItem title="Employees" to="/company/employees" /> : null}
                {auth.user.company_data ? <SubMenuItem title="Settings" to="/company/settings" /> : null}
            </SubMenuItems>
            {/*<MenuItem title="Money Transactions" to="/money-transactions" icon={<RiBankLine />}/>*/}
            <MenuItem title="Explore Companies" to="/companies" icon={<MdOutlineExplore/>} />
            <SubMenuItems title="My Account" icon={<AiOutlineUser />}>
                {/*<SubMenuItem title="Profile" to="/" />
                       <SubMenuItem title="Settings" to="/" />*/}
                <SubMenuItem title="Sign Out" to="/logout" />
            </SubMenuItems>
            <MenuItem title="Desktop Client" to="/client/download" icon={<FiDownload />} />
            <MenuItem title="Discord" to="https://vcc-online.eu/redirect/discord" icon={<RiDiscordFill />} className="lg:hidden"/>
            <MenuItem title="Support" to="https://vcc-online.eu/redirect/discord" icon={<AiOutlineInfoCircle />} className="lg:hidden"/>
            <MenuItem title="Server Status" to="https://status.vcc-online.eu/" icon={<FiServer />} className="lg:hidden"/>
        </div>
    );
}

const GuestSidebar = () => {
    return (
        <div className="py-2">
            <MenuItem title="Discord" to="https://vcc-online.eu/redirect/discord" icon={<RiDiscordFill />}/>
            <MenuItem title="Support" to="https://vcc-online.eu/redirect/discord" icon={<AiOutlineInfoCircle />}/>
            <MenuItem title="Server Status" to="https://status.vcc-online.eu/" icon={<FiServer />}/>
            <AuthButton />
        </div>
    )
}

const AuthButton = () => {
    const auth = useAuth();

    if (auth.isAuthenticated)
        return (
            <MenuItem title="Sign out" to="/logout" icon={<HiOutlineLogin />} />
        );
    if (auth.isAuthenticating) {
        return <AuthButtonLoading text="Signing In..." />;
    }
    else if (auth.isRedirectingToLogin) {
        return <AuthButtonLoading text="Redirecting..." />;
    }

    return (
        <MenuItem title="Sign in" to="/login" icon={<HiOutlineLogin />} />
    );
}

const AuthButtonLoading = ({text}) => {
    return (
        <MenuItem title={text} icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" className="mr-2 h-4">
                <defs>
                    <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                        <stop stopColor="#fff" stopOpacity={0} offset="0%"/>
                        <stop stopColor="#fff" stopOpacity=".631" offset="63.146%"/>
                        <stop stopColor="#fff" offset="100%"/>
                    </linearGradient>
                </defs>
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(1 1)">
                        <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth={4}>
                            <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18"
                                              dur="0.9s" repeatCount="indefinite"/>
                        </path>
                        <circle fill="#fff" cx={36} cy={18} r={1}>
                            <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18"
                                              dur="0.9s" repeatCount="indefinite"/>
                        </circle>
                    </g>
                </g>
            </svg>
        } />
    )
}

export const SideBar = (props) => {
    const auth = useAuth();
    const sidebarCtx = useSidebar();

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(sidebarCtx.isOpen);
    }, [sidebarCtx.isOpen]);

    return (
        <div className={"bg-dark-2 min-h-screen h-full fixed z-10 pt-12 transition-all duration-700 ease-in-out shadow-2xl " + (isVisible ? "opacity-100" : "opacity-0")} style={{ width: (isVisible ? "15rem" : "0rem") }}>
            {auth.isAuthenticated ? <AuthSidebar /> : <GuestSidebar />}
            {/*<SidebarFooter>
        <div className="flex justify-end">
          <button className="focus:outline-none hover:text-opacity-70 text-white m-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="transform transition-transform duration-500 ease-in-out rotate-180" id="ToggleSidebarImage" height="30" width="30">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </SidebarFooter>*/}
        </div>
    )
}