import React, { useContext, useRef, useState } from 'react';
import { useEffect } from 'react';
import homeStyle from "../styles/home.module.scss";
import commonStyle from "../styles/Common.module.scss"
import lottie from 'lottie-web';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import Chatbox from '../component/common/chatbox';
import Loader from '../component/common/loader';
import Link from 'next/link';
import { ConnContext } from '../context/connContext';
import Lottie from 'react-lottie';
import animationData from '../public/assets/js/scene1.json';

export default function Index() {

    const { data: session } = useSession();
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { homePage, setHomePage, setFormData, formData, blockKey, setBlockKey } = useContext(ConnContext)

    const [open, setOpen] = useState(false)
    const [space, setSpace] = useState(false)
    const [validation, setValidation] = useState(false)
    const [demo, setDemo] = useState(false)


    const handleChange = (e) => {
        const inputValue = e.target.value;
        if(inputValue.length > 8){
            setDemo(false)
        }
        if (inputValue !== " ") {
            // Validate input using a regular expression (allowing only letters and spaces)
            const isValid = /^[a-zA-Z!\s]*$/.test(inputValue);
            // Update state only if the input is valid
            if (isValid) {
                setFormData({
                    ...formData,
                    [e.target.name]: inputValue,
                });
                setValidation(false);
                setSpace(false)
            } else {
                setValidation(false);
                setSpace(true)
                setBlockKey(false)
            }
        } else {
            setSpace(true)
            setValidation(false);
            setBlockKey(false)
        }
    };
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

    const login = (e) => {
        signIn('spotify')
        e.preventDefault();
    }

    const fetchTokenApi = async () => {
        const authorizationCode = process.env.NEXT_PUBLIC_CODE;
        localStorage.setItem('refresh_token', authorizationCode)
        try {
            const response = await fetch('/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: authorizationCode }),
            });
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access_token);
                localStorage?.setItem('inputData', JSON.stringify(formData.name))
                setLoading(true)
                router.push('/songCollection')
            } else {
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        const fetchTokenInterval = setInterval(fetchTokenApi, 60 * 60 * 1000); // 1 hour
        // fetchTokenApi()
        return () => {
            clearInterval(fetchTokenInterval); // Clear the interval when the component unmounts
        };
    }, []);

    const closeButton = async () => {
        setOpen(false);
        fetchTokenApi(); // Call the API immediately when the close button is clicked
        // ... (your existing code)
    };
    const [sessionData, setSessionData] = useState('');

    useEffect(() => {
        if (session) {
            localStorage.setItem('access_token', session.accessToken)
            localStorage.setItem('refresh_token', session.refreshToken)
            setSessionData(session.accessToken)
        }
    }, [session])

    useEffect(() => {
        if (homePage) {
            router.push('/')
        } else {
            if (sessionData !== '') {
                let inputData = localStorage.getItem('inputData')
                if (inputData !== '' && inputData !== null) {
                    router.push("/songCollection")
                }
            } else {
                router.push("/")
            }
        }
    }, [sessionData, homePage])

    const generateTExt = () => {
        setHomePage(false);
        let inputData = formData.name.trim()
        if (inputData.length < 8) {
            setDemo(true)
        } else {
            setDemo(false)
            if (formData.name === '') {
                setValidation(true)
                setSpace(false)
            } else if (blockKey) {
                setSpace(false)
            } else {
                if (sessionData) {
                    // setOpen(false)
                    if (!space) {
                        router.push('/songCollection')
                        localStorage?.setItem('inputData', JSON.stringify(formData.name))
                    }
                } else {
                    if (space) {
                        setOpen(false)
                    } else {
                        setOpen(true)
                        localStorage?.setItem('inputData', JSON.stringify(formData.name))
                    }
                }
            }
        }
    }
    return (
        <>
            <div className={commonStyle["main-wrapper"]}>
                {/* <div id="bg-wrapper" className={commonStyle["bg-animation"]}></div> */}
                {/* <div className={commonStyle["bg-gradient"]}></div> */}
            <div className={commonStyle["bg-animation"]} style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Lottie
                    options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                    }}
                    height={'100%'}
                    width={'100%'}
                />
            </div>
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
                            <div className={homeStyle["form-group"] + " " + (validation == true || space == true || blockKey == true || demo == true ? homeStyle["active"] : "")}>
                                <input type="text"
                                    placeholder={placeholders.name}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    id='myInput'
                                />
                                {validation &&
                                    <p className={homeStyle["error"]}>Please enter your emotions before submitting!</p>
                                }
                                {space &&
                                    <p className={homeStyle["error"]}>Please enter correct para or word before submitting!</p>
                                }
                                {blockKey &&
                                    <p className={homeStyle["error"]}>Invalid Keyword</p>
                                }
                                {demo &&
                                    <p className={homeStyle['error']}>Please enter minimum 8 characters</p>
                                }
                            </div>
                            {/* <a href="#" className={homeStyle["btn"] + " " + homeStyle["bnt-main"]} onClick={() => setOpen(true)}>Generate</a> */}
                            <div className={commonStyle["button-wrapper"] + " " + homeStyle["home-btn"]}>
                                <a href="#" className={commonStyle["btn"] + " " + commonStyle["bnt-main"]} id='myBtn' onClick={generateTExt}><span>Generate</span></a>
                                <div className={commonStyle["button-bg"]}></div>
                            </div>

                        </section>

                        <div className={homeStyle["dialog-wrapper"] + " " + (open == true ? homeStyle["open"] : homeStyle["close"])}>
                            <div className={homeStyle["dialog-box"]}>
                                <h4 className={homeStyle["modal-title"]}>Log in with your spotify account to get the most personalised experience.</h4>
                                <div className={homeStyle["btn-wrap"]}>
                                    <a href="#" className={homeStyle["btn"] + " " + homeStyle["confirm-btn"]} onClick={login}></a>
                                    <a href="#" className={homeStyle["btn"] + " " + homeStyle["cancel-btn"]} onClick={closeButton}></a>
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

// export const getServerSideProps = (context) => {
//     let data = context.req.cookies['next-auth.session-token']
//     console.log("0000000",data);
//     if (!data) {
//         return {
//             redirect: {
//                 destination: '/play-list',
//                 permanent: true,
//             },
//         }
//     } else {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false
//             }
//         }
//     }
//     return {
//         props: { "userData": "userData" }
//     }

// }
