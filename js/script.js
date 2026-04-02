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
        showToast('<i class="fas fa-check"></i> Berhasil disalin!');
    }).catch(() => {
        alert('Gagal menyalin teks');
    });
}

function openWhatsApp(phoneNumber) {
    // Clean phone number from non-numeric characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
}

function sendFormToWhatsApp(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;

    if (!name || !message) {
        showToast('<i class="fas fa-exclamation-triangle"></i> Mohon isi nama dan pesan Anda!');
        return;
    }

    const text = `Halo RT06 RW02 KADIROJO 2,%0A%0A` +
        `*Nama:* ${name}%0A` +
        `*Email:* ${email}%0A` +
        `*No. Telp:* ${phone || '-'}%0A%0A` +
        `*Pesan:*%0A${message}`;

    const phoneNumber = '628991240549';
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, '_blank');

    openSuccessModal();
}

function sendFormToEmail(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Kirim Email';

    if (!name || !message || !email) {
        showToast('<i class="fas fa-exclamation-triangle"></i> Mohon isi nama, email, dan pesan!');
        return;
    }

    // Show loading state
    if (submitBtn) {
        submitBtn.innerHTML = '<span class="btn-text">Mengirim...</span><span class="btn-icon"><i class="fas fa-spinner fa-spin"></i></span>';
        submitBtn.disabled = true;
    }

    // Prepare data for FormSubmit
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone || '-');
    formData.append('message', message);
    formData.append('_subject', `Pesan Website Kadirojo 2 dari ${name}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false'); // Disable captcha if you want simpler submission

    fetch("https://formsubmit.co/ajax/Kadirojo2rt06@gmail.com", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success === "true" || data.success === true) {
                openSuccessModal();
                event.target.reset(); // Reset form
            } else {
                showToast('<i class="fas fa-times-circle"></i> Gagal mengirim pesan. Silakan coba lagi.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showToast('<i class="fas fa-wifi"></i> Terjadi kesalahan koneksi.');
        })
        .finally(() => {
            // Restore button state
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
}

function initContactForm() {
    const form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            // Check if the user clicked the WhatsApp button or the main submit
            // For now, let's keep the main submit going to FormSubmit.co
            // but add a listener for the specific WhatsApp button if we change it.
        });
    }
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

// ============ RIPPLE EFFECT ============
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;

    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
}

// Initialize ripple effect on all buttons
function initRippleEffects() {
    document.querySelectorAll('.btn, .btn-primary, .btn-secondary').forEach(button => {
        if (!button.classList.contains('ripple-initialized')) {
            button.classList.add('ripple-initialized');
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.addEventListener('click', createRipple);
        }
    });
}

// ============ CURSOR BLOB EFFECT ============
function initCursorBlob() {
    const blob = document.getElementById('cursor-blob');
    if (!blob) return;

    window.addEventListener('mousemove', e => {
        requestAnimationFrame(() => {
            blob.style.left = e.clientX + 'px';
            blob.style.top = e.clientY + 'px';
        });
    });
}

// ============ TYPEWRITER EFFECT ============
function initTypewriter() {
    const text = "RT06 RW02 KADIROJO 2";
    const element = document.getElementById('typewriter');
    if (!element) return;

    // Reset element content before starting
    element.textContent = "";
    let i = 0;

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }

    type();
}

// ============ SCROLL PROGRESS ============
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;

    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    scrollProgress.style.width = scrolled + "%";
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

// ============ 3D TILT EFFECT ============
function initTilt() {
    const tiltElements = document.querySelectorAll('.stat, .about-item, .service-card, .info-card');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
        });
    });
}

// ============ COUNTER ANIMATION ============
function initCounter() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ============ STORIES MANAGEMENT ============
const stories = [
    {
        image: 'images/story-nature.jpg',
        title: 'Keindahan Alam Desa',
        caption: 'Gotong Royong'
    },
    {
        image: 'images/story-farming.jpg',
        title: 'Program Pertanian',
        caption: 'Kegiatan pertanian berkelanjutan desa kami'
    },
    {
        image: 'images/story-umkm.jpg',
        title: 'Gotong Royong',
        caption: 'Produk unggulan dari pengusaha lokal'
    },
    {
        image: 'images/story-people.jpg',
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

    const storyImage = document.getElementById('story-image');
    if (!storyImage) return;

    storyImage.src = story.image;
    document.getElementById('story-title').textContent = story.title;
    document.getElementById('story-caption').textContent = story.caption;

    // Update dots
    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });

    // Reset progress animation
    const progressBar = document.querySelector('.story-progress-fill');
    if (progressBar) {
        progressBar.style.animation = 'none';
        setTimeout(() => {
            progressBar.style.animation = 'progress 5s linear forwards';
        }, 10);
    }
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
    // Update main weather widget
    const tempDisplay = document.getElementById('weather-temp-display');
    if (tempDisplay) {
        tempDisplay.textContent = Math.round(temp);
    }

    const statusDisplay = document.getElementById('weather-status');
    if (statusDisplay) {
        statusDisplay.textContent = getWeatherDescription(code);
    }

    // Update humidity display
    const humidityDisplay = document.getElementById('humidity-display');
    if (humidityDisplay) {
        humidityDisplay.textContent = humidity + '%';
    }

    // Update wind display
    const windDisplay = document.getElementById('wind-display');
    if (windDisplay) {
        windDisplay.textContent = Math.round(wind) + ' km/h';
    }

    // Update weather icons
    const elTemp = document.getElementById('weather-temp');
    if (elTemp) elTemp.textContent = Math.round(temp) + '°C';

    const elHumidity = document.getElementById('weather-humidity');
    if (elHumidity) elHumidity.textContent = humidity;

    const elWind = document.getElementById('weather-wind');
    if (elWind) elWind.textContent = Math.round(wind);

    const elTempDisplay = document.getElementById('temp-display');
    if (elTempDisplay) elTempDisplay.textContent = Math.round(temp) + '°C';

    updateWeatherIcon(code);
    const elDesc = document.getElementById('weather-desc');
    if (elDesc) elDesc.textContent = getWeatherDescription(code);

    // Update weather card display
    const elWeatherTempDisplay = document.getElementById('weather-temp-display');
    if (elWeatherTempDisplay) elWeatherTempDisplay.textContent = Math.round(temp) + '°C';

    const elWeatherStatus = document.getElementById('weather-status');
    if (elWeatherStatus) elWeatherStatus.textContent = getWeatherDescription(code);

    updateWeatherIconDisplay(code);



    // Additional elements for new layout
    const elHumidityDisplay = document.getElementById('humidity-display');
    if (elHumidityDisplay) elHumidityDisplay.textContent = humidity + '%';

    const elWindDisplay = document.getElementById('wind-display');
    if (elWindDisplay) elWindDisplay.textContent = Math.round(wind) + ' km/h';

    // Modal elements
    const elTempModal = document.getElementById('weather-temp-modal');
    if (elTempModal) elTempModal.textContent = Math.round(temp) + '°C';

    const elDescModal = document.getElementById('weather-description-modal');
    if (elDescModal) elDescModal.textContent = getWeatherDescription(code);

    const elHumidityModal = document.getElementById('humidity-modal');
    if (elHumidityModal) elHumidityModal.textContent = humidity + '%';

    const elWindModal = document.getElementById('wind-modal');
    if (elWindModal) elWindModal.textContent = Math.round(wind) + ' km/h';

    // Update ambient background
    updateAmbientEnvironment(temp, code);
}

function updateAmbientEnvironment(temp, code) {
    const ambientScene = document.getElementById('ambient-scene');
    if (!ambientScene) return;

    // 1. Time Logic
    const hour = new Date().getHours();
    let timeState = 'day';
    if (hour >= 5 && hour < 11) {
        timeState = 'morning';
    } else if (hour >= 11 && hour < 15) {
        timeState = 'day';
    } else if (hour >= 15 && hour < 19) {
        timeState = 'afternoon';
    } else {
        timeState = 'night';
    }

    // Assign time attribute
    ambientScene.setAttribute('data-time', timeState);

    // 2. Weather Logic
    let weatherState = 'clear';
    const isRaining = ((code >= 51 && code <= 65) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99));
    
    if (isRaining) {
        weatherState = 'rain';
    } else if (temp >= 28) {
        weatherState = 'hot';
    }

    // Assign weather attribute
    ambientScene.setAttribute('data-weather', weatherState);

    // 3. Generate Raindrops if raining
    const rainContainer = document.getElementById('ambient-rain');
    if (rainContainer) {
        rainContainer.innerHTML = ''; // Clear previous
        if (weatherState === 'rain') {
            const dropCount = 100;
            for (let i = 0; i < dropCount; i++) {
                const drop = document.createElement('div');
                drop.classList.add('drop');
                drop.style.left = Math.random() * 100 + '%';
                drop.style.animationDuration = 0.5 + Math.random() * 0.5 + 's';
                drop.style.animationDelay = Math.random() * 2 + 's';
                rainContainer.appendChild(drop);
            }
        }
    }

    // 4. Generate Fireflies if night
    const fireflyContainer = document.getElementById('ambient-fireflies');
    if (fireflyContainer) {
        fireflyContainer.innerHTML = ''; // Clear previous
        if (timeState === 'night') {
            const fireflyCount = 30;
            for (let i = 0; i < fireflyCount; i++) {
                const firefly = document.createElement('div');
                firefly.classList.add('firefly');
                firefly.style.left = Math.random() * 100 + '%';
                firefly.style.top = Math.random() * 80 + 20 + '%'; // Don't spawn too high
                firefly.style.animationDelay = (Math.random() * 5) + 's, ' + (Math.random() * 10) + 's';
                fireflyContainer.appendChild(firefly);
            }
        }
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
    const iconElements = [
        document.getElementById('weather-icon'),
        document.getElementById('weather-icon-main'),
        document.getElementById('weather-icon-modal')
    ];

    const iconClass = getWeatherIcon(code);

    iconElements.forEach(elem => {
        if (elem) {
            elem.className = iconClass;
        }
    });
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
    if (!mapContainer || mapContainer.querySelector('.leaflet-container')) return;

    const latitude = -7.759056;
    const longitude = 110.448001;

    const map = L.map('map-container', {
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: false
    }).setView([latitude, longitude], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    L.marker([latitude, longitude]).addTo(map);
}

function openMapFullscreen() {
    const isLight = document.body.classList.contains('light-mode');
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: ${isLight ? 'white' : '#0a0a0a'};
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
        background: ${isLight ? 'white' : '#1a1a1a'};
        color: ${isLight ? '#1e293b' : '#ffffff'};
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
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
    if (!element) return;

    const img = element.querySelector('img');
    const title = element.getAttribute('data-title');
    const desc = element.getAttribute('data-desc');

    const modal = document.getElementById('info-modal');
    const modalImage = document.getElementById('info-modal-image');
    const modalTitle = document.getElementById('info-modal-title');
    const modalDesc = document.getElementById('info-modal-desc');

    if (!modal) {
        console.error('Info modal element not found!');
        return;
    }

    if (img && modalImage) {
        modalImage.src = img.src;
    }

    if (modalTitle) modalTitle.textContent = title || 'Informasi';
    if (modalDesc) modalDesc.innerHTML = desc || '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeInfoModal(event) {
    if (event && event.type === 'click' && event.target.id !== 'info-modal') {
        return;
    }

    const modal = document.getElementById('info-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeInfoModal();
    }
});

// ============ EMERGENCY MODAL MANAGEMENT ============
function openEmergencyModal() {
    const modal = document.getElementById('emergency-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeEmergencyModal(event) {
    if (event && event.target && event.target.id !== 'emergency-modal') {
        const isCloseBtn = event.target.classList.contains('denah-modal-close') ||
            event.target.classList.contains('info-modal-close') ||
            event.target.closest('.denah-modal-close') ||
            event.target.closest('.info-modal-close');
        if (!isCloseBtn) return;
    }
    const modal = document.getElementById('emergency-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ============ DENAH ZOOM & PAN MANAGEMENT ============
let denahZoomLevel = 1;
let isPanning = false;
let startX, startY;
let translateX = 0, translateY = 0;

function updateDenahTransform() {
    const img = document.getElementById('denah-modal-img');
    if (img) {
        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(${denahZoomLevel})`;
        img.style.cursor = denahZoomLevel > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in';
        img.style.transition = isPanning ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
    }
}

