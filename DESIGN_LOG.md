# DESIGN_LOG — WEB LVA 2026

Bitácora de decisiones de UI/UX del rediseño del sitio corporativo.
Rama de trabajo: `PruebaUI`. **Nada de esto va a `main` sin validación humana.**

**Fuente del copy:** el brief original vive en Google Docs —
`docs.google.com/document/d/1cZCwskW_5wTKijLPJr--zDi-x3ZTCtVtmjN9dSmGYEI`—.
Es la referencia contra la que se contrasta cualquier texto del sitio antes de
cambiarlo. No está versionado junto al código: si el documento se edita, el
sitio y el brief pueden separarse sin que nada lo avise.

Convención: el hash de cada commit se registra en la entrada siguiente (un commit
no puede contener su propio hash).

---

## 2026-09-01 — Sesión 5: el hover de los enlaces deja de subrayar

Hash de la sesión 4: **`ba7cbce`**.

### Qué cambió

En escritorio los enlaces se subrayaban al pasar el mouse. Andrea pidió que en
vez de la línea cambien de tonalidad. El subrayado venía de una única regla
global heredada de la V5 (`a:hover { text-decoration: underline }`), que se
aplicaba también sobre reglas que solo definían color —el menú, por ejemplo,
fijaba su color de hover pero heredaba la línea igual.

Como el nav no tiene estado claro (vive siempre sobre el navy del bloque
superior), **todos** los enlaces del sitio están sobre fondo oscuro. Eso deja
dos familias, y cada una vira en la dirección contraria para que el cambio se
note:

| En reposo | Al pasar el mouse | Contraste sobre navy |
|---|---|---|
| Menú y enlaces del footer, gris `#C4D2DA` | turquesa `#2FC3E3` | 10.94 → 8.09 |
| Acceso Clientes y LinkedIn, turquesa `#2FC3E3` | claro `#F4EFE6` | 8.09 → 14.78 |

Los que ya son turquesa en reposo no podían virar al turquesa: no se vería nada.
Por eso van al claro, que además es el color que ya tenían antes de este cambio.

Se añadió `transition: color 0.18s ease` en `a` para que el cambio de tono se
lea como intencional y no como un salto.

### Los cuatro "Leer más" a la misma altura

El párrafo de Riesgo ocupa una línea más que los otros tres —tiene las cifras
que se devolvieron del brief—, así que su "Leer más" caía más abajo y los
cuatro quedaban desalineados. El `min-height: 5.1em` del párrafo cubría tres
líneas y Riesgo se pasaba.

**Primer intento, descartado:** columna en flex con `margin-top: auto` en el
botón. Alinea perfecto en reposo, pero al desplegar una tarjeta las otras tres
se estiran a la altura de la abierta y su "Leer más" cae **1.112 px** por debajo
de su propio párrafo. Se midió y se revirtió.

**Solución:** `grid-template-rows: subgrid` en `.area`. Cada tarjeta hereda las
filas de la grilla madre, así etiqueta, promesa, párrafo y botón se alinean
entre columnas sin encadenar las alturas totales. El detalle desplegable ocupa
una quinta fila que crece sola.

Dos consecuencias del subgrid que hubo que resolver:

1. El `row-gap` de la grilla madre se aplicaría **dentro** de cada tarjeta,
   separando etiqueta de promesa. Se puso en `0` y la separación entre filas de
   tarjetas pasó a `padding-bottom` en `.area`.
2. Ese relleno dejaba 46 px de aire sobrante bajo la última fila. Se cancela con
   un `margin-bottom` negativo del mismo valor en `.areas`.

Medido en 1440, 1024, 768 y 390: alineados en todas las filas y en ambos
estados (cerrado y con Riesgo abierto), hueco párrafo→botón constante de 22 px,
separación entre filas de 28 px, sin desborde horizontal, y el aire hasta la
sección "Datos" de vuelta en 132 px.

### Typo en una cifra del hero

La cuarta cifra decía `20 años` con la bajada `Años de series históricas
continuas`: repetía la unidad. Queda `De series históricas continuas`, en
mayúscula como las otras tres bajadas y como el paralelo exacto que ya existía
en "Datos" (`20 años → De series comparables`).

Se revisaron las ocho cifras del sitio comparando cada número con su bajada:
era la única que repetía.

### Criterio de marca: afirmar, no contrastar

Andrea lo formula así: *"no me importa cómo venda el resto, yo vendo lo mío, que
es valioso"*. Vale para todo el sitio, no solo para la demo.

Se auditó el copy visible buscando negaciones y comparativos. Aparecen 13
frases, pero **no todas son lo mismo**, y la distinción es la que decide qué se
toca:

- **Describen el producto** —"sin producción manual", "sin fricción con tus
  procesos", "sin importar la cantidad de fondos"—: no hay competidor a la
  vista. Se quedan.
- **Describen el dolor del cliente** —"cerrar negocios, no armar documentos",
  "dedícate al análisis, no a los cálculos"—: hablan de su día, no del rival.
  Se quedan, y además vienen del brief.
- **Se comparan con el mercado**: son las que aplican al criterio.

Cambiadas, las dos de los pilares de Nosotros:

| Antes | Ahora |
|---|---|
| Independencia → **Sin conflicto** con la gestión de activos | Independencia → **Nuestro único negocio es la información** |
| IA integrada → Parte de cómo operamos, **no un slogan** | IA integrada → **Parte de cómo desarrollamos y operamos** |

La segunda usa las palabras del propio brief, que en la misma frase trae la
versión afirmativa: *"es parte integral de cómo desarrollamos y operamos"*.

*Corrección:* una primera comprobación dio que "no un slogan" no venía del
brief. Era un falso negativo por buscar la frase literal: el brief dice "No es
un slogan".

Queda una sin resolver, en el párrafo de Nosotros: *"y no seguimos tendencias…
las anticipamos"*. Viene del brief y habla de LVA, no de terceros, pero el
contraste está. Pendiente de decisión.

### El copy de la demo deja de definirse por negación

Reparo de Andrea: el tono sonaba peyorativo, describía **lo que la demo no es**
en vez de lo que ofrece. Contadas, tres de las cuatro frases empezaban por una
negación.

| Antes | Ahora |
|---|---|
| **No** una presentación genérica: trabajamos sobre tus datos… | Trabajamos con tus datos y tus casos reales… |
| Te responde alguien que conoce la industria, **no** un ejecutivo de cuenta | Conversas con quien conoce la industria por dentro |
| **Sin** compromiso **ni** instalación previa | Lo vemos en vivo, sobre tus propios instrumentos |
| Te contactamos dentro del día hábil siguiente | Te respondemos dentro del día hábil siguiente |

El bloque queda con **cero negaciones**. La tercera era la más difícil: "sin
instalación" tranquiliza, pero dicho en positivo —se ve en vivo, sobre lo que ya
tienes— informa lo mismo y además cuenta algo.

### Cabeceras del blog y del post, más bajas

A 1440×900 el contenido quedaba cortado. Medido antes de tocar:

| | Antes | Ahora |
|---|---|---|
| Blog: bloque superior | 374px | **312px** |
| Blog: ¿cabe la primera entrada? | no, 426 de 450px | **sí, entera** |
| Post: imagen de cabecera | 585px | **338px** |
| Post: el texto empieza en | 912px | **829px** |

En el post el problema no era la cabecera sino **la imagen**: a 1040px de ancho,
un 16:9 da 585px de alto y empujaba el artículo fuera de la pantalla. Se le pone
un tope de alto además de la proporción, y el recorte lo absorbe `object-fit`.

A 1440×900 asoman dos líneas de texto, que es lo que hace falta para que se vea
que el artículo sigue. En pantallas de 800px de alto todavía no llega: bajar más
obligaría a sacrificar la imagen, y ahí ya es preferible que se desplace.

### "Agenda tu demo" pasa de modal a página propia

Criterio de Andrea: **el modal se siente efímero** para agendar una reunión
comercial. Se sustituye por `demo.html`.

Lo que gana al ser página y no ventana: tiene dirección propia que compartir o
enlazar desde una campaña, no se pierde al recargar, y hay sitio para el
argumento **junto** al formulario en vez de solo encima.

La página repite el mensaje de los 30 minutos sobre la propia cartera, añade
tres apoyos y ofrece **comercial@lvaindices.com** como alternativa para quien
prefiera escribir en vez de rellenar.

Los cinco disparadores del sitio —los dos de la portada, el del blog, el del
post y el de la plantilla del editor— apuntan ahora ahí. Con esto desaparece
también el apaño del `?demo`, que existía solo porque el modal vivía en una
sola página.

Eliminado el modal por completo: marcado, 136 líneas de CSS y su JavaScript.

*Tropiezo:* el script que quitaba el CSS del modal calculó el corte al revés
—el bloque a borrar estaba después del de referencia— y **duplicó 700 líneas**
de hoja. Se detectó al comprobar el orden de los bloques, se restauró con
`git checkout` y se rehízo verificando que el corte fuera hacia adelante.

