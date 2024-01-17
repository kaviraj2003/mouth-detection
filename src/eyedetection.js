import React, { useState,useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';



const EyeDetection = () => {
  const videoRef = useRef(null);
  const [eyesClosed, setEyesClosed] = useState(false);

  useEffect(() => {
    const runEyeDetection = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

      const video = videoRef.current;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
          video.srcObject = stream;

          video.addEventListener('play', () => {
            const canvas = faceapi.createCanvasFromMedia(video);
            

            const displaySize = { width: video.width || 640, height: video.height || 480 };
            faceapi.matchDimensions(canvas, displaySize);

            setInterval(async () => {
              const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks();

              const canvasContext = canvas.getContext('2d');
              canvasContext.clearRect(0, 0, canvas.width, canvas.height);
              if (detections.length > 0) {
                const leftEye = detections[0].landmarks.getLeftEye();
                const rightEye = detections[0].landmarks.getRightEye();

                const leftEyeClosed = (leftEye[3].y - leftEye[1].y) < 4;
                const rightEyeClosed = (rightEye[3].y - rightEye[1].y) < 4;
                
                if(leftEyeClosed&&rightEyeClosed){
                setEyesClosed(true);
                }else{
                  setEyesClosed(false);
                }

                if (leftEyeClosed&&rightEyeClosed) {
                  console.log('Eyes Closed');
                } else {
                  console.log('Eyes Open');
                }
              
              } else {
                
                console.log('no face detected');
              }
              
            
              
            }, 1000);
          });
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      } else {
        console.error('getUserMedia is not supported');
      }
    };

    runEyeDetection();
  
  }, []);

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center', marginTop:'250px'}}>
        <video ref={videoRef} autoPlay playsInline hidden style={{display:'none'}}/>
        <img
        src={( eyesClosed)? 'closeeyes.jpg' : 'openeye.jpg'}
        alt={(eyesClosed )? 'eyeclose' : 'eyeopen'}
        className={(eyesClosed) ? 'close' : 'open'}
        style={{ width: '200px', height: '100px' }}
      />
    </div>
  );
};

export default EyeDetection;
