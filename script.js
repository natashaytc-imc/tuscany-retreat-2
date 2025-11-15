// 表單處理邏輯
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('weddingForm');
    const hasCompanionRadios = document.querySelectorAll('input[name="hasCompanion"]');
    const guestCountGroup = document.getElementById('guestCountGroup');
    const guestCountSelect = document.getElementById('guestCount');
    const successMessage = document.getElementById('successMessage');
    const scrollTriggers = document.querySelectorAll('[data-scroll-to]');
    const countdownTargets = {
        days: document.getElementById('days'),
        hours: document.getElementById('hours'),
        minutes: document.getElementById('minutes'),
        seconds: document.getElementById('seconds'),
    };

    // 根據是否攜伴顯示/隱藏參加人數欄位
    hasCompanionRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes') {
                guestCountGroup.style.display = 'block';
                guestCountSelect.setAttribute('required', 'required');
            } else {
                guestCountGroup.style.display = 'none';
                guestCountSelect.removeAttribute('required');
                guestCountSelect.value = '';
            }
        });
    });

    // 表單提交處理
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // 表單驗證
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // 收集表單數據
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            hasCompanion: document.querySelector('input[name="hasCompanion"]:checked').value,
            guestCount: guestCountSelect.value || null,
            stayAtVilla: document.querySelector('input[name="stayAtVilla"]:checked').value,
            dietary: Array.from(document.querySelectorAll('input[name="dietary"]:checked')).map(cb => cb.value),
            optionalActivities: Array.from(document.querySelectorAll('input[name="optionalActivities"]:checked')).map(cb => cb.value),
            specialRequests: document.getElementById('specialRequests').value,
            message: document.getElementById('message').value,
            submittedAt: new Date().toISOString()
        };

        // 這裡可以將數據發送到服務器
        // 目前先顯示在控制台和成功訊息
        console.log('表單數據:', formData);

        // 顯示成功訊息
        form.style.display = 'none';
        successMessage.style.display = 'block';

        // 可以選擇將數據發送到後端 API
        // sendToServer(formData);
    });

    // 重置表單時隱藏成功訊息
    form.addEventListener('reset', function() {
        successMessage.style.display = 'none';
        form.style.display = 'block';
        guestCountGroup.style.display = 'none';
        guestCountSelect.removeAttribute('required');
    });

    // 平滑滑動效果
    scrollTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const targetSelector = trigger.getAttribute('data-scroll-to');
            const target = document.querySelector(targetSelector);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // 倒數計時
    const weddingDate = new Date('2026-05-18T12:00:00+02:00');
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            Object.values(countdownTargets).forEach(el => {
                if (el) el.textContent = '00';
            });
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (countdownTargets.days) countdownTargets.days.textContent = String(days).padStart(2, '0');
        if (countdownTargets.hours) countdownTargets.hours.textContent = String(hours).padStart(2, '0');
        if (countdownTargets.minutes) countdownTargets.minutes.textContent = String(minutes).padStart(2, '0');
        if (countdownTargets.seconds) countdownTargets.seconds.textContent = String(seconds).padStart(2, '0');
    }, 1000);

    // 圖片滑動效果
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryWrapper = document.querySelector('.gallery-track-wrapper');
    const galleryCards = document.querySelectorAll('.gallery-card');
    const galleryDotsContainer = document.querySelector('.gallery-dots');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');
    let currentSlide = 0;

    if (galleryTrack && galleryWrapper && galleryCards.length > 0) {
        let slideWidth = galleryWrapper.offsetWidth;

        const updateDots = () => {
            const dots = galleryDotsContainer?.querySelectorAll('button');
            dots?.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        };

        const goToSlide = (targetIndex) => {
            const total = galleryCards.length;
            currentSlide = (targetIndex + total) % total;
            const offset = currentSlide * slideWidth;
            galleryTrack.style.transform = `translateX(-${offset}px)`;
            updateDots();
        };

        const createDots = () => {
            if (!galleryDotsContainer) return;
            galleryDotsContainer.innerHTML = '';
            galleryCards.forEach((_, index) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.setAttribute('aria-label', `前往第 ${index + 1} 張照片`);
                dot.addEventListener('click', () => {
                    goToSlide(index);
                    resetAutoPlay();
                });
                if (index === 0) dot.classList.add('active');
                galleryDotsContainer.appendChild(dot);
            });
        };

        createDots();

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        nextBtn?.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
        prevBtn?.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        window.addEventListener('resize', () => {
            slideWidth = galleryWrapper.offsetWidth;
            goToSlide(currentSlide);
        });

        let autoPlay = setInterval(nextSlide, 6000);

        function resetAutoPlay() {
            clearInterval(autoPlay);
            autoPlay = setInterval(nextSlide, 6000);
        }

        galleryTrack.addEventListener('touchstart', resetAutoPlay, { passive: true });
        galleryTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
        galleryTrack.addEventListener('mouseleave', resetAutoPlay);

        goToSlide(0);
    }


    // 可以添加更多驗證邏輯
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const hasCompanion = document.querySelector('input[name="hasCompanion"]:checked');
        const stayAtVilla = document.querySelector('input[name="stayAtVilla"]:checked');

        if (!name) {
            alert('請輸入姓名');
            return false;
        }

        if (!email) {
            alert('請輸入電子郵件');
            return false;
        }

        if (!hasCompanion) {
            alert('請選擇是否攜伴');
            return false;
        }

        if (hasCompanion.value === 'yes' && !guestCountSelect.value) {
            alert('請選擇參加人數');
            return false;
        }

        if (!stayAtVilla) {
            alert('請選擇是否與我們同住 Villa');
            return false;
        }

        return true;
    }
});

// 如果需要發送到服務器，可以使用這個函數
function sendToServer(formData) {
    // 範例：使用 fetch API 發送到後端
    /*
    fetch('/api/wedding-rsvp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('成功:', data);
    })
    .catch((error) => {
        console.error('錯誤:', error);
        alert('表單提交失敗，請稍後再試');
    });
    */
}

