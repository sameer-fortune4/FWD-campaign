import React, { useContext, useEffect, useState } from 'react';
import commonStyle from "../../styles/Common.module.scss";
import Image from 'next/image';
// import Logo from "/assets/images/fwd-logo.png"
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ConnContext } from '../../context/connContext';
export default function Chatbox() {
  const [open, SetOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const { setHomePage, homePage } = useContext(ConnContext)

  const handleData = async () => {
    // await signOut();
    localStorage.removeItem('inputData')
    setHomePage(true)
  }
  // useEffect(() => {
  //   let token = localStorage.getItem('access_token')
  //   if (session == null || session === undefined) {
  //     if (!token) {
  //       router.push('/')
  //     }
  //   }
  // }, [session])

  useEffect(() => {
    if (homePage === true) {
      router.push('/')
    }
  }, [homePage])
  
  return (
    <>
      <div className={commonStyle["logo-wrapper"] + " " + (open == true ? commonStyle["active"] : "")}>
        <a href="#" className={commonStyle["logo-wrap"]}>
          <Image onClick={handleData} src="/assets/images/fwd-logo.png" height={100} width={100} alt='logo' />
        </a>
        <div className={commonStyle["chat-titie"]}>
          <p className={commonStyle["top-title"]}>We're always here to listen. </p>
          <p className={commonStyle["botton-title"]}>Click <a href="#">here</a> for a confidential session with a mental health
              professional.</p>
        <span className={commonStyle["close-btn"]} onClick={()=> SetOpen(false)}></span>
        </div>
        <div className={commonStyle["msg-round"]} onClick={()=>SetOpen(!open)}>
          <div className={commonStyle[""]}></div>
        </div>
      </div>
    </>
  )
}
