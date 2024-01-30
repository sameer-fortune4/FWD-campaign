import { createContext, useState } from "react";

export const ConnContext = createContext()

export const ConnProvider = ({ children }) => {
    const [homePage, setHomePage] = useState(false)

    return (
        <ConnContext.Provider value={{
            homePage,
            setHomePage,
        }}
        >
            {children}
        </ConnContext.Provider>
    )
}