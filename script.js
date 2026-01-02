/* ==================== API CONFIGURATION ==================== */
const API_URL = 'http://localhost:5001/api/random';

/* ==================== CANVAS SETUP ==================== */
const canvas = document.getElementById('landscapesCanvas');
const ctx = canvas.getContext('2d');

// Disable image smoothing for crisp pixels
ctx.imageSmoothingEnabled = false;

canvas.width = Math.min(window.innerWidth, 1920);
canvas.height = Math.min(window.innerHeight, 1080);

const landscapeImage = new Image();
landscapeImage.crossOrigin = "anonymous";  // Enable CORS for API images

// Store location data from API
let currentImageData = null;

/* ==================== LOAD RANDOM LANDSCAPE FROM API ==================== */
async function loadRandomLandscape() {
    try {
        console.log('Fetching random landscape from API...');
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success) {
            console.log('API Response:', data.data);
            
            // Store image data for later use
            currentImageData = data.data;
            
            // Set image source from API
            landscapeImage.src = data.data.imageUrl;
            
            // Log location if available
            if (data.data.caption) {
                console.log('Location:', data.data.caption);
            } else {
                console.log('No location data for this image');
            }
            
            // Log photographer credit
            console.log('Photo by:', data.data.photographer.name);
        } else {
            console.error('API returned error');
            fallbackToLocalImage();
        }
    } catch (error) {
        console.error('Failed to fetch from API:', error);
        fallbackToLocalImage();
    }
}

// Fallback to local image if API fails
function fallbackToLocalImage() {
    console.log('Using fallback local image');
    
    // Local images with their locations
    const landscapes = [
        {
            path: 'landscapes/lofoten_islands.jpg',
            caption: 'Lofoten Islands, Norway'
        },
        {
            path: 'landscapes/benagil_cave.jpg',
            caption: 'Benagil Cave, Portugal'
        },
        {
            path: 'landscapes/yellowstone.jpg',
            caption: 'Yellowstone, United States'
        },
        {
            path: 'landscapes/great_wall_of_china.jpg',
            caption: 'Great Wall of China, China'
        },
        {
            path: 'landscapes/ben_gioc.jpg',
            caption: 'Ban Gioc Waterfall, Vietnam'
        }
    ];
    
    const randomLandscape = landscapes[Math.floor(Math.random() * landscapes.length)];
    
    // Store location data for local image
    currentImageData = {
        imageUrl: randomLandscape.path,
        caption: randomLandscape.caption,
        photographer: {
            name: 'Unknown'
        }
    };
    
    landscapeImage.src = randomLandscape.path;
    console.log('Local image with location:', randomLandscape.caption);
}

// Load image on page load
loadRandomLandscape();

landscapeImage.onload = function() {
    console.log('Image loaded successfully');
    ctx.drawImage(landscapeImage, 0, 0, canvas.width, canvas.height);
    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    drawPixelated(200);
    console.log('Pixelated version drawn!');
};

landscapeImage.onerror = function() {
    console.error('Failed to load image, trying fallback');
    fallbackToLocalImage();
};

