import React, { useEffect } from 'react';
// 1. Import your local video file
import introVideo from '../assets/intro.mp4'; 

function Intro({ onFinish }) {
  useEffect(() => {
    // 2. Play video for 10 seconds (or however long your video is)
    const timer = setTimeout(() => {
      onFinish();
    }, 10000); // Change 10000 to match your video length in milliseconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'black', zIndex: 9999,
      display: 'flex', justifyContent: 'center', alignItems: 'center'
    }}>
      {/* 3. Use the imported video here */}
      <video 
        autoPlay 
        muted 
        playsInline 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      >
        <source src={introVideo} type="video/mp4" />
      </video>
    </div>
  );
}

export default Intro;