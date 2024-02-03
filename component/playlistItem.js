import React, { useState } from 'react'
import styles from '../styles/Common.module.scss';
import Image from 'next/image';

export default function PlaylistItem({ data, classData, setClassData }) {
    const [showIframe, setShowIframe] = useState(false)
    const [active, setActive] = useState(false)
    const [idData,setIdData] = useState()
    const handledata = (data) => {
        setIdData(data?.id)
        setShowIframe(true)
        setClassData(true)
    };

    
    return (
        <div className={"swiper-outer"}>
            <div className={styles.card + " " + (active ? "control" : "")} onClick={()=>setActive(true)}  >
                <div className={styles.image + " sliderCard-img"} >
                    {showIframe && data && idData === data.id ?
                        <div className={styles["player"] + " player-wrapper"}>
                            <div className={styles["wrap-control"]}>
                                <iframe
                                    
                                    src={`https://open.spotify.com/embed/track/${data.id}?utm_source=generator`}
                                    width="300"
                                    height="352"
                                    frameBorder="0"
                                    allowtransparency="true"
                                    allow="encrypted-media; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen;"
                                ></iframe>
                            </div>
                        </div> :
                        <Image width={200} height={200} className="banner-img" src={data.album?.images[0]?.url} alt={data.name} onClick={() => handledata()} />
                    }
                    <span onClick={() => handledata(data)} className={styles["btn-play"] + " " + "act-btn" + " " + (classData ? styles['active'] : "") }></span>
                </div>
            </div>
        </div>
        
    )
}
