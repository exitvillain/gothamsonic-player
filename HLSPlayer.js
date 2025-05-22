import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";

const HLSPlayer = ({ song, onSongEnd, onNext }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false); 
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!song || !song.file_url) return;
    const audio = audioRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(song.file_url);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setDuration(audio.duration);
      });

      return () => hls.destroy();
    } else if (audio.canPlayType("application/vnd.apple.mpegurl")) {
      audio.src = song.file_url;
    }
  }, [song]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleSeek = (e) => {
    const seekTime = e.target.value;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  return (
    <div className="player-container" style={{
      position: "relative",
      zIndex: 1100,
      background: "rgba(0, 0, 0, 0.6)",
      padding: "15px",
      borderRadius: "10px",
      textAlign: "center",
      color: "white",
      maxWidth: "300px",
    }}>
      {song ? (
        <h2 style={{ marginBottom: "10px", fontSize: "18px" }}>
          {song.title} by {song.artist_name}
        </h2>
      ) : (
        <h2>Loading...</h2>
      )}

      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} />

      {/* ✅ Like & Next Buttons + Play Button in the Center */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
      }}>
        {/* Like/Unlike Button */}
        <button
          onClick={toggleLike}
          style={{
            fontSize: "16px",
            padding: "8px 12px",
            backgroundColor: isLiked ? "#ff4d4d" : "#000", // Black default, turns red when unliked
            color: "white",
            border: `2px solid ${isLiked ? "#ff4d4d" : "#FF8C00"}`, // Red border when unliked, orange otherwise
            borderRadius: "5px",
            cursor: "pointer",
            flex: "1",
            marginRight: "10px"
          }}>
          {isLiked ? "Unlike" : "Like"}
        </button>

        {/* Play/Pause Button (Centered) */}
        <button
          onClick={togglePlay}
          style={{
            fontSize: "20px",
            padding: "10px 20px",
            backgroundColor: "#222", // Sleek dark gray
            color: "white",
            border: "2px solid #FF8C00", // Orange border
            borderRadius: "5px",
            cursor: "pointer",
            flex: "1"
          }}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Next Button (Right Side) */}
        <button
          onClick={onNext}
          style={{
            fontSize: "16px",
            padding: "8px 12px",
            backgroundColor: "#222", // Sleek dark gray
            color: "#FF8C00", // Orange text
            border: "2px solid #FF8C00", // Orange border
            borderRadius: "5px",
            cursor: "pointer",
            flex: "1",
            marginLeft: "10px"
          }}>
          Next
        </button>
      </div>

      {/* Progress Bar */}
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSeek}
        style={{
          width: "80%",
          marginBottom: "10px"
        }}
      />

      <span style={{ fontSize: "14px" }}>
        {Math.floor(currentTime)} / {Math.floor(duration)} sec
      </span>
    </div>
  );
};

export default HLSPlayer;

