# DESIGN_LOG — WEB LVA 2026

Bitácora de decisiones de UI/UX del rediseño del sitio corporativo.
Rama de trabajo: `PruebaUI`. **Nada de esto va a `main` sin validación humana.**

Convención: el hash de cada commit se registra en la entrada siguiente (un commit
no puede contener su propio hash).

---

## 2026-07-31 — Sesión 3: navy dominante y malla viva

Hash de la sesión 2: **`6071d0d`**.

### Investigación previa: cantor8.io y guardbase.ai

Se analizaron ambos sitios **leyendo su código**, no solo mirándolos. Deja
constancia porque las decisiones de abajo salen de ahí.

**cantor8.io**
- Un solo azul `#044AB3` en 339 elementos, más negro `#151515`. **Sin grises de
  andamiaje**: no hay estructura neutra visible. Eso es lo que evita que parezca
  template.
- PP Neue Montreal + Fragment Mono. El mono aparece 20 veces: quirúrgico.
- **H1 en peso 400**, 43px, interlínea 1.0. La contención lee como seriedad.
- Hero: canvas 2D (el archivo se llama `webgl-circle` pero no usa WebGL ni
  shaders). Parámetros reales: 130 puntos en círculo, conexiones curvas con
  resorte (rigidez 12, amortiguación 4.8), rotación global 0.055, viento de
  52px a 0.16 Hz, pulsos de luz por cada arista con degradado de 5 paradas y
  `smoothstep` (alfa 0.14→0.58), mouse con radio 155px e impulso 3900.
- Y lo decisivo: **etiquetas con sus palabras de dominio** (Custody, Issuance,
  Yield, Settlement…) apareciendo en tandas de 5, escalonadas, en mono 10.7px.
  La abstracción no decora: nombra lo que hacen.
- Pausa el bucle fuera de viewport y con la pestaña oculta.

**guardbase.ai**
- Casi negro `#0E1114`, superficie `#15191E`, un acento menta `#5EEAD4`.
- Satoshi + DM Mono, con el mono en 80 nodos (~35% del texto).
- H1 en peso 500, tracking −0.03em. Frases clave encajadas en cajas con borde
  de un pelo: destacan sin usar color.
- **Cero librerías JS.** El hero es SVG con SMIL: cada paquete es un `<rect>`
  de 12×12 movido por `<animateMotion>` + `<mpath>` sobre rutas bezier;
  duraciones 5/5.6/6.4s con arranques escalonados. Un `<animate>` sobre `fill`
  **cambia el color del paquete a mitad de camino** (keyTimes 0.46→0.54), justo
  al pasar por el nodo central: gris → menta (permitido), gris → amarillo
  (redactado). Un tercer paquete usa `keyPoints="0;0.38;0.38;1"` y **se detiene**
  a mitad de ruta, esperando aprobación. La animación es el producto explicado.
- Trama diagonal 8×8 rotada 135° con líneas al 7%.

**Denominador común:** un color posee la página · el mono es voz estructural ·
display en peso bajo · la animación explica el negocio.

### Decisiones tomadas

**1. Un color posee la página**
Se eliminó la alternancia claro/oscuro: el navy es el sitio de punta a punta,
incluidos blog y artículo. Las secciones ya no se separan cambiando de fondo
sino con filetes (`--site-border`) y superficies elevadas
(`--site-bg-card` para tarjetas, `--lva-navy-950` para el footer). Única
excepción: el CTA final, un lavado teal al 10%.

Se añadió una capa de tokens de sitio (`--site-bg*`, `--site-fg*`,
`--site-border*`) sobre los de marca, y los alias heredados de gris resuelven
contra ella. Eso evitó reescribir regla por regla.

**2. Pesos tipográficos abajo**
Siguiendo a Cantor8 (400) y Guardbase (500): el bold grande es el delator de lo
marketero. H1 y H2 pasaron de 800 a **500** y ganaron tamaño
(`clamp(2.6rem, 5.6vw, 4.25rem)` en el hero). Los claims de tarjeta y pestaña
bajaron de 700 a 600. Interlínea del hero a 1.02.