/* ==================== LOCATION CAPTION ==================== */
function showLocationCaption() {
    // Only show if we have location data
    if (!currentImageData || !currentImageData.caption) {
        // If no location, show restart prompt after a delay
        setTimeout(showRestartPrompt, 2000);
        return;
    }
    
    // Create caption element
    const caption = document.createElement('div');
    caption.id = 'locationCaption';
    caption.textContent = `📍 ${currentImageData.caption}`;
    
    // Style the caption with frosted glass effect
    caption.style.position = 'fixed';
    caption.style.bottom = '40px';
    caption.style.left = '40px';
    caption.style.color = 'white';
    caption.style.fontSize = '1.5rem';
    caption.style.fontFamily = "'Inter', sans-serif";
    caption.style.fontWeight = '600';
    caption.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    caption.style.padding = '15px 25px';
    caption.style.borderRadius = '15px';
    
    // Frosted glass effect (same as timer)
    caption.style.background = 'rgba(255, 255, 255, 0.1)';
    caption.style.backdropFilter = 'blur(12px)';
    caption.style.webkitBackdropFilter = 'blur(12px)';
    caption.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    caption.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    
    caption.style.opacity = '0';
    caption.style.transform = 'translateY(10px)';
    caption.style.transition = 'opacity 1s ease, transform 1s ease, box-shadow 0.5s ease';
    caption.style.zIndex = '1000';
    
    document.body.appendChild(caption);
    
    // Fade in with slide up
    setTimeout(() => {
        caption.style.opacity = '1';
        caption.style.transform = 'translateY(0)';
    }, 500);
    
    // Add sparkle effect after fade in
    setTimeout(() => {
        // Pulse the shadow to draw attention
        caption.style.boxShadow = '0 8px 40px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.3)';
        
        setTimeout(() => {
            caption.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        }, 600);
    }, 1500);
    
    // Show restart prompt after user has time to admire
    setTimeout(showRestartPrompt, 4000);
}

