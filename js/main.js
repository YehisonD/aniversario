document.addEventListener('DOMContentLoaded', () => {

    // ---------- PANTALLA DE CARGA ----------
    const loader = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                mainContent.classList.remove('hidden');
                initSnow();
                startCounter();
                // Inicializar nuevas secciones
                buildSolarSystem();
                buildTimeline();
                buildNotes();
            }, 1000);
        }, 3000);
    });

    // ---------- NIEVE ----------
    function initSnow() {
        const canvas = document.getElementById('snow-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const snowflakes = [];
        const maxFlakes = 80;

        for (let i = 0; i < maxFlakes; i++) {
            snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 1.5 + 0.5,
                wind: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.8 + 0.2
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#e0f7ff';
            snowflakes.forEach(flake => {
                ctx.globalAlpha = flake.opacity;
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            update();
            requestAnimationFrame(draw);
        }

        function update() {
            snowflakes.forEach(flake => {
                flake.y += flake.speed;
                flake.x += flake.wind;
                if (flake.y > canvas.height + 10) {
                    flake.y = -10;
                    flake.x = Math.random() * canvas.width;
                }
                if (flake.x > canvas.width + 10) flake.x = -10;
                if (flake.x < -10) flake.x = canvas.width + 10;
            });
        }

        draw();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ---------- CONTADOR DE TIEMPO ----------
    function startCounter() {
        const anniversary = new Date('2025-05-08T00:00:00');
        const counterText = document.getElementById('counter-text');

        function updateCounter() {
            const now = new Date();
            let diff = now - anniversary;

            if (diff < 0) {
                counterText.innerHTML = '¡El gran día aún no llega!';
                return;
            }

            let seconds = Math.floor(diff / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);

            const monthsTotal = Math.floor(days / 30.4375);
            const years = Math.floor(monthsTotal / 12);
            const months = monthsTotal % 12;

            const daysInYears = years * 365.25;
            const daysInMonths = months * 30.4375;
            const remainingDays = Math.floor(days - daysInYears - daysInMonths);

            hours = hours % 24;
            minutes = minutes % 60;
            seconds = seconds % 60;

            counterText.innerHTML = `
                ${years} año${years !== 1 ? 's' : ''}, 
                ${months} mes${months !== 1 ? 'es' : ''}, 
                ${remainingDays} día${remainingDays !== 1 ? 's' : ''}, 
                ${hours} hora${hours !== 1 ? 's' : ''}, 
                ${minutes} minuto${minutes !== 1 ? 's' : ''}, 
                ${seconds} segundo${seconds !== 1 ? 's' : ''}
            `;
        }

        updateCounter();
        setInterval(updateCounter, 1000);
    }

    // ---------- GALERÍA LIGHTBOX ----------
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
        });
    });

    closeBtn.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) lightbox.classList.remove('active');
    });

    // ---------- CARTA ANIMADA ----------
    const envelope = document.getElementById('envelope');
    const heartsContainer = document.getElementById('hearts-container');
    let isOpen = false;

    envelope.addEventListener('click', () => {
        isOpen = !isOpen;
        envelope.classList.toggle('open', isOpen);

        if (isOpen) {
            for (let i = 0; i < 30; i++) {
                createHeart();
            }
        }
    });

    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = ['❤️', '💕', '💖', '💘', '💝', '💗'][Math.floor(Math.random() * 6)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 2 + 2) + 's';
        heartsContainer.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove());
    }

    // ---------- MINIJUEGO ----------
    function normalize(str) {
        return str
            .trim()
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, ' ');
    }

    const correctAnswers = {
        q1: 'isha',
        q2: 'the maze runner prueba de fuego',
        q3: 'una ida a cine',
        q4: 'turquesa',
        q5: 'mi casa',
        q6: '2025-05-08'
    };

    const quizForm = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let score = 0;

        if (normalize(document.getElementById('q1').value) === normalize(correctAnswers.q1)) score++;
        const answer2 = normalize(document.getElementById('q2').value);
        if (answer2.includes('maze runner') && answer2.includes('prueba de fuego')) score++;
        if (normalize(document.getElementById('q3').value) === normalize(correctAnswers.q3)) score++;
        if (document.getElementById('q4').value === correctAnswers.q4) score++;
        if (normalize(document.getElementById('q5').value) === normalize(correctAnswers.q5)) score++;
        if (document.getElementById('q6').value === correctAnswers.q6) score++;

        const total = 6;
        let message = '';
        if (score === total) message = '¡Perfecto! Me conoces completamente 💖';
        else if (score >= 4) message = '¡Casi perfecto! Solo algunos detalles 🥰';
        else if (score >= 2) message = 'Vas bien, mi amor, pero podemos seguir conociéndonos 😊';
        else message = 'Tranquila, todavía tenemos una vida para recordar cada momento ❤️';

        resultDiv.style.display = 'block';
        resultDiv.innerHTML = `
            Acertaste ${score} de ${total} preguntas.
            <span>${message}</span>
        `;
        resultDiv.scrollIntoView({ behavior: 'smooth' });
    });

    // ========== NUEVAS FUNCIONES ==========

    // ---------- SISTEMA SOLAR ----------
    function buildSolarSystem() {
        // Datos de los "planetas" (personaliza con tus momentos)
        const planets = [
            { name: 'Primer mensaje', date: '15-03-2025', img: 'img/foto1.jpeg', desc: 'Ese día nos escribimos por primera vez...', angle: 0, distance: 130 },
            { name: 'Primera cita', date: '01-04-2025', img: 'img/foto2.jpeg', desc: 'Nuestra primera salida al cine.', angle: 72, distance: 160 },
            { name: 'Primer beso', date: '20-04-2025', img: 'img/foto3.jpeg', desc: 'En mi casa, jamás lo olvidaré.', angle: 144, distance: 140 },
            { name: 'Novios', date: '08-05-2025', img: 'img/foto4.jpeg', desc: 'El día que el universo nos unió.', angle: 216, distance: 170 },
            { name: 'Nuestra hija Isha', date: '...', img: 'img/foto6.jpeg', desc: 'Cuando supimos que seríamos papás.', angle: 288, distance: 150 }
        ];

        const solarSystem = document.getElementById('solar-system');
        // Añadir órbitas
        planets.forEach(p => {
            const orbit = document.createElement('div');
            orbit.className = 'orbit';
            orbit.style.width = (p.distance * 2) + 'px';
            orbit.style.height = (p.distance * 2) + 'px';
            solarSystem.appendChild(orbit);
        });

        // Añadir planetas
        planets.forEach(p => {
            const planet = document.createElement('div');
            planet.className = 'planet';
            planet.innerHTML = '<span>' + p.name.charAt(0) + '</span>'; // inicial
            planet.setAttribute('data-name', p.name);
            planet.setAttribute('data-date', p.date);
            planet.setAttribute('data-img', p.img);
            planet.setAttribute('data-desc', p.desc);
            // Posición mediante transform en el sistema rotatorio
            planet.style.transform = `rotate(${p.angle}deg) translateX(${p.distance}px) rotate(-${p.angle}deg)`;
            solarSystem.appendChild(planet);

            // Click → mostrar modal
            planet.addEventListener('click', (e) => {
                e.stopPropagation();
                const modal = document.getElementById('planet-modal');
                document.getElementById('planet-modal-img').src = p.img;
                document.getElementById('planet-modal-title').textContent = p.name;
                document.getElementById('planet-modal-desc').textContent = p.desc;
                document.getElementById('planet-modal-date').textContent = p.date;
                modal.classList.add('active');
            });
        });

        // Cerrar modal del planeta
        document.querySelector('.close-planet-modal').addEventListener('click', () => {
            document.getElementById('planet-modal').classList.remove('active');
        });
        document.getElementById('planet-modal').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('active');
        });
    }

    // ---------- LÍNEA DE TIEMPO ----------
    function buildTimeline() {
        const timeline = document.getElementById('timeline');
        // Datos de hitos (personaliza con tus fotos y fechas)
        const hitos = [
            { date: '15 marzo 2025', text: 'Primer mensaje', img: 'img/foto1.jpeg' },
            { date: '1 abril 2025', text: 'Primera cita', img: 'img/foto2.jpeg' },
            { date: '20 abril 2025', text: 'Nuestro primer beso', img: 'img/foto3.jpeg' },
            { date: '8 mayo 2025', text: '¡Nos hicimos novios!', img: 'img/foto4.jpeg' },
            { date: '...', text: 'Llegó Isha', img: 'img/foto6.jpeg' },
            { date: 'Hoy', text: 'Eternamente juntos', img: 'img/foto7.jpeg' }
        ];

        hitos.forEach(h => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <img src="${h.img}" alt="${h.text}">
                <p class="timeline-date">${h.date}</p>
                <p class="timeline-text">${h.text}</p>
            `;
            timeline.appendChild(item);
        });
    }

    // ---------- MURO DE NOTAS ----------
    function buildNotes() {
        const grid = document.getElementById('notes-grid');
        // Frases cortas (frente) y textos largos (reverso)
        const razones = [
            { front: 'Tu sonrisa', back: 'Ilumina hasta los días más oscuros.' },
            { front: 'Tus abrazos', back: 'Son el lugar donde quiero quedarme para siempre.' },
            { front: 'Tu fortaleza', back: 'Admiro cómo enfrentas todo con valentía.' },
            { front: 'Tu ternura', back: 'Con cada gesto me demuestras tu amor.' },
            { front: 'Ser mamá de Isha', back: 'Verte con nuestra hija es el regalo más grande.' },
            { front: 'Nuestras risas', back: 'No hay mejor sonido que nuestras carcajadas juntos.' }
        ];

        razones.forEach(r => {
            const card = document.createElement('div');
            card.className = 'note-card';
            card.innerHTML = `
                <div class="note-inner">
                    <div class="note-front">${r.front}</div>
                    <div class="note-back">${r.back}</div>
                </div>
            `;
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
            grid.appendChild(card);
        });
    }

});