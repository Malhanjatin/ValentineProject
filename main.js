 const heartBg = document.getElementById('heartBg');
    const heartEmojis = ['💖', '💕', '💗', '💓', '💝', '❤️', '🌸', '🌹', '✨'];
    
    function createFloatingHeart() {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDuration = (15 + Math.random() * 10) + 's';
      heart.style.animationDelay = Math.random() * 5 + 's';
      heart.style.fontSize = (20 + Math.random() * 20) + 'px';
      heartBg.appendChild(heart);
      
      setTimeout(() => heart.remove(), 25000);
    }

    // Create hearts continuously
    setInterval(createFloatingHeart, 800);
    for (let i = 0; i < 15; i++) {
      setTimeout(createFloatingHeart, i * 500);
    }

    // Create sparkles
    function createSparkle(x, y) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';
      sparkle.style.animationDelay = Math.random() + 's';
      document.body.appendChild(sparkle);
      
      setTimeout(() => sparkle.remove(), 3000);
    }

    // Add sparkles on mouse move
    let sparkleTimeout;
    document.addEventListener('mousemove', (e) => {
      clearTimeout(sparkleTimeout);
      sparkleTimeout = setTimeout(() => {
        if (Math.random() > 0.7) {
          createSparkle(e.clientX, e.clientY);
        }
      }, 50);
    });

    // Screen navigation
    const screens = document.querySelectorAll('.screen');
    let current = 0;

    function next() {
      screens[current].classList.remove('active');
      current++;
      screens[current].classList.add('active');
    }

    // No button behavior - ALWAYS VISIBLE, ALWAYS MOVING
    const noBtn = document.getElementById("no");
    const yesBtn = document.getElementById("yes");

    function getRandomPosition() {
      // Get viewport dimensions (works on mobile too)
      const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      
      // Get button dimensions
      const btnWidth = noBtn.offsetWidth;
      const btnHeight = noBtn.offsetHeight;
      
      // Set safe padding from edges (bigger on mobile)
      const isMobile = viewportWidth <= 768;
      const padding = isMobile ? 20 : 40;
      
      // Calculate maximum safe positions
      const maxLeft = viewportWidth - btnWidth - padding;
      const maxTop = viewportHeight - btnHeight - padding;
      
      // Ensure minimum positions
      const minLeft = padding;
      const minTop = padding;
      
      // Make sure we have valid ranges
      if (maxLeft <= minLeft || maxTop <= minTop) {
        // Screen too small, center the button
        return {
          left: (viewportWidth - btnWidth) / 2,
          top: (viewportHeight - btnHeight) / 2
        };
      }
      
      // Generate random position within safe bounds
      const randomLeft = minLeft + Math.random() * (maxLeft - minLeft);
      const randomTop = minTop + Math.random() * (maxTop - minTop);
      
      return {
        left: Math.max(minLeft, Math.min(randomLeft, maxLeft)),
        top: Math.max(minTop, Math.min(randomTop, maxTop))
      };
    }

    function moveNoButton(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      const newPos = getRandomPosition();
      
      // Apply position immediately with no transition
      noBtn.style.transition = "none";
      noBtn.style.position = "fixed";
      noBtn.style.left = newPos.left + "px";
      noBtn.style.top = newPos.top + "px";
      noBtn.style.transform = "none";
      
      // Force visibility
      noBtn.style.opacity = "1";
      noBtn.style.visibility = "visible";
      noBtn.style.display = "block";
      
      // Add a little shake animation for feedback
      noBtn.style.animation = "none";
      setTimeout(() => {
        noBtn.style.animation = "shake 0.3s";
      }, 10);
      
      return false;
    }

    // Add shake animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
      }
    `;
    document.head.appendChild(style);

    // Safety check - make sure button is always visible
    function checkButtonVisibility() {
      const rect = noBtn.getBoundingClientRect();
      const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      
      const isVisible = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewportHeight &&
        rect.right <= viewportWidth &&
        rect.width > 0 &&
        rect.height > 0
      );
      
      if (!isVisible) {
        console.log("Button off screen, repositioning...");
        const newPos = getRandomPosition();
        noBtn.style.transition = "none";
        noBtn.style.position = "fixed";
        noBtn.style.left = newPos.left + "px";
        noBtn.style.top = newPos.top + "px";
        noBtn.style.transform = "none";
        noBtn.style.opacity = "1";
        noBtn.style.visibility = "visible";
        noBtn.style.display = "block";
      }
    }

    // Check button visibility every 500ms
    setInterval(checkButtonVisibility, 500);

    if (noBtn) {
      // Mobile touch events with better handling
      noBtn.addEventListener("touchstart", function(e) {
        e.preventDefault();
        e.stopPropagation();
        moveNoButton(e);
        return false;
      }, { passive: false });

      noBtn.addEventListener("touchend", function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, { passive: false });

      // Desktop mouse events
      noBtn.addEventListener("mouseenter", function(e) {
        e.preventDefault();
        moveNoButton(e);
        return false;
      });

      noBtn.addEventListener("mouseover", function(e) {
        e.preventDefault();
        moveNoButton(e);
        return false;
      });

      noBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        moveNoButton(e);
        return false;
      });

      noBtn.addEventListener("mousedown", function(e) {
        e.preventDefault();
        e.stopPropagation();
        moveNoButton(e);
        return false;
      });
    }

    // Yes button - Success screen
    if (yesBtn) {
      yesBtn.addEventListener("click", () => {
        // Create confetti
        const colors = ['#f093fb', '#f5576c', '#fda085', '#667eea', '#764ba2'];
        for (let i = 0; i < 100; i++) {
          setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = -10 + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (3 + Math.random() * 3) + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.opacity = Math.random();
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 8000);
          }, i * 30);
        }

        // Show success screen
        setTimeout(() => {
          document.body.innerHTML = `
            <div class="heart-bg" id="successHeartBg"></div>
            <div class="success-screen">
              <div class="success-content">
                <div class="success-emoji">💖</div>
                <div class="success-text">
                  You Said Yes! 🎉
                </div>
                <div class="success-subtext">
                  My heart is overflowing with joy right now ✨
                </div>
                <div class="love-message">
                  "From the moment you came into my life, everything changed. 
                  You're not just my Valentine – you're my best friend, my comfort, 
                  my happiness, and my forever. Every smile, every laugh, every moment 
                  we share is a treasure I hold close to my heart. 
                  With you, I've found a love I didn't even know I was searching for. 
                  Thank you for choosing me, for believing in us, and for making 
                  every single day feel like magic. I promise to cherish you, 
                  to make you smile, and to love you more with each sunrise. 
                  You are my today and all of my tomorrows. 💕✨"
                </div>
              </div>
            </div>
          `;

          // Continue floating hearts on success screen
          const successHeartBg = document.getElementById('successHeartBg');
          setInterval(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (15 + Math.random() * 10) + 's';
            heart.style.fontSize = (25 + Math.random() * 25) + 'px';
            heart.style.opacity = '0.2';
            successHeartBg.appendChild(heart);
            
            setTimeout(() => heart.remove(), 25000);
          }, 600);

          // Add big floating hearts around the message
          const successScreen = document.querySelector('.success-screen');
          const bigHeartEmojis = ['💖', '💕', '💗', '💝', '❤️'];
          
          setInterval(() => {
            const bigHeart = document.createElement('div');
            bigHeart.className = 'floating-hearts-big';
            bigHeart.textContent = bigHeartEmojis[Math.floor(Math.random() * bigHeartEmojis.length)];
            bigHeart.style.left = (20 + Math.random() * 60) + '%';
            bigHeart.style.bottom = '0';
            bigHeart.style.animationDelay = Math.random() * 2 + 's';
            successScreen.appendChild(bigHeart);
            
            setTimeout(() => bigHeart.remove(), 6000);
          }, 1500);

        }, 300);
      });
    }