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
                // Iniciar nieve y contador después de mostrar el contenido
                initSnow();
                startCounter();
            }, 1000);
        }, 3000); // 3 segundos de carga romántica
    });

    // ---------- NIEVE ----------
    function initSnow() {
        const canvas = document.getElementById('snow-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const snowflakes = [];
        const maxFlakes = 80; // más copos = más intensidad

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
        // ⚠️ Fecha exacta de novios (8 de mayo de 2025)
        const anniversary = new Date('2025-05-08T00:00:00');
        const counterText = document.getElementById('counter-text');

        function updateCounter() {
            const now = new Date();
            let diff = now - anniversary; // milisegundos

            if (diff < 0) {
                counterText.innerHTML = '¡El gran día aún no llega!';
                return;
            }

            // Cálculos manuales para años, meses, días, horas, minutos, segundos
            let seconds = Math.floor(diff / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours = Math.floor(minutes / 60);
            let days = Math.floor(hours / 24);

            // Aproximación de años y meses (considerando meses de 30.4375 días)
            const monthsTotal = Math.floor(days / 30.4375);
            const years = Math.floor(monthsTotal / 12);
            const months = monthsTotal % 12;

            // Días restantes después de contar años y meses completos
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
            // Generar corazoncitos voladores
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
    // Función para normalizar texto (quitar tildes, minúsculas, espacios extra)
    function normalize(str) {
        return str
            .trim()
            .toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
            .replace(/[^a-z0-9\s-]/g, '') // eliminar caracteres especiales
            .replace(/\s+/g, ' '); // espacios múltiples a uno
    }

    // Respuestas correctas (normalizadas)
    const correctAnswers = {
        q1: 'isha',
        q2: 'the maze runner prueba de fuego', // para validación flexible
        q3: 'una ida a cine',
        q4: 'turquesa',       // valor del select
        q5: 'mi casa',
        q6: '2025-05-08'      // formato del input date
    };

    const quizForm = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('quiz-result');

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let score = 0;

        // Pregunta 1: exacta normalizada
        if (normalize(document.getElementById('q1').value) === normalize(correctAnswers.q1)) score++;

        // Pregunta 2: flexible, debe contener "maze runner" y "prueba de fuego"
        const answer2 = normalize(document.getElementById('q2').value);
        if (answer2.includes('maze runner') && answer2.includes('prueba de fuego')) score++;

        // Pregunta 3: exacta normalizada
        if (normalize(document.getElementById('q3').value) === normalize(correctAnswers.q3)) score++;

        // Pregunta 4: del select
        if (document.getElementById('q4').value === correctAnswers.q4) score++;

        // Pregunta 5: exacta normalizada
        if (normalize(document.getElementById('q5').value) === normalize(correctAnswers.q5)) score++;

        // Pregunta 6: input date, valor directo
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

});