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
    const [plyasong, setPlaySong] = useState();

    useEffect(() => {
        if (!session) {
            router.push('/');
        } else {
            fetchData();
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

    // const playData = async (id) => {
    //     try {
    //         let user = session?.accessToken;
    //         let response = await getData(apiList.PLAY_SONG + `?user=${user}&id=${id}`);
    //         // return response?.map((v) => v.track.preview_url);
    //         setPlaySong(response?.track.preview_url)
    //     } catch (error) {
    //         console.error('Error fetching play data:', error);
    //         return null;
    //     }
    // };

    const fetchData = async () => {
        try {
            let user = session?.accessToken;
            let response = await getData(apiList.PLAY_LIST + `?user=${user}`);
            // setListSong(
            //     response?.map((v) => ({
            //         image: v.images[0]?.url,
            //         name: v.name,
            //         songUrl: "df",
            //     }))
            // );
            // let dataSong = []
            // response && response?.map((v,i) => (
            //     playData(v.id),
            //     dataSong.push({
            //         image: v.images[0].url,
            //         name: v.name,
            //         songUrl: plyasong && plyasong
            //     })
            // ))
            if (response) {
                setListSong(response)
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const [idData, setIdData] = useState()
    const [classData,setClassData] = useState(false)
    const handledata = async (data) => {
        setClassData(!classData)
        setIdData(data)
        let user = session?.accessToken;
        let response = await getData(apiList.PLAY_SONG + `?user=${user}&id=${data}`);
        console.log("fjgdhfgdhfgdhfgdh",response)
        setPlaySong(response[0]?.track.preview_url)
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
            0:{
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
    console.log("listSong",plyasong);
    return (
        <>
            <div id="bg" className={commonStyle["bg-animation"]} ></div>
                {/* <header className={styles.headerWrapper}>
                    <div className={styles.copy}>
                        <span className={styles.name}>{`${session?.user.name}'s`}</span>
                        <span className={styles.list}>Playlist</span>
                    </div>
                    <div className={commonStyle["button-wrapper"]}>
                        <a href="#" className={commonStyle["btn"] + " " + commonStyle["bnt-main"]} onClick={signOut}>SignOut</a> 
                        <div className={commonStyle["button-bg"]}></div>
                    </div>
                    <button onClick={signOut} className='loginButton'>
                        SignOut
                    </button>
                </header> */}
                <div className={styles["swiper-box"]}>
                    <div className={styles.container + " " + "swiper-container"}>
                        <h2 className={styles["medium-title"]}>Listen to other people's</h2>   
                         <h2 className={styles["medium-title"]}>Playlist for a Problem</h2>   
                        <Swiper {...swiperOptions}>
                            {listSong &&
                                listSong.map((v, i) => (
                                    <SwiperSlide key={i}>
                                        <a className={styles.card}  onClick={() => handledata(v.id)} >
                                            <div className={styles.image}>
                                                <img src={v.images[0].url} alt={v.name}  />
                                                {/* <div className={styles.player}>
                                                </div> */}
                                               
                                                <div className={styles["player"] + " " +"player-wrapper"}>
                                                    <span  onClick={() => handledata(v.id)} className={styles["media-icon"] + " " + (idData === v.id && !classData ? styles.active : "")}></span>
                                                    <div className={styles["control-wrapper"]}>
                                                        <span className={styles["info-title"]}>{v.name}</span>
                                                        <span className={styles["timer-wrap"]}>
                                                            <span>-6s</span>
                                                            <span>2min</span>
                                                        </span>
                                                        <div className={styles["progress-bar"]}>
                                                            <span className={styles["strip"]}></span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={styles["btn-play"] + " " + "play-btn"}></span>
                                            </div>
                                           
                                            {/* <img src={v.image} alt={v.name} /> */}
                                        {/* {idData === v.id ?
                                                    <>
                                                        <div className={styles["nitin"]}>
                                                            <audio ref={audioRef} src={plyasong}/>
                                                                
                                                            </audio>
                                                        </div>
                                                    </>
                                                    : ""}  */}
                                        </a>
                                    </SwiperSlide>
                                ))}
                                <div className="swiper-button-prev swipe-btn"></div>
                                <div className="swiper-button-next swipe-btn"></div>
                        </Swiper>
                    </div >
                </div>
            <Chatbox/>
        </>
    );
}
