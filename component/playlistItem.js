import React, { useState } from 'react'
import styles from '../styles/Common.module.scss';
import Image from 'next/image';

export default function PlaylistItem({ data, classData, setClassData }) {
    // const [showIframe, setShowIframe] = useState(false)
    // const [active, setActive] = useState(false)
    // const handledata = () => {
    //     setShowIframe(true)
    //     setClassData(true)
    // };

    return (
        <div className={"swiper-outer"}>
            <div className={styles.card}>
                <div className={styles.image + " sliderCard-img"} >
                        <Image width={200} height={200} className="banner-img" src={data.album?.images[0]?.url} alt={data.name} />
                    <span className={styles["btn-play"] + " " + "act-btn"}></span>
                </div>
            </div>
        </div>
    )
}
