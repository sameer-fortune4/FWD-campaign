import React, { useEffect, useRef, useState } from 'react'
import commonStyle from "../styles/Common.module.scss"
import collectionStyle from "../styles/songCollection.module.scss"
import lottie from 'lottie-web';
import Chatbox from '../component/common/chatbox';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
export default function SongCollection() {
  const [emotions, setEmotions] = useState([]);
  const socketRef = useRef(null);
  const mountRef = useRef(true);
  const router = useRouter();
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
  useEffect(() => {
    // socketRef.current = new WebSocket()
    socketRef.current = new WebSocket(`wss://api.hume.ai/v0/stream/models?apikey=${process.env.NEXT_PUBLIC_HUME_API_KEY}`)
    socketRef.current.onopen = socketOnOpen;
    socketRef.current.onmessage = socketOnMessage;
    async function socketOnOpen() {
      const socket = socketRef.current;
      if (socket.readyState === WebSocket.OPEN) {
        let inputData = localStorage.getItem('inputData');
        const message = {
          models: {
            language: {},
          },
          raw_text: true,
          data: inputData,
        };
        socket.send(JSON.stringify(message));
      }
    }

    async function socketOnMessage(event) {
      const response = JSON.parse(event.data);
      const predictions = response.language?.predictions || [];
      const error = response.error;
      if (error) {
        console.error(error);
        stopEverything();
        return;
      }

      if (predictions.length === 0) {
        setEmotions([]);
      } else {
        setEmotions(predictions);
      }
    }
    function stopEverything() {
      console.log('Stopping everything...');
      mountRef.current = false;
      const socket = socketRef.current;
      if (socket) {
        console.log('Closing socket');
        socket.close();
        socketRef.current = null;
      } else {
        console.warn('Could not close socket, not initialized yet');
      }
    }
  }, []);

  // console.log("nfgvbhfgrfg000000000000000", emotions && emotions.sort((a, b) => b.score - a.score).slice(0, 5))
  // const dar = "dfg df dfd df"
  const data = emotions?.map(v => v.emotions)
  const datamain = []?.concat(...data)
  // const t = new Set(datamain)

  const scoreMap = {};

  // Iterate through the data and calculate the sum and count for each name
  datamain.forEach(item => {
    if (!scoreMap[item.name]) {
      scoreMap[item.name] = { sum: 0, count: 0 };
    }

    scoreMap[item.name].sum += item.score;
    scoreMap[item.name].count += 1;
  });

  // Create a new array to store the averages
  const averagesArray = [];

  // Calculate the average for each name and push it to the new array
  Object.keys(scoreMap).forEach(name => {
    const averageScore = scoreMap[name].sum / scoreMap[name].count;
    averagesArray.push({ name, averageScore });
  });
  let arr = averagesArray.sort((a, b) => b.averageScore - a.averageScore).slice(0, 3)
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    localStorage?.setItem('emotionData', JSON.stringify(arr[0]))
  }

  const handelClick = () => {
    router.push('/play-list')
  }
  return (
    <>
      {/* <div id="bg-wrapper" className={commonStyle['bg-animation']}></div> */}
      <div className={commonStyle['main-wrapper']}>
      <div className={commonStyle["bg-gradient"]}></div>
      {/* <button onClick={signOut} >click</button> */}
        <section className={collectionStyle["playlist-wrappper"]}>
          <h2 className={commonStyle["medium-title"]}>Here's your Playlist for a Problem</h2>
          <a href="#"><img onClick={handelClick} className={collectionStyle["playlist-img"]} src="https://images.unsplash.com/photo-1515010137531-66995c7f40e6?q=80&w=1474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" /></a>
          <a href="#" className={collectionStyle["listen-txt"]} onClick={handelClick}>Click to listen</a>
        </section>
      </div>
      <Chatbox />
    </>
  )
}
