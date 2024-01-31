import React, { useEffect, useRef, useState } from 'react'
import commonStyle from "../styles/Common.module.scss"
import collectionStyle from "../styles/songCollection.module.scss"
// import lottie from 'lottie-web';
import Chatbox from '../component/common/chatbox';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../component/common/loader';
import Lottie from 'react-lottie';
import animationData from "/public/assets/js/scene1.json"
import { postApiData } from '../utilities/service';
export default function SongCollection() {
  const [emotions, setEmotions] = useState([]);
  const [imageCreation, setImageCreation] = useState();
  const [textData, setTextData] = useState('')
  const [isLoading, setIsloading] = useState(true);

  const socketRef = useRef(null);
  const mountRef = useRef(true);

  // useEffect(() => {
  //   const animation = lottie.loadAnimation({
  //     container: document.getElementById('bg-wrapper'),
  //     renderer: 'svg',
  //     loop: true,
  //     autoplay: true,
  //     path: '/assets/js/lottiefiles.json',
  //   });
  //   return () => {
  //     animation.destroy();
  //   };
  // }, []);
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
  
  useEffect(() => {
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
    let data = resultArray.sort((a, b) => b.score - a.score).slice(0, 3);
    setTextData(data[0]?.name)
    if (typeof window !== 'undefined') {
      localStorage?.setItem('emotionData', JSON.stringify(data[0]?.name))
    }
  }, [emotions])

  // const [antonym, setAntonym] = useState();
  // useEffect(() => {
  //   const antonymDictionary = {
  //     'joy': 'joy',
  //     'happy': 'happy',
  //     'sad': 'happiness',
  //     'Sadness': "happiness",
  //     'Triumph':'Success',
  //     'Tiredness':'energy',
  //     'Sympathy':'kindness',
  //     'Surprise (positive)':"Happiness positive",
  //     'Shame':'Disapponited',
  //     'Desire':"wish",
  //     'Satisfaction':'Satisfaction',
  //     'Romance':'Romance',
  //     'Relief':'Relief'
  //   }
  //   function replaceWithAntonym(word) {
  //     return antonymDictionary[word] || word;
  //   }
  //   const originalWord = data[0]?.name;
  //   setAntonym(replaceWithAntonym(originalWord))
  // }, [data])

  useEffect(() => {
    setTimeout(() => {
      setIsloading(false)
    }, 10000);
  }, [])

  useEffect(() => {
    if (textData) {
      stableDiffusion()
    }
  }, [textData])

  const stableDiffusion = async () => {
    setIsloading(true)
    let payload = {
      "key": `${process.env.NEXT_PUBLIC_STABLE_DIFFUSION_KEY}`,
      "prompt": `${textData} boy`,
      "negative_prompt": "((out of frame)), ((extra fingers)), mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), (((tiling))), ((naked)), ((tile)), ((fleshpile)), ((ugly)), (((abstract))), blurry, ((bad anatomy)), ((bad proportions)), ((extra limbs)), cloned face, glitchy, ((extra breasts)), ((double torso)), ((extra arms)), ((extra hands)), ((mangled fingers)), ((missing breasts)), (missing lips), ((ugly face)), ((fat)), ((extra legs)),((trolly bag)),((extra trolly bag)),((non-living thing))",
      "width": "512",
      "height": "512",
      "samples": "1",
      "num_inference_steps": "20",
      "seed": null,
      "guidance_scale": 7.5,
      "safety_checker": "yes",
      "multi_lingual": "no",
      "panorama": "no",
      "self_attention": "no",
      "upscale": "no",
      "embeddings_model": null,
      "webhook": null,
      "track_id": null
    }
    let response = await postApiData('https://stablediffusionapi.com/api/v3/text2img', payload)
    if (response.status !== "error") {
      setImageCreation(response)
      setIsloading(false)
    }
  }
  
  return (
    <>
      {/* <div id="bg-wrapper" className={commonStyle['bg-animation']}></div> */}
      {isLoading ? <Loader /> :
        <div className={commonStyle['main-wrapper']}>
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
          {/* <div className={commonStyle["bg-gradient"]}></div> */}
          <section className={collectionStyle["playlist-wrappper"]}>
            <h2 className={commonStyle["medium-title"]}>Here&apos;s your Playlist for a Problem</h2>
              <Link href="/play-list" aria-label="Listen more songs" className={collectionStyle["avatar-wrapper"]} role="link">
                <Image height={100} width={100} className={collectionStyle["playlist-img"]} src={imageCreation ? imageCreation.output[0] : "https://picsum.photos/id/3/200/300"} alt="" />
              {/* <ul className={collectionStyle["list-wrapper"]}>
                <li>
                  <p className={collectionStyle["song-title"]}>This little light of mine</p>
                  <div className={collectionStyle["sub-wrapper"]}>
                    <span>Elizabeth Michel</span>
                    <span>3:05</span>
                  </div>
                </li>
                <li>
                  <p className={collectionStyle["song-title"]}>This little light of mine</p>
                  <div className={collectionStyle["sub-wrapper"]}>
                    <span>Elizabeth Michel</span>
                    <span>3:05</span>
                  </div>
                </li>
              </ul> */}
            </Link>
            <Link href="/play-list" aria-label="Listen more songs" role="link" className={collectionStyle["listen-txt"]}>Click to listen</Link>
          </section>
        </div>
      }
      <Chatbox />
    </>
  )
}
