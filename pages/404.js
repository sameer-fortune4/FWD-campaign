import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import commonStyle from "../styles/Common.module.scss"
import notFoundStyle from "../styles/pageNotFound.module.scss"
export default function PageNotFound() {
    const router = useRouter()
    const[counter, setCounter] = useState(5)
    useEffect(()=>{
        if(router.pathname == '/404'){
            setTimeout(()=>{
                router.push('/')
            },[5000]) 
            if(counter > 0){
            setInterval(()=>{
                    setCounter(counter - 1)
                },[1000])
            }

        }
    },[router, counter])
    console.log("first",router)
  return (
    <div className={commonStyle['main-wrapper']}>
        <div className={commonStyle["bg-gradient"]}></div>
        <div className={notFoundStyle["pageNotFound-wrapper"]}>
            <span className={notFoundStyle["error-logo"]}></span>
            <p className={notFoundStyle["title-error"]}>You Will Redirect To Home Page In <span>{counter}</span> </p>
        </div>
    </div>
  )
}
