import Image from "next/image";
import {useRouter} from "next/router";
import {useEffect, useRef} from "react";
import {useAuth} from "../contexts/AuthContext";

import {FaWifi, FaPencilRuler, FaDownload, FaMicrochip, FaDesktop, FaTruck} from "react-icons/fa";
import VTCMDesktopClientImage from "../public/img/screenshots/screenshot-1.png";
import {btoa} from "buffer";

export default function Home() {
    const router = useRouter();
    const auth = useRef(useAuth());

    useEffect(() => {
        // OAuth token callback
        let tokenRequestParameter = router.query.token?.toString();
        if (tokenRequestParameter) {
            localStorage.setItem('authtoken', tokenRequestParameter);
            auth.current.checkAuth();
        }
    }, [router.query]);

  return (
      <div className="page navbar-top-margin">
          <div className="vtcm-welcome-banner bg-gradient-to-b from-black to-gray-900 w-full text-white d-flex items-center flex-row text-center h-auto p-10">
              <div>
                  <h1 className="text-3xl sm:text-5xl font-bold">VTCManager</h1>
                  <h2 className="text-md sm:text-2xl">The future starts now.</h2>
              </div>

              <Image src={VTCMDesktopClientImage}
                     alt="VTCM client screenshot"
                     className="h-auto mx-auto my-8 shadow-xl"
                     priority={true} />

              <div>
                  <h1 className="text-xl sm:text-2xl">VTCManager Desktop Client Public Beta</h1>
                  <h2 className="text-md sm:text-1xl text-gray-400">Available Now</h2>
              </div>
          </div>

          <div className="bg-black w-full">
              <div className="md:max-w-4xl mx-auto py-12 lg:px-0 px-8">
                  <h1 className="text-5xl font-bold text-center pb-14">Does more than just work.</h1>
                  <div className="grid gap-20 sm:grid-cols-3">
                      <div>
                          <FaWifi className="animate-pulse feature-icon-color" size="42px" />
                          <h1 className="text-xl font-bold mt-4">Lightning fast connection</h1>
                          <p className="text-white text-opacity-70 mt-2">Brand new connection technologies
                              enable a faster exchange of data sets and clear the way for unique,
                              revolutionary functions.</p>
                      </div>

                      <div>
                          <FaPencilRuler className="feature-icon-color" size="42px" />
                          <h1 className="text-xl font-bold mt-4">The most modern job tracker ever</h1>
                          <p className="text-white text-opacity-70 mt-2">Due to extensive design research and
                              feedback from the community, we have the most cutting-edge interface you have
                              ever seen. And even if you don&apos;t find it so blatant, you can redesign it
                              yourself until you like it.</p>
                      </div>

                      <div>
                          <FaDownload className="feature-icon-color" size="42px" />
                          <h1 className="text-xl font-bold mt-4">The very first tracker with mod support</h1>
                          <p className="text-white text-opacity-70 mt-2">VTCManager comes with a built-in mod
                              store where you can install mods for the tracker as well as for the Euro Truck
                              Simulator 2 and the American Truck Simulator.</p>
                      </div>

                      <div>
                          <FaMicrochip className="feature-icon-color" size="42px" />
                          <h1 className="text-xl font-bold mt-4">Compatible with external hardware</h1>
                          <p className="text-white text-opacity-70 mt-2">With a unique programming interface,
                              we make it possible to build your own truck cockpit. We support everything from
                              electronic components to external dashboards and multimedia systems.</p>
                      </div>

                      <div>
                          <FaDesktop className="feature-icon-color" size="42px" />
                          <h1 className="text-xl font-bold mt-4">Compatible with external software</h1>
                          <p className="text-white text-opacity-70 mt-2">Our system is compatible with
                              external software such as Discord and Spotify. This enables further functions
                              from third parties and our tracker to be activated and enjoyed.</p>
                      </div>

                      <div>
                          <FaTruck className="feature-icon-color" size="42px" />
                          <h1 className="text-xl font-bold mt-4">One place for you and your company</h1>
                          <p className="text-white text-opacity-70 mt-2">VTCManager contains many functions
                              for the administration, automation and expansion of your virtual company.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

export async function getServerSideProps(context) {

    // Handle OAuth callback
    let tokenRequestParameter = context.query.token;
    if (tokenRequestParameter) {
        context.res.setHeader('Set-Cookie', ['vtcm_session=' + btoa(tokenRequestParameter)]);
    }

    return {
        props: {}, // will be passed to the page component as props
    }
}