**3. La malla del hero pasa a canvas y se nombra**
`assets/brand/hero-mesh.js` reemplaza al SVG animado. Ahora tiene lo que le
faltaba para dejar de ser textura:
- **Palabras de LVA sobre los nodos** — Valorización, Índices, Renta fija,
  Benchmarks, Normativa, Compliance, Riesgo, Carteras, Distribución, Inversión,
  Precios, Propuestas — en tandas de 4, escalonadas 0.22s, con entrada y salida
  de 0.9s. Vocabulario que ya existe: **no se inventó copy**.
- **Repulsión del mouse**: radio 165px, fuerza 1300 con caída cuadrática y
  retorno por resorte (rigidez 3.2, amortiguación 3.6).
- **Viento**: deriva de 14px a 0.055 Hz, desfasada por nodo.
- **Pulsos por arista** con degradado y `smoothstep`, alfa 0.16→0.62.
- Grilla jitterada de 9×5 con desorden **determinista** (`sin` como semilla):
  se ve orgánica pero no cambia en cada resize, que se leería como parpadeo.
- Pausa con `IntersectionObserver` y `visibilitychange`; con
  `prefers-reduced-motion` dibuja un solo cuadro y no arranca el bucle.
- Dibuja el **primer cuadro de forma síncrona**: el hero nunca aparece vacío.

Las etiquetas se restringen a la mitad derecha del hero para no cruzarse con el
titular, igual que la máscara diagonal del canvas.

### Archivos afectados
- `assets/brand/hero-mesh.js` *(nuevo)*
- `index.html` — el SVG inline pasa a `<canvas>`; carga del script
- `styles.css` — capa de tokens de sitio, navy dominante, pesos, reglas del canvas
- `DESIGN_LOG.md`

### Verificación
- Navy continuo confirmado por estilos computados en las siete secciones.
- Canvas dibujando: 3,2% de píxeles con contenido, alfa máximo 248.
- H1 en peso 500. 21 plegables siguen funcionando.
- Contraste WCAG AA recorriendo cada nodo de texto visible en las cuatro
  pestañas **y con el modal abierto**: 0 fallos en index, blog y artículo.
- Sin errores de consola.

**Lo que NO se pudo verificar:** el panel de preview reporta
`document.hidden = true` y por eso `requestAnimationFrame` nunca dispara. La
animación, las etiquetas en tandas y la repulsión del mouse están verificadas
estructuralmente (el canvas dibuja su primer cuadro, sin errores), pero **no
observadas en movimiento**. Hay que mirarlas en un navegador real.

**Bug encontrado y corregido:** un reemplazo masivo de `color:` alcanzó también
a `background-color:` y dejó el menú móvil blanco sobre blanco. Lo detectó la
auditoría de contraste, no la vista.

### Commit asociado
`Navy dominante y malla del hero en canvas, con palabras de LVA y mouse`

---

## 2026-07-31 — Sesión 2: navy, Manrope y textura de datos en el hero

Hash de la sesión 1: **`d12ceaf`**.

### Contexto
Se propusieron dos direcciones de web corporativa moderna: "Terminal de datos"
(navy dominante, Space Grotesk) e "Institucional moderno" (claro con anclas
navy, Manrope). Andrea eligió el **look de la Opción A aplicado solo al hero**,
con **Manrope** como tipografía. El resto del sitio se mantiene claro, es decir
se conserva el ritmo híbrido de la sesión 1 con el navy nuevo.

Nota de proceso: primero se implementó el sitio oscuro completo por una mala
lectura del encargo, y se revirtió antes de commitear. No quedó rastro en el
historial.

### Decisiones tomadas

