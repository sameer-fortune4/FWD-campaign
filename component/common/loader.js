import React, { useEffect, useState } from 'react';
import commonStyle from '../../styles/Common.module.scss';
import loaderStyle from '../../styles/loader.module.scss';
import { useSession } from 'next-auth/react';
import animationData from '/public/assets/js/scene2.json';
import Lottie from 'react-lottie';
export default function Loader() {
  const [progress, setProgress] = useState(0);

  const { data: session } = useSession();


  useEffect(() => { 
      const interval = setInterval(() => {
        if (progress >= 100) {
          setProgress(0);
        } else {
          setProgress((prevProgress) => prevProgress + 1);
        }
      }, 30);

      return () => clearInterval(interval);

  }, [progress]);

  return (
    <>
      <div className={commonStyle["main-wrapper"]}>
        {/* <div id="bg-wrapper" className={commonStyle['bg-animation']}></div> */}

        {/* <div className={commonStyle["bg-gradient"]}></div> */}
        <div className={commonStyle["bg-animation"]} style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Lottie
                    options={{
                    loop: true,
                    autoplay: true,
                    animationData: animationData,
                    rendererSettings: {
                        preserveAspectRatio: 'xMidYMid slice'
                    }
                    }}
                    height={'100%'}
                    width={'100%'}
                />
            </div>
        <section className={loaderStyle['loader-wrapper']}>
          <h4 className={commonStyle['small-title']  + " " + commonStyle["light-title"]}>
            Breathe in, breathe out... <br /> Your Playlist for a Problem is on its way.
          </h4>
          <div className={loaderStyle['dots-container']}>
            {Array.from({ length: 20 }).map((_, index) => (
              <span
                key={index}
                className={`${loaderStyle['laoder-dot']} ${index < progress / 5 ? loaderStyle['active'] : ''}`}
              ></span>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