### Fuera el sitio antiguo

La cabecera del blog queda en **"Blog"** con la bajada **"Noticias y novedades
desde LVA Índices"**, sin más.

Y se elimina todo lo heredado, que ya no lo usaba nadie. La cadena era simple:
`blog/ejemplo-articulo.html` no estaba enlazado desde ninguna parte, y era el
único que sostenía a los otros tres.

| Archivo | Peso |
|---|---|
| `styles-legacy.css` | 64 KB, 2.840 líneas |
| `script.js` | 20 KB |
| `blog/ejemplo-articulo.html` | 16 KB |
| `blog/images/tiempo-valioso.jpg` | 488 KB |

El repo queda con 14 archivos. Verificado tras borrar: ninguna página pide nada
que ya no exista y no hay errores en consola.

Con esto **el rediseño ya no convive con el sitio anterior**: index, acceso,
blog, el post y el editor usan la misma hoja de estilos.

### El listado del blog pasa al diseño V5

`blog.html` era lo último que quedaba con `styles-legacy.css`. Se reescribe con
el mismo bloque superior del sitio, una cabecera propia sobre navy y las
entradas sobre papel, sin caja: la foto y el aire ordenan la cuadrícula, como en
Soluciones.

La cuadrícula es `auto-fill` con mínimo de 300px, así que se adapta sola cuando
haya más de una entrada, sin tocar nada.

**Botón de demo huérfano.** Al revisar apareció que el post llevaba el botón
"Agenda tu demo" pero no el modal, así que **no hacía nada**. En vez de duplicar
el formulario en cada página, las que no lo llevan enlazan a la portada con
`?demo`, y `startModal()` lo abre al cargar si encuentra ese parámetro. Se
corrigió el post publicado y la plantilla del editor.

Queda `blog/ejemplo-articulo.html`, la versión antigua del mismo artículo: ya no
se enlaza desde ninguna parte, pero sigue en el repo y es lo único que usa
`styles-legacy.css`. Pendiente decidir si se borra.

### Primer post publicado, y una lección del editor en Netlify

Se publica "Tenemos más tiempo, y ese tiempo es más valioso", generado con el
editor. El listado del blog **apunta ahora a esta versión** en vez de a
`ejemplo-articulo.html`: es el mismo artículo, así que duplicarlo habría dejado
el blog listando dos veces lo mismo, una con cada diseño.

**El archivo exportado venía contaminado.** Al alojar el editor en Netlify, la
exportación por clonado del DOM se llevó todo lo que el host y el navegador
inyectan en la página:

- los `meta` y el comentario de Netlify,
- su insignia "Powered by Netlify" entera, un `iframe` con su CSS y su JS,
- un `iframe` y varios nodos de una extensión del navegador,
- y los enlaces reescritos a rutas **absolutas** (`/blog` en vez de
  `../blog.html`), que en GitHub Pages apuntarían fuera del sitio, porque allí
  cuelga de `/potencialweblva/`.

De 22.283 bytes, **13.040 eran basura**. Se limpió el archivo y se blindó la
exportación del editor para que descarte todo lo que no puso él y devuelva los
enlaces a relativos.

Es el precio de publicar el editor: en local no pasaba. Conviene recordarlo si
algún día se aloja en otro sitio que también inyecte cosas.

### El editor se publica en la vista previa

Se necesitaba poder enseñar el editor, no solo el sitio. Se sube a la vista
previa de Netlify, donde **queda cubierto por el mismo candado**: sin la clave
devuelve 401.

`http://localhost:5273/editor/` en local, `/editor/` en la vista previa.

Cambia lo que decía la entrada anterior sobre que el editor no se desplegaba.
Sigue sin enlazarse desde el sitio y sigue con `noindex`, pero ya no es solo
local. **Quien tenga la clave de la vista previa puede abrir el editor**, que es
aceptable para revisar y presentar, pero conviene saberlo.

### Cabecera del post centrada y columna más ancha

- Título y metadatos **centrados**. El titular lleva `max-width: 19ch` con
  márgenes automáticos: sin tope se estiraría de borde a borde.
- La columna de texto pasa de 680 a **750px**. A 18px son unos 75 caracteres por
  línea, el techo del rango cómodo para leer seguido.

### Aire en Soluciones

La sección se sentía comprimida. Lo más apretado no eran los bloques grandes
sino el interior de la tarjeta: **7px entre etiqueta y título, 6 entre título y
párrafo**. Como el título ya comparte cuerpo e interlínea con el texto —solo se
distingue por la negrita—, sin aire propio los tres se leían como un bloque.

| | Antes | Ahora |
|---|---|---|
| Etiqueta → título | 7px | **13px** |
| Título → párrafo | 6px | **14px** |
| Menú → bajada | 50px | **62px** |
| Bajada → tarjetas | 50px | **62px** |
| Interlínea de la bajada | 1,38 | **1,45** |
| Respiro de la sección | 88 / 132px | **100 / 144px** |

Los dos huecos grandes se mantienen simétricos, como se había pedido antes. El
salto entre pestañas sigue en cero y los cuerpos siguen alineados.

### El modal de demo: botón anclado y campos sobrios

**El botón quedaba fuera de la ventana.** Medido: el formulario ocupa 794px en
una caja que a 800px de pantalla solo puede medir 720. La caja se desplazaba por
dentro, pero el botón caía abajo y no se veía. Ahora el pie va `sticky`, pegado
al fondo de la caja, con márgenes negativos que lo hacen sangrar hasta los
bordes y un degradado que tapa el texto que pasa por debajo. Verificado a 800,
700 y 390px: el botón siempre a la vista.

**Los campos parecían seleccionados.** El borde era turquesa al 42%, que es lo
que uno espera de un campo con foco, así que los siete se veían activos a la
vez. Pasa a `--v5-rule-dark`, la regla del sitio sobre oscuro. El radio baja de
10 a 8px.

| | Antes | Ahora |
|---|---|---|
| Borde | turquesa 42% | regla del sitio, 12% |
| Alto del campo | 53px | 44px |
| Texto del campo | 16,5px | 15,5px |
| **Etiqueta** | 13px | **14px** |

La etiqueta sube y el campo baja: el que tiene que leerse es el rótulo, no la
caja vacía. Entre eso y los márgenes más ajustados, el formulario pasó de 865 a
794px.

*No se pudo verificar el estado de foco en el panel de pruebas:*
`document.hasFocus()` es `false` porque la ventana no tiene el foco del sistema,
y Chrome no aplica `:focus` en ese caso. Se comprobó por CSSOM que la regla
existe y que el selector coincide con el campo.

### Homologación del signo +

`70+ fondos` pasa a `+70 fondos`. Era la única de las ocho cifras del sitio con
el signo pospuesto; las otras siete ya lo llevaban delante. Además se ponen
espacios duros entre cada cifra y su unidad, para que el salto de línea no las
separe.

### Más turquesa en Soluciones, hasta donde el contraste lo permite

La sección se veía plana. El acento estaba en `#056E80`, el turquesa más oscuro
de la escala.

**El techo real es más bajo de lo que parece,** y conviene dejarlo escrito: el
fondo de Soluciones es un degradado que termina en `#E9F1F4`, y las tarjetas
caen justo en esa zona. El contraste hay que medirlo contra **ese extremo**, no
contra el blanco. Ahí el primario de marca `#02A9C3` da 2,46 —muy lejos del 4,5—
y un primer intento con `#068196` daba 4,58 sobre blanco pero **4,00** sobre el
degradado.

| Elemento | Antes | Ahora | Contraste |
|---|---|---|---|
| Texto turquesa | `#056E80` | **`#04758A`** | 4,69 |
| Barra de la pestaña activa | `#056E80`, 2px | **`#0295AE`, 2,5px** | 3,10 |
| Etiquetas de tarjeta | gris `#5C6B75` | **turquesa** | 4,69 |
| Separadores | gris `#D3DFE4` | **`#C6DFE7`** | decorativo |

El cambio que más pesa no es el tono sino las **19 etiquetas**: eran grises y
ahora son turquesa, así que el acento se repite a lo largo de toda la sección en
vez de aparecer solo en el eyebrow y la pestaña.

La barra de la pestaña puede ir bastante más viva que el texto porque es un
elemento gráfico: el mínimo es 3,0 y no 4,5.

### Auditoría de las 18 tarjetas contra el brief

Se compararon una a una las tarjetas del sitio con las del brief. **No hay
contenido inventado**: las 18 trazan a una tarjeta del brief y los cuerpos son
condensaciones del original, sin cifras ni afirmaciones nuevas. Cuatro son
literales.

**Faltaba una tarjeta entera.** El brief tiene 19 y el sitio tenía 18: se había
perdido `[PLATAFORMA INTEGRAL] Tu equipo comercial con toda la información`, de
Distribución. Recuperada en su posición del brief, la segunda. Ahora los cuatro
dominios quedan en 5 / 5 / 5 / 4.

