import React, { useEffect, useState } from 'react';
import styles from '../styles/Common.module.scss';
import { getData } from '../utilities/service';
import { apiList } from '../utilities/apiList';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import commonStyle from "../styles/Common.module.scss"
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import lottie from 'lottie-web';
import Chatbox from '../component/common/chatbox';
// import Loader from '../component/landing/loader';

export default function PlayList() {
    const { data: session } = useSession();
    const router = useRouter();

    const [listSong, setListSong] = useState([]);
    const [idData, setIdData] = useState()
    const [classData, setClassData] = useState(false)

    useEffect(() => {
        let access_token = session?.accessToken;
        let token = localStorage.getItem('access_token')

        // if (!session) {
        //     router.push('/');
        // } else {
        //     fetchPlayListData(access_token);
        //     handledata()
        // }
        if (!session) {
            if (token) {

                fetchFilterListSong(token)
            }
        } else {

            fetchFilterListSong(access_token)
        }
    }, [session]);

    useEffect(() => {
        // Load the Lottie animation
        const animation = lottie.loadAnimation({
            container: document.getElementById('bg'),
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

    const fetchFilterListSong = async (access_token) => {
        let item = JSON.parse(localStorage.getItem('emotionData'))
        let response = await getData(apiList.FILTER_BY_TRACK_SONG + `?q=${item?.name}&access_token=${access_token}`)
        setListSong(response.items)
    }

    const [audioRef, setAudioRef] = useState(null);
    const [playSong, setPlaySong] = useState()
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    useEffect(() => {
        // Create an audio element reference
        const audioElement = new Audio();
        setAudioRef(audioElement);

        const handleTimeUpdate = () => {
            setCurrentTime(audioElement.currentTime);
        };

        // Handle duration change
        const handleDurationChange = () => {
            setDuration(audioElement.duration);
        };

        // Attach event listeners
        audioElement.addEventListener('timeupdate', handleTimeUpdate);
        audioElement.addEventListener('durationchange', handleDurationChange);

        // Clean up the audio element when the component is unmounted
        return () => {
            audioElement.pause();
            audioElement.src = '';
            audioElement.load();
            audioElement.removeEventListener('timeupdate', handleTimeUpdate);
            audioElement.removeEventListener('durationchange', handleDurationChange);
        };
    }, []);
    const handledata = async (data) => {
        console.log("object", playSong);
        // Pause the previous song
        if (audioRef) {
            audioRef.pause();
        }

        // If the clicked card is the same as the currently playing one, pause the audio
        if (idData === data) {
            setIdData(null);
        } else {
            // Otherwise, play the new song
            setIdData(data);
            setClassData(true)
            // Fetch the new song data based on the id
            try {
                // let access_token = session?.accessToken;
                let access_token = localStorage.getItem('access_token');
                let response = await getData(apiList.SINGLE_SONG + `?access_token=${access_token}&id=${data}`);
                setPlaySong(response.preview_url);

                // Play the audio
                if (audioRef) {
                    audioRef.src = response.preview_url;
                    audioRef.load();
                    audioRef.play();
                }
            } catch (error) {
                console.error('Error fetching playlist song data:', error);
            }
        }
    };
    const calculateProgressBarWidth = () => {
        if (duration > 0) {
            return (currentTime / duration) * 100 + '%';
        }
        return '0%';
    };
    const swiperOptions = {
        className: "mySwiper",
        effect: 'coverflow',
        centeredSlides: true,
        // slidesPerView: [1.2],
        initialSlide: [2],
        speed: [1000],
        coverflowEffect: {
            rotate: 0,
            depth: 300,
            modifier: 1,
            slideShadows: true,
            scale: 1,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.2,
            },
            499: {
                slidesPerView: 2.2,
            },
            999: {
                slidesPerView: 3.2,
            }
        },
        // loop:true,
        pagination: true,
        allowTouchMove: true,
        modules: [EffectCoverflow, Navigation],
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // on: {
        //     slideChange: (swiper) => {
        //         setClassData(false);
        //         if (audioRef) {
        //             audioRef.pause();
        //         }
        //     },
        // },
    }

    const [swiper, setSwiper] = useState(null);
    // useEffect(() => {
    //     if (swiper) {
    //         swiper.on('slideChange', () => {
    //             setClassData(false);
    //             if (audioRef) {
    //                 audioRef.pause();
    //             }
    //         });
    //     }
    // }, [swiper]);

    const handleSwiper = (swiperInstance) => {
        setSwiper(swiperInstance);

        swiperInstance.on('slideChange', () => {
            setClassData(false);
        });
    };

    useEffect(() => {
        if (audioRef && classData === false) {
            audioRef.pause()
        }
    }, [classData])
    // console.log("object", audioRef);

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    return (
        <>
            <div id="bg" className={commonStyle["bg-animation"]} ></div>
            <div className={styles["swiper-box"]}>
                <div className={styles.container + " " + "swiper-container"}>
                    <h2 className={styles["medium-title"]}>Listen to other people's</h2>
                    <h2 className={styles["medium-title"]}>Playlist for a Problem</h2>
                    <div className={styles["loader"]}>
                        <div className={styles["loader-card"]}>
                            <div className={styles["top-img"] + " " + styles["pulsate"]}></div>
                            <div className={styles["footer-wrap"]}>
                                <span className={styles["img-logo"] + " " + styles["pulsate"]}></span>
                                <div className={styles["control-wrap"]}>
                                    <span className={styles["top"] + " " + styles["pulsate"]}></span>
                                    <span className={styles["top"] + " " + styles["top-first"] + " " + styles["pulsate"]}></span>
                                </div>
                            </div>
                        </div>
                        <div className={styles["loader-card"]}>
                            <div className={styles["top-img"] + " " + styles["pulsate"]}></div>
                            <div className={styles["footer-wrap"]}>
                                <span className={styles["img-logo"] + " " + styles["pulsate"]}></span>
                                <div className={styles["control-wrap"]}>
                                    <span className={styles["top"] + " " + styles["pulsate"]}></span>
                                    <span className={styles["top"] + " " + styles["top-first"] + " " + styles["pulsate"]}></span>
                                </div>
                            </div>
                        </div>
                        <div className={styles["loader-card"]}>
                            <div className={styles["top-img"] + " " + styles["pulsate"]}></div>
                            <div className={styles["footer-wrap"]}>
                                <span className={styles["img-logo"] + " " + styles["pulsate"]}></span>
                                <div className={styles["control-wrap"]}>
                                    <span className={styles["top"] + " " + styles["pulsate"]}></span>
                                    <span className={styles["top"] + " " + styles["top-first"] + " " + styles["pulsate"]}></span>
                                </div>
                            </div>
                        </div>
                        <div className={styles["loader-card"]}>
                            <div className={styles["top-img"] + " " + styles["pulsate"]}></div>
                            <div className={styles["footer-wrap"]}>
                                <span className={styles["img-logo"] + " " + styles["pulsate"]}></span>
                                <div className={styles["control-wrap"]}>
                                    <span className={styles["top"] + " " + styles["pulsate"]}></span>
                                    <span className={styles["top"] + " " + styles["top-first"] + " " + styles["pulsate"]}></span>
                                </div>
                            </div>
                        </div>
                        <div className={styles["loader-card"]}>
                            <div className={styles["top-img"] + " " + styles["pulsate"]}></div>
                            <div className={styles["footer-wrap"]}>
                                <span className={styles["img-logo"] + " " + styles["pulsate"]}></span>
                                <div className={styles["control-wrap"]}>
                                    <span className={styles["top"] + " " + styles["pulsate"]}></span>
                                    <span className={styles["top"] + " " + styles["top-first"] + " " + styles["pulsate"]}></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Swiper {...swiperOptions} onSwiper={handleSwiper}>
                        {listSong &&
                            listSong.map((v, i) => (
                                <SwiperSlide key={i}>
                                    <a className={styles.card} onClick={() => handledata(v.id)} >
                                        <div className={styles.image}>
                                            <img src={v.album?.images[0]?.url} alt={v.name} />
                                            <div className={styles["player"] + " " + "player-wrapper"}>
                                                <span className={styles["media-icon"] + " " + ((idData === v.id && classData ? styles.active : ""))}></span>
                                                <div className={styles["control-wrapper"]}>
                                                    <span className={styles["info-title"]}>{v.name}</span>
                                                    <div className={styles['timer-wrap']}>
                                                        {idData === v.id && classData ? <>
                                                            <span>{formatTime(currentTime)}</span>
                                                            <span>{formatTime(duration)}</span>
                                                        </>
                                                            :
                                                            <>
                                                                <span>0.00</span>
                                                                <span>{formatTime(duration)}</span>
                                                            </>
                                                        }
                                                    </div>
                                                    <source ref={audioRef} src={playSong} type="audio/mpeg" />
                                                    <div className={styles["progress-bar"]}>
                                                        {idData === v.id && classData ?
                                                            <span
                                                                className={styles["strip"]}
                                                                style={{ width: calculateProgressBarWidth() }}
                                                            ></span>
                                                            :
                                                            <span
                                                                className={styles["strip"]}
                                                            ></span>
                                                        }
                                                    </div>

                                                    {/* <div className={styles["progress-bar"]}>
                                                                <span className={styles["strip"]}></span>
                                                            </div> */}
                                                </div>
                                            </div>
                                            <span className={styles["btn-play"] + " " + "play-btn"}></span>
                                        </div>
                                    </a>
                                </SwiperSlide>
                            ))}
                        <div className="swiper-button-prev swipe-btn"></div>
                        <div className="swiper-button-next swipe-btn"></div>
                    </Swiper>
                </div >
            </div>
            <Chatbox />
        </>
    );
}