**1. Navy corporativo — extensión de paleta (el manual no tiene navy)**
| Token | Hex | Uso |
|---|---|---|
| `--lva-navy-950` | `#081726` | footer |
| `--lva-navy-900` | `#0A1C2E` | hero, navbar, heros de blog y artículo |
| `--lva-navy-800` | `#0F2637` | superficies elevadas sobre navy |
| `--lva-navy-700` | `#17334A` | bordes fuertes sobre navy |

Están en el mismo rango de matiz que el teal (~205°), para que `#02A9C3` se
vea encendido encima. El navy anterior del sitio (`#0A1628`) tiraba al
azul-violeta y apagaba el cian. Reemplaza a `ink-900` en todas las superficies
oscuras; los titulares sobre fondo claro también pasaron a navy-900, que ata
mejor la paleta que el casi-negro `ink-900`.

**2. Manrope en titulares, reemplaza a Open Sans Condensed**
Open Sans Condensed es una cara utilitaria, angosta por economía de espacio y
no por diseño; no lee como marca tecnológica. Manrope es geométrica moderna y
su `800` aguanta titulares grandes. **El cuerpo, la UI y los botones siguen en
Open Sans**, que es lo que mantiene el vínculo con la marca; Roboto Mono sigue
en las cifras. Manrope no tiene eje de ancho, así que los tokens
`--width-display*` pasaron a `normal` y se eliminaron las 7 declaraciones de
`font-stretch`, que ya no significaban nada. Tracking negativo (−0.035em en el
titular del hero, −0.03em display, −0.015em subtítulos), que es lo que Manrope
pide para no verse suelta en tamaños grandes.

**3. Hero: malla de datos animada**
SVG **inline** en `index.html` (inline y no archivo externo, porque así el CSS
de la página puede animarlo). Malla geométrica triangulada: 45 nodos sobre una
grilla jitterada, unidos por aristas horizontales, verticales y diagonales en
ambos sentidos, sobre una retícula tipo mapa muy tenue. La idea es "unir puntos
y conectar ideas", **sin cifras, ejes ni curvas de mercado**: es textura, no
ilustración de datos financieros.

Animación "neuronal", toda muy lenta y de bajo contraste:
- **Nodos que se encienden** — `fill-opacity` 0.22 ↔ 0.85, ciclo de 9 s
  repartido en seis grupos de desfase, para que la red nunca late al unísono.
- **Seis hubs** más brillantes, ciclo de 11 s, con su propio desfase.
- **Destellos que recorren la red** — un tramo corto de luz viaja por seis
  caminos (`stroke-dasharray` + `stroke-dashoffset`), 15–26 s cada uno. Como
  los caminos tienen largos distintos, el recorrido se desincroniza solo.

Máscara diagonal que la desvanece sobre el titular. Bajo 768px baja a
`opacity .5` y la máscara pasa a vertical. **Se congela entera con
`prefers-reduced-motion`**: es decorativa.

**4. Ritmo de superficies (híbrido, con navy)**

| Sección | Fondo |
|---|---|
| navbar (translúcido) · hero | navy-900 + malla |
| soluciones | ink-50 |
| premios | blanco |
| nosotros | ink-50 |
| así funciona | blanco |
| CTA final | lavado teal-100 |
| footer | navy-950 |

Blog y artículo: hero navy-900, contenido claro.

**5. Contraste: resuelto**
El pendiente #1 de la sesión 1 queda cerrado. `--fg-on-brand` pasó de blanco a
navy profundo `#04222E`: sobre teal-600 da **9,1:1** en vez de 2,81:1.

Además apareció un fallo que la sesión 1 no había detectado: el teal-600 **como
texto sobre fondo claro** da 2,67:1. Afectaba a `.about-tagline`, `.btn-link`,
`.group-label` y `.blog-card-link`. Todos pasaron a teal-700 (4,83:1), que es el
mismo color de marca.

Se auditaron las tres páginas recorriendo cada nodo de texto visible,
calculando su fondo efectivo y su ratio WCAG contra el umbral que le
corresponde por tamaño y peso: **0 fallos en index, blog y artículo.**

