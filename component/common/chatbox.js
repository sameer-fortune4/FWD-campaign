import React from 'react';
import commonStyle from "../../styles/Common.module.scss";
import Image from 'next/image';
import Logo from "../../public/assets/images/fwd-logo.svg"
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
export default function Chatbox() {
  const router = useRouter()
  const handleData = ()=>{
    signOut();
    router.push('/')
    localStorage.clear()
  }
  return (
    <>
        <div className={commonStyle["logo-wrapper"]}>
            {/* <div className={commonStyle["chat-titie"]}>
                <p>We're always here to listen. </p>
                <p className={commonStyle["botton-title"]}>Click <a href="#">here</a> for a confidential session with a mental health
                    professional.</p>
            </div> */}
            <a href="#" className={commonStyle["logo-wrap"]}>
                <Image onClick={handleData} src={Logo} height={100} width={100}/>
            </a>
        </div>
    </>
  )
}
