import React, { useEffect, useState } from 'react';
import commonStyle from "../../styles/Common.module.scss";
import Image from 'next/image';
import Logo from "../../public/assets/images/fwd-logo.svg"
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
export default function Chatbox() {
  const [open, SetOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleData = async() => {
    await signOut();
    localStorage.clear()
  }
  useEffect(() => {
    let token = localStorage.getItem('access_token')
    if (session == null || session === undefined) {
      if (!token) {
        router.push('/')
      }
    }
  }, [session])

  return (
    <>
      <div className={commonStyle["logo-wrapper"] + " " + (open == true ? commonStyle["active"] : "")}>
        <div className={commonStyle["chat-titie"]}>
          <p>We're always here to listen. </p>
          <p className={commonStyle["botton-title"]}>Click <Link href="/">here</Link> for a confidential session with a mental health
            professional.</p>
        </div>
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
