import React, { useRef } from 'react';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <video ref={videoRef} controls poster={poster} style={{ width: '100%' }}>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default CustomVideoPlayer; 