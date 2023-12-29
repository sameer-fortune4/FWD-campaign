import React, { useState } from 'react';
import commonStyle from "../../styles/Common.module.scss";
import Image from 'next/image';
import Logo from "../../public/assets/images/fwd-logo.svg"
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
export default function Chatbox() {
  const [open, SetOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleData = () => {
    if (session) {
      signOut();
      localStorage.clear()
      router.push('/')
    } else {
      router.push('/')
    }
  }
  return (
    <>
      <div className={commonStyle["logo-wrapper"] + " " + (open == true ? commonStyle["active"] : "")}>
        <div className={commonStyle["chat-titie"]}>
          <p>We're always here to listen. </p>
          <p className={commonStyle["botton-title"]}>Click <a href="#">here</a> for a confidential session with a mental health
              professional.</p>
        </div>
        <div className={commonStyle["msg-round"]} onClick={()=>SetOpen(!open)}>
          <div className={commonStyle[""]}></div>
        </div>
        <a href="#" className={commonStyle["logo-wrap"]}>
          <Image onClick={handleData} src={Logo} width={100} alt='logo' />
        </a>
      </div>
    </>
  )
}
