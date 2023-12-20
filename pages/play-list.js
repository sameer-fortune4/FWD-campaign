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
import LoaderCard from '../component/common/loaderCard';
// import Loader from '../component/landing/loader';

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
        // let item = JSON.parse(localStorage.getItem('emotionData'))
        let item = localStorage.getItem('inputData')
        // console.log("object");
        let response = await getData('api/filter/filterByTrackSong' + `?q=${item}&access_token=${access_token}`)
        if (response) {
            setListSong(response.items)
            setIsloading(false)
        }
    }

    const [playSong, setPlaySong] = useState()

    const handledata = async (data) => {
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
                let response = await getData('api/filter/track' + `?access_token=${access_token}&id=${data}`);
                setPlaySong(response.preview_url);
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
    }
    return (
        <>
            <div id="bg" className={commonStyle["bg-animation"]} ></div>
            <div className={styles["swiper-box"]}>
                <div className={styles.container + " " + "swiper-container"}>
                    <h2 className={styles["medium-title"]}>Listen to other people's</h2>
                    <h2 className={styles["medium-title"]}>Playlist for a Problem</h2>
                    {isLoading ?
                        <LoaderCard />
                        :
                        <Swiper {...swiperOptions}>
                            {listSong &&
                                listSong.map((v, i) => (
                                    <SwiperSlide key={i}>
                                        <a className={styles.card} onClick={() => handledata(v.id)} >
                                            <div className={styles.image}>
                                                <img src={v.album?.images[0]?.url} alt={v.name} />
                                                <div className={styles["player"] + " " + "player-wrapper"}>
                                                    {idData == v.id && playSong !==undefined &&
                                                        <audio controls>
                                                            <source src={playSong} type="audio/mpeg" />
                                                        </audio>
                                                    }
                                                    
                                                </div>
                                                <span className={styles["btn-play"] + " " + "play-btn"}></span>
                                            </div>
                                        </a>
                                    </SwiperSlide>
                                ))}

                            <div className="swiper-button-prev swipe-btn"></div>
                            <div className="swiper-button-next swipe-btn"></div>
                        </Swiper>
                    }
                </div>
            </div>
            <Chatbox />
        </>
    );
}