**6. Jerarquía de lectura invertida en todo el sitio**
El problema: cada bloque abría con el nombre de la categoría en bold y dejaba la
promesa como texto secundario. Se lee primero lo que menos dice.

Se invirtió el peso visual, **sin tocar una sola palabra ni cambiar el orden del
DOM** — solo tipografía:

| Bloque | Antes (título) | Ahora etiqueta ▸ claim |
|---|---|---|
| Pestaña de solución | "Distribución & Comercialización" en bold 17px | etiqueta mono 11px ▸ **"Tu equipo comercial, potenciado"** en Manrope 17/700 |
| Cabecera de área | ídem, 28px | etiqueta mono ▸ la promesa completa en Manrope 800, hasta 1.6rem |
| Tarjeta de producto | píldora teal a la derecha | etiqueta mono con guion teal, arriba ▸ la promesa como titular |
| Tarjeta de premio | "Premio Salmón" 24px | etiqueta mono ▸ **"El referente de fondos mutuos en Chile"** 24/800 |

Las etiquetas van en **Roboto Mono, mayúsculas, 10–11px, tracking 0.15em**. El
mono es lo que aporta el carácter técnico sin necesidad de copy nuevo.

Ojo: el bloque responsive de ≤768px volvía a invertir la jerarquía con sus
propios `font-size`. Estaba corregido pero conviene recordarlo si se tocan esos
tamaños.

**7. Detalle plegable ("Saber más") — no se borró texto**
Las descripciones largas se recortan a 2 líneas (4 en "Nosotros") y el resto
queda tras un "Saber más +". **Mejora progresiva**: sin JS se ve el texto
completo; el recorte y el botón los agrega `script.js`.

- Solo se pliega lo que realmente se desborda: se mide alto real vs. recortado.
  De 22 candidatos quedaron 21 plegables; uno cabía en dos líneas y se dejó.
- Los tres párrafos de "Nosotros" se agrupan en un contenedor para que haya un
  botón y no tres.
- Se mide después de `document.fonts.ready`: medir antes daría los altos de la
  fuente de respaldo.
- Los paneles de pestañas arrancan ocultos y no se pueden medir, así que se
  inicializan al abrirse. **Se mide de forma síncrona a propósito**:
  `requestAnimationFrame` e `IntersectionObserver` no corren en pestañas de
  fondo y dejaban paneles sin inicializar.
- Accesible: `aria-expanded` + `aria-controls` sobre el párrafo.

**8. Retícula de fondo en las secciones claras**
Eco de la malla del hero a 72px, en teal al 5%. Al límite de lo perceptible;
aporta el aire técnico sin ensuciar la lectura.

### Archivos afectados
- `assets/brand/tokens.css` — navy, Manrope, `--fg-on-brand`
- `index.html` — SVG de la malla inline en el hero, fuentes
- `styles.css` — navy, Manrope, malla animada, jerarquía invertida, plegables,
  retícula, correcciones de contraste
- `script.js` — plegables "Saber más"
- `blog.html`, `blog/ejemplo-articulo.html` — fuentes
- `DESIGN_LOG.md`

### Verificación
Servido en local y auditado por DOM:
- Las tres fuentes cargan (`Manrope`, `Open Sans`, `Roboto Mono`).
- Malla: 45 nodos, 6 destellos, las tres animaciones activas.
- Jerarquía invertida confirmada por estilos computados: etiqueta mono 10–11px
  vs. claim Manrope 16–19px/700–800.
- Plegables: 21 botones tras recorrer las cuatro pestañas, 0 textos recortados
  sin su botón; abrir y cerrar devuelve el alto original y el texto queda
  íntegro.
- Contraste WCAG AA recorriendo cada nodo de texto visible en las cuatro
  pestañas: **0 fallos**. Sin errores de consola.

