import React, { useRef, useState, useEffect } from 'react';
import styles from './CustomVideoPlayer.module.css';

/**
 * 自定义视频播放器组件，解决国产浏览器视频浮层问题
 * 特别针对腾讯X5内核的解决方案
 * 
 * @param {Object} props 组件属性
 * @param {string} props.src 视频源地址
 * @param {string} props.poster 视频封面图片地址
 * @param {boolean} props.autoPlay 是否自动播放
 * @param {boolean} props.muted 是否静音
 * @param {boolean} props.loop 是否循环播放
 */
export default function CustomVideoPlayer({ 
  src, 
  poster, 
  autoPlay = false, 
  muted = false,
  loop = false
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(muted ? 0 : 1);

  // 初始化视频
  useEffect(() => {
    const video = videoRef.current;
    
    if (video) {
      // 设置X5内核相关属性 - 根据最新的终极版解决方案
      // 关键：千万别加 x5-video-player-type="h5" 它会坑死你的
      video.setAttribute('x5-playsinline', '');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x-webkit-airplay', 'allow');
      
      // 监听视频加载完成事件
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };
      
      // 监听视频时间更新事件
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      };
      
      // 监听视频结束事件
      const handleEnded = () => {
        setIsPlaying(false);
        if (loop) {
          video.currentTime = 0;
          video.play().then(() => setIsPlaying(true)).catch(console.error);
        }
      };
      
      // 添加事件监听
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);
      
      // 清理函数
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [loop]);

  // 格式化时间显示
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 播放/暂停切换
  const togglePlay = () => {
    const video = videoRef.current;
    
    if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        video.play().then(() => setIsPlaying(true)).catch(console.error);
      }
    }
  };

  // 进度条点击事件
  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    
    if (video && !isNaN(video.duration)) {
      video.currentTime = pos * video.duration;
      setCurrentTime(video.currentTime);
      setProgress(pos * 100);
    }
  };

  // 音量调节
  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    const newVolume = parseFloat(e.target.value);
    
    if (video) {
      video.volume = newVolume;
      video.muted = newVolume === 0;
      setVolume(newVolume);
    }
  };

  // 静音切换
  const toggleMute = () => {
    const video = videoRef.current;
    
    if (video) {
      if (video.volume > 0) {
        // 记住当前音量，然后静音
        setVolume(0);
        video.volume = 0;
        video.muted = true;
      } else {
        // 恢复音量
        const newVolume = 1;
        setVolume(newVolume);
        video.volume = newVolume;
        video.muted = false;
      }
    }
  };

  return (
    <div className={styles.videoContainer}>
      {/* 视频元素 - 使用正确的X5内核配置 */}
      <video
        ref={videoRef}
        className={styles.videoElement}
        src={src}
        poster={poster}
        preload="auto"
        muted={muted}
        loop={loop}
        playsInline={true}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        onClick={togglePlay}
      />
      
      {/* 自定义视频控件 */}
      <div className={`${styles.controls} ${isPlaying ? styles.playing : ''}`}>
        <button 
          className={styles.playButton} 
          onClick={togglePlay}
          aria-label={isPlaying ? "暂停" : "播放"}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
        
        <div 
          className={styles.progressBar} 
          onClick={handleProgressClick}
        >
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className={styles.timeDisplay}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
        
        <div className={styles.volumeControl}>
          <button 
            className={styles.muteButton}
            onClick={toggleMute}
            aria-label={volume === 0 ? "取消静音" : "静音"}
          >
            {volume === 0 ? "🔇" : "🔊"}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
            aria-label="音量"
          />
        </div>
      </div>
      
      {/* 自定义浮层按钮 */}
      <div className={styles.overlayButtons}>
        <button className={styles.overlayButton}>
          ❤️ 点赞
        </button>
        <button className={styles.overlayButton}>
          📤 分享
        </button>
        <button className={styles.overlayButton}>
          💬 评论
        </button>
      </div>
    </div>
  );
} 