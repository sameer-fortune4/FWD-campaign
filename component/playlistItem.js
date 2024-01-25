import React, { useState } from 'react'
import styles from '../styles/Common.module.scss';
import Image from 'next/image';

export default function PlaylistItem({ data, classData, setClassData }) {
    const [showIframe, setShowIframe] = useState(false)

    const handledata = () => {
        setShowIframe(true)
    };

    return (
        <div className={"swiper-outer"}>
            <div className={styles.card + " " + (classData == true ? "control" : "")}  >
                <div className={styles.image + " sliderCard-img"} >
                    {showIframe ?
                        <div className={styles["player"] + " player-wrapper"}>
                            <div className={styles["wrap-control"]}>
                                <iframe
                                    src={`https://open.spotify.com/embed/track/${data.id}?utm_source=generator`}
                                    width="300"
                                    height="360"
                                    frameBorder="0"
                                    allowtransparency="true"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                ></iframe>
                            </div>
                        </div> :
                        <Image width={200} height={200} src={data.album?.images[0]?.url} alt={data.name} onClick={() => handledata()} />
                    }
                </div>
            </div>
        </div>
    )
}
