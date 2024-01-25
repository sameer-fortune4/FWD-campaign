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
// import lottie from 'lottie-web';
import Chatbox from '../component/common/chatbox';
import LoaderCard from '../component/common/loaderCard';
import Link from 'next/link';
import PlaylistItem from '../component/playlistItem';


export default function PlayList() {
    const { data: session } = useSession();
    const router = useRouter();
    const [listSong, setListSong] = useState([]);
    const [idData, setIdData] = useState()
    const [classData, setClassData] = useState(false)

    useEffect(() => {
        let token = localStorage.getItem('access_token')
        if (token !== '') {
            fetchFilterListSong(token)
        }
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
    const [listenText, setListenText] = useState(false)
    const swipperData = (text) => {
        text.on('slideChange', () => {
            setClassData(false)
            setListenText(true)
        })

    }

    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (session == undefined) {
            if (!access_token) {
                router.push('/')
            } else {
                router.push('/play-list')
            }
        }
    }, [session])

    return (
        <>
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
                                                <PlaylistItem data={v} setClassData={setClassData} classData={classData} />
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
