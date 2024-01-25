import React, { useState } from 'react'
import styles from '../styles/Common.module.scss';

export default function PlaylistItem({ data, classData, setClassData }) {
    const [idData, setIdData] = useState()
    console.log("object",idData);
    const handledata = async (data) => {
        setIdData(data);
        setClassData(true)

    };
    return (
        <>
            <div className={"swiper-outer"}>
                <div className={styles.card + " " + (classData == true ? "control" : "")} onClick={() => handledata(data.id)} >
                    <div className={styles.image + " " + "sliderCard-img"} >
                        <img width={200} height={200} src={data.album?.images[0]?.url} alt={data.name} />
                        <div className={styles["player"] + " " + "player-wrapper"}>
                            <div className={styles["wrap-control"]}>
                                {data.id === idData &&
                                    <iframe
                                    src={`https://open.spotify.com/embed/track/${idData}?utm_source=generator`}
                                    // width="300"
                                    height="200"
                                    frameBorder="0"
                                    allowtransparency="true"
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                ></iframe>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
