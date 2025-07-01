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

// Enhanced Music Player with Touch Support
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

  // Enhanced drag functionality with touch support
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let currentPosition = { x: 10, y: 10 }; // Default position

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
    audio.play().catch(e => console.log("Playbook error:", e));
  });

  muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
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
    }, 3000);
  }

  // Mouse/Touch enter events
  musicPlayer.addEventListener("mouseenter", () => {
    trackInfo.classList.remove("faded");
    clearTimeout(fadeTimeout);
  });

  musicPlayer.addEventListener("mouseleave", () => {
    fadeTimeout = setTimeout(() => {
      trackInfo.classList.add("faded");
    }, 1000);
  });

  // Helper functions for drag functionality
  function getEventPosition(e) {
    return {
      x: e.type.includes('touch') ? e.touches[0].clientX : e.clientX,
      y: e.type.includes('touch') ? e.touches[0].clientY : e.clientY
    };
  }

  function constrainPosition(x, y) {
    const rect = musicPlayer.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;
    
    return {
      x: Math.max(0, Math.min(x, maxX)),
      y: Math.max(0, Math.min(y, maxY))
    };
  }

  function updatePlayerPosition(x, y) {
    const constrained = constrainPosition(x, y);
    currentPosition = constrained;
    musicPlayer.style.left = constrained.x + "px";
    musicPlayer.style.top = constrained.y + "px";
    musicPlayer.style.bottom = "auto";
    musicPlayer.style.right = "auto";
  }

  function startDrag(e) {
    // Don't start drag if clicking on the mute button
    if (e.target === muteBtn) return;
    
    e.preventDefault();
    isDragging = true;
    musicPlayer.classList.add("dragging");
    
    const eventPos = getEventPosition(e);
    const rect = musicPlayer.getBoundingClientRect();
    dragOffset.x = eventPos.x - rect.left;
    dragOffset.y = eventPos.y - rect.top;
  }

  function handleDrag(e) {
    if (!isDragging) return;
    
    e.preventDefault();
    const eventPos = getEventPosition(e);
    const x = eventPos.x - dragOffset.x;
    const y = eventPos.y - dragOffset.y;
    
    updatePlayerPosition(x, y);
  }

  function endDrag(e) {
    if (isDragging) {
      e.preventDefault();
      isDragging = false;
      musicPlayer.classList.remove("dragging");
    }
  }

  // Mouse events
  musicPlayer.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", endDrag);

  // Touch events for mobile
  musicPlayer.addEventListener("touchstart", startDrag, { passive: false });
  document.addEventListener("touchmove", handleDrag, { passive: false });
  document.addEventListener("touchend", endDrag, { passive: false });

  // Prevent context menu
  musicPlayer.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Handle window resize to keep player in bounds
  window.addEventListener("resize", () => {
    updatePlayerPosition(currentPosition.x, currentPosition.y);
  });

  // Initialize position based on screen size
  function initializePosition() {
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    if (isMobile) {
      updatePlayerPosition(10, window.innerHeight - 130); // Bottom left for mobile
    } else if (isTablet) {
      updatePlayerPosition(10, window.innerHeight - 140); // Bottom left for tablet
    } else {
      updatePlayerPosition(10, window.innerHeight - 160); // Bottom left for desktop
    }
  }

  // Initialize position on load
  initializePosition();

  // Reinitialize position on orientation change (mobile)
  window.addEventListener("orientationchange", () => {
    setTimeout(initializePosition, 100); // Small delay to allow orientation change to complete
  });
}