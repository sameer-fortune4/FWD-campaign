import React from 'react';
import commonStyle from "../../styles/Common.module.css";
import Image from 'next/image';
import Logo from "../../public/assets/images/fwd-logo.svg"
export default function Chatbox() {
  return (
    <>
        <div className={commonStyle["logo-wrapper"]}>
            <div className={commonStyle["chat-titie"]}>
                <p>We're always here to listen. </p>
                <p className={commonStyle["botton-title"]}>Click <a href="#">here</a> for a confidential session with a mental health
                    professional</p>
            </div>
            <a href="#" className={commonStyle["logo-wrap"]}>
                <Image src={Logo} height={100} width={100}/>
            </a>
        </div>
    </>
  )
}