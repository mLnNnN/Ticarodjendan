// Card flip functionality
const mainCard = document.querySelector('.birthday-card');
const present = document.querySelector('.present');

present.addEventListener('click', () => {
    mainCard.classList.add('flipped');
    createConfetti();
    playSound();
});

// Confetti functionality
const confettiBtn = document.getElementById('confettiBtn');
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let confettiParticles = [];

class ConfettiParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.1; // gravity
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

function createConfetti() {
    for (let i = 0; i < 100; i++) {
        confettiParticles.push(new ConfettiParticle());
    }
    animateConfetti();
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = confettiParticles.length - 1; i >= 0; i--) {
        confettiParticles[i].update();
        confettiParticles[i].draw();
        
        if (confettiParticles[i].y > canvas.height) {
            confettiParticles.splice(i, 1);
        }
    }
    
    if (confettiParticles.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
}

confettiBtn.addEventListener('click', () => {
    createConfetti();
    createHearts();
    createRoses();
});

// Messages section
const messageBtn = document.getElementById('messageBtn');
const messagesSection = document.getElementById('messagesSection');
const closeMessages = document.getElementById('closeMessages');
let currentMessageIndex = 0;
const messageCards = document.querySelectorAll('.message-card');

// Initialize messages - hide all except first
function initializeMessages() {
    messageCards.forEach((card, index) => {
        if (index === 0) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    currentMessageIndex = 0;
}

messageBtn.addEventListener('click', () => {
    messagesSection.classList.add('active');
    initializeMessages();
    createHearts();
    createRoses();
});

closeMessages.addEventListener('click', () => {
    messagesSection.classList.remove('active');
    initializeMessages(); // Reset when closing
});

// Close messages on outside click
messagesSection.addEventListener('click', (e) => {
    if (e.target === messagesSection) {
        messagesSection.classList.remove('active');
        initializeMessages(); // Reset when closing
    }
});

// Message cards interaction - show next message on click
messageCards.forEach((card, index) => {
    card.addEventListener('click', () => {
        if (card.classList.contains('active')) {
            // Show next message
            if (index < messageCards.length - 1) {
                // Hide current message with animation
                card.classList.remove('active');
                card.classList.add('fade-out');
                
                setTimeout(() => {
                    // Show next message
                    currentMessageIndex = index + 1;
                    const nextCard = messageCards[currentMessageIndex];
                    nextCard.classList.add('active');
                    nextCard.classList.add('fade-in');
                    createHearts();
                    createRoses();
                    
                    // Remove fade classes after animation
                    setTimeout(() => {
                        card.classList.remove('fade-out');
                        nextCard.classList.remove('fade-in');
                    }, 500);
                }, 300);
            } else {
                // Last message - just create hearts, roses and maybe close
                createHearts();
                createRoses();
                card.style.animation = 'bounce 0.5s';
            }
        }
    });
});

// Floating hearts
function createHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '💖';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// Floating roses
function createRoses() {
    const rosesContainer = document.querySelector('.roses-container');
    const rose = document.createElement('div');
    rose.className = 'rose';
    rose.textContent = '🌹';
    rose.style.left = Math.random() * 100 + '%';
    rose.style.animationDuration = (Math.random() * 3 + 4) + 's';
    rosesContainer.appendChild(rose);
    
    setTimeout(() => {
        rose.remove();
    }, 7000);
}

// Create hearts periodically
setInterval(() => {
    if (Math.random() > 0.7) {
        createHearts();
    }
}, 2000);

// Create roses periodically
setInterval(() => {
    if (Math.random() > 0.6) {
        createRoses();
    }
}, 3000);

// Music button functionality with MP3
const musicBtn = document.getElementById('musicBtn');
const birthdayMusic = document.getElementById('birthdayMusic');
let isPlaying = false;

// Music button click handler
musicBtn.addEventListener('click', () => {
    if (!isPlaying) {
        // Play music and create confetti
        birthdayMusic.play().catch(error => {
            console.log('Error playing audio:', error);
            alert('Molimo kliknite na stranicu prvo da omogućite reprodukciju muzike.');
        });
        
        // Create confetti animation
        createConfetti();
        createHearts();
        
        // Update button text
        musicBtn.textContent = '🔇 Zaustavi muziku';
        isPlaying = true;
    } else {
        // Pause music
        birthdayMusic.pause();
        musicBtn.textContent = '🎵 Muzika';
        isPlaying = false;
    }
});

// Update button when music ends
birthdayMusic.addEventListener('ended', () => {
    musicBtn.textContent = '🎵 Muzika';
    isPlaying = false;
});

// Update button when music is paused
birthdayMusic.addEventListener('pause', () => {
    if (birthdayMusic.currentTime > 0 && !birthdayMusic.ended) {
        musicBtn.textContent = '🎵 Muzika';
        isPlaying = false;
    }
});

// Sound effect function
function playSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Add click effects to interactive elements
document.querySelectorAll('.interactive-btn, .message-card').forEach(element => {
    element.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple effect CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .interactive-btn, .message-card {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && messagesSection.classList.contains('active')) {
        messagesSection.classList.remove('active');
    }
});

// Initialize with some hearts and roses
for (let i = 0; i < 5; i++) {
    setTimeout(() => createHearts(), i * 500);
    setTimeout(() => createRoses(), i * 700);
}

