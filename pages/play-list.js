import React, { useEffect, useState } from 'react';
import styles from '../styles/Common.module.scss';
import { getData } from '../utilities/service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import commonStyle from "../styles/Common.module.scss"
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import lottie from 'lottie-web';
import Chatbox from '../component/common/chatbox';
import LoaderCard from '../component/common/loaderCard';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Link from 'next/link';
import ReactAudioPlayer from 'react-audio-player';
import Image from 'next/image';

export default function PlayList() {
    const { data: session } = useSession();

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
    const [isLoading, setIsloading] = useState(false)
    const fetchFilterListSong = async (access_token) => {
        setIsloading(true)
        let item = JSON.parse(localStorage.getItem('emotionData'))
        // let item = localStorage.getItem('inputData')
        let response = await getData('api/filter/filterByTrackSong' + `?q=${item}&access_token=${access_token}`)
        if (response) {
            setListSong(response.items)
            setIsloading(false)
        }
    }

    const [playSong, setPlaySong] = useState()
    const [playBtn, setPlayBtn] = useState(false)
    const handledata = async (data) => {

        setIdData(data);
        setClassData(true)
        setPlayBtn(true)
        try {
            let access_token
            if (session) {
                access_token = session?.accessToken;
            } else {
                access_token = localStorage.getItem('access_token');
            }
            let response = await getData('api/filter/track' + `?access_token=${access_token}&id=${data}`);
            setPlaySong(response.preview_url);
        } catch (error) {
            console.error('Error fetching playlist song data:', error);
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
    }
    const [listenText,setListenText] = useState(false)
    const swipperData = (text) => {
        text.on('slideChange', () => {
            setClassData(false)
            setListenText(true)
        })

    }
    const [isPlaying, setIsPlaying] = useState(false);
    const handlePlay = () => {
        setIsPlaying(true);
    };
    const handlePause = () => {
        setIsPlaying(false);
    };

    return (
        <>
            {/* <div className={commonStyle["main-wrapper"]}> */}
            {/* <div id="bg" className={commonStyle["bg-animation"]} ></div> */}
            <div className={commonStyle["bg-gradient"]}></div>
            <div className={styles["swiper-box"]}>
                <div className={styles.container + " " + "swiper-container"}>
                    <h2 className={styles["medium-title"]}>Listen to other people&apos;s</h2>
                    <h2 className={styles["medium-title"]}>Playlist for a Problem</h2>
                    {isLoading ?
                        <LoaderCard />
                        :
                        listSong.length > 0 ?
                        <>
                            <Swiper {...swiperOptions} onSwiper={swipperData} allowTouchMove={false}>
                                {listSong &&
                                    listSong.map((v, i) => (
                                        <SwiperSlide key={i}>
                                            <div className={"swiper-outer"}>
                                                <div className={styles.card + " " + (classData == true ? "control" : "")} onClick={() => handledata(v.id)} >
                                                    <div className={styles.image + " " + "sliderCard-img"} >
                                                        <img width={200} height={200} src={v.album?.images[0]?.url} alt={v.name} />
                                                        <div className={styles["player"] + " " + "player-wrapper"}>
                                                            <div className={styles["wrap-control"]}>

                                                                {idData == v.id && <>
                                                                    <p className={styles["card-title"]}>{v.name}</p>
                                                                    <AudioPlayer
                                                                        autoPlay={classData}
                                                                        src={playSong}
                                                                        onPlay={handlePlay}
                                                                        onPause={handlePause}
                                                                    />

                                                                </>
                                                                }
                                                            </div>
                                                        </div>
                                                        <span className={styles["btn-play"] + " " + (classData ? "active" : "") + " " + (idData == v.id && playBtn && isPlaying ? styles["current"] : "")}></span>
                                                    </div>
                                                        <a onClick={() => handledata(v.id)} aria-label="Listen songs" role="link" className={styles["listen-txt"] + " " + "listen-link"} href="#">Click to listen</a>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}

                                <div className={"swiper-button-prev" + " " + styles["swipe-btn-prev"]}></div>
                                <div className={"swiper-button-next" + " " + styles["swipe-btn-next"]}></div>
                            </Swiper>
                            </>
                            :
                            <div className={styles["error-wrap"]}>
                                <p className={styles["error-txt"]}>No Result Found</p>
                                <div className={commonStyle["button-wrapper"]} style={{ width: "fit-content", margin: "0 auto" }}>
                                    <Link href="/" className={commonStyle["btn"] + " " + commonStyle["bnt-main"]}>
                                        Go To Home Page
                                    </Link>
                                    <div className={commonStyle["button-bg"]}></div>
                                </div>
                            </div>
                    }

                </div>
            </div>
            <Chatbox />
            {/* </div> */}
        </>
    );
}