/* ==================== RESTART PROMPT ==================== */
function showRestartPrompt() {
    // Create restart prompt
    const prompt = document.createElement('div');
    prompt.id = 'restartPrompt';
    prompt.textContent = 'Press SPACE to restart';
    
    // Style the prompt - bottom center
    prompt.style.position = 'fixed';
    prompt.style.bottom = '40px';
    prompt.style.left = '50%';
    prompt.style.transform = 'translate(-50%, 10px)';  // Start slightly below
    prompt.style.color = 'white';
    prompt.style.fontSize = '1.5rem';
    prompt.style.fontFamily = "'Inter', sans-serif";
    prompt.style.fontWeight = '600';
    prompt.style.textShadow = '0 2px 4px rgba(0, 0, 0, 0.3)';
    prompt.style.padding = '20px 40px';
    prompt.style.borderRadius = '15px';
    
    // Frosted glass effect
    prompt.style.background = 'rgba(255, 255, 255, 0.1)';
    prompt.style.backdropFilter = 'blur(12px)';
    prompt.style.webkitBackdropFilter = 'blur(12px)';
    prompt.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    prompt.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    
    prompt.style.opacity = '0';
    prompt.style.transition = 'opacity 1s ease, transform 1s ease';
    prompt.style.zIndex = '1000';
    
    // Blinking animation
    prompt.style.animation = 'blink 2s ease-in-out infinite';
    
    document.body.appendChild(prompt);
    
    // Fade in with slide up (same timing as location)
    setTimeout(() => {
        prompt.style.opacity = '1';
        prompt.style.transform = 'translate(-50%, 0)';
    }, 500);
    
    // Add CSS animation for blinking
    if (!document.getElementById('blinkAnimation')) {
        const style = document.createElement('style');
        style.id = 'blinkAnimation';
        style.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.4; }
            }
        `;
        document.head.appendChild(style);
    }
}

/* ==================== RESTART FUNCTIONALITY ==================== */
function restartTimer() {
    // Remove location caption and restart prompt if they exist
    const caption = document.getElementById('locationCaption');
    const prompt = document.getElementById('restartPrompt');
    if (caption) caption.remove();
    if (prompt) prompt.remove();
    
    // Reset screen
    clockScreen.style.display = 'none';
    inputScreen.style.display = 'flex';
    canvas.style.display = 'none';
    document.body.style.backgroundImage = "url('title-screen-background.png')";
    
    // Reset clock screen styles
    clockScreen.style.background = 'rgba(255, 255, 255, 0.1)';
    clockScreen.style.backdropFilter = 'blur(12px)';
    clockScreen.style.webkitBackdropFilter = 'blur(12px)';
    clockScreen.style.border = '1px solid rgba(255, 255, 255, 0.2)';
    clockScreen.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    
    // Reset button displays
    timeButton.style.visibility = 'visible';  // Show time button again
    timeButton.style.display = 'block';  // Ensure it's displayed
    pauseButton.style.display = 'block';
    pauseButton.textContent = 'Start';
    pauseButton.style.opacity = '1';
    
    // Reset values
    inputValue = 0;
    remainingSeconds = 0;
    lastStage = -1;
    
    // Clear input and reset display
    inputBox.value = '';
    titleStudyTime.textContent = '0:00';
    
    // Load new random landscape for next session
    loadRandomLandscape();
    
    // Focus input
    inputBox.focus();
}

// Listen for spacebar press to restart
document.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
        // Only restart if we're on the finished screen (canvas visible, timer at 0)
        if (canvas.style.display === 'block' && remainingSeconds === 0) {
            e.preventDefault(); // Prevent page scroll
            restartTimer();
        }
    }
    
    // Toggle fullscreen with F key
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        if (!document.fullscreenElement) {
            // Enter fullscreen
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error entering fullscreen:', err);
            });
        } else {
            // Exit fullscreen
            document.exitFullscreen();
        }
    }
});

/* ==================== CONSTANTS ==================== */
const timeButton = document.getElementById('timeButton');
const pauseButton = document.getElementById('pauseButton');
const inputBox = document.querySelector('.input');
const titleStudyTime = document.getElementById('titleStudyTime');
const plus30 = document.getElementById('plus30');
const startButton = document.getElementById('startButton');
const inputScreen = document.querySelector('.inputScreen');
const clockScreen = document.querySelector('.clock');
const clockStudyTime = document.getElementById('studyTime');
let isHovering = false;
let inputValue = 0;
let remainingSeconds = 0;
let countdownInterval = null;
let inFinalMinute = false;
let lastStage = -1;
const pixelStages = 32;
const startBlockSize = 128;
const endBlockSize = 4;

/* ==================== TIMER LOGIC ==================== */

/* --------------------TITLE SCREEN-------------------- */

/* Update on Enter key press */
inputBox.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        updateStudyTime();
        inputBox.blur();
    }
});

/* Update when input user clicks elsewhere */
inputBox.addEventListener('blur', function() {
    updateStudyTime();
});

/* Add global Enter key listener for starting timer */
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && inputScreen.style.display !== 'none') {
        // Check if input box is NOT focused
        if (document.activeElement !== inputBox) {
            // Start timer if valid time exists
            if (inputValue > 0) {
                startTimer();
            }
        }
    }
});

/* Update +30 */
plus30.addEventListener('click', function() {
    inputValue += 30;
    titleStudyTime.textContent = secondsToTime(inputValue * 60);
});

/* Start button - switch screens */
startButton.addEventListener('click', function() {
    startTimer();
});

/* Function to start the timer and switch screens */
function startTimer() {
    if (inputValue > 0) {
        inputScreen.style.display = 'none';
        clockScreen.style.display = 'flex';
        document.body.style.backgroundImage = 'none';
        canvas.style.display = 'block';
        remainingSeconds = inputValue * 60;
        clockStudyTime.textContent = secondsToTime(remainingSeconds);
        drawPixelated(calculateBlockSize());
    }
}

/* Update study time display */
function updateStudyTime() {
    inputValue = parseInt(inputBox.value.trim()) || 0;
    titleStudyTime.textContent = secondsToTime(inputValue * 60);
}

/* --------------------CLOCK SCREEN-------------------- */

/* Hide function for real time clock */
timeButton.addEventListener('mouseenter', function (){
    isHovering = true;
    timeButton.textContent = "Hide";
});

timeButton.addEventListener('mouseleave', function (){
    isHovering = false;
    updateClock();
});

timeButton.addEventListener('click', function(){
    timeButton.style.visibility = 'hidden';  // Hide but keep space
})

/* Pause/Start button */
pauseButton.addEventListener('click', function() {
    if (pauseButton.textContent === "Start") {
        pauseButton.style.opacity = '0';
        startCountdown();
        pauseButton.textContent = "Pause";
    } else if (pauseButton.textContent === "Pause") {
        clearInterval(countdownInterval);
        pauseButton.textContent = "Resume";
    } else {
        startCountdown();
        pauseButton.textContent = "Pause";
    }
});

pauseButton.addEventListener('mouseenter', function() {
    if (pauseButton.textContent === "Pause") {
        pauseButton.style.opacity = '1';
    }
});

/* Hide pause button when mouse leaves */
pauseButton.addEventListener('mouseleave', function() {
    if (pauseButton.textContent === "Pause") {
        pauseButton.style.opacity = '0';
    }
});

/* Real time clock update */
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours());
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (!isHovering) {
        document.getElementById('timeButton').textContent = `${hours} : ${minutes} : ${seconds}`;
    }
}

/* --------------------CLOCK LOGIC-------------------- */

/* Convert seconds to time format */
function secondsToTime(seconds) {
    const total = parseInt(seconds) || 0;
    const secs = total % 60;
    const mins = Math.floor(total / 60) % 60;
    const hours = Math.floor(total / 3600);
    if (hours === 0) {
        return `0:${String(mins).padStart(2, '0')}`;
    }
    return `${hours}:${String(mins).padStart(2, '0')}`;
}

/* Countdown timer function */
function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    let lastUpdateTime = Date.now();
    countdownInterval = setInterval(function() {
        const now = Date.now();
        const deltaTime = now - lastUpdateTime;
        lastUpdateTime = now;
        
        // Only decrement if close to 1 second has passed
        if (deltaTime >= 900) {
            remainingSeconds--;
        }
        
        // Update clock display every tick
        if (remainingSeconds <= 0) {
            clearInterval(countdownInterval);
            clockStudyTime.textContent = '';
            timeButton.style.display = 'none';
            pauseButton.style.display = 'none';
            colorBlastReveal();
        } else if (remainingSeconds <= 60) {
            clockStudyTime.textContent = remainingSeconds;
        } else {
            clockStudyTime.textContent = secondsToTime(remainingSeconds);
        }
        
        // Update pixels only when stage changes
        const newStage = calculateStage();
        if (newStage !== lastStage) {
            lastStage = newStage;
            const blockSize = calculateBlockSize();
            
            // Draw pixelated version (full saturation throughout)
            drawPixelated(blockSize);
            console.log(`Stage ${newStage}: ${blockSize}px blocks`);
        }
        
    }, 1000);
}

updateClock();
setInterval(updateClock, 1000);

/* ==================== PIXEL REVEAL ==================== */

let imageData = null;

// Draw the image in pixelated blocks
function drawPixelated(blockSize, saturation = 1.0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let y = 0; y < canvas.height; y += blockSize) {
    for (let x = 0; x < canvas.width; x += blockSize) {
      const color = getAverageColor(x, y, blockSize, blockSize, saturation);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  }
}

/* Get average color of an image */
function getAverageColor(startX, startY, blockWidth, blockHeight, saturation = 1.0) {
  let r = 0, g = 0, b = 0, count = 0;
  
  for (let y = startY; y < startY + blockHeight && y < canvas.height; y++) {
    for (let x = startX; x < startX + blockWidth && x < canvas.width; x++) {
      const index = (y * canvas.width + x) * 4;
      r += imageData.data[index];
      g += imageData.data[index + 1];
      b += imageData.data[index + 2];
      count++;
    }
  }
  
  // Calculate average RGB
  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);
  
  // Apply subtle desaturation if needed
  if (saturation < 1.0) {
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    r = Math.floor(r * saturation + gray * (1 - saturation));
    g = Math.floor(g * saturation + gray * (1 - saturation));
    b = Math.floor(b * saturation + gray * (1 - saturation));
  }
  
  return `rgb(${r}, ${g}, ${b})`;
}

// Calculate what block size should be based on current stage
function calculateBlockSize() {
  const stage = calculateStage();
  const numberOfStages = 16;
  
  const maxBlockSize = 256;
  const minBlockSize = 8;
  
  // Create exponential curve for satisfying "splitting" feel
  const stageProgress = stage / (numberOfStages - 1);
  const easedProgress = Math.pow(stageProgress, 1.4);
  
  const blockSize = maxBlockSize * Math.pow(minBlockSize / maxBlockSize, easedProgress);
  
  return Math.round(blockSize);
}

// Calculate which discrete stage we're in (0 to numberOfStages-1)
function calculateStage() {
  const totalSeconds = inputValue * 60;
  if (totalSeconds === 0) return 0;
  
  const progress = (totalSeconds - remainingSeconds) / totalSeconds;
  const numberOfStages = 16;
  
  const stage = Math.floor(progress * numberOfStages);
  return Math.min(stage, numberOfStages - 1);
}

// Animate the final color reveal with left-to-right wave
function colorBlastReveal() {
  // Remove frosted glass effect from clock container
  clockScreen.style.background = 'transparent';
  clockScreen.style.backdropFilter = 'none';
  clockScreen.style.webkitBackdropFilter = 'none';
  clockScreen.style.border = 'none';
  clockScreen.style.boxShadow = 'none';
  
  let blastProgress = 0;
  const blastDuration = 3000;
  const startTime = Date.now();
  
  function animateBlast() {
    const elapsed = Date.now() - startTime;
    blastProgress = Math.min(1, elapsed / blastDuration);
    
    const easedProgress = 1 - Math.pow(1 - blastProgress, 2);
    
    const transitionZone = 150;
    const wavePosition = easedProgress * (canvas.width + transitionZone);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // LAYER 1: Draw pixelated background everywhere
    const blockSize = 8;
    for (let y = 0; y < canvas.height; y += blockSize) {
      for (let x = 0; x < canvas.width; x += blockSize) {
        const color = getAverageColor(x, y, blockSize, blockSize);
        ctx.fillStyle = color;
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }
    
    // LAYER 2: Draw full-res image over the revealed area
    if (wavePosition > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, Math.max(0, wavePosition), canvas.height);
      ctx.clip();
      ctx.drawImage(landscapeImage, 0, 0, canvas.width, canvas.height);
      ctx.restore();
      
      // LAYER 3: Draw gradient mask over transition zone to blend
      if (wavePosition < canvas.width + transitionZone) {
        const gradient = ctx.createLinearGradient(
        wavePosition - transitionZone, 0,
        wavePosition, 0
        );

        gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.6)');

        ctx.fillStyle = gradient;
        ctx.fillRect(wavePosition - transitionZone, 0, transitionZone, canvas.height);
      }
    }
    
    if (blastProgress < 1) {
      requestAnimationFrame(animateBlast);
    } else {
      // Animation complete - draw final image and show location
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(landscapeImage, 0, 0, canvas.width, canvas.height);
      
      // Show location caption after animation completes
      showLocationCaption();
    }
  }
  
  requestAnimationFrame(animateBlast);
}

/* ==================== INITIALIZATION ==================== */

// Auto-focus the input box when page loads
window.addEventListener('load', function() {
    inputBox.focus();
});

// Handle window resize to keep canvas properly sized
window.addEventListener('resize', function() {
  // Only resize if on clock screen (canvas is visible)
  if (canvas.style.display === 'block') {
    const oldWidth = canvas.width;
    const oldHeight = canvas.height;
    
    canvas.width = Math.min(window.innerWidth, 1920);
    canvas.height = Math.min(window.innerHeight, 1080);
    
    // Redraw if size changed
    if (oldWidth !== canvas.width || oldHeight !== canvas.height) {
      // Reload image data at new size
      ctx.drawImage(landscapeImage, 0, 0, canvas.width, canvas.height);
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Redraw current state
      if (remainingSeconds > 0) {
        const blockSize = calculateBlockSize();
        drawPixelated(blockSize);
      }
    }
  }
});
