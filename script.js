/* =============================================
   VITA MODA - JavaScript
   Minimal interactions for landing page
   ============================================= */

document.addEventListener('DOMContentLoaded', function () {
    // --- Navigation Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const heroSection = document.getElementById('hero');

    function handleNavScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('nav--light');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('nav--light');
        }
    }

    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll(); // Initial check

    // --- Dynamic Opening Hours & Current Day Highlight ---
    function initOpeningHours() {
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // 1-12
        const currentDay = today.getDate();
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Determina se è Orario Invernale (dal 15/10 al 15/04)
        // Invernale: Mesi 11, 12, 1, 2, 3 + seconda metà Ottobre (>=15) + prima metà Aprile (<=15)
        const isWinter = (currentMonth > 10 || currentMonth < 4) ||
            (currentMonth === 10 && currentDay >= 15) ||
            (currentMonth === 4 && currentDay <= 15);



        const hours = {
            winter: {
                weekday: "09:00 - 13:00<br>16:30 - 20:30",
                sunday: "10:30 - 13:00<br>Chiuso"
            },
            summer: {
                weekday: "09:00 - 13:00<br>17:00 - 21:00",
                sunday: "10:30 - 13:00<br>17:00 - 21:00"
            }
        };

        const currentSchedule = isWinter ? hours.winter : hours.summer;

        // Aggiorna tutti gli elementi orario
        document.querySelectorAll('.hours__item').forEach(item => {
            const day = parseInt(item.getAttribute('data-day'));
            const timeElement = item.querySelector('.hours__time');

            if (timeElement) {
                if (day === 0) { // Domenica
                    timeElement.innerHTML = currentSchedule.sunday;
                } else { // Lunedì - Sabato
                    timeElement.innerHTML = currentSchedule.weekday;
                }
            }

            // Highlight oggi
            if (day === dayOfWeek) {
                item.classList.add('hours__item--today');
            }
        });
    }

    initOpeningHours();

    // --- Mobile Menu Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');

            // Animate hamburger to X
            this.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // --- Smooth Scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Video Autoplay Fix for Mobile ---
    const heroVideo = document.querySelector('.hero__video');
    if (heroVideo) {
        // Force play on load
        heroVideo.muted = true;
        heroVideo.play().then(() => {
            heroVideo.classList.add('playing');
        }).catch(error => {
            console.log("Autoplay was prevented, waiting for interaction:", error);
            // Fallback: try to play on the first touch/click anywhere
            const playOnInteraction = () => {
                heroVideo.play().then(() => {
                    heroVideo.classList.add('playing');
                });
                document.removeEventListener('click', playOnInteraction);
                document.removeEventListener('touchstart', playOnInteraction);
            };
            document.addEventListener('click', playOnInteraction);
            document.addEventListener('touchstart', playOnInteraction);
        });

        heroVideo.addEventListener('error', function () {
            this.style.display = 'none';
        });
    }

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all sections for fade-in animation
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    // --- New Arrivals Slider ---
    initArrivalsSlider();
});

// =============================================
// NEW ARRIVALS SLIDER
// =============================================

/**
 * Google Apps Script URL — Inserisci qui l'URL della Web App dopo il deploy.
 * Lascialo vuoto per usare le foto placeholder durante lo sviluppo.
 */
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxPc0g_H-vwyeCZ525JHRJ1rNkY-R03MJX0ffQzJ4FHl4f2teGcBmsHvhKN1YwU4jdfew/exec';

/**
 * Placeholder photos for development (before Drive integration is set up).
 * These are high-quality fashion/outfit images from Unsplash.
 */
const PLACEHOLDER_PHOTOS = [
    { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=800&fit=crop&crop=center' },
    { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop&crop=center' },
    { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&crop=center' },
    { url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop&crop=center' },
    { url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop&crop=center' },
    { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=900&fit=crop&crop=top' },
    { url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&h=800&fit=crop&crop=center' },
    { url: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&h=800&fit=crop&crop=center' },
    { url: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&h=800&fit=crop&crop=center' },
    { url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=800&fit=crop&crop=center' },
];

async function initArrivalsSlider() {
    const track = document.getElementById('arrivalsTrack');
    const loading = document.getElementById('arrivalsLoading');
    const slider = document.getElementById('arrivalsSlider');

    if (!track || !slider) return;

    let photos = [];

    // Try to fetch from Google Apps Script
    if (APPS_SCRIPT_URL) {
        try {
            const response = await fetch(APPS_SCRIPT_URL);
            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
                photos = data.photos;
            }
        } catch (error) {
            console.log('Drive fetch failed, using placeholders:', error);
        }
    }

    // Fall back to placeholders if no Drive photos
    if (photos.length === 0) {
        photos = PLACEHOLDER_PHOTOS;
    }

    // Build slide elements
    const slideHTML = photos.map(photo =>
        `<div class="arrivals__slide">
            <img src="${photo.url}" alt="Nuovi arrivi da Vita Moda" loading="lazy">
        </div>`
    ).join('');

    // Duplicate slides for seamless infinite loop (the CSS animation translates -50%)
    track.innerHTML = slideHTML + slideHTML;

    // Calculate animation duration based on number of slides (more slides = longer duration)
    // ~4 seconds per slide is a good fashion-editorial pace
    const duration = photos.length * 4;
    track.style.setProperty('--slider-duration', `${duration}s`);
    // Also set on the parent for the CSS variable to cascade
    slider.style.setProperty('--slider-duration', `${duration}s`);
    track.parentElement.style.setProperty('--slider-duration', `${duration}s`);

    // Wait for at least some images to load, then hide shimmer
    const firstImages = track.querySelectorAll('.arrivals__slide img');
    let loadedCount = 0;
    const minToShow = Math.min(3, firstImages.length);

    firstImages.forEach(img => {
        if (img.complete) {
            loadedCount++;
        } else {
            img.addEventListener('load', () => {
                loadedCount++;
                if (loadedCount >= minToShow) {
                    showSlider();
                }
            });
            img.addEventListener('error', () => {
                loadedCount++;
                if (loadedCount >= minToShow) {
                    showSlider();
                }
            });
        }
    });

    // If images were cached, show immediately
    if (loadedCount >= minToShow) {
        showSlider();
    }

    // Fallback: show after 3 seconds regardless
    setTimeout(showSlider, 3000);

    let sliderShown = false;
    function showSlider() {
        if (sliderShown) return;
        sliderShown = true;

        if (loading) {
            loading.classList.add('arrivals__loading--hidden');
        }
        slider.style.opacity = '1';
    }

    // Initially hide slider until loaded
    slider.style.opacity = '0';
    slider.style.transition = 'opacity 0.6s ease';

    // --- Drag interaction (pause on drag) ---
    let isDragging = false;
    let startX = 0;

    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        track.style.animationPlayState = 'paused';
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            track.style.animationPlayState = 'running';
        }
    });

    // Touch support
    slider.addEventListener('touchstart', () => {
        track.style.animationPlayState = 'paused';
    }, { passive: true });

    slider.addEventListener('touchend', () => {
        track.style.animationPlayState = 'running';
    }, { passive: true });
}

// Add CSS for fade-in animation dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(style);
