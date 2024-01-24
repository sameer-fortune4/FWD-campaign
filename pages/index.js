import React, { useRef, useState } from 'react';
import { useEffect } from 'react';
import homeStyle from "../styles/home.module.scss";
import commonStyle from "../styles/Common.module.scss"
import lottie from 'lottie-web';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import Chatbox from '../component/common/chatbox';
import Loader from '../component/common/loader';
import Link from 'next/link';
export default function Index() {

    const { data: session } = useSession();
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const [formData, setFormData] = useState({ name: '', });
    const [validation, setValidation] = useState(false)
    const [space, setSpace] = useState(false)
    const handleChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue !== " ") {
            // Validate input using a regular expression (allowing only letters and spaces)
            const isValid = /^[a-zA-Z\s]*$/.test(inputValue);
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
            }
        } else {
            setSpace(true)
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
    // const [collection,setCollection] = useState(false)
    const login = (e) => {
        signIn('spotify')
        // setLoading(true)
        e.preventDefault();
        // setMainData(formData.name)
        // localStorage.clear();
    }

    const fetchTokenApi = async () => {
        const authorizationCode = process.env.NEXT_PUBLIC_CODE;
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
            setSessionData(session.accessToken)
        }
    }, [session])

    useEffect(() => {
        if (sessionData !== '') {
            router.push("/songCollection")
        } else {
            router.push("/")
        }
    }, [sessionData])

    const generateTExt = () => {
        if (formData.name === '') {
            // alert("please enter text11")
            setValidation(true)
            setSpace(false)
        } else {
            setOpen(true)
            localStorage?.setItem('inputData', JSON.stringify(formData.name))
        }
    }
    // useEffect(()=>{
    //     var input = document.getElementById("myInput");

    //     input.addEventListener("keypress", function(event) {
    //     // If the user presses the "Enter" key on the keyboard
    //     if (event.key === "Enter") {
    //         // Cancel the default action, if needed
    //         event.preventDefault();
    //         // Trigger the button element with a click
    //         document.getElementById("myBtn").click();
    //     }
    //     });
    // },[])
    return (
        <>
            <div className={commonStyle["main-wrapper"]}>
                {/* <div id="bg-wrapper" className={commonStyle["bg-animation"]}></div> */}
                <div className={commonStyle["bg-gradient"]}></div>
                {loading ?
                    <Loader />
                    :
                    // {collection ? <SongCollection mainData={mainData} /> :

                    <>
                        <section className={homeStyle["banner-wrapper"]} >
                            <div className={homeStyle["text-container"]}>
                                <h1 className={commonStyle["large-title"]}>PLAYLIST FOR A PROBLEM</h1>
                            </div>
                            <p className={homeStyle["tag-lines"]}>Sharing your feelings is healthy. Tell us how you feel today and we&apos;ll curate an album
                                designed to make you feel better.</p>
                            <div className={homeStyle["form-group"] + " " + (validation == true || space == true ? homeStyle["active"] : "")}>
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
                            </div>
                            {/* <a href="#" className={homeStyle["btn"] + " " + homeStyle["bnt-main"]} onClick={() => setOpen(true)}>Generate</a> */}
                            <div className={commonStyle["button-wrapper"] + " " + homeStyle["home-btn"]}>
                                <a href="#" className={commonStyle["btn"] + " " + commonStyle["bnt-main"]} id='myBtn' onClick={generateTExt}>Generate</a>
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
