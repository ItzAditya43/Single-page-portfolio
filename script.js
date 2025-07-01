// Initialize everything when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  initQuotes();
  initMusicPlayer();
  initDarkMode();
});

// Dark Mode Toggle Logic
function initDarkMode() {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.classList.add("dark-mode");
  }
  darkModeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark-mode");
    const isDark = document.documentElement.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Quote Display System
function initQuotes() {
  const quotes = [
    "Your website isn't just code—it's an experience. Build it like an artist, refine it like an engineer.",
    "Great web design is like great magic—when done right, no one sees the tricks, just the wonder.",
    "The web is a canvas, and every line of code you write is a brushstroke on the digital world.",
    "Training a model is like training your mind—the more data you process, the smarter you become.",
    "Machine Learning isn't about making machines think—it's about teaching them to learn, just like us.",
    "In AI, the difference between failure and innovation is one well-tuned parameter.",
    "DSA isn't just about solving problems—it's about solving them elegantly, efficiently, and with style.",
    "Every algorithm is a story of logic, and every data structure is its plot twist.",
    "The shortest path to success? Optimize your approach, just like a good Dijkstra's algorithm.",
    "Code is poetry, logic is rhythm, and debugging is the art of turning chaos into harmony."
  ];
  const quoteBtn = document.getElementById("quote-btn");
  const quoteText = document.getElementById("quote-text");

  quoteBtn.addEventListener("click", () => {
    const index = Math.floor(Math.random() * quotes.length);
    quoteText.textContent = quotes[index];
  });
}

// Music Player System with Drag functionality
function initMusicPlayer() {
  const audio = document.getElementById("audio");
  const muteBtn = document.getElementById("mute-btn");
  const trackTitle = document.getElementById("track-title");
  const musicPlayer = document.querySelector(".music-player");
  const trackInfo = document.querySelector(".track-info");

  const playlist = [
    { title: "Slash of Void", src: "Background custom/FGO.mp3", bg: "Background custom/FGO.gif" },
    { title: "Flowers", src: "Background custom/Flowers.mp3", bg: "Background custom/Flowers.gif" },
    { title: "Genshin Main Theme", src: "Background custom/Genshin.mp3", bg: "Background custom/Genshin Main Theme.gif" }
  ];

  let currentIndex = 0;
  let isMuted = false;
  let fadeTimeout;
  audio.volume = 0.5;

  // Drag functionality
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };

  loadTrack(currentIndex);

  audio.play().catch(e => {
    console.log("Auto-play prevented. User interaction required:", e);
    trackTitle.textContent = "Click 🔊 to start music";
    showTrackInfo();
  });

  function loadTrack(index) {
    const track = playlist[index];
    audio.src = track.src;
    trackTitle.textContent = track.title;
    musicPlayer.style.backgroundImage = `url("${track.bg}")`;
    showTrackInfo();
  }

  audio.addEventListener("ended", () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    audio.play().catch(e => console.log("Playback error:", e));
  });

  muteBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent drag when clicking button
    if (audio.paused) {
      audio.play().catch(e => console.log("Playback error:", e));
    }
    isMuted = !isMuted;
    audio.muted = isMuted;
    muteBtn.textContent = isMuted ? "🔇" : "🔊";
    showTrackInfo();
  });

  // Track info fade functionality
  function showTrackInfo() {
    trackInfo.classList.remove("faded");
    clearTimeout(fadeTimeout);
    fadeTimeout = setTimeout(() => {
      trackInfo.classList.add("faded");
    }, 3000); // Fade out after 3 seconds
  }

  // Mouse enter on music player shows track info
  musicPlayer.addEventListener("mouseenter", () => {
    trackInfo.classList.remove("faded");
    clearTimeout(fadeTimeout);
  });

  // Mouse leave on music player starts fade timer again
  musicPlayer.addEventListener("mouseleave", () => {
    fadeTimeout = setTimeout(() => {
      trackInfo.classList.add("faded");
    }, 1000); // Shorter delay when mouse leaves
  });

  // Drag functionality
  musicPlayer.addEventListener("mousedown", (e) => {
    // Don't start drag if clicking on the mute button
    if (e.target === muteBtn) return;
    
    isDragging = true;
    musicPlayer.classList.add("dragging");
    
    const rect = musicPlayer.getBoundingClientRect();
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;
    
    e.preventDefault();
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    // Keep player within window bounds
    const maxX = window.innerWidth - musicPlayer.offsetWidth;
    const maxY = window.innerHeight - musicPlayer.offsetHeight;
    
    const constrainedX = Math.max(0, Math.min(x, maxX));
    const constrainedY = Math.max(0, Math.min(y, maxY));
    
    musicPlayer.style.left = constrainedX + "px";
    musicPlayer.style.top = constrainedY + "px";
    musicPlayer.style.bottom = "auto"; // Remove bottom positioning
  });

  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      musicPlayer.classList.remove("dragging");
    }
  });

  // Prevent context menu on music player
  musicPlayer.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}