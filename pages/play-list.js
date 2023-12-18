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
    useEffect(() => {
        // Create an audio element reference
        const audioElement = new Audio();
        setAudioRef(audioElement);

        // Clean up the audio element when the component is unmounted
        return () => {
            audioElement.pause();
            audioElement.src = '';
            audioElement.load();
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
        on: {
            slideChange: () => setClassData(false), // Set classData to false on slide change
        },
    }
    return (
        <>
            <div id="bg" className={commonStyle["bg-animation"]} ></div>
            <div className={styles["swiper-box"]}>
                <div className={styles.container + " " + "swiper-container"}>
                    <h2 className={styles["medium-title"]}>Listen to other people's</h2>
                    <h2 className={styles["medium-title"]}>Playlist for a Problem</h2>
                    <Swiper {...swiperOptions}>
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
                                                    {idData === v.id && classData && (
                                                        // <audio controls >
                                                            <source ref={audioRef} src={playSong} type="audio/mpeg" />
                                                        // {/* </audio> */}
                                                    )}
                                                    <div className={styles["progress-bar"]}>
                                                        <span className={styles["strip"]}></span>
                                                    </div>
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
