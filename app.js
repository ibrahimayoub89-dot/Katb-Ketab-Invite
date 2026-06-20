document.addEventListener('DOMContentLoaded', () => {
    
    // --- Elements ---
    const envelopeFrame = document.getElementById('envelope-frame');
    const envelopeContainer = document.getElementById('envelope-container');
    const mainInvitation = document.getElementById('main-invitation');
    
    const skyToggle = document.getElementById('sky-toggle');
    const heroSection = document.getElementById('hero-section');
    const heroBgSunset = document.querySelector('.hero-bg-sunset');
    const heroBgNight = document.querySelector('.hero-bg-night');

    // --- Envelope Interaction ---
    const frames = [
        'url("envelope_01.png")',
        'url("envelope_02.png")',
        'url("envelope_03.png")'
    ];
    let isAnimating = false;

    envelopeFrame.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        // 3 frames -> 2 transitions. 300ms per frame for a slow, smooth reveal.
        const frameDuration = 300;
        
        for (let i = 1; i < frames.length; i++) {
            setTimeout(() => {
                envelopeFrame.style.backgroundImage = frames[i];
            }, i * frameDuration);
        }

        const totalAnimationTime = (frames.length - 1) * frameDuration;
        
        // After sequence finishes, wait a tiny bit, then crossfade to main invitation
        setTimeout(() => {
            envelopeContainer.style.opacity = '0';
            mainInvitation.classList.remove('hidden');
            
            // Allow display block to render before triggering opacity transition
            requestAnimationFrame(() => {
                mainInvitation.classList.add('visible');
                // Trigger staggered text fade-in
                triggerTextFadeIn();
            });
        }, totalAnimationTime + 400); // 400ms pause to see the final open frame
        
        // Remove envelope container completely from DOM flow after fade
        setTimeout(() => {
            envelopeContainer.style.display = 'none';
        }, totalAnimationTime + 400 + 1500); // sequence + pause + fade duration
    });

    // --- Staggered Text Fade-In ---
    function triggerTextFadeIn() {
        const fadeLines = document.querySelectorAll('.fade-line');
        fadeLines.forEach((line) => {
            const delay = parseInt(line.getAttribute('data-delay')) || 0;
            setTimeout(() => {
                line.classList.add('visible');
            }, 800 + delay * 700); // 800ms initial wait, then 700ms between each line
        });
    }

    // --- Sky Toggle Logic ---
    const countdownSection = document.querySelector('.countdown-section');
    const venueSection = document.querySelector('.venue-section');

    skyToggle.addEventListener('change', (e) => {
        const fadeLines = document.querySelectorAll('.fade-line');
        
        // Step 1: Fade out all text
        fadeLines.forEach((line) => {
            line.classList.remove('visible');
        });

        // Step 2: After text fades out, switch all backgrounds
        setTimeout(() => {
            if(e.target.checked) {
                // Night Mode — all screens
                heroSection.classList.remove('sunset-mode');
                heroSection.classList.add('night-mode');
                heroBgSunset.classList.remove('active');
                heroBgNight.classList.add('active');
                countdownSection.classList.add('night-mode');
                venueSection.classList.add('night-mode');
            } else {
                // Sunset Mode — all screens
                heroSection.classList.remove('night-mode');
                heroSection.classList.add('sunset-mode');
                heroBgNight.classList.remove('active');
                heroBgSunset.classList.add('active');
                countdownSection.classList.remove('night-mode');
                venueSection.classList.remove('night-mode');
            }

            // Step 3: After background transitions, fade text back in
            setTimeout(() => {
                triggerTextFadeIn();
            }, 600);
        }, 800); // wait for text fade-out
    });

    // --- Countdown Logic ---
    const targetDate = new Date('July 18, 2026 00:00:00').getTime();
    
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            daysElement.innerText = "00";
            hoursElement.innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        daysElement.innerText = days < 10 ? '0' + days : days;
        hoursElement.innerText = hours < 10 ? '0' + hours : hours;
    }

    // Initial call
    updateCountdown();
    // Update every hour (since we only show days/hours)
    setInterval(updateCountdown, 1000 * 60 * 60);
});
