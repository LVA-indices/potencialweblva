# DESIGN_LOG — WEB LVA 2026

Bitácora de decisiones de UI/UX del rediseño del sitio corporativo.
Rama de trabajo: `PruebaUI`. **Nada de esto va a `main` sin validación humana.**

Convención: el hash de cada commit se registra en la entrada siguiente (un commit
no puede contener su propio hash).

---

## 2026-07-31 — Sesión 1: importación del design system de marca

### Qué se hizo

Se importó el design system de marca LVA desde el proyecto Claude Design
`25b04638-8408-49f8-b987-db6f2fabbd15` y se aplicó a todo el sitio.
Solo se tomaron los archivos de **branding** (colores, tipografía, logos,
lineamientos). No se usaron `ui_kits/elevest` ni `ui_kits/internal-docs`;
`ui_kits/web` se usó únicamente como referencia de patrones.

**1. Base de marca incorporada al repo**
- `assets/brand/tokens.css` — adaptación de `colors_and_type.css` del design
  system. Es la **fuente de verdad** de color y tipografía del sitio.
- `assets/brand/logos/` — los 4 variantes oficiales (`color`, `color-on-dark`,
  `white`, `mono`).

**2. Color: el sitio pasó de su paleta propia a la paleta LVA**

| Antes | Ahora | Nota |
|---|---|---|
| Cian `#00CAE9` | Teal 600 `#02A9C3` | primario de marca |
| Lima `#DDFF0D` | Teal 400/500 | el lima no existe en la marca |
| Navy `#0A1628` / `#0F2137` | Ink 900 `#1F1F21` | superficies oscuras |
| Grises Tailwind (`#111827`, `#6B7280`…) | Escala `ink` de marca | |
| Ámbar/índigo/verde de los iconos de área | Serie de gráfico oficial (`chart-1/3/4/5`) | mismos matices, ya en paleta |

**3. Tipografía: Inter → Open Sans (familia oficial)**
- Titulares H1/H2 → Open Sans **Condensed** (800/700).
- H3/H4, eyebrows, botones, badges → Open Sans **SemiCondensed** (600).
- Cuerpo y formularios → Open Sans normal.
- Cifras (números de paso, stats) → **Roboto Mono** con `tabular-nums`.

**4. Ritmo de superficies (decisión "híbrido", validada por Andrea)**
`hero + navbar` oscuros (ink-900) → `soluciones` ink-50 → `premios` blanco →
`nosotros` ink-50 → `así funciona` blanco → `CTA final` lavado teal-100 →
`footer` ink-900.
Antes "Premios" y "Así funciona" eran oscuros; pasaron a claro para acercarse al
manual ("fondos mayoritariamente blancos") sin perder el impacto del hero.

**5. Reglas del manual aplicadas**
- **Se eliminaron los degradados** (navy, cian, cian→lima, los 4 de iconos de
  área, badges, botón de formulario, callouts, placeholder de blog). Se
  conservan solo los dos halos radiales teal del hero oscuro, como recurso de
  profundidad — ver decisión abierta #3.
- Se quitó la animación `gradientShift` del CTA final.
- **Foco visible teal de 3px** (`--focus-ring`) global sobre links, botones e
  inputs. El manual lo declara obligatorio; antes solo lo tenían los inputs.
- Radios alineados a la escala de marca (4/6/10/16).
- Motion unificado a 200ms `cubic-bezier(0.2,0,0,1)`, sin rebotes.
- `.problem-card` pasó de acento de **borde izquierdo** a borde superior: el
  manual prohíbe los acentos de borde izquierdo. Se mantiene la barra lateral en
  `blockquote` de artículos por ser convención editorial, no acento de tarjeta.

**6. Bug corregido de paso**
`--transition-normal` se usaba en las tarjetas y enlaces del blog pero **nunca
estaba definida**, así que esas transiciones no corrían. Quedó definida en el
mapa de tokens.

### Archivos afectados
- `assets/brand/tokens.css` *(nuevo)*
- `assets/brand/logos/lva-logo-{color,color-on-dark,white,mono}.svg` *(nuevos)*
- `DESIGN_LOG.md` *(nuevo)*
- `styles.css` — `:root` remapeado a tokens de marca + ~40 bloques de reglas
- `index.html` — `<head>` (fuentes + tokens), 4 iconos de área, 4 `stroke` inline
- `blog.html` — `<head>`
- `blog/ejemplo-articulo.html` — `<head>`

