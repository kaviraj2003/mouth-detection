import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import './mouthdetector.css';

const MouthDetection = () => {
  const videoRef = useRef(null);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [detections, setDetections] = useState(0);

  useEffect(() => {
    const runMouthDetection = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

      const video = videoRef.current;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;

          video.addEventListener('play', async () => {
            const canvas = faceapi.createCanvasFromMedia(video);

            const displaySize = { width: video.width || 640, height: video.height || 480 };
            faceapi.matchDimensions(canvas, displaySize);

            setInterval(async () => {
              const faceDetections = await faceapi
                .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks();

              const canvasContext = canvas.getContext('2d');
              canvasContext.clearRect(0, 0, canvas.width, canvas.height);
              setDetections(faceDetections.length);

              if (faceDetections.length > 0) {
                const mouthLandmarks = faceDetections[0].landmarks.getMouth();

                if (mouthLandmarks.length > 0) {
                  const bottomLipY = mouthLandmarks[mouthLandmarks.length - 1].y;
                  const topLipY = mouthLandmarks[0].y;

                  if (bottomLipY !== undefined && topLipY !== undefined) {
                    const lipHeight = bottomLipY - topLipY;
                    if(lipHeight>10){
                      console.log("mouth open");
                    }else{
                      console.log("mouth close");
                    }
                    setMouthOpen(lipHeight > 10); 
                  } else {
                    console.error('Mouth landmarks are incomplete');
                  }
                } else {
                  console.error('Mouth landmarks not available');
                }
              }

             
            },1000);
        });
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      } else {
        console.error('getUserMedia is not supported');
      }
    };

    runMouthDetection();
  }, []);

  return (
    <div id="video-container"  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:'250px', maxWidth:'100%'}}>
      <video ref={videoRef} autoPlay playsInline hidden/>
      {detections > 0 && mouthOpen ? (
        <img src="openmouth.jpg" alt="mouth open" className="mouth-image" />
      ) : (
        <img src="mouthclose.jpeg" alt="mouth closed" className="mouth-image" />
      )}
    </div>
  );
};

export default MouthDetection;
