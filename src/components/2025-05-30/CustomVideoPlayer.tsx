import React, { useRef, useEffect, useState, useCallback } from 'react';
import styles from './CustomVideoPlayer.module.css';

export interface CustomVideoPlayerProps {
  src: string | { url: string; type: string };
  contextId?: string; // 容器 id，可选
  preload?: boolean;
  mask?: boolean;
  poster?: string;
  playBtn?: boolean;
  jumpBtn?: boolean;
  autoClose?: boolean;
  canvas?: boolean;
  fill?: boolean;
  orientation?: 'portrait' | 'landscape';
  isRotate?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnd?: () => void;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({
  src,
  preload = true,
  mask = true,
  poster,
  playBtn = true,
  jumpBtn = false,
  autoClose = false,
  canvas = false,
  fill = true,
  orientation = 'portrait',
  isRotate = true,
  onPlay,
  onPause,
  onEnd,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showPoster, setShowPoster] = useState(!!poster);
  const [showPlayBtn, setShowPlayBtn] = useState(playBtn);
  const [showJumpBtn, setShowJumpBtn] = useState(false);
  const [showMask, setShowMask] = useState(mask);
  const [animationId, setAnimationId] = useState<number | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  // SSR安全：初始为'portrait'，只在浏览器端检测
  // test
  const [currentOrientation, setCurrentOrientation] = useState<'portrait' | 'landscape'>('portrait');

  // 处理横竖屏（只在浏览器端）
  useEffect(() => {
    if (typeof window === 'undefined' || !isRotate) return;
    const getOrientation = () => {
      const clientWidth = document.documentElement.clientWidth;
      const clientHeight = document.documentElement.clientHeight;
      return clientWidth > clientHeight ? 'landscape' : 'portrait';
    };
    setCurrentOrientation(getOrientation());
    const handleOrientation = () => {
      setCurrentOrientation(getOrientation());
    };
    window.addEventListener('orientationchange', handleOrientation);
    window.addEventListener('resize', handleOrientation);
    return () => {
      window.removeEventListener('orientationchange', handleOrientation);
      window.removeEventListener('resize', handleOrientation);
    };
  }, [isRotate]);

  // canvas 绘制
  const drawVideoFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx && video.videoWidth && video.videoHeight) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      const id = requestAnimationFrame(drawVideoFrame);
      setAnimationId(id);
    }
  }, []);

  // 播放
  const handlePlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setPlaying(true);
      setShowPlayBtn(false);
      setShowPoster(false);
      setShowJumpBtn(jumpBtn);
      if (onPlay) onPlay();
      if (canvas) {
        drawVideoFrame();
      }
    }
  }, [canvas, drawVideoFrame, jumpBtn, onPlay]);

  // 暂停
  const handlePause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      setPlaying(false);
      setShowPlayBtn(true);
      setShowJumpBtn(false);
      if (onPause) onPause();
      if (canvas && animationId) {
        cancelAnimationFrame(animationId);
      }
    }
  }, [canvas, animationId, onPause]);

  // 跳过/结束
  const handleEnd = useCallback(() => {
    setShowPlayBtn(true);
    setShowJumpBtn(false);
    setPlaying(false);
    if (onEnd) onEnd();
    if (autoClose) {
      // 直接移除（React 里可用父组件控制）
    } else {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        setShowPoster(!!poster);
      }
    }
    if (canvas && animationId) {
      cancelAnimationFrame(animationId);
    }
  }, [autoClose, canvas, animationId, onEnd, poster]);

  // 监听 video 事件
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      if (!videoReady && video.currentTime > 0.1) {
        setVideoReady(true);
        if (canvas) drawVideoFrame();
        setShowPoster(false);
        setShowPlayBtn(false);
        setShowJumpBtn(jumpBtn);
      }
    };
    const onEnded = () => handleEnd();
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
    };
  }, [canvas, drawVideoFrame, handleEnd, jumpBtn, videoReady]);

  // canvas 尺寸自适应
  useEffect(() => {
    if (!canvas || typeof window === 'undefined') return;
    const resizeCanvas = () => {
      const container = document.getElementById('video-player-container');
      if (container && canvasRef.current) {
        canvasRef.current.width = container.clientWidth;
        canvasRef.current.height = container.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [canvas]);

  // 渲染 video 或 canvas
  const renderVideoOrCanvas = () => {
    if (canvas) {
      return (
        <canvas
          ref={canvasRef}
          className={styles.videoElement}
          style={{
            width: '100%',
            height: '100%',
            display: playing ? 'block' : 'none',
          }}
          onClick={handlePause}
        />
      );
    }
    return (
      <video
        ref={videoRef}
        className={styles.videoElement}
        poster={poster}
        preload={preload ? 'auto' : 'none'}
        style={{
          width: '100%',
          height: '100%',
          objectFit: fill ? 'fill' : 'contain',
        }}
        x-webkit-airplay="allow"
        webkit-playsinline="true"
        playsInline
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation={orientation}
        onClick={handlePause}
      >
        {typeof src === 'object' ? (
          <source src={src.url} type={`video/${src.type}`} />
        ) : (
          <source src={src} />
        )}
        Your browser does not support the video tag.
      </video>
    );
  };

  // 容器样式
  const containerStyle: React.CSSProperties =
    isRotate && currentOrientation !== orientation
      ? {
          width: '100%',
          height: '100%',
          transform: 'rotate(-90deg)',
        }
      : { width: '100%', height: '100%' };

  return (
    <div
      id="video-player-container"
      className={styles.videoContainer}
      style={containerStyle}
    >
      {/* Poster */}
      {showPoster && poster && (
        <div
          className={styles.poster}
          style={{
            backgroundImage: `url('${poster}')`,
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundSize: 'cover',
            zIndex: 2,
          }}
          onClick={handlePlay}
        />
      )}
      {/* Video/Canvas */}
      {renderVideoOrCanvas()}
      {/* Mask */}
      {showMask && (
        <div
          className={styles.mask}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 3,
            background: 'rgba(0,0,0,0.01)',
            display: playing ? 'block' : 'none',
          }}
          onClick={handlePause}
        />
      )}
      {/* Play Button */}
      {showPlayBtn && (
        <div
          className={styles.playButton}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 4,
            cursor: 'pointer',
          }}
          onClick={handlePlay}
        >
          <svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="30" fill="rgba(0,0,0,0.5)" />
            <polygon points="26,18 48,32 26,46" fill="#fff" />
          </svg>
        </div>
      )}
      {/* Jump Button */}
      {jumpBtn && showJumpBtn && (
        <div
          className={styles.jumpBtn}
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
            zIndex: 5,
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            borderRadius: 8,
            padding: '8px 16px',
            cursor: 'pointer',
          }}
          onClick={handleEnd}
        >
          跳过视频&gt;&gt;
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer; 