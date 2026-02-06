// ============ WEATHER INTERACTIVITY ============
function toggleWeatherDetail(element) {
    element.classList.toggle('active');
    // Close other details
    document.querySelectorAll('.weather-detail-item-compact').forEach(detail => {
        if (detail !== element) {
            detail.classList.remove('active');
        }
    });
}

// ============ CONTACT UTILITIES ============
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show toast notification
        showToast('Berhasil disalin! ✓');
    }).catch(() => {
        alert('Gagal menyalin teks');
    });
}

function openWhatsApp(phoneNumber) {
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
}

function sendFormToEmail(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    const subject = `Pesan dari Website Desa Kadirojo 2 - ${name}`;
    const body = `Nama: ${name}%0AEmail: ${email}%0ANo. HP: ${phone}%0A%0APesan:%0A${message}`;

    window.location.href = `mailto:Kadirojo2rt06@gmail.com?subject=${subject}&body=${body}`;
}

function sendFormToWhatsApp(event) {
    // Only prevent default if it's a form submission
    if (event.type === 'submit') {
        event.preventDefault();
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    if (!name || !message) {
        alert('Mohon isi nama dan pesan Anda');
        return;
    }

    const whatsappMessage = `Halo Admin RT06 RW02 KADIROJO 2,%0A%0ASaya ingin mengirim pesan melalui website:%0A%0ANama: ${name}%0AEmail: ${email}%0ANo. HP: ${phone}%0A%0APesan: ${message}`;

    window.open(`https://wa.me/628991240549?text=${whatsappMessage}`, '_blank');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, #25D366 0%, #20BA5A 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 50px;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 8px 25px rgba(37, 211, 102, 0.3);
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ============ INTERACTIVE STAT DETAILS ============
function toggleStatDetail(element) {
    element.classList.toggle('active');
    // Close other stats
    document.querySelectorAll('.stat').forEach(stat => {
        if (stat !== element) {
            stat.classList.remove('active');
        }
    });
}

// ============ ABOUT SECTION INTERACTIVITY ============
function toggleAboutExpanded() {
    const expanded = document.getElementById('about-expanded');
    const intro = document.querySelector('.about-intro');

    if (expanded.style.display === 'none') {
        expanded.style.display = 'block';
        intro.style.backgroundColor = 'rgba(0, 119, 190, 0.05)';
    } else {
        expanded.style.display = 'none';
        intro.style.backgroundColor = '';
    }
}

function highlightLocation(element) {
    document.querySelectorAll('.location-item').forEach(item => {
        item.classList.remove('highlight');
    });
    element.classList.add('highlight');
}

function expandCard(element) {
    const isExpanded = element.classList.contains('expanded');

    // Remove expanded class from all items
    document.querySelectorAll('.about-item').forEach(item => {
        item.classList.remove('expanded');
    });

    // Add expanded class to clicked item if not already expanded
    if (!isExpanded) {
        element.classList.add('expanded');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ============ STORIES MANAGEMENT ============
const stories = [
    {
        image: 'images/WhatsApp Image 2026-01-18 at 09.58.22 (1).jpeg',
        title: 'Keindahan Alam Desa',
        caption: 'Gotong Royong'
    },
    {
        image: 'images/WhatsApp Image 2026-01-18 at 09.58.25 (1).jpeg',
        title: 'Program Pertanian',
        caption: 'Kegiatan pertanian berkelanjutan desa kami'
    },
    {
        image: 'images/image 1.jpeg',
        title: 'UMKM Lokal',
        caption: 'Produk unggulan dari pengusaha lokal'
    },
    {
        image: 'images/image 3.jpeg',
        title: 'Gotong Royong',
        caption: 'Kebersamaan masyarakat desa'
    }
];

let currentStory = 0;
let storyAutoPlay;
let storyProgress = 0;

function showStory(index) {
    currentStory = index;
    const story = stories[index];

    document.getElementById('story-image').src = story.image;
    document.getElementById('story-title').textContent = story.title;
    document.getElementById('story-caption').textContent = story.caption;

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    // Reset progress animation
    const progressBar = document.querySelector('.story-progress-fill');
    progressBar.style.animation = 'none';
    setTimeout(() => {
        progressBar.style.animation = 'progress 5s linear forwards';
    }, 10);
}

function nextStory() {
    showStory((currentStory + 1) % stories.length);
    clearInterval(storyAutoPlay);
    startAutoPlay();
}

function previousStory() {
    showStory((currentStory - 1 + stories.length) % stories.length);
    clearInterval(storyAutoPlay);
    startAutoPlay();
}

function goToStory(index) {
    showStory(index);
    clearInterval(storyAutoPlay);
    startAutoPlay();
}

function startAutoPlay() {
    storyAutoPlay = setInterval(() => {
        nextStory();
    }, 5000);
}

function pauseAutoPlay() {
    clearInterval(storyAutoPlay);
}

function resumeAutoPlay() {
    startAutoPlay();
}

// ============ WEATHER MANAGEMENT ============
function fetchWeather() {
    const latitude = -7.759056;
    const longitude = 110.448001;

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius`)
        .then(res => res.json())
        .then(data => {
            const current = data.current;
            updateWeather(current.temperature_2m, current.relative_humidity_2m, current.weather_code, current.wind_speed_10m);
        })
        .catch(err => console.log('Error fetching weather:', err));
}

function updateWeather(temp, humidity, code, wind) {
    document.getElementById('weather-temp').textContent = Math.round(temp) + '°C';
    document.getElementById('weather-humidity').textContent = humidity;
    document.getElementById('weather-wind').textContent = Math.round(wind);
    document.getElementById('temp-display').textContent = Math.round(temp) + '°C';

    updateWeatherIcon(code);
    document.getElementById('weather-desc').textContent = getWeatherDescription(code);

    // Update weather card display
    document.getElementById('weather-temp-display').textContent = Math.round(temp) + '°C';
    document.getElementById('weather-status').textContent = getWeatherDescription(code);
    updateWeatherIconDisplay(code);

    // Update floating weather widget
    document.getElementById('floating-temp').textContent = Math.round(temp) + '°C';
    const floatingIcon = document.getElementById('floating-weather-icon');
    if (floatingIcon) {
        floatingIcon.className = getWeatherIcon(code);
    }
}

function getWeatherDescription(code) {
    const weatherCodes = {
        0: 'Cerah',
        1: 'Sebagian Berawan',
        2: 'Berawan',
        3: 'Mendung',
        45: 'Berkabut',
        48: 'Berkabut',
        51: 'Gerimis Ringan',
        53: 'Gerimis',
        55: 'Gerimis Lebat',
        61: 'Hujan Ringan',
        63: 'Hujan',
        65: 'Hujan Lebat',
        71: 'Salju Ringan',
        73: 'Salju',
        75: 'Salju Lebat',
        77: 'Butir Salju',
        80: 'Hujan Ringan Rintik',
        81: 'Hujan Rintik',
        82: 'Hujan Rintik Lebat',
        85: 'Salju Ringan Rintik',
        86: 'Salju Rintik Lebat',
        95: 'Badai Petir',
        96: 'Badai Petir dengan Butir Es',
        99: 'Badai Petir dengan Salju Es'
    };
    return weatherCodes[code] || 'Tidak Diketahui';
}

function updateWeatherIcon(code) {
    const icon = document.getElementById('weather-icon');
    if (code === 0) {
        icon.className = 'fas fa-sun';
    } else if (code === 1 || code === 2) {
        icon.className = 'fas fa-cloud-sun';
    } else if (code === 3) {
        icon.className = 'fas fa-cloud';
    } else if (code >= 45 && code <= 48) {
        icon.className = 'fas fa-smog';
    } else if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
        icon.className = 'fas fa-cloud-rain';
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
        icon.className = 'fas fa-snowflake';
    } else if (code >= 95 && code <= 99) {
        icon.className = 'fas fa-bolt';
    } else {
        icon.className = 'fas fa-cloud';
    }
}

function getWeatherIcon(code) {
    if (code === 0) {
        return 'fas fa-sun';
    } else if (code === 1 || code === 2) {
        return 'fas fa-cloud-sun';
    } else if (code === 3) {
        return 'fas fa-cloud';
    } else if (code >= 45 && code <= 48) {
        return 'fas fa-smog';
    } else if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
        return 'fas fa-cloud-rain';
    } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
        return 'fas fa-snowflake';
    } else if (code >= 95 && code <= 99) {
        return 'fas fa-bolt';
    } else {
        return 'fas fa-cloud';
    }
}

// ============ MAP MANAGEMENT ============
let mapInstance = null;

function initializeSmallMap() {
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) return;

    // Kadirojo 2 Coordinates
    const center = [-7.759056, 110.448001];

    // Border Coordinates (Approximate)
    const borders = [
        { name: "Perbatasan Barat: Sambisari", loc: [-7.759056, 110.443000] },
        { name: "Perbatasan Utara: Dukuh", loc: [-7.755088, 110.448001] },
        { name: "Perbatasan Timur: Turusan", loc: [-7.759056, 110.453000] }
    ];

    const map = L.map('map-container', {
        dragging: !L.Browser.mobile, // Disable dragging on mobile by default to prevent scroll hijacking
        touchZoom: true,
        scrollWheelZoom: false, // Disable scroll zoom
        zoomControl: false // Custom position later
    }).setView(center, 15);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Kadirojo 2 Marker (Center)
    const mainIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#6366f1; width: 15px; height: 15px; border-radius: 50%; border: 3px solid rgba(99, 102, 241, 0.3); box-shadow: 0 0 10px #6366f1;'></div>",
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    L.marker(center, { icon: mainIcon }).addTo(map)
        .bindPopup('<div style="text-align: center;"><strong>RT06 RW02<br>KADIROJO 2</strong></div>')
        .openPopup();

    // Territory Circle
    L.circle(center, {
        color: '#6366f1',
        fillColor: '#6366f1',
        fillOpacity: 0.1,
        radius: 300 // Approximate radius
    }).addTo(map);

    // Border Markers
    const borderIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#ef4444; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px #ef4444;'></div>",
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    borders.forEach(border => {
        L.marker(border.loc, { icon: borderIcon })
            .addTo(map)
            .bindPopup(`<strong>${border.name}</strong>`);

        // Dashed line to center
        L.polyline([center, border.loc], {
            color: '#ef4444',
            weight: 1,
            opacity: 0.5,
            dashArray: '5, 10'
        }).addTo(map);
    });
}

function openMapFullscreen() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        z-index: 1000;
        display: flex;
        flex-direction: column;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 1001;
        background: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
    closeBtn.innerHTML = '✕';
    closeBtn.onclick = () => overlay.remove();

    const mapContainer = document.createElement('div');
    mapContainer.id = 'map-fullscreen';
    mapContainer.style.cssText = `
        flex: 1;
        width: 100%;
        height: 100%;
    `;

    overlay.appendChild(closeBtn);
    overlay.appendChild(mapContainer);
    document.body.appendChild(overlay);

    setTimeout(() => {
        const fullscreenMap = L.map('map-fullscreen', {
            dragging: true,
            touchZoom: true,
            doubleClickZoom: true,
            scrollWheelZoom: true,
            zoomControl: true,
            attributionControl: true
        }).setView([-7.759056, 110.448001], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(fullscreenMap);

        L.marker([-7.759056, 110.448001], {
            title: 'Desa Kadirojo 2'
        }).addTo(fullscreenMap)
            .bindPopup(
                '<div style="text-align: center;">' +
                '<strong style="font-size: 1.1rem; color: #0077be;">Desa Kadirojo 2</strong><br>' +
                '<small>7°45′32.612″S 110°26′54.763″E</small>' +
                '</div>',
                { maxWidth: 250 }
            )
            .openPopup();

        L.circle([-7.759056, 110.448001], {
            color: '#0077be',
            fillColor: '#0077be',
            fillOpacity: 0.1,
            weight: 2,
            radius: 1000,
            dashArray: '5, 5'
        }).addTo(fullscreenMap);

        fullscreenMap.invalidateSize();
    }, 100);
}

// ============ FAQ MANAGEMENT ============
function toggleAnswer(element) {
    const faqItem = element.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');

    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });

    faqItem.classList.toggle('active');
}

// ============ INFO MODAL MANAGEMENT ============
function openInfoModal(element) {
    const img = element.querySelector('img');
    const modal = document.getElementById('info-modal');
    const modalImage = document.getElementById('info-modal-image');
    const modalTitle = document.getElementById('info-modal-title');
    const modalDesc = document.getElementById('info-modal-desc');

    modalImage.src = img.src;
    modalTitle.textContent = element.getAttribute('data-title');

    // Interactive Text Implementation
    const rawDesc = element.getAttribute('data-desc');
    modalDesc.innerHTML = ''; // Clear existing

    // Split by <br><br> if exists, otherwise just show as is
    const paragraphs = rawDesc.split('<br><br>');

    paragraphs.forEach((text, index) => {
        const p = document.createElement('div');
        p.className = 'modal-para';
        p.innerHTML = text;
        p.style.opacity = '0';
        p.style.transform = 'translateY(20px)';
        p.style.transition = `all 0.6s cubic-bezier(0.23, 1, 0.32, 1) ${0.1 * index}s`;
        modalDesc.appendChild(p);

        // Trigger animation
        setTimeout(() => {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        }, 50);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeInfoModal(event) {
    if (event && event.type === 'click' && event.target.id !== 'info-modal' && !event.target.classList.contains('info-modal-close')) {
        return;
    }

    const modal = document.getElementById('info-modal');
    modal.style.opacity = '0';
    modal.querySelector('.info-modal-content').style.transform = 'scale(0.9)';

    setTimeout(() => {
        modal.classList.remove('active');
        modal.style.opacity = '';
        modal.querySelector('.info-modal-content').style.transform = '';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeInfoModal();
    }
});

// ============ SCROLL ANIMATIONS ============
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.about h2, .services h2, .stories-section h2, .weather-section h2, .faq-section h2, .map-section h2, .contact h2').forEach(el => {
        // el.style.opacity = '0'; // REMOVE: Let CSS handle initial state to avoid flash
        observer.observe(el);
    });

    document.querySelectorAll('.about-item, .service-card, .faq-item, .info-card').forEach((el, index) => {
        // el.style.opacity = '0'; // REMOVE: Let CSS handle initial state
        el.style.animationDelay = (index * 0.1) + 's';
        observer.observe(el);
    });
}

// ============ TYPEWRITER EFFECT ============
function initTypewriter() {
    const textElement = document.getElementById('typewriter');
    if (!textElement) return;

    const phrases = ["Desa Digital Indonesia", "Lingkungan Guyub & Rukun", "Inovasi Berkelanjutan"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pause before new word
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// ============ NAVBAR MANAGEMENT ============
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });

    // Initialize stories
    showStory(0);
    startAutoPlay();

    const storyViewer = document.querySelector('.story-viewer');
    if (storyViewer) {
        storyViewer.addEventListener('mouseenter', pauseAutoPlay);
        storyViewer.addEventListener('mouseleave', resumeAutoPlay);
        storyViewer.addEventListener('touchstart', pauseAutoPlay);
        storyViewer.addEventListener('touchend', resumeAutoPlay);
    }

    // Fetch weather
    fetchWeather();

    // Initialize map
    setTimeout(initializeSmallMap, 500);

    // Initialize scroll animations
    // Initialize scroll animations
    initializeScrollAnimations();

    // Initialize typewriter
    initTypewriter();
});

// Refresh weather every 10 minutes
setInterval(fetchWeather, 600000);

// ============ WEATHER MODAL FUNCTIONS ============
function openWeatherModal() {
    const modal = document.getElementById('weather-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeWeatherModal(event) {
    if (event && event.target.id !== 'weather-modal') {
        return;
    }
    const modal = document.getElementById('weather-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function updateWeatherIconDisplay(code) {
    const iconElements = [
        document.getElementById('weather-icon-main'),
        document.getElementById('weather-icon-modal')
    ];

    let icon = 'fas fa-cloud';

    if (code === 0) icon = 'fas fa-sun';
    else if (code === 1 || code === 2) icon = 'fas fa-cloud-sun';
    else if (code === 3) icon = 'fas fa-cloud';
    else if (code === 45 || code === 48) icon = 'fas fa-smog';
    else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) icon = 'fas fa-cloud-rain';
    else if ([71, 73, 75, 77].includes(code)) icon = 'fas fa-snowflake';
    else if ([80, 81, 82].includes(code)) icon = 'fas fa-cloud-showers-heavy';
    else if ([85, 86].includes(code)) icon = 'fas fa-cloud-showers-heavy';
    else if ([95, 96, 99].includes(code)) icon = 'fas fa-bolt';

    iconElements.forEach(elem => {
        if (elem) {
            elem.className = icon;
        }
    });
}