function applyBoundaries() {
    if (denahZoomLevel <= 1) {
        translateX = 0;
        translateY = 0;
        return;
    }

    const wrapper = document.querySelector('.modal-image-side.zoomable');
    if (!wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const limitX = (rect.width * (denahZoomLevel - 1)) / 2;
    const limitY = (rect.height * (denahZoomLevel - 1)) / 2;

    translateX = Math.max(Math.min(translateX, limitX), -limitX);
    translateY = Math.max(Math.min(translateY, limitY), -limitY);
}

function zoomDenah(scale, mouseX, mouseY) {
    const oldZoom = denahZoomLevel;
    denahZoomLevel *= scale;

    // Limit zoom
    if (denahZoomLevel < 1) denahZoomLevel = 1;
    if (denahZoomLevel > 5) denahZoomLevel = 5;

    // Zoom-to-cursor logic
    if (mouseX !== undefined && mouseY !== undefined && denahZoomLevel !== oldZoom) {
        const wrapper = document.querySelector('.modal-image-side.zoomable');
        const rect = wrapper.getBoundingClientRect();

        const relX = mouseX - rect.left - rect.width / 2;
        const relY = mouseY - rect.top - rect.height / 2;

        const ratio = denahZoomLevel / oldZoom;
        translateX = relX - (relX - translateX) * ratio;
        translateY = relY - (relY - translateY) * ratio;
    }

    applyBoundaries();
    updateDenahTransform();
}

function resetZoomDenah() {
    denahZoomLevel = 1;
    translateX = 0;
    translateY = 0;
    updateDenahTransform();
}

function initDenahInteractions() {
    const img = document.getElementById('denah-modal-img');
    const wrapper = document.querySelector('.modal-image-side.zoomable');

    if (!img || !wrapper) return;

    // Mouse Events for Panning
    wrapper.addEventListener('mousedown', (e) => {
        if (denahZoomLevel <= 1) return;
        isPanning = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        updateDenahTransform();
    });

    window.addEventListener('mousemove', (e) => {
        if (!isPanning) return;
        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;

        applyBoundaries();
        updateDenahTransform();
    });

    window.addEventListener('mouseup', () => {
        if (isPanning) {
            isPanning = false;
            updateDenahTransform();
        }
    });

    // Mouse Wheel Zoom
    wrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.94 : 1.06;
        zoomDenah(delta, e.clientX, e.clientY);
    }, { passive: false });

    // Touch Events for Mobile
    let lastTouchX, lastTouchY;
    wrapper.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1 && denahZoomLevel > 1) {
            isPanning = true;
            lastTouchX = e.touches[0].clientX - translateX;
            lastTouchY = e.touches[0].clientY - translateY;
        }
    });

    wrapper.addEventListener('touchmove', (e) => {
        if (isPanning && e.touches.length === 1) {
            e.preventDefault();
            translateX = e.touches[0].clientX - lastTouchX;
            translateY = e.touches[0].clientY - lastTouchY;
            applyBoundaries();
            updateDenahTransform();
        }
    }, { passive: false });

    wrapper.addEventListener('touchend', () => {
        isPanning = false;
        updateDenahTransform();
    });
}

