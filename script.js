const video = document.getElementById("video");
const moodDisplay = document.getElementById("mood");
const songsList = document.getElementById("songs-list");

// Songs map
const songs = {
  happy: [
    "🎵 Happy – Pharrell Williams",
    "🎵 Uptown Funk – Bruno Mars",
    "🎵 Can't Stop the Feeling – Justin Timberlake"
  ],
  sad: [
    "🎵 Let Her Go – Passenger",
    "🎵 Someone Like You – Adele",
    "🎵 Fix You – Coldplay"
  ],
  angry: [
    "🎵 In the End – Linkin Park",
    "🎵 Lose Yourself – Eminem",
    "🎵 Numb – Linkin Park"
  ],
  surprised: [
    "🎵 Roar – Katy Perry",
    "🎵 Feel Good Inc. – Gorillaz",
    "🎵 Shake It Off – Taylor Swift"
  ],
  neutral: [
    "🎵 Counting Stars – OneRepublic",
    "🎵 Memories – Maroon 5",
    "🎵 Closer – Chainsmokers"
  ],
  fearful: [
    "🎵 Brave – Sara Bareilles",
    "🎵 Stronger – Kelly Clarkson",
    "🎵 Fight Song – Rachel Platten"
  ],
  disgusted: [
    "🎵 Bad Day – Daniel Powter",
    "🎵 Everybody Hurts – R.E.M.",
    "🎵 Mad World – Gary Jules"
  ]
};

// Initialize the application
async function initApp() {
  try {
    console.log("Starting initialization...");
    moodDisplay.textContent = "Loading AI models...";
    
    // Check if face-api is loaded
    if (typeof faceapi === 'undefined') {
      throw new Error("face-api.js not loaded. Check your internet connection.");
    }
    
    console.log("Loading models...");
    
    // Load models with proper error handling
    try {
      await faceapi.nets.tinyFaceDetector.loadFromUri("./models");
      console.log("Tiny face detector model loaded");
    } catch (error) {
      console.error("Failed to load tiny face detector:", error);
      throw new Error("Failed to load face detection model. Check if model files are present.");
    }
    
    try {
      await faceapi.nets.faceExpressionNet.loadFromUri("./models");
      console.log("Face expression model loaded");
    } catch (error) {
      console.error("Failed to load face expression model:", error);
      throw new Error("Failed to load expression recognition model. Check if model files are present.");
    }
    
    console.log("Models loaded successfully!");
    moodDisplay.textContent = "Starting camera...";
    
    // Start video 
    await startVideo();
    
  } catch (error) {
    console.error("Initialization error:", error);
    moodDisplay.textContent = "Error: " + error.message;
    
    // Show fallback message
    showFallbackMessage();
  }
}

function showFallbackMessage() {
  songsList.innerHTML = `
    <li style="color: red; font-weight: bold;">❌ Camera/AI not available</li>
    <li>Please ensure:</li>
    <li>• Camera permissions are granted</li>
    <li>• Site is accessed via HTTPS (required for camera)</li>
    <li>• Internet connection is stable</li>
    <li>• Browser supports WebRTC</li>
    <li>• Try refreshing the page</li>
    <li style="margin-top: 10px; color: blue;">💡 Tip: GitHub Pages requires HTTPS for camera access</li>
  `;
}

async function startVideo() {
  console.log("Requesting camera access...");
  
  // Check if we're on HTTPS (required for camera on GitHub Pages)
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    throw new Error("Camera requires HTTPS. Please use https:// URL.");
  }
  
  // Check if getUserMedia is supported
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Camera not supported in this browser");
  }
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user'
      } 
    });
    
    console.log("Camera access granted");
    video.srcObject = stream;
    
    return new Promise((resolve, reject) => {
      video.onloadedmetadata = () => {
        console.log("Video metadata loaded");
        video.play()
          .then(() => {
            console.log("Video playing");
            moodDisplay.textContent = "Ready! Look at the camera";
            setupFaceDetection();
            resolve();
          })
          .catch(reject);
      };
      
      video.onerror = (e) => {
        console.error("Video error:", e);
        reject(new Error("Video playback failed"));
      };
    });
    
  } catch (err) {
    console.error("Camera error:", err);
    let errorMessage = "Camera access denied. ";
    
    if (err.name === 'NotAllowedError') {
      errorMessage += "Please allow camera access and refresh.";
    } else if (err.name === 'NotFoundError') {
      errorMessage += "No camera found.";
    } else if (err.name === 'NotReadableError') {
      errorMessage += "Camera is being used by another application.";
    } else {
      errorMessage += err.message;
    }
    
    throw new Error(errorMessage);
  }
}

function setupFaceDetection() {
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.style.position = 'absolute';
  canvas.style.top = '10px';
  canvas.style.left = '10px';
  document.getElementById("camera-box").append(canvas);
  
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  let detectionInterval = setInterval(async () => {
    try {
      if (video.paused || video.ended) {
        clearInterval(detectionInterval);
        return;
      }
      
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (detections.length > 0) {
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        const expressions = detections[0].expressions;
        const dominantMood = getDominantMood(expressions);
        moodDisplay.textContent = `${capitalize(dominantMood)} (${Math.round(expressions[dominantMood] * 100)}%)`;
        suggestSongs(dominantMood);
      } else {
        moodDisplay.textContent = "No face detected";
        songsList.innerHTML = "<li>👤 Please position your face in the camera</li>";
      }
    } catch (error) {
      console.error("Detection error:", error);
      moodDisplay.textContent = "Detection error";
    }
  }, 1000); // Reduced interval for better responsiveness
}

function getDominantMood(expressions) {
  let max = 0;
  let mood = "neutral";
  for (let [key, value] of Object.entries(expressions)) {
    if (value > max) {
      max = value;
      mood = key;
    }
  }
  return mood;
}

function suggestSongs(mood) {
  const list = songsList;
  list.innerHTML = ""; // clear previous
  const moodSongs = songs[mood] || songs["neutral"];
  
  moodSongs.forEach((song) => {
    const li = document.createElement("li");
    li.textContent = song;
    li.style.animation = "fadeIn 0.5s ease-in";
    list.appendChild(li);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Start the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, initializing app...");
  
  // Add some initial feedback
  moodDisplay.textContent = "Initializing...";
  
  // Wait a bit for face-api to load, then start
  setTimeout(() => {
    initApp();
  }, 500);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log("Page hidden, pausing video");
    if (video.srcObject) {
      video.pause();
    }
  } else {
    console.log("Page visible, resuming video");
    if (video.srcObject) {
      video.play();
    }
  }
});