Dos matices menores, no inventos pero sí añadidos: "sin producción manual" en la
tarjeta de Marketing, y "local" en la de Carteras complejas —el brief dice "20
años de experiencia de LVA"—.

De paso se normalizó la indentación de las 18 tarjetas, que había quedado
irregular al generar la sección con un script.

### "Tu camino con LVA" y los pilares

- Los pasos cambian su línea horizontal superior por el **separador vertical**
  de Soluciones. El número ya ocupaba el `::before`, así que la línea va en
  `::after`. Se apaga bajo 900px.
- Los títulos turquesa de los pilares de Nosotros pasan de 13,5 a **16,5px**.

### Rediseño de Soluciones: separadores y una sola bajada por dominio

Según maqueta de Andrea. Tres cambios:

**1. Fuera la promesa.** Cada dominio tenía un titular ("Tu equipo comercial
potenciado") más una bajada pequeña. Ahora hay **un solo bloque de texto**, con
el peso visual que tenía el titular: 26px, navy, y un `max-width: 46ch` que lo
mantiene en dos líneas. Sin ese tope se estiraría en una sola línea larguísima.

**2. Separadores verticales entre tarjetas.** Van en un pseudo-elemento colocado
en el centro del hueco, **no como borde de la tarjeta**: así no le comen ancho al
texto y la línea queda equidistante de las dos columnas que separa. Se apagan
bajo 900px, donde las tarjetas se apilan. La tarjeta vuelve a llenar su columna
—277px con cuatro, 212 con cinco— porque ahora la separación la marca la línea y
no el aire.

**3. Texto del brief.** Se recuperaron las bajadas de los cuatro dominios del
brief original, ajustadas para caber en dos líneas:

| Dominio | Bajada |
|---|---|
| Distribución | Somos los proveedores de servicios financieros más grandes de LATAM. Más de 500 asesores nos usan a diario. |
| Riesgo | Una nueva forma de entender tu riesgo. +3.000 reportes, 70+ fondos y +6.000 millones gestionados. |
| Inversión | Más de 11.000 instrumentos de deuda valorizados cada día, con metodología auditada y reconocida por reguladores. |
| Compliance | Más de 90% de adopción del mercado en fichas regulatorias, con un solo sistema para cuatro marcos regulatorios. |

Dos venían largas en el brief y se recortaron; las de Inversión y Compliance
venían de una sola frase corta y se completaron con material del propio brief
—la metodología auditada sale de su tarjeta de pricing, y los cuatro marcos, de
la de distribución internacional—.

El brief vive en Google Docs; el enlace está al principio de esta bitácora.

### La bajada de Riesgo se parte en dos líneas

Corte a propósito entre la promesa y las cifras:

> Análisis pre-trade y métricas on the fly, integrados a tu flujo existente.
> **+3.000** reportes mensuales, 70+ fondos administrados y +6.000 millones
> gestionados.

Se aprovecha para unificar "Más de 3.000" en **"+3.000"**, coherente con el
"70+" y el "+6.000" de la misma frase.

El `<br class="corte-ancho">` solo actúa de 901px hacia arriba. Apilado, un
corte fijo dejaría una línea suelta de dos palabras, así que ahí el texto fluye
solo. Verificado: 2 líneas a 1440, corte desactivado a 900 y 390.

### Ancho de tarjeta: 262px

La tarjeta no llena su columna: lleva un tope de ancho con
`justify-items: start`, y el sobrante pasa a ser separación.

Se probaron dos valores antes de acertar. **215px** rompía todos los títulos
largos pero dejaba las columnas estrechas. **262px** es el equilibrio: recorta
la columna de 279 sin apretar la tarjeta, y da 58px de separación. En las áreas
de cinco la columna ya mide 216, así que el tope no llega a actuar.

**Lo que queda sin resolver por CSS:** a 262px, títulos como "Folletos
informativos automáticos" (243px medidos) vuelven a caber en una línea. Romper
esos sin estrechar la tarjeta exige acortar el texto, no tocar el ancho.

### Tarjetas más angostas para que los títulos rompan

Se revierte lo de las cinco columnas fijas —el hueco al final no convencía— y
vuelven cuatro columnas para cuatro tarjetas y cinco para cinco. Pero la tarjeta
ya no llena su columna: **tope de 215px**, con `justify-items: start`, y el
sobrante pasa a ser separación.

El valor sale de medir, no de tantear. Los títulos que quedaban en una sola
línea larga medían 243, 221, 220 y 206px; los cortos de verdad, 193px hacia
abajo. Un tope de 215 rompe los primeros y deja intactos los segundos.

Resultado: 215px de tarjeta en las cuatro áreas. La separación sí cambia —105px
en las áreas de cuatro y 41 en las de cinco—, porque la columna es más ancha
donde hay menos tarjetas.

### Ancho de tarjeta constante entre áreas

Antes la grilla usaba cuatro o cinco columnas según cuántas tarjetas tuviera el
área, así que la tarjeta cambiaba de ancho —280px contra 216— al saltar de
pestaña.

Ahora son **cinco columnas siempre**. Las áreas de cuatro dejan un hueco al
final, que es preferible a que el contenido se reacomode en cada clic.
Verificado: **216px en las cuatro áreas**, y el salto de altura sigue en cero.

Se elimina la regla condicional con `:has(> .product:nth-child(5))`, que deja de
tener sentido.

### El subgrid abría las tarjetas por dentro

Efecto secundario del cambio anterior: el `row-gap` de `.panel__grid` se aplica
**dentro** de cada tarjeta cuando esta es un subgrid, así que etiqueta, título y
párrafo quedaron separados los mismos 40px que hay entre columnas.

Es la segunda vez que aparece esta trampa —la primera fue con `.areas`—, y
conviene tenerla presente: **al convertir un hijo en subgrid, el gap del padre
pasa a separar también sus filas internas.**

Se pone `row-gap: 0` dentro del bloque de 901px, que es donde el subgrid actúa
y donde las tarjetas van en una sola fila. La separación interna la dan los
márgenes: 7px bajo la etiqueta y 6px bajo el título. Bajo 901px las tarjetas se
apilan y el gap sigue haciendo falta, así que ahí no se toca.

### El título de tarjeta y su párrafo comparten cuerpo e interlínea

El título ya estaba en 15px, igual que el párrafo, y en negrita. Lo que lo hacía
**parecer** más pequeño era la interlínea: 1,36 contra el 1,65 del texto, o sea
20,4px contra 24,75. A igual cuerpo, un interlineado más apretado se lee como
un tamaño menor.

Se iguala a 1,65. La jerarquía la marca la negrita, no el tamaño.

### Tarjetas: los párrafos dejan de escalonarse

Con títulos de una o dos líneas, cada párrafo arrancaba a distinta altura y la
fila se veía desordenada.

Se resuelve con **subgrid en `.product`**: las tres filas de la tarjeta
—etiqueta, título y cuerpo— se alinean entre columnas, así que el título
reserva la altura del más largo y todos los cuerpos empiezan igual. Es la misma
técnica que ya ordenaba los "Leer más".

Se añade `text-wrap: balance` en el título, para repartir las dos líneas en vez
de dejar una palabra suelta abajo.

Verificado en las cuatro áreas a 1440 y 1024: cuerpos alineados en todas. Bajo
901px el subgrid se apaga: las tarjetas se apilan y no hay nada con qué
alinearse.

Queda una diferencia menor: dos títulos cortos —"Cumple la norma a cabalidad" y
"Tecnología, no solo datos"— siguen ocupando una línea dentro del espacio de
dos. Forzarlos a dos líneas exigiría reescribir el texto, no CSS.

### Ajustes en el menú de áreas

- **Fuera las líneas sobre las tarjetas.** Cuatro reglas horizontales encima de
  las tarjetas competían con la del menú, que es la que ordena la sección. Se
  quitan el `border-top` y el relleno superior de `.product`.
- **Aire simétrico.** El hueco sobre el título del panel se iguala al que hay
  bajo la bajada: **50px arriba y 50 abajo**. Había 72. No bastó con tocar
  `.panels`: la promesa arrastraba un `margin-top: 14px` que era la separación
  con la etiqueta del panel, ya eliminada, y sumaba de más.
- **Tarjetas más discretas:** título de 16 a 15px, etiqueta de 10,5 a 10px. La
  etiqueta mantiene 5,5 de contraste.

### El editor pasa a WYSIWYG y el post estrena diseño V5

Dos correcciones de fondo sobre la primera versión.

**1. El post salía con el diseño viejo.** Generaba contra
`blog/ejemplo-articulo.html`, que sigue en `styles-legacy.css`. Ahora hay un
layout de post en el rediseño, dentro de `styles.css`: cabecera navy con el
mismo nav y pie del sitio, título grande, media a caballo entre el navy y el
papel, y cuerpo sobre blanco.

La medida del texto es de **680px, no la del sitio**: 18px con interlínea 1,75
deja unos 68 caracteres por línea, que es el rango cómodo para leer seguido.
Las secciones comerciales se leen a saltos y admiten columnas anchas; un
artículo no.

**2. El editor era un formulario con vista previa al lado.** Ahora la página
**es** el post: se escribe encima, con la hoja de estilos real, y el formato se
aplica con una barra flotante que aparece sobre lo que seleccionas —el patrón
de Squarespace o Medium—. Desaparece el panel de previa: no hace falta previsar
lo que ya estás viendo.

Lo que no es contenido vive en una barra superior: ajustes (resumen para Google
con contador de 155 caracteres, y etiqueta), copiar tarjeta y descargar.

**Exportación por clonado.** En vez de rellenar una segunda plantilla —que se
desincroniza a la primera de cambio—, se clona el documento vivo y se le quita
lo del editor. El archivo publicado es literalmente lo que hay en pantalla.
Verificado interceptando la descarga real: cero restos de la barra, el panel,
la barra flotante, los botones de media, los `contenteditable`, el script del
editor y el `noindex`.

El JS va en `editor/editor.js` aparte, no embebido: la primera versión se rompía
porque la plantilla dentro del script contenía un `</script>`.

### Blog en el menú y editor local de posts

"Blog" entra como quinto enlace de la cabecera. Verificado a 1440 y 1100: el
menú sigue en una línea y no se solapa con los botones de la derecha.

**Editor de posts** en `editor/index.html`. Decisión de arquitectura tomada con
Andrea entre tres caminos: editor local, CMS sobre git (Decap) o Supabase con
render en cliente. Se eligió el **editor local** porque no añade
infraestructura ni dependencias, encaja con el flujo actual y no cierra puertas:
el trabajo de composición se reaprovecha si más adelante se migra a Decap con el
Netlify institucional.

Qué hace: campos del post, cabecera (imagen, video de YouTube o video propio),
editor de texto con negrita, cursiva, enlace, títulos, listas y frase destacada,
vista previa en vivo con el CSS real del blog, y descarga del `.html` listo más
el archivo de imagen o video ya renombrado. También copia la tarjeta para
pegar en `blog.html`.

Detalles que importan:

- Genera **las mismas clases** que `blog/ejemplo-articulo.html`, así que cuando
  el blog reciba su pasada al diseño V5, los posts se restilan solos.
- **Pegado limpio** desde Word o Google Docs: conserva negritas, cursivas,
  enlaces, títulos y listas, y descarta el resto de etiquetas y estilos.
- Minutos de lectura calculados a 200 palabras por minuto.
- Borrador en `localStorage` para no perder el texto al cerrar.
- `noindex`, sin enlaces desde el sitio y **excluido del despliegue**: vive solo
  en el repo y en local.

El editor no pide lo que puede deducir: **no hay campo para el nombre del
archivo** —se deriva del título y se muestra la ruta resultante como dato— y la
**fecha llega puesta con la de hoy**, editable. Los minutos de lectura ya se
calculaban solos. Quedan cinco campos que escribir: título, resumen, autor,
etiqueta y el texto.

*Tropiezo:* la plantilla se embebe como cadena JS y contiene un `</script>`,
que corta el bloque de JavaScript al parsear el HTML. La vista previa salía en
blanco. Se escapa como `<\/script>`.

Usa `document.execCommand`, marcado como obsoleto pero sin sustituto
equivalente y con soporte universal. Es una herramienta interna, no código del
sitio publicado.

### Vuelve el formulario de demo, ahora en modal

Recupera la única funcionalidad que se había perdido en la migración a la V5.
Los dos botones "Agenda tu demo" dejan de ser `mailto:` y abren un modal.

Campos con los **mismos nombres que el formulario original** (`name`, `email`,
`company`, `phone`, `country`, `clientType`, `message`), para que quien conecte
el backend no tenga que renombrar nada. Reutiliza `.field` / `.field__input` de
la pantalla de acceso: es el mismo tipo de pieza.

**Comportamiento de modal completo:** foco al primer campo al abrir, trampa de
foco con Tab y Shift+Tab, Escape y clic fuera para cerrar, devolución del foco
al botón que lo abrió, y bloqueo del scroll de fondo. Verificado los cuatro.

**El envío NO está conectado, y el original tampoco lo estaba:** su
`access_key` de web3forms es el literal `YOUR_ACCESS_KEY_HERE`. Aquí se
intercepta el submit —sin `action`, el navegador mandaría los datos personales
al propio servidor—. Comprobado con datos de prueba: la URL no cambia ni los
contiene. Valida los obligatorios y enfoca el primero que falte.

Contraste sobre el navy del modal: título 16,92; bajada 7,71; etiquetas 10,94;
texto escrito 14,26; botón Enviar 12,16. Mínimo 7,71.

En móvil la caja se desplaza por dentro en vez de empujar la página, y Empresa
y Teléfono se apilan.

### Menú de áreas: fuera la etiqueta repetida y el salto de altura

**La etiqueta repetida.** Bajo la pestaña activa "DISTRIBUCIÓN", el panel volvía
a decir "DISTRIBUCIÓN". La pestaña ya lo comunica, así que la promesa pasa a ser
la primera línea del panel.

*Tropiezo:* el primer intento borró por patrón **todos** los `class="eyebrow"`
en mayúsculas, y se llevó también los rótulos DATOS y NOSOTROS de otras
secciones. Se revirtió con `git checkout` y se rehízo acotando la búsqueda al
interior de cada `.panel`.

**El salto de altura.** Medido: 199px entre el panel más bajo (283px) y el más
alto (482px). Se atacó en dos pasos, en vez de reservar sin más la altura mayor
—que habría dejado 199px de hueco en la mitad de las pestañas—:

1. **Cinco tarjetas, cinco columnas.** Con cuatro columnas la quinta rompía a
   una segunda fila ella sola. Con `:has(> .product:nth-child(5))` el panel usa
   cinco. El salto cayó de 199px a 74px, sin ningún hueco. Va envuelto en
   `:where()` para dejar la especificidad en 0,1,0 y que los cortes de móvil
   puedan reescribirlo: si no, ganaría por especificidad pese a ir antes.
2. **Paneles apilados en la misma celda de grilla**, con los ocultos en
   `visibility: hidden` en vez de `display: none`, para que sigan ocupando su
   sitio. El contenedor mide siempre lo que el más alto: **salto 0**.
   `visibility` los saca igual del foco y del lector de pantalla (verificado: 0
   elementos enfocables en paneles ocultos).

El apilado solo de 901px hacia arriba. En móvil el panel es largo y se recorre
scrolleando: reservar la altura mayor solo dejaría un hueco. Verificado que a
900 y 390px los ocultos vuelven a `display: none`.

### "Valorización" → "información", solo en el titular

Criterio de Andrea: **"información" engloba mejor el negocio**. "Valorización"
en finanzas se asocia a *valorización de derivados* —una pieza, no el conjunto—
y deja fuera Distribución, Riesgo y Compliance.

Se probó extender el criterio a las tres apariciones de "data" del texto
("Operando sobre nuestra data", "sobre data al día", "Data certificada y al
día") y **se revirtió**: se comprobó en el historial que las tres entraron en
`ba7cbce`, el commit que devolvió el copy al brief. Están por algo — hablan
directo de la parte de data que leen los equipos de riesgo e inversión. El
brief manda sobre la preferencia estilística.

Queda entonces un solo cambio: el titular de Soluciones.

### Soluciones pasa a menú de áreas, y el amarillo del diseño

Tres cambios de una tanda de feedback.

**1. Fuera el "Leer más".** Era el reparo de fondo: información importante
escondida tras un clic. Las cuatro columnas se sustituyen por un menú de áreas
—una pestaña por dominio— donde el área elegida se muestra **entera**: etiqueta,
promesa, bajada y sus tarjetas. Nada queda oculto tras un "ver más".

Las 18 tarjetas se conservan íntegras: se extrajeron del HTML y se
reinsertaron, sin transcribir a mano. Distribución 4, Riesgo 5, Inversión y
mercado 5, Compliance 4.

**Contra el efecto "flotando"**, que era la preocupación: la tira de pestañas
se apoya en una línea que cruza todo el ancho, y la activa la pisa con su
subrayado (`margin-bottom: -1px`). Sin esa línea las pestañas quedan sueltas
entre el titular y el contenido. Es el patrón estándar de conmutador, no una
invención.

Accesibilidad completa: `role="tablist"/"tab"/"tabpanel"`, `aria-selected`,
`aria-controls`, y **tabindex móvil** —solo la activa es tabulable, el resto se
recorre con flechas, Home y End—, que es lo que espera un lector de pantalla en
este patrón.

En móvil las cuatro etiquetas no caben: la tira se desliza en horizontal (450px
de contenido en 335 de ancho) y las tarjetas pasan a 2 columnas bajo 900px y a
1 bajo 600px.

**2. Amarillo `#FFD816` en los botones de demo.** Tomado del SVG del diseño,
donde aparece exactamente dos veces: los dos "Agenda tu demo". Es la única
acción comercial del sitio y en turquesa competía con el resto de acentos.
Texto navy encima: **12,16**. En blanco daría 1,39, inservible.

**3. "Esa base de verdad" → "Esa base de información"**, en el segundo párrafo
de Nosotros.

También se adaptó la promesa de Distribución a "Tu equipo comercial potenciado"
y el titular de la sección pasa a "Cuatro dominios, un solo estándar de
**información**" —antes "de valorización"—, que además hace eco del hero ("La
mejor versión de la información"). El resto del texto del mockup era simulado y
no se tocó.

Contraste de lo nuevo, contra el peor extremo del degradado de la sección:
pestaña activa 5,17; inactiva 4,81; promesa y títulos 14,79; cuerpos 4,81.
Todo sobre el mínimo AA.

### Acceso: la cabecera se queda solo con el logo

Fuera los enlaces, "Agenda tu demo" y "Acceso clientes". Razón de Andrea: quien
llega aquí **ya es cliente**, no necesita recorrer el sitio. El logo queda como
única salida, apuntando a la portada.

Se va también la hamburguesa: sin enlaces no hay nada que desplegar.
`startNav()` no necesitó cambios, porque ya salía sin hacer nada si no
encontraba el toggle (`if (!toggle || !panel) return`).

Verificado a 1440 y 390: un solo enlace en la cabecera, sin desborde, y el hero
sigue en 583px con proporción 2,469.

### Acceso: el componente baja 16px

Los paddings del hero pasan de 60/36 a **76/20**. Se sumó arriba lo mismo que
se restó abajo: el contenido ocupa 574 de los 583px disponibles y solo quedan
9px de holgura, así que añadir margen superior sin compensar habría hecho
crecer el bloque y estirado el canvas otra vez.

Verificado: hero en 583px, canvas 1440×583, proporción 2,469.

### Acceso: cumbres más altas

Tercer parámetro de la variante `data-soft`: `lift = 1.3`, un 30% más de altura
en las cumbres.

Se aplica **solo al dibujar**, no al valor `hgt`. Escalar la altura misma haría
que más tramos superaran los umbrales `FLOOR` (0.055) y el del filo de cumbres
(0.3), y el dibujo se llenaría de líneas justo cuando se buscaba lo contrario.

### Acceso: el texto de ayuda se centra

"¿Aún no tienes cuenta?" pasa a `text-align: center`. Comparte los 430px del
formulario con el botón, así que su centro cae en el mismo eje: 720px ambos a
1440. El resto del formulario sigue alineado a la izquierda.

### Acceso: dibujo atenuado y el fondo deja de cortarse

**El corte de media pantalla.** El bloque superior lleva una línea blanca de
1px para separarse de las secciones blancas de la portada. En acceso no hay
nada debajo, así que la línea quedaba suelta y, peor, el degradado terminaba a
los 583px del hero y chocaba contra el navy plano del `body`. Se quita la línea
y el `.top` estira a `100dvh`.

Ojo con la distinción, que es la que evita repetir el error anterior: estira el
**contenedor**, no el hero. El canvas sigue midiendo 583px y conserva la
proporción 2,469 de la portada. Estirar el hero fue lo que deformó el dibujo la
primera vez.

**Dibujo atenuado y estirado.** `field.js` acepta ahora `data-soft` en el
canvas. Con ese atributo:

- la frecuencia horizontal del ruido baja de `8.4` a `4.6`, así las cumbres son
  más anchas y el dibujo se lee estirado;
- todos los trazos se multiplican por `0.42`, incluido el filo de cumbres.

Es una variante, no un cambio del motor: la portada no lleva el atributo y su
canvas quedó verificado idéntico (1440×583, proporción 2,469).

### Acceso: misma altura que el hero, y formulario más legible

Tres correcciones sobre la primera versión.

**1. El canvas salía estirado.** El bloque se había estirado a `100dvh`, así
que el hero medía 900px en vez de 583 y el dibujo se deformaba. Se quitó el
estirado: ahora manda el `min-height` del hero, igual que en la portada.

A 1440px queda **idéntico**: 1440×583, proporción 2,469, el mismo número que
la portada. Debajo de 1440 el hero de acceso es más alto (519px a 1024, 503 a
768, 530 a 390) contra los 430 de la portada: **un formulario necesita más alto
que un titular de dos líneas**, y comprimirlo hasta 430 obligaría a achicar los
campos, que es lo contrario de lo pedido.

**2. El componente subió.** Al quitar el centrado vertical y ajustar los
paddings —clamp(40,4.2vw,60) arriba, clamp(24,2.5vw,36) abajo, contra los
144/56 de la portada— el título arranca mucho más arriba. Los paddings tienen
que ser menores que los del hero: si el contenido superara los 583px, el bloque
crecería y el canvas volvería a estirarse.

**3. Campos más legibles.** El fondo pasó de `rgba(255,255,255,0.06)` a
`rgba(18,45,63,0.92)`: al 6% de blanco se transparentaba el dibujo del canvas
por debajo y el texto escrito costaba de leer. Texto de 15 a 16,5px, alto de 47
a 53px, placeholder de `faint` a `dim`.

Contraste dentro del campo: texto escrito **14,47**, placeholder **6,59**.

### Página de acceso (`acceso.html`)

Pantalla de login con el bloque superior de la portada —nav, lavado radial y
canvas animado—, con el formulario en el lugar del titular y la bajada.

No es una copia del hero: es **la misma pieza**. Reutiliza `.top`, `.nav`,
`.hero` y el canvas `data-field="hero"`, así que el menú sandwich, el acordeón
de nav y la animación funcionan sin una línea nueva.

**Formulario estándar:** correo (`type=email`, `autocomplete=username`),
contraseña (`autocomplete=current-password`), "Recuérdame en este equipo",
"¿Olvidaste tu contraseña?" y "Ingresar". Etiquetas visibles, no solo
placeholders. Campos y botón de 47px de alto. Zona `aria-live` para mensajes.

**La autenticación NO está conectada.** El envío se intercepta con
`preventDefault`: sin eso el navegador mandaría la contraseña al propio
servidor por no tener `action`. Comprobado enviando una clave de prueba: la URL
no cambia y no aparece en ella. Quien conecte el backend debe reemplazar ese
listener; el enlace de recuperación (`#recuperar`) también está pendiente.

**Decisiones de medida:**

- El bloque estira a `100dvh`. Con la altura propia del hero (584px máx.)
  quedaba una franja blanca debajo en cualquier escritorio.
- Formulario de 430px. A 400px la casilla y el enlace de contraseña se quedaban
  a 12px y se leían como un solo bloque; ahora hay 72px.
- `.hero__inner` necesitó `width: 100%`: dentro de la grilla del hero el `.wrap`
  se encogía al contenido y dejaba el formulario en 370px.
- Bajo 420px la casilla y el enlace se apilan.

Contraste sobre navy, todo sobre el mínimo AA de 4,5: título 16,92; bajada
7,71; etiquetas 10,94; enlace de contraseña 8,09; texto de ayuda 5,25.

El enlace "Acceso clientes" del menú deja de apuntar al login antiguo
(`lvaindices.com/login3/`) y apunta a esta página.

### Columnas parejas para que el justificado funcione

Andrea pidió justificado sin huecos enormes, aceptando cambiar anchos de
columna, con la condición de que quedara **parejo** y sin perder la grilla.

El desparejo venía de Premios: con el logo al costado, la columna de 150px más
su gap se comen 182px de la media columna, dejando el párrafo en 237px a
1024px y 304px a 1200px, contra los 410–480px de Datos y Nosotros.

Cálculo: con el logo al lado, el párrafo solo alcanza 380px sobre **1405px** de
viewport. Debajo de eso el logo sube y el párrafo se queda con la media columna
entera. La grilla de dos premios no se toca. La regla ya existía para móvil a
600px; solo se elevó el umbral.

Anchos de columna resultantes, idénticos en los tres bloques:

| Viewport | Columna | Peor espacio |
|---|---|---|
| 1440 | 576 / 576 / 394 | 1,2× — 1,8× |
| 1300 | 520 en los tres | hasta 3,0× |
| 1024 | 410 en los tres | hasta 2,3× |
| 950 | 380 en los tres | hasta 2,9× |
| 768 | 660 en los tres | hasta 2,2× |
| 390 | 335 → izquierda | 1× |

### Por qué "Así funciona" y las tarjetas quedan a la izquierda

Se midió justificar también esos bloques, y no es viable: sus columnas son de
275px (pasos) y 217px (CTA) por diseño, al ir cuatro en fila. Justificados dan
**23,9×** en el primer paso — casi el doble de malo que el peor caso que se
acaba de corregir. El motivo es "latinoamericano": una palabra de 15 letras en
una columna de 275px deja líneas de dos palabras.

El justificado necesita medida: bajo ~380px no hay suficientes palabras por
línea para repartir el sobrante. Esos bloques quedan alineados a la izquierda,
que es la decisión tipográfica correcta, no una omisión.

### Justificado sí, guiones no: la condición por ancho de columna

Corrección de la entrada anterior. Andrea **sí quiere** el texto en bloque
justificado; lo que no quiere son los cortes con guion. Al quitar el justificado
quedó el borde derecho irregular ("con flecos"), que no era lo pedido.

Vuelve `text-align: justify` en los tres bloques, con `hyphens: none`. El
problema de los huecos se resuelve con una **container query**: la condición
mira el ancho de la propia columna, no el del viewport, porque una misma
pantalla tiene columnas muy distintas según la sección. Bajo 380px de columna
se alinea a la izquierda.

Peor espacio entre palabras, medido (1 = ancho natural):

| Viewport | Datos | Premios | Nosotros |
|---|---|---|---|
| 1440 | 1,2× | 1,8× | 1,2× |
| 1200 | 2,0× | *izq.* (col 304px) | 2,0× |
| 1024 | 2,1× | *izq.* (col 237px) | 1,5× |
| 768 | 1,5× | 2,4× | 2,2× |
| 390 | *izq.* | *izq.* | *izq.* |

Antes de la regla, Premios a 1024px llegaba a **13,9×**. El máximo ahora es 2,4×,
dentro de lo normal en texto justificado.

**Trampa de cascada:** el bloque `@container` se insertó primero a media hoja y
solo funcionaba en `.data__lead`. Las reglas de `.award__body` y
`.about__story p` vienen después en el archivo y, con la misma especificidad,
ganaban por orden. La container query no altera la especificidad. Se movió el
bloque al final de la hoja.

### Fuera los cortes de palabra con guion

Andrea pidió que ningún texto se corte con guion ("inde-pendiente",
"Co-lombia"). La partición venía de `hyphens: auto` en tres bloques:
`.data__lead`, `.award__body` y `.about__story p`.

Quitar los guiones **no bastaba**: esos tres bloques estaban justificados, y la
justificación sin guiones estira los espacios. Medido tras desactivarlos:

| Ancho | Bloque | Columna | Espacio |
|---|---|---|---|
| 1024 | Premios | 237px | **+41,8px** sobre 3,2px naturales (14×) |
| 390 | Datos | 335px | +12,8px sobre 3,5px (4,6×) |
| 390 | Nosotros | 335px | +8,8px (3,5×) |

Así que se quitó también la justificación en esos tres bloques. No es una
decisión nueva: el propio diseño ya desactivaba el justificado de `.award__body`
en pantallas angostas, con el comentario "justificado a este ancho abre ríos
entre palabras". Se eliminó esa regla del media query por redundante.

Verificado en 1440, 1024 y 390: los cinco párrafos en `left`, `hyphens: none`,
estiramiento de espacio **0** y sin desborde horizontal.

### Archivos

- `styles.css` — reglas de hover de enlaces y alineación de las cuatro áreas.
- `index.html` — bajada de la cifra de años.

### Verificación

El panel de vista previa volvió a quedar en cero píxeles, así que no se pudo
hacer hover con el mouse. Se verificó recorriendo el CSSOM: para cada enlace se
listaron **todas** las reglas `:hover` de la hoja que le aplican. Ninguna
declara `underline`, y todas cambian el color. El único enlace sin cambio de
tono es `.nav__brand`, que es el logo: no tiene texto.

### Nota de accesibilidad

Quitar el subrayado deja el color como única señal del hover, lo que en texto
corrido incumpliría WCAG 1.4.1. Aquí no aplica: el sitio no tiene enlaces
dentro de párrafos —todos están en el menú, el footer o son botones—, donde la
posición ya los identifica como navegación. **Si en el futuro se agregan
enlaces dentro de un párrafo, hay que devolverles el subrayado.**

---

## 2026-09-01 — Sesión 4: se implementa la V5 de Claude Design

Hash de la sesión 3: **`3f34d57`**.

### Qué pasó

Andrea diseñó el sitio en Claude Design y exportó un handoff. **Esa V5 manda
sobre todo lo anterior**: se descartó la dirección que veníamos construyendo
(hero oscuro disolviéndose en sitio blanco, Manrope, deboxing) y se implementó
`LVA Sitio V5 - Generativa.dc.html` tal cual.

El bundle no se pudo importar por MCP —la autorización de design expiró a mitad
de sesión y `/design-login` no corre en un contexto no interactivo—, así que se
trabajó desde el zip de handoff.

### Qué cambió respecto del sitio anterior

**Contenido nuevo, no solo estilos.** La V5 trae copy distinto y una sección
que no existía:

| | Antes | V5 |
|---|---|---|
| Titular | "La mejor versión de la información" | "La infraestructura de datos financieros del asset management latinoamericano." |
| Voz | tú | **usted** ("Su equipo comercial", "Conozca al comprador") |
| Secciones | Hero · Soluciones · Premios · Nosotros · Así funciona · CTA | Hero · **KPIs** · Soluciones · **Datos** · Premios · Nosotros |
| Navegación | Soluciones, Premios, Nosotros, Blog | Soluciones, Datos, Premios, Nosotros |

Esto cierra el pendiente de voz que arrastrábamos desde la sesión 1: la V5 está
escrita de usted, como pide el manual de marca.

**Tipografía:** Google Sans / Google Sans Text con **DM Sans** de respaldo desde
Google Fonts. Reemplaza a Manrope + Open Sans. Ojo: Google Sans no se
distribuye libremente, así que quien no la tenga instalada verá DM Sans — que
es exactamente lo que define el prototipo.

**Paleta:** navy `#0B1E2F` y `#173A50`, sobre los que van los lavados radiales
del bloque superior. Reemplaza al `#0A1C2E` que veníamos usando.

**Dos motivos generativos** (`assets/brand/field.js`), portados del prototipo:
- *hero* — cordillera en retícula de perspectiva, ruido `ridged` de 5 octavas,
  96×26 nodos, ~20 fps. Solo se dibujan los tramos con relieve: la planicie
  desaparece.
- *datos* — nube de 1.300 puntos sobre dos curvas Catmull-Rom, recorrida por un
  frente que los agranda al pasar, ~55 fps, con zonas limpias donde va el texto.

Ambos se siembran al azar en cada carga, se pausan fuera de pantalla y se
congelan con `prefers-reduced-motion`.

**Acordeón de Soluciones:** exclusivo (abrir uno cierra los demás), como en el
prototipo, con `aria-expanded` y `aria-controls`.

### Desviaciones deliberadas respecto del prototipo

1. **Ancho máximo de contenido 1440px** con los fondos a sangre. El prototipo va
   a sangre completa sin tope. Pedido de diseño para que las columnas no se
   estiren sin control en pantallas anchas.
2. **Premios y Nosotros usan `repeat(2, 1fr)`** en vez de `auto-fit minmax(320px)`,
   con colapso a una columna bajo 900px. Así el canal de columnas coincide entre
   ambas secciones — verificado: **56 px en las dos**. Era el arreglo pedido.
3. **Los CTA "Agenda tu demo" son enlaces `mailto:`** a `comercial@lvaindices.com`.
   En el prototipo son `<span>` sin acción. Se prefirió eso a dejar botones
   muertos. **Decisión abierta:** el sitio anterior tenía un modal de contacto
   con formulario web3forms; la V5 no lo contempla y quedó fuera.
4. **Foco visible** con anillo teal, que el prototipo no define pero el manual
   de marca exige.

### Archivos
- `index.html` — reescrito completo
- `styles.css` — reescrito completo (el anterior se conservó como
  `styles-legacy.css`, del que dependen blog y artículo)
- `assets/brand/field.js` *(nuevo)* — motivos generativos y acordeón
- `assets/brand/logos/` — se agregan `premio-salmon-on-dark.png` y
  `prixtar-on-dark.svg`; se actualizan los dos logos LVA desde el bundle
- `assets/brand/hero-field.js` *(eliminado)* — la malla de la sesión 3
- `blog.html`, `blog/ejemplo-articulo.html` — apuntan a `styles-legacy.css`

### Verificación
Servido en local y auditado por DOM: los 8 bloques con sus fondos exactos, los
dos canvas dibujando (6,95% y 5,65% de píxeles con tinta), acordeón abriendo,
cerrando y siendo exclusivo, canal de columnas 56 px en Premios y Nosotros, sin
errores de consola.

El panel de preview solo captura de forma fiable la parte superior de la página,
así que **el hero se vio en imagen y el resto se verificó por medidas del DOM**.
Conviene recorrerlo entero en un navegador real.

### ⚠️ Contraste: 14 fallos WCAG AA que vienen del diseño

Se implementó fiel, sin cambiar colores. Pero el prototipo tiene cuatro pares
que no pasan AA. Los valores están medidos:

| Elemento | Actual | Mínimo | Corrección propuesta | Queda |
|---|---|---|---|---|
| Botón "Agenda tu demo" (nav) | blanco sobre `#02A9C3` = **2,81** | 4,5 | texto `#0B1E2F` | 6,02 |
| "Leer más" y su glifo | `#02A9C3` sobre blanco = **2,81** | 4,5 | `#067C90` (ya en la paleta) | 4,89 |
| `product__tag` (9,5px) | `#6E7C85` = **4,30** | 4,5 | `#5C6B75` | 5,50 |
| Eyebrow y labels del bloque Datos | `#5C6B75` sobre `#DED9D2` = **3,92** | 4,5 | `#4E5C66` | 4,91 |

El propio diseño ya usa **navy sobre teal** en el botón de la tarjeta de CTA
(8,09), así que la corrección del botón del nav lo dejaría internamente
consistente, no menos fiel.

**Aplicados el 2026-09-01 a pedido de Andrea.** Los cuatro cambios usan colores
que ya estaban en la paleta del diseño, así que no se introdujo ninguno nuevo:
el `#067C90` es el mismo de los eyebrow, el `#5C6B75` y el `#4E5C66` ya se usan
en cuerpo de texto, y el navy sobre teal es lo que el propio diseño hace en el
botón de la tarjeta de CTA. **Verificado: de 14 fallos a 0.**

### Ajustes posteriores del mismo día

- **Aire sobre la grilla de Soluciones**: `clamp(64px, 8vw, 116px)` →
  `clamp(40px, 5vw, 72px)`. Un 38% menos; el titular quedó conversando con las
  columnas en vez de flotando.
- **Premios: logo a la izquierda, texto a la derecha.** Los dos logos tienen
  proporciones muy distintas (Salmón 546×352 = 1,55 · Prixtar 1920×768 = 2,50),
  así que comparten una caja fija de 150×86 y se ajustan con `object-fit:
  contain`: quedan ópticamente parejos sin deformarse. La columna de texto va a
  alto completo con las cifras empujadas al pie (`margin-top: auto`), de modo
  que **la línea de cifras queda alineada entre los dos premios** aunque los
  párrafos midan distinto. Verificado: ambas en el mismo píxel.
- **Copy: todo el sitio pasa a tú.** Estaba mezclado —Soluciones en usted
  ("Su equipo comercial", "Conozca", "Cumpla") y los CTA en tú— justo en los
  botones. Se unificó en tú con registro corporativo: imperativo directo, sin
  coloquialismos. Nueve frases cambiadas, más `sólo` → `solo` (la RAE ya no
  recomienda la tilde). **Se aparta del manual de marca, que pide usted**;
  decisión de Andrea.

- **Copy devuelto al brief original.** Al comparar el brief contra lo
  implementado quedó claro que Claude Design lo había reescrito de más: la V5
  leía como un resumen ejecutivo del texto, no como el texto. Se restauró:

  - **Hero y bajada del brief, en su estructura original de dos frases:**
    "La mejor versión de la información. / Más de 20 años entregándola." con la
    bajada "Somos la plataforma que más de 120 gestoras en Chile, Colombia,
    México y Perú eligen para distribuir, invertir y cumplir."

    Se probó primero una versión de una sola frase que incorporaba el mercado
    ("+20 años entregando la mejor versión de la información para el asset
    management latinoamericano.", 96 caracteres, tres líneas) y quedó larga.
    El brief ya lo tenía resuelto mejor: **golpe y prueba en dos tiempos**,
    63 caracteres. El mercado no se pierde — la bajada lo dice con países, que
    es más concreto que la etiqueta de categoría. `<title>` y meta description
    sí conservan "asset management latinoamericano", que ahí sirve para
    búsqueda.

    Se probó `+20 años` para que rimara con la fila de KPIs (+11.000, +1.400,
    +120), pero se dejó "Más de 20 años" tal como estaba en el brief: en una
    frase completa lee mejor que la abreviatura.

  - **La sección "Así funciona LVA"**, que la V5 había eliminado entera. Era la
    pérdida más grave: es el único lugar del sitio que responde "¿cuánto me
    cuesta implementar esto?", con "plataformas SaaS listas para usar" y sobre
    todo **"sin proyectos largos de implementación"**. Vuelve sobre
    `--v5-navy-mid`, con el mismo índice numerado de la batería de reportes,
    entre Nosotros y el footer.

  - **Las cifras de Riesgo** (3.000 reportes mensuales, 70+ fondos, +6.000
    millones gestionados). Sin ellas Riesgo era el dominio con menos evidencia
    de los cuatro, cuando en el brief era de los mejor respaldados.

  - **Cinco cierres de tarjeta** que estaban recortados, entre ellos el mejor
    argumento comercial del brief: "Tu fuerza de venta está para cerrar
    negocios, no armar documentos."

  - **Dos tarjetas caídas**: "Dedícate al análisis, no a los cálculos"
    (Automatización) e "Información pre-trade para tu equipo". De 16 a 18.

  - **El CTA de demo se movió de Nosotros a "Así funciona", como cuarta
    columna.** Remata el arco de esa sección —cómo empiezas— en vez del de
    quiénes somos, y al quedar en la misma fila que los tres pasos se lee como
    el cuarto tiempo de la secuencia: "Conversemos".

    Es **la única columna con caja** —lavado teal al 10% sobre el navy de la
    sección, con filete teal y radio 16— justamente para destacarla del resto,
    que va sin marco.

    La grilla es de cuatro columnas: la `<ol>` de pasos ocupa las tres primeras
    y se subdivide con el mismo gap, así las cuatro miden igual sin romper la
    semántica de lista. Se usó el gap de `.areas` —la otra grilla de cuatro del
    sitio— y el resultado calza exacto: **275px por columna en ambas secciones**.

    Se eliminó del CTA la frase "Sin proyecto de implementación" porque el paso
    03, justo al lado, ya la dice.

    Efecto colateral que hubo que corregir: sin el CTA, la columna derecha de
    Nosotros quedaba en 131px contra 406 de la izquierda. Los pilares pasaron
    de 2×2 a una sola columna con filete; la diferencia bajó a 64px y además
    leen como lo que son, una lista de principios.

  - **Los pilares de Nosotros alineados con el texto de Premios.** La columna
    derecha de Nosotros arrancaba en el borde de su columna (763px) mientras el
    texto de los premios de arriba empieza después del logo (945px), así que
    las dos secciones no compartían eje. Se sangró la columna de pilares
    exactamente el ancho del logo más su canal — tokenizado como
    `--v5-award-logo` + `--v5-award-gap`, no un número a ojo, para que siga
    cuadrando si cambia el tamaño del logo. Verificado: **ambos en 945px** a
    1440 y desfase 0 también a 1100. Se anula al apilar.

  - **Titular de "Así funciona" en una sola línea**: `max-width` de 760 a 920px.
    Comprobado a 1440 y a 1100.

  - **Eyebrow de esa sección: "ASÍ FUNCIONA LVA" → "TU CAMINO CON LVA".**
    El problema era de idea, no de layout: "así funciona" prometía un mecanismo
    y el titular daba una identidad, así que la etiqueta y el titular tiraban
    para lados distintos antes de llegar a las columnas. "Tu camino con LVA"
    encuadra las cuatro columnas como el arco de la relación —conocemos,
    construimos, creces, conversemos— y el titular dice quién está del otro
    lado. Se probó antes alinear el bloque a la izquierda para acercarlo a la
    grilla; se descartó, porque el problema no estaba en la maqueta.

    Se pasó por "TU PROYECTO CON LVA" y se cambió a "camino" porque el paso 03
    dice "sin proyectos largos de implementación" a veinte centímetros: la
    misma palabra con valencia opuesta —recorrido vs. implementación pesada—
    justo donde se promete evitarla.

  - **Bajada de Premios: vuelve la del brief.** La de la V5 tenía 246
    caracteres y caía en tres líneas; la del brief tiene 181 y entra en dos
    sin forzar la medida de lectura. Otro caso donde el texto original ya
    estaba mejor resuelto.

  - **Título de "Así funciona": "El partner tecnológico que sabe de
    inversiones."** Costó cuatro intentos y vale la pena dejar por qué, porque
    cada descarte acercó el foco:

    1. *"De la primera conversación a los primeros resultados."* — invento mío,
       describía un proceso sin prometer nada.
    2. *"Empiezas a usarlo, no a implementarlo."* — apuntaba a la objeción del
       proyecto largo, pero era una promesa de producto: cualquiera dice que su
       software está listo.
    3. *"Hablemos de lo que necesitas, no de cómo implementarlo."* — mejor,
       movía el eje a dónde vive la conversación, pero seguía sin nombrar la
       competencia que la hace posible.
    4. Andrea lo cerró: **no es un equipo de TI externo, es el partner
       tecnológico (data + SaaS) con conocimiento financiero.** "Sabe" y no
       "entiende": es la palabra que ella misma usó al describirlo, y afirma
       más. Gente que puede
       sentarse con un equipo de inversión como par y a la vez ir al fondo de
       los problemas de data y despliegue.

    Ese es el diferenciador difícil de copiar: la mayoría de los proveedores es
    o gente de finanzas que terceriza la tecnología, o gente de tecnología que
    no entiende los instrumentos. El dolor concreto del cliente es tener que
    explicarle duración o valorización a un consultor de TI.

  Se mantuvo de la V5 lo que sí mejoraba el brief: la jerarquía invertida
  (etiqueta chica + promesa grande) y el recorte de los *intros* de área, que
  estaban largos para un primer vistazo.

- **Tarjeta de CTA reordenada.** El texto iba con un `<br>` a mitad que
  chocaba con el corte natural del primer enunciado: la línea 1 terminaba con
  un "tu" colgando y la 2 era solo "propia cartera.". Ahora cada frase es su
  propio bloque con `text-wrap: balance`, así que la primera reparte sus dos
  líneas parejas y la segunda va en la suya. **Tres líneas ordenadas**, sin
  huérfanas. El botón se fijó con `flex: 0 0 auto` y `white-space: nowrap`
  para que no se encoja ni se parta; en teléfono baja debajo del texto.

- **Header: menú centrado en el eje de la página y texto más grande.** El nav
  pasó de flex con `space-between` a grilla `1fr | auto | 1fr`. Con flex los
  enlaces se centraban *entre* el logo y los botones, que tienen anchos
  distintos, así que quedaban corridos del eje. Con la grilla el centro es el
  de la página. Verificado a 1440: menú, eje de página y titular del hero los
  tres en **720 px**, desvío 0. En móvil la grilla pasa a `1fr auto` (logo y
  botón sandwich), con el panel fuera del flujo.
  Tamaños: enlaces 14 → **15,5px**; "Agenda tu demo" y "Acceso clientes"
  12,5 → **13,5px**.

- **Contenido desplegado de "Leer más" también más grande**: título de producto
  14,5 → 16px, párrafo 13 → **15px**, etiqueta 9,5 → 10,5px, ítems de la
  batería 13,5 → 14,5px.

- **Mini-títulos: un turquesa por fondo.** El `#067C90` del prototipo no
  alcanza AA en los degradados claros (4,27 al pie de Soluciones, 3,48 en
  Datos). Se armó una escala de tres tonos, cada uno el más vivo que pasa
  sobre su fondo, todos medidos en el peor caso del degradado:

  | Token | Valor | Dónde | Contraste |
  |---|---|---|---|
  | `--v5-teal-deep` | `#056E80` | Soluciones (blanco → #E9F1F4) | 5,92 / 5,17 |
  | `--v5-teal-mist` | `#056373` | Datos (#DCEAEE → #DED9D2) | 5,61 / 4,92 |
  | `--v5-teal-navy` | `#2FC3E3` | Premios y Nosotros | 5,71 / 8,09 |

  El eyebrow de Datos iba en gris en el prototipo; ahora es turquesa como los
  otros tres.

- **Columna derecha alineada al titular, no al mini-título**, en Datos y
  Nosotros. El desfase es un token calculado
  (`calc(13.2px + clamp(22px, 2.4vw, 32px))` = alto del eyebrow + margen del
  h2), no un número a ojo: si cambia el margen del titular, sigue cuadrando.
  Se anula al apilar bajo 900px. Verificado: desfase **0 px** a 1440 y a 1024.

- **Batería de reportes: fuera las píldoras.** El prototipo las traía como
  chips con fondo y radio 999px, y leían como botones o tags que llevaban a
  algún lado. No son interactivas: son el contenido de la batería. Pasaron a
  `<ul>` con índice numerado en teal (`01`–`06`, contador CSS, cifras
  tabulares) y filas separadas por filete: ordenado, escaneable, hace contable
  la batería y no parece un control. Se eliminó el token `--v5-chip`, que quedó sin uso.

- **Texto de párrafo más grande** que el prototipo, que iba en 12,5–13,5px:
  intros y cuerpos a 14–15px, y las etiquetas de apoyo un punto arriba para no
  perder la jerarquía. Sin desbordes a 1440 ni a 390, y el contraste sigue en 0
  fallos (subir el tamaño solo puede aflojar el umbral, nunca endurecerlo).

- **Hero un punto abajo**: titular `clamp(30px,3.7vw,54px)` →
  `clamp(28px,3.4vw,49px)` y bajada `clamp(15px,1.45vw,21px)` →
  `clamp(14.5px,1.32vw,19px)`. De 53/21 a 49/19 a 1440.

- **Datos: se quitaron los `max-width` del titular y del párrafo** (480px y
  452px del prototipo). Venían de un layout a sangre sin cap de 1440 y dejaban
  el texto 96 y 76px corto respecto del borde de su columna, que mide 576.
  Ahora ambos llenan la columna y cierran en el mismo píxel que Nosotros.

- **Eyebrow "NOSOTROS"** en el mismo turquesa `#5FC5DD` de Premios (8,47:1
  sobre navy), con el mismo respiro hasta el titular que en Datos. Nota: el
  eyebrow de Datos va en gris y no en turquesa **por decisión del prototipo**,
  no por el arreglo de contraste; homologarlo pediría un turquesa más oscuro,
  porque `#067C90` sobre `#DED9D2` solo alcanza 3,48:1.

- **Una sola grilla para Datos, Premios y Nosotros.** Datos usaba
  `auto-fit minmax(340px)` con su propio gap y colapsaba en otro punto; ahora
  las tres son `repeat(2, 1fr)` con el mismo token `--v5-gap-cols` y el mismo
  corte a una columna en 900px. El canal se ensanchó de 56 a **86,4 px** a
  1440 (`clamp(40px, 6vw, 88px)`). Verificado: idéntico en las tres, a 1440 y
  a 1024, y las tres apilan juntas bajo 900.

- **Más aire entre la bajada de Premios y los dos bloques**:
  `clamp(46px, 5vw, 68px)` → `clamp(56px, 7vw, 104px)`. De 68 a **100,8 px**.

- **Menú sandwich con corte en 1024px.** Es el estándar actual: tablet
  apaisada (1024 / 1194 / 1366) y escritorio con el menú completo; tablet
  vertical (768 / 834) y teléfono con sandwich. Verificado en los cinco anchos.
  El único caso ambiguo es el iPad Pro de 12,9" en vertical, que mide justo
  1024 y se queda con el menú completo — cabe de sobra, así que se dejó así.

  El panel **no duplica los enlaces**: el envoltorio `.nav__collapse` es
  `display: contents` en escritorio, así que logo, enlaces y acciones siguen
  siendo hermanos del mismo flex; bajo 1024px pasa a ser el desplegable.
  Accesible: `aria-expanded`, `aria-controls`, cierre con Escape, al hacer clic
  fuera y al elegir un enlace, y limpieza del estado si se pasa a escritorio
  con el panel abierto.

- **Datos en grilla 2×2 en teléfono.** Las cuatro cifras son cortas; apiladas
  en una sola columna estiraban la sección sin ganar legibilidad.

- **Premios apilados en teléfono**, con el logo arriba y el texto abajo: bajo
  600px la columna de 150px del logo dejaba el párrafo demasiado angosto. A ese
  ancho el párrafo además pasa de justificado a alineado a la izquierda, porque
  justificar abría ríos entre palabras.

- **Más margen lateral en todo el sitio, menos el header.** Se separó el ritmo
  horizontal en dos tokens: `--v5-pad-x` (56px máx, solo el header, intacto) y
  `--v5-pad-content` (`clamp(24px, 7vw, 112px)`) para el resto. A 1440px el
  contenido pasa de 56 a 101 px por lado; el logo y el menú siguen en 56.

### Commit asociado
`Implementa el diseño V5 de Claude Design`

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

**0. Parqueadas del editor de posts (sesión 5)**

- **Botón de IA para el resumen.** Propuesto y **descartado por ahora**: el repo
  es público y una clave de API dentro del editor quedaría expuesta en cuanto se
  commitee. La alternativa inmediata —clave pegada a mano y guardada solo en el
  navegador— también se descartó. Andrea lo retomará **si adoptan Netlify
  institucional**, donde la clave vive en el servidor. El mismo botón podría
  proponer título, etiqueta y minutos de lectura.
- **Resumen único para dos usos.** Hoy el mismo texto alimenta la
  `meta description` de Google y el extracto de la tarjeta del listado. Son
  públicos distintos: uno decide si entrar desde el buscador, el otro ya está
  dentro del sitio. Separarlos en dos campos está pendiente de decisión.
- **Importar `.docx` desde Google Docs.** Pegar desde Docs ya funciona con
  limpieza de formato. Arrastrar el archivo añadiría las imágenes del documento.
  A la espera de que el uso real lo pida.


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
