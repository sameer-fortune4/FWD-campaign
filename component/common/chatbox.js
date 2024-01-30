import React, { useContext, useEffect, useState } from 'react';
import commonStyle from "../../styles/Common.module.scss";
import Image from 'next/image';
import Logo from "../../public/assets/images/fwd-logo.svg"
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
    // localStorage.clear()
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
        <div className={commonStyle["msg-round"]} onClick={() => SetOpen(!open)}>
          <div className={commonStyle[""]}></div>
        </div>
        <Link href="/" className={commonStyle["logo-wrap"]}>
          <Image onClick={handleData} src={Logo} width={100} alt='logo' />
        </Link>
      </div>
    </>
  )
}
