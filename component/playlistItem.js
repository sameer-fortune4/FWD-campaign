import React, { useState } from 'react'
import styles from '../styles/Common.module.scss';
import Image from 'next/image';
import Link from 'next/link';

export default function PlaylistItem({ data }) {
    // const [showIframe, setShowIframe] = useState(false)
    // const [active, setActive] = useState(false)
    // const handledata = () => {
    //     setShowIframe(true)
    //     setClassData(true)
    // };

    return (
        <div className={"swiper-outer"}>
            <Link className={styles.card} href={data.external_urls.spotify} target='_blank'>
                <div className={styles.image + " sliderCard-img"} >
                        <Image width={200} height={200} className="banner-img" src={data.album?.images[0]?.url} alt={data.name} />
                    <span className={styles["btn-play"] + " " + "act-btn"}></span>
                </div>
            </Link>
        </div>
    )
}