// Update initialization to set up modal listeners
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeInfoModal();
        closeEmergencyModal();
        closeDenahModal();
    }
});

// ============ NAVBAR MANAGEMENT ============
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');

            // Handle smooth scrolling for anchor links
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active link
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        const navbarHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });

        // If at top of page, highlight home
        if (window.scrollY < 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('.nav-link[href="#home"]');
            if (homeLink) homeLink.classList.add('active');
        }
    });


    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initialize cursor blob
    initCursorBlob();

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
    try {
        initializeScrollAnimations();
    } catch (e) {
        console.error("Scroll animations failed to init:", e);
    }

    // Remove Preloader - Use a more robust approach
    let preloaderRemoved = false;
    const removePreloader = () => {
        if (preloaderRemoved) return;
        preloaderRemoved = true;

        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                initTypewriter();
            }, 600);
        } else {
            initTypewriter();
        }
    };

    // Remove after 1.5s or when window is fully loaded, whichever comes first
    window.addEventListener('load', removePreloader);
    setTimeout(removePreloader, 2000); // Fail-safe

    // Scroll progress listener
    window.addEventListener('scroll', updateScrollProgress);

    // Initialize Counter
    initCounter();

    // Initialize 3D Tilt
    initTilt();

    // Initialize Theme
    initTheme();

    // Initialize Ripple Effects
    initRippleEffects();

    // Initialize Denah Modal interactions
    initDenahInteractions();

    // Initialize Ambient Leaves
    initAmbientLeaves();

    // Re-initialize ripple effects after dynamic content loads
    setTimeout(initRippleEffects, 2000);
});

