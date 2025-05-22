import React, { useEffect, useState } from "react";
import HLSPlayer from "./HLSPlayer";
import "./SongMode.css";

const API_URL = "https://gothamsonic.com/api/songs";

const SongMode = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setSongs(data);
        if (data.length > 0) {
          setCurrentSong(data[0]); // Default to first song
        }
      })
      .catch(error => console.error("Error fetching songs:", error));
  }, []);

const handleSongEnd = () => {
  if (songs.length === 0) return;
  const currentIndex = songs.findIndex(song => song.file_url === currentSong.file_url);
  const nextIndex = (currentIndex + 1) % songs.length; 
  setCurrentSong(songs[nextIndex]);
};

 return (
    <div style={{
      textAlign: "center",
      paddingBottom: "50px",
    }}>
      {currentSong ? (
        <div>
          <HLSPlayer song={currentSong} onSongEnd={handleSongEnd} />
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <h3>Pick a Song:</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {songs.map((song, index) => (
          <li key={index} style={{ marginBottom: "10px" }}>
            <button 
              onClick={() => setCurrentSong(song)}
              style={{
                fontSize: "18px",
                padding: "10px 20px",
                background: "rgba(0, 0, 0, 0.6)", // ✅ Same see-through black as player
                color: "white", // ✅ White text for readability
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                zIndex: 9999,
                position: "relative",
                display: "block",
                width: "80%",
                margin: "0 auto",
                boxShadow: "2px 2px 8px rgba(0,0,0,0.2)"
              }}
            >
              {song.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongMode;
