import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { getData } from '../utilities/service';
import { apiList } from '../utilities/apiList';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function PlayList() {
    const { data: session } = useSession();
    const router = useRouter();

    const [listSong, setListSong] = useState([]);
    const [plyasong, setPlaySong] = useState();
    console.log("object", plyasong);
    useEffect(() => {
        if (!session) {
            router.push('/');
        } else {
            fetchData();
            handledata()
        }
    }, [session]);

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
            setListSong(response)
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

    return (
        <>
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
                {listSong &&
                    listSong.map((v, i) => (
                        <a key={i} className={styles.card}>
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
                    ))}
            </div>
        </>
    );
}
