// Initialize Vercel Analytics
import { inject } from '@vercel/analytics';

inject({
	mode: 'production'
});

var main = document.querySelector('main'),
	canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	text = document.querySelector('.text'),
	ww = window.innerWidth,
	menu = document.querySelector('.menu'),
	ul = menu.querySelector('ul'),
	idx = 0,
	count = ul.childElementCount - 1,
	toggle = true,
	frame;

// Set canvas size
canvas.width = ww / 3;
canvas.height = (ww * 0.5625) / 3;

// Generate CRT noise
function snow(ctx) {

	var w = ctx.canvas.width,
		h = ctx.canvas.height,
		d = ctx.createImageData(w, h),
		b = new Uint32Array(d.data.buffer),
		len = b.length;

	for (var i = 0; i < len; i++) {
		b[i] = ((255 * Math.random()) | 0) << 24;
	}

	ctx.putImageData(d, 0, 0);
}

function animate() {
	snow(ctx);
	frame = requestAnimationFrame(animate);
};

// Glitch
for (i = 0; i < 4; i++) {
	var span = text.firstElementChild.cloneNode(true);
	text.appendChild(span);
}

window.addEventListener('DOMContentLoaded', function(e) {
	setTimeout(function() {
		main.classList.add('on');
		main.classList.remove('off');
		animate();
	}, 1000);
});

window.addEventListener('keydown', function(e) {
	var key = e.keyCode;
	var prev = idx;
	if (key == 38 || key == 40) {
		e.preventDefault();

		switch (key) {
			case 38:
				if (idx > 0) {
					idx--;
				}
				break;
			case 40:
				if (idx < count) {
					idx++;
				}
				break;
		}

		ul.children[prev].classList.remove('active');
		ul.children[idx].classList.add('active');
	}
}, false);

window.addEventListener("mouseover", play);
window.addEventListener("click", play);

function play() {
    var startupSound = document.getElementById('tv-startup');
    var hissSound = document.getElementById('tv-hiss');
    
    // Açılış sesini çal
    startupSound.play().catch(error => {
        console.error('Açılış sesi çalınamadı:', error);
    });

    // 2 saniye sonra ince sesi başlat
    setTimeout(function() {
        hissSound.play().catch(error => {
            console.error('İnce ses çalınamadı:', error);
        });
    }, 2000);
}

// Ses efektleri için Audio nesneleri
const tvStartup = document.getElementById('tv-startup');
const tvHiss = document.getElementById('tv-hiss');
const scrollSound = new Audio('TVScroll.mp3');

// Kaydırma sesi için değişkenler
let isScrolling;
let lastScrollTime = Date.now();
const scrollDelay = 50; // ms cinsinden minimum ses çalma aralığı

// Kaydırma olayını dinle
window.addEventListener('scroll', () => {
    const now = Date.now();
    
    // Minimum ses çalma aralığını kontrol et
    if (now - lastScrollTime > scrollDelay) {
        scrollSound.currentTime = 0;
        scrollSound.play();
        lastScrollTime = now;
    }
    
    // Kaydırma durduğunda sesi durdur
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        scrollSound.pause();
        scrollSound.currentTime = 0;
    }, 150);
});

// Sayfa yüklendiğinde TV açılış sesini çal
window.addEventListener('load', () => {
    tvStartup.play();
    setTimeout(() => {
        tvHiss.play();
    }, 1000);
});

