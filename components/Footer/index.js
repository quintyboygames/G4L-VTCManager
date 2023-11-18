import AppConfig from "../../models/AppConfig";

import {FaInstagram, FaTwitter} from "react-icons/fa";
import {BsDiscord} from "react-icons/bs";

export const Footer = () => {
    return (
        <footer className="w-full bg-dark-3 text-white pb-8">
            <div className="mx-auto max-w-6xl pt-12">
                <div className="flex flex-wrap justify-between px-8">
                    <div className="block">
                        <h1 className="text-xl font-bold pb-3">Information</h1>
                        <ul>
                            <li className="my-1">
                                <a href={AppConfig.server_url + "social/discord"} className="text-gray-300 hover:text-white">Help &amp; Support</a>
                            </li>
                            <li className="my-1">
                                <a href="https://status.vcc-online.eu/" className="text-gray-300 hover:text-white">Service
                                    Status</a>
                            </li>
                            <li className="my-1">
                                <a href="https://vcc-online.eu/legal/terms-of-service"
                                   className="text-gray-300 hover:text-white">Terms of Use</a>
                            </li>
                            <li className="my-1">
                                <a href="https://vcc-online.eu/legal/privacy-policy"
                                   className="text-gray-300 hover:text-white">Privacy Policy</a>
                            </li>
                            <li className="my-1">
                                <a href="https://vcc-online.eu/legal/legal-disclosure"
                                   className="text-gray-300 hover:text-white">Legal Disclosure</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <hr className="border-dark-1 my-8"/>
                <p className="text-center text-gray-300 mx-6">Copyright ©2021-{new Date().getFullYear()} | Made With ❤️ and ☕ by <a
                    href="https://vcc-online.eu/" className="hover:text-white">The VisualCable Collective</a></p>
                <div className="flex items-center justify-center pt-5 pb-5 text-2xl">
                    <a href="https://vcc-online.eu/redirect/instagram"
                       className="text-gray-300 hover:text-white px-2"><FaInstagram /></a>
                    <a href="https://vcc-online.eu/redirect/twitter" className="text-gray-300 hover:text-white px-2"><FaTwitter /></a>
                    <a href="https://vcc-online.eu/redirect/discord" className="text-gray-300 hover:text-white px-2"><BsDiscord /></a>
                </div>
            </div>
        </footer>
    )

}