import React, { useState } from 'react';
import { useEffect } from 'react';
import homeStyle from "../../styles/home.module.scss";
import commonStyle from "../../styles/Common.module.css"
import lottie from 'lottie-web';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import Chatbox from '../common/chatbox';
export default function Home() {

    const { data: session } = useSession();
    const router = useRouter()

    const [open, setOpen] = useState(false)

    useEffect(() => {
        // Load the Lottie animation
        const animation = lottie.loadAnimation({
            container: document.getElementById('bg-wrapper'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/assets/js/lottiefiles.json',
        });

        // Clean up the animation when the component is unmounted
        return () => {
            animation.destroy();
        };
    }, []);

    const login = () => {
        signIn('spotify')
    }

    useEffect(() => {
        if (session) {
            // router.push("/play-list")
            // router.push("/loader")
            // router.push("/songCollection")
        }
    }, [session])

    return (
        <>
            <div id="bg-wrapper" className={commonStyle["bg-animation"]}></div>
            <section className={homeStyle["banner-wrapper"]} >
                <h1 className={commonStyle["large-title"]}>PLAYLIST FOR A PROBLEM</h1>
                <p className={homeStyle["tag-lines"]}>Sharing your feelings is healthy. Tell us how you feel today and we'll curate an album
                    designed to make you feel better.</p>
                <div className={homeStyle["form-group"]}>
                    <input type="text"
                        placeholder="I'm so anxious that I might lose my job I'm worried it's driving my wife away." />
                </div>
                <a href="#" className={homeStyle["btn"] + " " + homeStyle["bnt-main"]} onClick={() => setOpen(true)}>Generate</a>

            </section>
        
            <div className={homeStyle["dialog-wrapper"] + " " + (open == true ? homeStyle["open"] : homeStyle["close"]) }>
                <div className={homeStyle["dialog-box"]}>
                    <h4 className={homeStyle["modal-title"]}>Log in with your spotify account to get the most personalised experience.</h4>
                    <div className={homeStyle["btn-wrap"]}>
                        <a href="#" className={homeStyle["btn"] + " " + homeStyle["confirm-btn"]} onClick={login}></a>
                        <a href="#" className={homeStyle["btn"] + " " + homeStyle["cancel-btn"]} onClick={() => setOpen(false)}></a>
                    </div>
                </div>
            </div>
            <Chatbox/>
        </>
    )
}