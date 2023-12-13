import React, { useEffect } from 'react'
import commonStyle from "../styles/Common.module.scss"
import collectionStyle from "../styles/songCollection.module.scss"
import lottie from 'lottie-web';
import Chatbox from '../component/common/chatbox';
export default function SongCollection() {
    useEffect(() => {
        const animation = lottie.loadAnimation({
          container: document.getElementById('bg-wrapper'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: '/assets/js/lottiefiles.json',
        });
        return () => {
          animation.destroy();
        };
      }, []);
    
  return (
    <>
      <div className={commonStyle['main-wrapper']}>
        <div id="bg-wrapper" className={commonStyle['bg-animation']}></div>
        <section className={collectionStyle["playlist-wrappper"]}>
            <h2 className={commonStyle["medium-title"]}>Here's your Playlist for a Problem</h2>
            <a href="#"><img className={collectionStyle["playlist-img"]} src="https://images.unsplash.com/photo-1515010137531-66995c7f40e6?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt=""/></a>
            <a href="#" className={collectionStyle["listen-txt"]}>Click to listen</a>
        </section>
      </div>
      <Chatbox/>
    </>
  )
}