El panel de preview quedó fijo en 767px, así que el layout desktop se comprobó
por medidas del DOM y no por captura — **vale la pena que mires el hero en
pantalla ancha**, que es donde la malla se ve como fue diseñada.

### Commit asociado
`Hero animado, navy y Manrope; invierte la jerarquía de lectura del sitio`

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

**1. ✅ Contraste de los botones — RESUELTO en la sesión 2**
`--fg-on-brand` pasó a navy profundo `#04222E` (9,1:1 sobre teal-600). Las tres
páginas pasan la auditoría WCAG AA completa, sin excepciones.

**2. Logotipo y desviaciones frente al manual**
Tres puntos donde el sitio ya no sigue el manual al pie de la letra, todos
aprobados y anotados en `assets/brand/tokens.css`: navy como extensión de
paleta, Manrope en titulares, y texto navy sobre teal. **Vale la pena
devolverlos al design system de marca** para que el manual y el sitio no
diverjan — hoy la fuente de verdad del proyecto Claude Design sigue diciendo
Open Sans Condensed, blanco sobre teal y sin navy.

Aparte: las variantes `color` y `mono` del logo están en `assets/brand/logos/`
pero ninguna se usa, porque ya no hay superficies claras. Se conservan por si
aparece una (una landing, un PDF, una firma de correo).

**3. Halos radiales del hero**
El manual dice "sin degradados ni texturas". Se conservaron los dos halos teal
del hero porque son su único recurso de profundidad y el propio kit de
marketing de marca usa un lavado degradado en su hero. Si se quiere ortodoxia
total, se eliminan y el hero queda navy plano.

**4. Tipografía servida desde Google Fonts**
Manrope, Open Sans y Roboto Mono se cargan desde Google Fonts. Para un sitio
corporativo puede convenir auto-hospedarlas: quita una dependencia de terceros
y evita el envío de IP de los visitantes a Google, que en Europa ya ha dado
problemas de RGPD. Es media hora de trabajo y no cambia nada visual.

**9. Pendiente de la investigación: el recorrido del dato**
La cuarta idea del análisis quedó sin construir. "Así funciona LVA" son tres
pasos que ya describen un flujo (dato crudo → LVA → dato utilizable), y con la
técnica de Guardbase (`animateMotion` + cambio de `fill` a mitad de ruta) se
puede contar en tres segundos y sin JavaScript. Es el siguiente bloque natural.

**10. La tarjeta del hero**
El hero mantiene la tarjeta de "buzz words" heredada (Morningstar, estándar de
la industria, las cuatro áreas). La maqueta de la Opción A tenía en su lugar una
tarjeta de datos con cifras en mono. Con el hero ya en navy y con textura, esa
tarjeta es lo único que quedó del diseño anterior y se nota. Cambiarla es una
decisión de **contenido**, no de CSS: hay que saber qué cifras se pueden
mostrar y de dónde salen.

**6. La malla en pantalla ancha**
Diseñada para 1440px y verificada por DOM, pero solo vista en un panel de
767px. Revisar en desktop real: si la textura queda muy tenue o muy marcada, se
ajusta con `opacity` en `.hero::before` — un solo valor.

**7. Voz del sitio: `tú` vs `usted`**
El manual de marca es explícito: dirigirse al cliente de **usted**, nunca de
`tú`, y sin signos de exclamación en UI. El sitio actual está íntegramente en
`tú` ("Agenda tu Demo", "Soluciones que impulsan tu negocio", "Cuéntanos cómo
podemos ayudarte"). **No se tocó ni una palabra**: es un cambio de copy, no de
UI, y afecta a todo el sitio. Requiere tu decisión antes de ejecutarlo.

**8. CSS muerto**
`styles.css` conserva reglas de secciones que ya no existen en el HTML
(`.problem`, `.testimonials`, `.social-proof`, `.client-tabs`, `.product-grid`
antiguo). Se remaparon a tokens de marca por consistencia, pero conviene
decidir si se eliminan.