### Verificación
Servido en local y auditado por DOM (no solo a ojo):
- Fondos de sección resuelven a los tokens esperados (hero `rgb(31,31,33)`,
  CTA final `rgb(229,247,251)`, footer `rgb(31,31,33)`).
- `font-stretch` resuelve a 75% (Condensed) y 87.5% (SemiCondensed).
- Botones, tabs, badges, iconos de área y pasos: todos en tokens `--lva-*`.
- Sin errores de consola.
- Sin restos de `#00CAE9`, `#DDFF0D`, `#0A1628` ni `#0F2137` en el código
  (solo quedan citados en comentarios de documentación).

### Commit asociado
`Aplica design system de marca LVA (colores, tipografía Open Sans, logos) al sitio`

---

## Decisiones abiertas — requieren validación humana

**1. ⚠️ Contraste de los botones primarios (accesibilidad)**
El design system define `--fg-on-brand: #FFFFFF` y el kit `ui_kits/web` usa
texto blanco sobre `#02A9C3`. Se implementó así, **fiel al manual**, pero ese par
da un contraste de **2,81:1**, bajo el mínimo WCAG AA (4,5:1 para texto normal).
Afecta a: "Agenda una Demo", "Acceso Clientes", "Agenda tu Demo" (CTA final),
botón de envío del formulario, badges de producto y números de paso.

Alternativas, ambas dentro de la paleta de marca:
- Rellenar los botones con **Teal 700 `#017A8C`** y dejar Teal 600 para hover y
  acentos → **5,04:1**, cumple AA. Es el cambio menor y casi no se nota.
- Mantener Teal 600 con **texto Ink 900** → 5,85:1, pero se aleja del look del kit.

Medidas del resto (todas cumplen): ink-800/blanco 10,31 · ink-600/blanco 5,10 ·
teal-700/teal-100 4,57 · teal-400/ink-900 9,55.

**2. Logotipo en superficies claras**
El sitio sigue usando `assets/logo_lva.svg` (variante sobre oscuro) en la navbar
y el footer, que son oscuros — correcto. Pero ya están disponibles en
`assets/brand/logos/` las variantes `color` y `mono` por si en alguna página o
sección clara se necesita el logo; hoy ninguna lo usa.

**3. Halos radiales del hero**
El manual dice "sin degradados ni texturas". Se conservaron los dos halos teal
del hero oscuro porque son su único recurso de profundidad y el propio kit de
marketing de marca usa un lavado degradado en su hero. Si se quiere ortodoxia
total, se eliminan y el hero queda ink-900 plano.

**4. Tipografía: Google Fonts en vez de las 36 TTF oficiales**
El design system trae 36 archivos TTF de Open Sans. Se optó por servir la
**variable de Open Sans desde Google Fonts** (eje `wdth` 75–100, que entrega
exactamente Condensed y SemiCondensed) en lugar de auto-hospedar ~36 archivos.
Es la misma tipografía y el sitio ya cargaba desde Google Fonts.
`tokens.css` deja `'Open Sans Condensed'` y `'Open Sans SemiCondensed'` primeras
en el stack: si LVA auto-hospeda las TTF oficiales más adelante, toman
precedencia solas, sin tocar CSS. Confirmar si para un sitio corporativo se
prefiere auto-hospedar (privacidad / sin dependencia de terceros).

**5. Voz del sitio: `tú` vs `usted`**
El manual de marca es explícito: dirigirse al cliente de **usted**, nunca de
`tú`, y sin signos de exclamación en UI. El sitio actual está íntegramente en
`tú` ("Agenda tu Demo", "Soluciones que impulsan tu negocio", "Cuéntanos cómo
podemos ayudarte"). **No se tocó ni una palabra**: es un cambio de copy, no de
UI, y afecta a todo el sitio. Requiere tu decisión antes de ejecutarlo.

**6. CSS muerto**
`styles.css` conserva reglas de secciones que ya no existen en el HTML
(`.problem`, `.testimonials`, `.social-proof`, `.client-tabs`, `.product-grid`
antiguo). Se remaparon a tokens de marca por consistencia, pero conviene
decidir si se eliminan.
