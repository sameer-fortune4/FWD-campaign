import React, { useEffect, useRef, useState } from 'react'
import commonStyle from "../styles/Common.module.scss"
import collectionStyle from "../styles/songCollection.module.scss"
import lottie from 'lottie-web';
import Chatbox from '../component/common/chatbox';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../component/common/loader';
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

  // console.log("a, emotions && emotions.sort((a, b) => b.score - a.score).slice(0, 5))
  // const dar = "dfg df dfd df"

  const scoresObject = {};

  emotions.forEach((item) => {
    // Iterate through the emotions array for each item
    item.emotions.forEach((emotion) => {
      const { name, score } = emotion;
      // Check if the name is already in the scoresObject
      if (scoresObject[name] === undefined || scoresObject[name] < score) {
        // If not present or if the score is higher, update the score
        scoresObject[name] = score;
      }
    });
  });
  const resultArray = Object.keys(scoresObject).map((name) => ({
    name,
    score: scoresObject[name],
  }));
  let data = resultArray.sort((a, b) => b.score - a.score).slice(0,3);
  // console.log(resultArray)
  if (typeof window !== 'undefined') {
      // Perform localStorage action
      localStorage?.setItem('emotionData', JSON.stringify(data[0]))
    }
  // const data = emotions?.map(v => v.emotions)
  // const datamain = []?.concat(...data)
  // // const t = new Set(datamain)

  // const scoreMap = {};

  // // Iterate through the data and calculate the sum and count for each name
  // datamain.forEach(item => {
  //   if (!scoreMap[item.name]) {
  //     scoreMap[item.name] = { sum: 0, count: 0 };
  //   }

  //   scoreMap[item.name].sum += item.score;
  //   scoreMap[item.name].count += 1;
  // });
  // console.log("object",scoreMap);
  // // Create a new array to store the averages
  // const averagesArray = [];

  // // Calculate the average for each name and push it to the new array
  // Object.keys(scoreMap).forEach(name => {
  //   const averageScore = scoreMap[name].sum / scoreMap[name].count;
  //   averagesArray.push({ name, averageScore });
  // });
  // let arr = averagesArray.sort((a, b) => b.averageScore - a.averageScore).slice(0, 3)
  // console.log("dfghdfg",averagesArray);
  // if (typeof window !== 'undefined') {
  //   // Perform localStorage action
  //   localStorage?.setItem('emotionData', JSON.stringify(arr[0]))
  // }
  const [isLoading,setIsloading] = useState(true);
  useEffect(()=>{
    setTimeout(() => {
      setIsloading(false)
    }, 10000);
  },[])
  const handelClick = () => {
      router.push('/play-list')
  }

  return (
    <>
      {/* <div id="bg-wrapper" className={commonStyle['bg-animation']}></div> */}
      {isLoading ? <Loader /> :
      <div className={commonStyle['main-wrapper']}>
        <div className={commonStyle["bg-gradient"]}></div>
        {/* <button onClick={signOut} >click</button> */}
        <section className={collectionStyle["playlist-wrappper"]}>
          <h2 className={commonStyle["medium-title"]}>Here&apos;s your Playlist for a Problem</h2>
          <Link href="#" aria-label="Listen more songs" role="link"><Image height={100} width={100} onClick={handelClick} className={collectionStyle["playlist-img"]} src="https://picsum.photos/900/900" alt="" /></Link>
          <Link href="#" aria-label="Listen more songs" role="link" className={collectionStyle["listen-txt"]} onClick={handelClick}>Click to listen</Link>
        </section>
      </div>
}
      <Chatbox />
    </>
  )
}
