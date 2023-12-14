import React, { useState } from 'react';
import { useEffect } from 'react';
import homeStyle from "../styles/home.module.scss";
import commonStyle from "../styles/Common.module.scss"
import lottie from 'lottie-web';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import Chatbox from '../component/common/chatbox';
import Loader from '../component/common/loader';
export default function Index() {

    const { data: session } = useSession();
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const [open, setOpen] = useState(false)

    //////////
    const milliseconds = 4000;
    const [intervalTime, setIntervalTime] = useState(milliseconds);
    const writePlaceholder = (field, text, n) => {
        if (n < text.length) {
            setPlaceholders((prevPlaceholders) => ({
                ...prevPlaceholders,
                [field]: text.substring(0, n + 1),
            }));
            n++;
            setTimeout(() => {
                writePlaceholder(field, text, n);
            }, 65);
        }
    };

    const setFields = (objFields) => {
        for (const key in objFields) {
            if (objFields.hasOwnProperty(key)) {
                writePlaceholder(key, objFields[key], 0);
            }
        }
    };
    const intervalTimeHandler = (ms) => {
        setIntervalTime(ms);
    };

    const [placeholders, setPlaceholders] = useState({});
    useEffect(() => {
        intervalTimeHandler(5000);
        setFields({
            name: "I'm so anxious that I might lose my job I'm worried it's driving my wife away.",
        });
    }, []);
    /////////////////

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: document.getElementById('bg-wrapper'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/assets/js/lottiefiles.json',
        });
        return () => {
            animation.destroy();
        };
    }, []);

    const login = () => {
        signIn('spotify')
        setLoading(true)
    }

    useEffect(() => {
        if (session) {
            router.push("/play-list")
            // router.push("/loader")
            // router.push("/songCollection")
        }
    }, [session])

    return (
        <>
            <div className={commonStyle["main-wrapper"]}>
                <div id="bg-wrapper" className={commonStyle["bg-animation"]}></div>
                {loading ?
                    <Loader />
                    :
                    <>
                        <section className={homeStyle["banner-wrapper"]} >
                            <div className={homeStyle["text-container"]}>
                                <h1 className={commonStyle["large-title"]}>PLAYLIST FOR A PROBLEM</h1>
                            </div>
                            <p className={homeStyle["tag-lines"]}>Sharing your feelings is healthy. Tell us how you feel today and we&apos;ll curate an album
                                designed to make you feel better.</p>
                            <div className={homeStyle["form-group"]}>
                                <input type="text"
                                    placeholder={placeholders.name} />
                            </div>
                            {/* <a href="#" className={homeStyle["btn"] + " " + homeStyle["bnt-main"]} onClick={() => setOpen(true)}>Generate</a> */}
                            <div className={commonStyle["button-wrapper"] + " " + homeStyle["home-btn"]}>
                                <a href="#" className={commonStyle["btn"] + " " + commonStyle["bnt-main"]} onClick={() => setOpen(true)}>Generate</a> 
                                <div className={commonStyle["button-bg"]}></div>
                            </div>

                        </section>

                        <div className={homeStyle["dialog-wrapper"] + " " + (open == true ? homeStyle["open"] : homeStyle["close"])}>
                            <div className={homeStyle["dialog-box"]}>
                                <h4 className={homeStyle["modal-title"]}>Log in with your spotify account to get the most personalised experience.</h4>
                                <div className={homeStyle["btn-wrap"]}>
                                    <a href="#" className={homeStyle["btn"] + " " + homeStyle["confirm-btn"]} onClick={login}></a>
                                    <a href="#" className={homeStyle["btn"] + " " + homeStyle["cancel-btn"]} onClick={() => setOpen(false)}></a>
                                </div>
                            </div>
                        </div>
                    </>
                }
                <Chatbox />
            </div>
        </>
    )
}
