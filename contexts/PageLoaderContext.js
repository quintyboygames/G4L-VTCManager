import {createContext, useContext, useState} from "react";

export const PageLoaderContext = createContext({
    isLoading: true,
    setIsLoading: (isLoading) => {}
});

export function PageLoaderContextProvider(props) {
    const [isLoading, setIsLoading] = useState(true);

    const context = {
        isLoading: isLoading,
        setIsLoading: setIsLoading
    };

    return (
        <PageLoaderContext.Provider value={context}>
            <>
                {/*pointerEvents: "none": user can click through the layer otherwise the user won't be able to use the interface after the loading overlay disappeared. It is not the best solution. ToDo: improve this*/}
                <div className={"fixed bg-dark-1 min-h-screen w-screen z-50 flex items-center justify-center transition-opacity duration-500 ease-in-out " + (!isLoading ? "opacity-0" : "opacity-100")} style={{pointerEvents: "none"}}>
                    <div>
                        <div className="lds-ellipsis">
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                    </div>
                </div>
                {props.children}
            </>
        </PageLoaderContext.Provider>
    );
}

export const usePageLoader = () => useContext(PageLoaderContext);