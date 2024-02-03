import { createContext, useEffect, useState } from "react";
import blockData from '../component/common/blockKey.json'
export const ConnContext = createContext()

export const ConnProvider = ({ children }) => {
    const [homePage, setHomePage] = useState(false)
    const [formData, setFormData] = useState({ name: '', });
    const [blockKey, setBlockKey] = useState(false)

    

    function containsStupidKeyword(title, keywords) {
        for (let keyword of keywords) {
            if (title.name !== '') {
                if (title.name.toLowerCase().includes(keyword)) {
                    return true;
                }
            }
        }
        return false;
    }
    useEffect(() => {
        if (formData.name !== "") {
            handleData()
        }
    }, [formData])

    const handleData = () => {
        if (containsStupidKeyword(formData, blockData)) {
            setBlockKey(true)
        } else {
            setBlockKey(false)
        }
    }
    return (
        <ConnContext.Provider value={{
            homePage,
            setHomePage,
            setFormData,
            formData,
            blockKey,
            setBlockKey
        }}
        >
            {children}
        </ConnContext.Provider>
    )
}