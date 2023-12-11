import React, { useEffect, useState } from 'react';
import commonStyle from '../styles/Common.module.css';
import loaderStyle from '../styles/loader.module.scss';
import lottie from 'lottie-web';

export default function Loader() {
  const [progress, setProgress] = useState(0);

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress >= 100) {
        setProgress(0);
      } else {
        setProgress((prevProgress) => prevProgress + 1);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <>
      <div className={commonStyle['main-wrapper']}>
        <div id="bg-wrapper" className={commonStyle['bg-animation']}></div>
        <section className={loaderStyle['loader-wrapper']}>
          <h4 className={commonStyle['small-title']}>
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
