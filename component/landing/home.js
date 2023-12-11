import React, { useState } from 'react';
import { useEffect } from 'react';
import homeStyle from "../../styles/home.module.scss";
import commonStyle from "../../styles/Common.module.css"
import lottie from 'lottie-web';
export default function Home() {
    const[open, setOpen] = useState(false)
    const handleClick = () =>{
        setOpen(true)
    }
    useEffect(() => {
        // Load the Lottie animation
        const animation = lottie.loadAnimation({
          container: document.getElementById('bg-wrapper'),
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
  return (
    <>
        <div id="bg-wrapper" className={commonStyle["bg-animation"]}></div>
        <section className={homeStyle["banner-wrapper"]} >
            <h1 className={commonStyle["large-title"]}>PLAYLIST FOR A PROBLEM</h1>
            <p className={homeStyle["tag-lines"]}>Sharing your feelings is healthy. Tell us how you feel today and we'll curate an album
                designed to make you feel better.</p>
            <div className={homeStyle["form-group"]}>
                <input type="text"
                    placeholder="I'm so anxious that I might lose my job I'm worried it's driving my wife away."/>
            </div>
            <a href="#" className={homeStyle["btn"]} onClick={()=> setOpen(true)}>Generate</a>
        </section>
        {
            open == true ? <>
                <div className={homeStyle["dialog-wrapper"]}>
                    <div className={homeStyle["dialog-box"]}>
                        <h4 className={homeStyle["modal-title"]}>Log in with your spotify account to get the most personalised experience.</h4>
                        <div className={homeStyle["btn-wrap"]}>
                            <a href="#" className={homeStyle["btn"] + " " + homeStyle["confirm-btn"]}>Okay</a>
                            <a href="#" className={homeStyle["btn"] + " " + homeStyle["cancel-btn"]} onClick={()=> setOpen(false)}>Cancel</a>
                        </div>
                    </div>
                </div>
                </> : <></>
        }
    </>
  )
}
