// ===================================================================
// LVA Índices — motivos generativos y acordeón de Soluciones
//
// Portado de "LVA Sitio V5 - Generativa.dc.html" (Claude Design).
// Dos motivos animados que ilustran "data" sin representar series
// reales:
//   hero  — cordillera en retícula de perspectiva sobre el navy
//   datos — nube de puntos sobre dos curvas, recorrida por un frente
// Ambos se siembran al azar en cada carga, así que el dibujo nunca es
// exactamente el mismo.
// ===================================================================

(function () {
    'use strict';

    // ---------- utilidades de ruido ----------
    function mulberry(seed) {
        return function () {
            seed |= 0; seed = seed + 0x6D2B79F5 | 0;
            let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    const CURVAS = [
        [0.753, 0.720, 0.585, 0.420, 0.348, 0.296, 0.250, 0.205, 0.170, 0.149],
        [0.851, 0.836, 0.750, 0.640, 0.590, 0.545, 0.510, 0.487, 0.470, 0.461]
    ];

    function sampleCurve(pts, u) {
        const n = pts.length - 1, fp = u * n, i = Math.min(n - 1, Math.floor(fp)), t = fp - i;
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(n, i + 2)];
        const t2 = t * t, t3 = t2 * t;
        return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3);
    }

    function hash2(x, y, s) {
        const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453;
        return n - Math.floor(n);
    }

    function vnoise(x, y, s) {
        const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
        const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
        const a = hash2(xi, yi, s), b = hash2(xi + 1, yi, s);
        const c = hash2(xi, yi + 1, s), d = hash2(xi + 1, yi + 1, s);
        return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
    }

    function ridged(x, y, s) {
        let sum = 0, amp = 0.55, fx = x, fy = y, norm = 0;
        for (let o = 0; o < 5; o++) {
            const n = 1 - Math.abs(vnoise(fx, fy, s + o * 13) * 2 - 1);
            sum += Math.pow(n, 1.7) * amp; norm += amp;
            amp *= 0.52; fx *= 2.03; fy *= 2.03;
        }
        return sum / norm;
    }

    // ---------- el motivo ----------
    class Field {
        constructor(canvas, mode, seed) {
            this.c = canvas; this.mode = mode; this.rnd = mulberry(seed);
            // data-soft: variante atenuada y mas estirada en horizontal, para la
            // pantalla de acceso, donde el dibujo va detras de un formulario.
            this.soft = canvas.hasAttribute('data-soft');
            this.ctx = canvas.getContext('2d');
            this.t = 0; this.acc = 0; this.visible = true;
            this.dpr = Math.min(window.devicePixelRatio || 1, 2);
            const r = this.rnd;
            this.a1 = 0.6 + r() * 1.4;
            this.a2 = 0.5 + r() * 1.6;
            this.a3 = 0.4 + r() * 1.2;
            this.dir = r() < 0.5 ? -1 : 1;
            this.off = r() * 100;
            if (mode !== 'hero') this.seedCloud();
        }

        seedCloud() {
            const r = this.rnd;
            this.pts = [];
            for (let i = 0; i < 1300; i++) {
                const band = r() < 0.56 ? 0 : 1;
                const u = (i % 26) / 26 + r() / 26;
                const base = sampleCurve(CURVAS[band], u);
                const edge = r() < 0.3;
                const depth = edge ? (r() - 0.62) * 0.05 : Math.pow(r(), 1.25) * (1 - base) * 1.02;
                this.pts.push({
                    u, band, y: base + depth, depth: Math.max(0, depth / Math.max(0.08, 1 - base)),
                    s: 0.5 + r() * 0.8, ph: r() * 6.2832, sp: 0.5 + r() * 1.2, drift: (r() - 0.5) * 0.012
                });
            }
        }

        resize() {
            const w = this.c.clientWidth, h = this.c.clientHeight;
            if (!w || !h) return false;
            this.w = w; this.h = h;
            this.c.width = Math.round(w * this.dpr);
            this.c.height = Math.round(h * this.dpr);
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
            return true;
        }

        draw(dt) {
            if (!this.w) return;
            this.acc += dt;
            const step = this.mode === 'hero' ? 50 : 18;   // ~20 / ~55 fps
            if (this.acc < step) return;
            this.t += this.acc / 1000; this.acc = 0;
            this.mode === 'hero' ? this.drawGrid() : this.drawCloud();
        }

        drawCloud() {
            const ctx = this.ctx, w = this.w, h = this.h;
            ctx.clearRect(0, 0, w, h);
            const top = h * 0.1, span = h * 0.56;
            // un frente avanza de izquierda a derecha y agranda los puntos al pasar
            const head = ((this.t * 0.09) % 1.34) - 0.17;
            for (const p of this.pts) {
                const wave = Math.sin(this.t * 0.85 * p.sp + p.u * 5.2 + p.ph);
                const swirl = Math.cos(this.t * 0.6 * p.sp - p.u * 3.7 + p.ph * 1.4);
                const spreadNow = 0.55 + 0.45 * wave;
                const px = p.u * w + (p.drift * 320 * wave + swirl * 5);
                const py = top + (p.y + p.depth * 0.3 * spreadNow * (1 - p.depth) + p.drift * 3.4 * swirl) * span;
                const near = Math.max(0, 1 - Math.abs(head - p.u) / 0.16);
                // zonas limpias: el bloque de texto arriba-izquierda y el borde superior
                const nx = px / w, ny = py / h;
                const fx = 1 - Math.min(1, Math.max(0, (nx - 0.38) / 0.34));
                const fy = 1 - Math.min(1, Math.max(0, (ny - 0.3) / 0.3));
                const keepOut = Math.min(0.72, Math.min(fx, fy) * 0.72 + Math.max(0, 1 - ny / 0.16) * 0.7);
                if (keepOut > 0.85) continue;
                const twinkle = 0.7 + 0.3 * Math.sin(this.t * 1.1 * p.sp + p.ph);
                const fade = Math.pow(1 - Math.min(1, p.depth), 0.85);
                const a = (0.32 + near * 0.4) * twinkle * (0.3 + fade * 0.7) * (1 - keepOut);
                if (a < 0.02) continue;
                ctx.fillStyle = p.band
                    ? 'rgba(2,169,195,' + (a * 0.85).toFixed(3) + ')'
                    : 'rgba(104,132,148,' + (a * 0.85).toFixed(3) + ')';
                ctx.beginPath();
                ctx.arc(px, py, Math.max(1.2, p.s * (1.9 + fade * 1.3) * (1 + near * 1.5)), 0, 6.2832);
                ctx.fill();
            }
        }

        drawGrid() {
            const ctx = this.ctx, w = this.w, h = this.h, t = this.t;
            const dark = this.mode === 'hero';
            ctx.clearRect(0, 0, w, h);
            const cols = w > 1000 ? (dark ? 96 : 130) : 70, rows = dark ? 26 : 38;
            const soft = this.soft;
            // Menos frecuencia horizontal = cumbres mas anchas, dibujo estirado.
            const fx = soft ? 4.6 : 8.4;
            // Atenuacion global de trazos.
            const dim = soft ? 0.42 : 1;
            // Cumbres mas altas. Se aplica solo al dibujar, no al 'hgt': si
            // escalara la altura misma, mas tramos superarian los umbrales
            // FLOOR y 0.3 y el dibujo se llenaria de lineas.
            const lift = soft ? 1.3 : 1;
            const horizon = h * (dark ? 0.22 : 0.34), seed = this.off;
            const drift = t * 0.035;
            const FLOOR = 0.055;                       // bajo este relieve no se dibuja nada
            const P = [];
            for (let j = 0; j <= rows; j++) {
                const vy = j / rows;
                const persp = 0.1 + Math.pow(vy, 1.85) * 1.6;
                const row = [];
                for (let i = 0; i <= cols; i++) {
                    const vx = i / cols;
                    // cordillera de borde a borde: solo cae en los extremos
                    const mass = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(vx - 0.5) * 2, 3.4)), 0.85)
                        * Math.pow(Math.max(0, 1 - Math.abs(vy - 0.56) * 1.7), 0.8);
                    const r = ridged(vx * fx + drift, vy * 3.4 - drift * 0.6, seed);
                    const hgt = Math.max(0, r - 0.26) * mass * 1.7;
                    row.push({
                        x: w * (0.5 + (vx - 0.5) * (0.78 + persp * 0.42)),
                        y: horizon + vy * (h - horizon) * (dark ? 0.88 : 0.99) - hgt * (h - horizon) * (dark ? 1.06 : 0.95) * lift * (0.35 + persp * 0.55),
                        persp, hgt
                    });
                }
                P.push(row);
            }
            const stroke = dark
                ? a => 'rgba(120,215,238,' + (a * 0.95 * dim).toFixed(3) + ')'
                : a => 'rgba(11,30,47,' + (a * dim).toFixed(3) + ')';
            // solo los tramos con relieve: la planicie desaparece
            const runs = (get, n, colorFor) => {
                let on = false;
                ctx.beginPath();
                for (let k = 0; k <= n; k++) {
                    const p = get(k);
                    if (p.hgt < FLOOR) { on = false; continue; }
                    on ? ctx.lineTo(p.x, p.y) : (ctx.moveTo(p.x, p.y), on = true);
                }
                ctx.strokeStyle = colorFor;
                ctx.stroke();
            };
            ctx.lineWidth = dark ? 0.6 : 0.55;
            for (let j = 0; j <= rows; j++) {
                const row = P[j], f2 = 0.25 + (j / rows) * 0.75;
                runs(k => row[k], cols, stroke((dark ? 0.2 : 0.16) * f2));
            }
            const vStep = dark ? 3 : 1;
            for (let i = 0; i <= cols; i += vStep) {
                runs(k => P[k][i], rows, stroke(dark ? 0.11 : 0.12));
            }
            // filo de cumbres
            ctx.lineWidth = dark ? 1 : 0.9;
            for (let j = 4; j <= rows; j += (dark ? 9 : 5)) {
                const row = P[j];
                let on = false;
                ctx.beginPath();
                for (let i = 0; i <= cols; i++) {
                    if (row[i].hgt < 0.3) { on = false; continue; }
                    on ? ctx.lineTo(row[i].x, row[i].y) : (ctx.moveTo(row[i].x, row[i].y), on = true);
                }
                ctx.strokeStyle = dark
                    ? 'rgba(47,195,227,' + (0.44 * dim).toFixed(3) + ')'
                    : 'rgba(2,169,195,' + (0.4 * dim).toFixed(3) + ')';
                ctx.stroke();
            }
        }
    }

    // ---------- arranque ----------
    function startFields() {
        const canvases = document.querySelectorAll('canvas[data-field]');
        if (!canvases.length) return;

        const seed = (Math.random() * 1e9) | 0;
        const fields = [];
        canvases.forEach((c, i) => {
            const mode = c.getAttribute('data-field');
            fields.push(new Field(c, mode, mode === 'hero' ? seed : (seed ^ 0x9e3779b9) + i));
        });

        const onResize = () => fields.forEach(f => f.resize());
        onResize();
        window.addEventListener('resize', onResize);

        // Si el canvas nace sin tamaño (fuentes cargando, panel oculto), se
        // reintenta: si no, se quedaría en blanco para siempre.
        if ('ResizeObserver' in window) {
            const ro = new ResizeObserver(() => fields.forEach(f => { if (!f.w) f.resize(); }));
            fields.forEach(f => ro.observe(f.c));
        }

        const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) { fields.forEach(f => { f.acc = 999; f.draw(0); }); return; }

        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver(entries => {
                entries.forEach(e => {
                    const f = fields.find(x => x.c === e.target);
                    if (f) f.visible = e.isIntersecting;
                });
            }, { rootMargin: '120px' });
            fields.forEach(f => io.observe(f.c));
        }

        // Un cuadro inmediato, para que nada se vea vacío antes del primer rAF
        fields.forEach(f => { f.acc = 999; f.draw(0); });

        let last = performance.now();
        const loop = now => {
            const dt = Math.min(now - last, 48); last = now;
            for (const f of fields) {
                if (!f.w) f.resize();
                if (f.visible) f.draw(dt);
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    // ---------- acordeón de Soluciones ----------
    // Exclusivo: abrir una cierra las demás, como en el prototipo.
    // Menu de areas de Soluciones. Sustituye al acordeon de "Leer mas".
    function startTabs() {
        const strip = document.querySelector('.tabs__strip');
        if (!strip) return;
        const tabs = [...strip.querySelectorAll('[role="tab"]')];
        if (!tabs.length) return;

        const select = (tab, mover) => {
            tabs.forEach(t => {
                const activa = t === tab;
                t.setAttribute('aria-selected', String(activa));
                // Solo la activa es tabulable: el patron de pestanas se recorre
                // con las flechas, no con el tabulador.
                t.tabIndex = activa ? 0 : -1;
                const panel = document.getElementById(t.getAttribute('aria-controls'));
                if (panel) panel.hidden = !activa;
            });
            if (mover) {
                tab.focus();
                // Si la tira esta desplazada en movil, trae la elegida a la vista.
                tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
            }
        };

        tabs.forEach((tab, i) => {
            tab.addEventListener('click', () => select(tab, false));
            tab.addEventListener('keydown', e => {
                const salto = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
                if (salto) {
                    e.preventDefault();
                    select(tabs[(i + salto + tabs.length) % tabs.length], true);
                } else if (e.key === 'Home') {
                    e.preventDefault(); select(tabs[0], true);
                } else if (e.key === 'End') {
                    e.preventDefault(); select(tabs[tabs.length - 1], true);
                }
            });
        });
    }

    // ---------- menú sandwich ----------
    // Solo actúa bajo 1024px; de ahí para arriba el CSS deja el menú completo
    // y este código no estorba porque el panel es display:contents.
    function startNav() {
        const toggle = document.getElementById('nav-toggle');
        const panel = document.getElementById('nav-collapse');
        if (!toggle || !panel) return;

        const mq = window.matchMedia('(max-width: 1023.98px)');

        const setOpen = open => {
            panel.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        };

        toggle.addEventListener('click', () => {
            setOpen(toggle.getAttribute('aria-expanded') !== 'true');
        });

        // Al elegir un destino el panel sobra
        panel.addEventListener('click', e => {
            if (e.target.closest('a')) setOpen(false);
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                setOpen(false);
                toggle.focus();
            }
        });

        document.addEventListener('click', e => {
            if (toggle.getAttribute('aria-expanded') !== 'true') return;
            if (!e.target.closest('.nav')) setOpen(false);
        });

        // Si se pasa a escritorio con el panel abierto, se limpia el estado:
        // si no, quedaría un aria-expanded="true" sobre un botón invisible.
        mq.addEventListener('change', () => { if (!mq.matches) setOpen(false); });
    }

    function init() { startFields(); startTabs(); startNav(); }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
