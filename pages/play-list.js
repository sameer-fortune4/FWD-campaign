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
            handledata()
        }
    }, [session]);

    useEffect(() => {
        // Load the Lottie animation
        const animation = lottie.loadAnimation({
            container: document.getElementById('bg'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/assets/js/slider.json',
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
    const handledata = async (data) => {
        setIdData(data)
        let user = session?.accessToken;
        let response = await getData(apiList.PLAY_SONG + `?user=${user}&id=${data}`);
        setPlaySong(response[0]?.track.preview_url)
    }
    const swiperOptions = {
        className: "mySwiper",
        effect: 'coverflow',
        centeredSlides: true,
        slidesPerView: [3.2],
        initialSlide: [2],
        coverflowEffect: {
            rotate: 0,
            depth: 300,
            modifier: 1,
            slideShadows: true,
            scale: 1,
        },
        // loop:true,
        pagination: true,
        modules: [EffectCoverflow, Navigation],
    }
    return (
        <>
            <div id="bg" className={commonStyle["bg-animation"]} ></div>
            <header className={styles.headerWrapper}>
                <div className={styles.copy}>
                    <span className={styles.name}>{`${session?.user.name}'s`}</span>
                    <span className={styles.list}>Playlist</span>
                </div>
                <button onClick={signOut} className='loginButton'>
                    SignOut
                </button>
            </header>
            <div className={styles.container}>
                <Swiper
                    {...swiperOptions}
                >
                    {listSong &&
                        listSong.map((v, i) => (
                            <SwiperSlide key={i}>
                                <a className={styles.card}>
                                    <div className={styles.image}>
                                        <img src={v.images[0].url} alt={v.name} onClick={() => handledata(v.id)} />
                                        <div className={styles.player}>

                                        </div>
                                        {idData === v.id ?
                                            <>
                                                <div className={styles.player}>
                                                    <audio controls>
                                                        <source src={plyasong} type="audio/mpeg" />
                                                    </audio>
                                                </div>
                                            </>
                                            : ""}
                                    </div>
                                    {/* <img src={v.image} alt={v.name} /> */}
                                    <h2>{v.name}</h2>
                                </a>
                            </SwiperSlide>
                        ))}
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>
                </Swiper>
            </div >
        </>
    );
}
