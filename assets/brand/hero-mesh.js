// ===================================================================
// LVA Índices — malla del hero
// Red de nodos que se conectan, con pulsos de luz recorriendo las
// aristas, palabras del dominio apareciendo en tandas, y repulsión
// suave al pasar el mouse.
//
// No es decoración: los nodos nombran lo que hace LVA. La idea viene
// del análisis de cantor8.io (ver DESIGN_LOG.md).
// ===================================================================

(function () {
    'use strict';

    const canvas = document.querySelector('canvas.hero-mesh');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CFG = {
        cols: 9,
        rows: 5,
        jitter: 0.34,        // desorden de la grilla, en fracción de celda
        linkDist: 1.55,      // radio de conexión, en celdas
        dotMin: 1.6,
        dotMax: 3.0,
        lineWidth: 1,

        windAmp: 14,         // deriva lenta, px
        windFreq: 0.055,

        stiffness: 3.2,      // resorte de vuelta al origen
        damping: 3.6,

        mouseRadius: 165,
        mouseForce: 1300,

        flowSpeed: 0.09,     // vueltas por segundo del pulso
        flowWidth: 0.28,
        flowBase: 0.16,
        flowPeak: 0.62,

        labelCount: 4,       // cuántas palabras a la vez
        labelHold: 3.4,      // segundos visibles
        labelFade: 0.9,
        labelGap: 1.1
    };

    // Vocabulario propio de LVA: la malla se nombra a sí misma
    const WORDS = [
        'Valorización', 'Índices', 'Renta fija', 'Benchmarks',
        'Normativa', 'Compliance', 'Riesgo', 'Carteras',
        'Distribución', 'Inversión', 'Precios', 'Propuestas'
    ];

    const TEAL = '2, 169, 195';
    const TEAL_LIGHT = '102, 212, 236';

    let nodes = [];
    let links = [];
    let labels = [];
    let w = 0, h = 0, dpr = 1;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let labelTimer = 0;
    let mouse = { x: -9999, y: -9999, active: false };

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    function build() {
        const rect = canvas.getBoundingClientRect();
        w = rect.width;
        h = rect.height;
        if (!w || !h) return false;

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const cw = w / (CFG.cols - 1);
        const ch = h / (CFG.rows - 1);

        nodes = [];
        for (let r = 0; r < CFG.rows; r++) {
            for (let c = 0; c < CFG.cols; c++) {
                // Desorden determinista: la malla se ve orgánica pero no
                // cambia en cada resize, que se leería como parpadeo.
                const seed = Math.sin(r * 12.9898 + c * 78.233) * 43758.5453;
                const jx = ((seed - Math.floor(seed)) - 0.5) * CFG.jitter;
                const seed2 = Math.sin(c * 39.3468 + r * 11.135) * 24634.6345;
                const jy = ((seed2 - Math.floor(seed2)) - 0.5) * CFG.jitter;

                nodes.push({
                    ox: c * cw + jx * cw,
                    oy: r * ch + jy * ch,
                    x: 0, y: 0, vx: 0, vy: 0,
                    phase: (seed - Math.floor(seed)) * Math.PI * 2,
                    r: CFG.dotMin + (seed2 - Math.floor(seed2)) * (CFG.dotMax - CFG.dotMin)
                });
            }
        }
        nodes.forEach(n => { n.x = n.ox; n.y = n.oy; });

        const maxDist = CFG.linkDist * Math.min(cw, ch) * 1.35;
        links = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].ox - nodes[j].ox;
                const dy = nodes[i].oy - nodes[j].oy;
                if (Math.hypot(dx, dy) <= maxDist) {
                    links.push({ a: i, b: j, off: (i * 7 + j * 13) % 100 / 100 });
                }
            }
        }

        labels = [];
        labelTimer = 0;
        return true;
    }

    function spawnLabels() {
        const used = new Set(labels.map(l => l.node));
        const fresh = [];
        let guard = 0;
        while (fresh.length < CFG.labelCount && guard++ < 60) {
            const ni = Math.floor(Math.abs(Math.sin(clock * 3.7 + guard * 1.9)) * nodes.length) % nodes.length;
            const n = nodes[ni];
            if (used.has(ni) || n.ox < w * 0.34 || n.ox > w - 90) continue;
            used.add(ni);
            fresh.push({
                node: ni,
                text: WORDS[Math.floor(Math.abs(Math.sin(clock * 5.1 + guard)) * WORDS.length) % WORDS.length],
                born: clock,
                delay: fresh.length * 0.22
            });
        }
        labels = labels.concat(fresh);
    }

    function labelAlpha(l) {
        const t = clock - l.born - l.delay;
        if (t < 0) return 0;
        if (t < CFG.labelFade) return t / CFG.labelFade;
        if (t < CFG.labelFade + CFG.labelHold) return 1;
        const out = t - CFG.labelFade - CFG.labelHold;
        if (out < CFG.labelFade) return 1 - out / CFG.labelFade;
        return -1; // agotada
    }

    function step(dt) {
        clock += dt;

        for (const n of nodes) {
            // Viento: deriva lenta que hace respirar la red
            const wx = Math.sin(clock * CFG.windFreq * Math.PI * 2 + n.phase) * CFG.windAmp;
            const wy = Math.cos(clock * CFG.windFreq * Math.PI * 2 * 0.8 + n.phase) * CFG.windAmp * 0.6;
            const tx = n.ox + wx;
            const ty = n.oy + wy;

            // Resorte de vuelta al objetivo
            let ax = (tx - n.x) * CFG.stiffness;
            let ay = (ty - n.y) * CFG.stiffness;

            // Repulsión del mouse, con caída cuadrática
            if (mouse.active) {
                const dx = n.x - mouse.x;
                const dy = n.y - mouse.y;
                const d = Math.hypot(dx, dy);
                if (d < CFG.mouseRadius && d > 0.01) {
                    const f = (1 - d / CFG.mouseRadius);
                    const push = CFG.mouseForce * f * f / d;
                    ax += dx * push;
                    ay += dy * push;
                }
            }

            n.vx = (n.vx + ax * dt) * Math.exp(-CFG.damping * dt);
            n.vy = (n.vy + ay * dt) * Math.exp(-CFG.damping * dt);
            n.x += n.vx * dt;
            n.y += n.vy * dt;
        }

        labelTimer -= dt;
        if (labelTimer <= 0) {
            spawnLabels();
            labelTimer = CFG.labelHold + CFG.labelFade * 2 + CFG.labelGap;
        }
        labels = labels.filter(l => labelAlpha(l) >= 0);
    }

    // Banda de luz que viaja: alfa por posición a lo largo de la arista
    function pulseAlpha(u, phase) {
        let d = Math.abs(u - phase);
        if (d > 0.5) d = 1 - d;
        const x = Math.max(0, 1 - d / CFG.flowWidth);
        const s = x * x * (3 - 2 * x);
        return CFG.flowBase + (CFG.flowPeak - CFG.flowBase) * s;
    }

    function draw() {
        ctx.clearRect(0, 0, w, h);

        ctx.lineWidth = CFG.lineWidth;
        for (const l of links) {
            const a = nodes[l.a], b = nodes[l.b];
            const phase = (clock * CFG.flowSpeed + l.off) % 1;
            const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            for (let s = 0; s <= 4; s++) {
                const u = s / 4;
                g.addColorStop(u, 'rgba(' + TEAL + ',' + pulseAlpha(u, phase).toFixed(3) + ')');
            }
            ctx.strokeStyle = g;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
        }

        for (const n of nodes) {
            const pulse = 0.45 + 0.4 * Math.sin(clock * 0.7 + n.phase);
            ctx.fillStyle = 'rgba(' + TEAL_LIGHT + ',' + pulse.toFixed(3) + ')';
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fill();
        }

        if (labels.length) {
            ctx.font = '500 11px "Roboto Mono", monospace';
            ctx.textBaseline = 'middle';
            for (const l of labels) {
                const a = labelAlpha(l);
                if (a <= 0) continue;
                const n = nodes[l.node];
                if (!n) continue;
                ctx.fillStyle = 'rgba(' + TEAL_LIGHT + ',' + (a * 0.85).toFixed(3) + ')';
                ctx.fillText(l.text, n.x + 12, n.y);
                ctx.strokeStyle = 'rgba(' + TEAL_LIGHT + ',' + (a * 0.35).toFixed(3) + ')';
                ctx.beginPath();
                ctx.moveTo(n.x + 4, n.y);
                ctx.lineTo(n.x + 9, n.y);
                ctx.stroke();
            }
        }
    }

    function frame(ts) {
        const dt = Math.min((ts - last) / 1000, 0.05);
        last = ts;
        step(dt);
        draw();
        raf = requestAnimationFrame(frame);
    }

    function start() {
        if (raf || reduced.matches) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
    }

    function stop() {
        if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }

    function init() {
        if (!build()) return;
        // Primer cuadro sincrónico: el hero nunca se ve vacío, ni siquiera
        // antes de que arranque el bucle.
        step(0);
        draw();
        if (reduced.matches) return;
        start();
    }

    // El canvas no recibe eventos (queda bajo el contenido del hero), así que
    // se escucha en la sección y se traducen las coordenadas.
    const surface = canvas.closest('.hero') || canvas.parentElement;
    surface.addEventListener('pointermove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
        mouse.active = true;
    });
    surface.addEventListener('pointerleave', () => { mouse.active = false; });

    let resizeT = 0;
    window.addEventListener('resize', () => {
        clearTimeout(resizeT);
        resizeT = setTimeout(() => { build(); draw(); }, 180);
    });

    // No gastar CPU con el hero fuera de pantalla o la pestaña en segundo plano
    document.addEventListener('visibilitychange', () => {
        document.hidden ? stop() : start();
    });

    if ('IntersectionObserver' in window) {
        new IntersectionObserver(es => {
            es.forEach(e => e.isIntersecting ? start() : stop());
        }, { threshold: 0 }).observe(canvas);
    }

    reduced.addEventListener('change', () => {
        if (reduced.matches) { stop(); draw(); } else { start(); }
    });

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(init);
    } else {
        init();
    }
})();