// ============ AMBIENT EFFECTS ============
function initAmbientLeaves() {
    const container = document.getElementById('ambient-leaves');
    if (!container) return;

    const leafCount = 15;
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';

        // Randomize positions and animations
        const startX = Math.random() * 100;
        const duration = 10 + Math.random() * 20;
        const delay = Math.random() * -20;
        const size = 10 + Math.random() * 10;

        leaf.style.left = startX + 'vw';
        leaf.style.width = size + 'px';
        leaf.style.height = size + 'px';
        leaf.style.animationDuration = duration + 's';
        leaf.style.animationDelay = delay + 's';

        container.appendChild(leaf);
    }
}

// ============ THEME MANAGEMENT ============
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');

        // Update Icon
        const icon = themeToggle.querySelector('i');
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';

        // Save Preference
        localStorage.setItem('theme', isLight ? 'light' : 'dark');

        // Feedback
        showToast(isLight ? 'Mode Terang diaktifkan ☀️' : 'Mode Gelap diaktifkan 🌙');
    });
}


// Refresh weather every 10 minutes
setInterval(fetchWeather, 600000);

// ============ WEATHER MODAL FUNCTIONS ============
function openWeatherModal() {
    const modal = document.getElementById('weather-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeWeatherModal(event) {
    if (event && event.target.id !== 'weather-modal' && !event.target.classList.contains('weather-modal-close') && !event.target.closest('.weather-modal-close')) {
        return;
    }
    const modal = document.getElementById('weather-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Consolidated with updateWeatherIcon and getWeatherIcon
function updateWeatherIconDisplay(code) {
    updateWeatherIcon(code);
}

// ============ SCROLL REVEAL INITIALIZATION ============
function initializeScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    function reveal() {
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', reveal);
    // Initial call
    reveal();
}

// ============ DENAH MODAL FUNCTIONS ============
function openDenahModal() {
    const modal = document.getElementById('denah-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeDenahModal(event) {
    // If event is provided, only close if clicking the backdrop
    if (event && event.target && event.target.id !== 'denah-modal') {
        const isCloseBtn = event.target.classList.contains('denah-modal-close') ||
            event.target.closest('.denah-modal-close');
        if (!isCloseBtn) return;
    }

    const modal = document.getElementById('denah-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        resetZoomDenah(); // Reset zoom when closing
    }
}

// ============ SUCCESS MODAL FUNCTIONS ============
function openSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSuccessModal(event) {
    if (event && event.target.id !== 'success-modal' && !event.target.classList.contains('denah-modal-close') && !event.target.closest('.denah-modal-close')) {
        return;
    }
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}



// ============ FEEDMUSIC SCROLL REVEAL ============
document.addEventListener('DOMContentLoaded', () => {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    const revealElements = document.querySelectorAll('.service-card, .about-item, .section-header, .hero-content, .info-card');
    revealElements.forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});

// ============ PENCATATAN RAPAT MODAL FUNCTIONS ============
let quillRapatEditor;

function initRapatEditor() {
    if (!quillRapatEditor && document.getElementById('rapat-editor')) {
        quillRapatEditor = new Quill('#rapat-editor', {
            theme: 'snow',
            placeholder: 'Tulis notulensi rapat di sini...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['link'],
                    ['clean']
                ]
            }
        });
        
        const dateInput = document.getElementById('rapat-tanggal');
        const judulInput = document.getElementById('rapat-judul');

        // Load saved data from localStorage if exists
        const savedDate = localStorage.getItem('rapat_tanggal');
        const savedJudul = localStorage.getItem('rapat_judul');
        const savedContent = localStorage.getItem('rapat_content');

        if (dateInput) {
            if (savedDate) {
                dateInput.value = savedDate;
            } else if (!dateInput.value) {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                dateInput.value = `${yyyy}-${mm}-${dd}`;
            }
        }

        if (savedJudul && judulInput) {
            judulInput.value = savedJudul;
        }

        if (savedContent) {
            quillRapatEditor.root.innerHTML = savedContent;
        }

        // Add event listeners to save data on every change
        quillRapatEditor.on('text-change', function() {
            localStorage.setItem('rapat_content', quillRapatEditor.root.innerHTML);
        });

        if (judulInput) {
            judulInput.addEventListener('input', function() {
                localStorage.setItem('rapat_judul', this.value);
            });
        }

        if (dateInput) {
            dateInput.addEventListener('change', function() {
                localStorage.setItem('rapat_tanggal', this.value);
            });
        }
    }
}

// Function to clear all meeting notes data from memory and UI
function clearRapatData() {
    if (confirm('Apakah Anda yakin ingin menghapus seluruh catatan rapat saat ini dan memulai file baru?')) {
        localStorage.removeItem('rapat_content');
        localStorage.removeItem('rapat_judul');
        localStorage.removeItem('rapat_tanggal');
        
        document.getElementById('rapat-judul').value = '';
        if (quillRapatEditor) {
            quillRapatEditor.root.innerHTML = '';
        }
        
        // Reset date to today
        const dateInput = document.getElementById('rapat-tanggal');
        if (dateInput) {
            const today = new Date();
            const yyyy = today.getFullYear();
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const dd = String(today.getDate()).padStart(2, '0');
            dateInput.value = `${yyyy}-${mm}-${dd}`;
        }
        
        showToast('<i class="fas fa-trash"></i> Catatan telah dibersihkan');
    }
}

function openRapatModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('rapat-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        initRapatEditor();
    }
}

function closeRapatModal(event) {
    if (event && event.target && event.target.id !== 'rapat-modal') {
        const isCloseBtn = event.target.classList.contains('denah-modal-close') ||
            event.target.closest('.denah-modal-close');
        if (!isCloseBtn) return;
    }

    const modal = document.getElementById('rapat-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Helper function to convert HTML to WhatsApp markdown
function convertHtmlToWhatsAppMarkdown(html) {
    let text = html;
    
    // Handle headings
    text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '*$1*\n');
    
    // Handle bold/strong
    text = text.replace(/<(b|strong)[^>]*>(.*?)<\/\1>/gi, '*$2*');
    
    // Handle italic/em
    text = text.replace(/<(i|em)[^>]*>(.*?)<\/\1>/gi, '_$2_');
    
    // Handle strike/del
    text = text.replace(/<(s|strike|del)[^>]*>(.*?)<\/\1>/gi, '~$2~');
    
    // Handle lists
    text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
    
    // Handle <br> and <p> with newlines
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n');
    
    // Remove all remaining HTML tags
    text = text.replace(/<[^>]+>/g, '');
    
    // Decode HTML entities
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    text = textArea.value;
    
    // Clean up multiple newlines
    text = text.replace(/\n{3,}/g, '\n\n').trim();
    
    return text;
}

// Prepare export container with correct styling
function prepareRapatExport(plainTextMode = false) {
    const tanggal = document.getElementById('rapat-tanggal').value;
    const judul = document.getElementById('rapat-judul').value || 'Tanpa Judul';
    
    // Format date nicely
    const dateObj = new Date(tanggal);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('id-ID', options);
    
    let contentHtml = '';
    
    if (quillRapatEditor) {
        contentHtml = quillRapatEditor.root.innerHTML;
    }
    
    if (plainTextMode) {
        return {
            date: formattedDate,
            title: judul,
            text: convertHtmlToWhatsAppMarkdown(contentHtml) || quillRapatEditor.getText()
        };
    }
    
    document.getElementById('export-tanggal').innerText = formattedDate;
    document.getElementById('export-judul').innerText = judul;
    document.getElementById('export-content').innerHTML = contentHtml;
    
    return document.getElementById('rapat-export-container');
}

function shareRapatWA() {
    const data = prepareRapatExport(true);
    if (!data.text.trim()) {
        showToast('<i class="fas fa-exclamation-triangle"></i> Catatan rapat masih kosong!');
        return;
    }
    
    const text = `*NOTULENSI RAPAT*%0A` +
        `*Judul:* ${data.title}%0A` +
        `*Tanggal:* ${data.date}%0A%0A` +
        `*Hasil Rapat:*%0A${window.encodeURIComponent(data.text)}`;

    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function exportRapatPDF() {
    if (typeof html2pdf === 'undefined') {
        showToast('<i class="fas fa-exclamation-triangle"></i> Pustaka PDF belum dimuat. Coba lagi.');
        return;
    }

    const element = prepareRapatExport(false);
    element.style.display = 'block'; // Make visible temporarily
    
    const judul = document.getElementById('rapat-judul').value || 'Notulensi';
    const tanggal = document.getElementById('rapat-tanggal').value || 'hari-ini';
    
    const opt = {
        margin:       15,
        filename:     `${judul.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${tanggal}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = 'none'; // Hide again
        showToast('<i class="fas fa-check"></i> PDF Berhasil Disimpan');
    });
}

function exportRapatWord() {
    const element = prepareRapatExport(false);
    
    // Create a complete HTML string including necessary Word namespaces
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head><meta charset='utf-8'><title>Export HTML to Word</title></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + element.innerHTML + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    
    const judul = document.getElementById('rapat-judul').value || 'Notulensi';
    const tanggal = document.getElementById('rapat-tanggal').value || 'hari-ini';
    fileDownload.download = `${judul.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${tanggal}.doc`;
    
    fileDownload.click();
    document.body.removeChild(fileDownload);
    
    showToast('<i class="fas fa-check"></i> Word Berhasil Disimpan');
}
