/* Maqueta del CMS del sitio LVA. Layout completo, sin conexiones: nada se
   guarda. Los datos son los reales del sitio para que se pueda juzgar el
   diseño con contenido de verdad y no con relleno.
   Cuando se sepa dónde se aloja el sitio, lo que hay que enchufar es:
   cargar y guardar en las tres áreas, y un acceso de verdad en vez del
   candado de esta pantalla. */
(() => {
  const $ = s => document.querySelector(s);

  /* ---------- candado provisional ----------
     Comprobación en el navegador: sirve para que la pantalla no quede a la
     vista, no para proteger nada. El acceso real va del lado del servidor. */
  const CLAVE = 'Prueba2026';
  $('#formPuerta').addEventListener('submit', e => {
    e.preventDefault();
    if ($('#clave').value.trim() === CLAVE) {
      $('#puerta').hidden = true; $('#marco').hidden = false;
      try { sessionStorage.setItem('lva-admin', '1'); } catch (err) {}
    } else {
      $('#errorPuerta').textContent = 'Contraseña incorrecta.';
      $('#clave').select();
    }
  });
  try {
    if (sessionStorage.getItem('lva-admin')) { $('#puerta').hidden = true; $('#marco').hidden = false; }
  } catch (err) {}
  $('#salir').addEventListener('click', () => {
    try { sessionStorage.removeItem('lva-admin'); } catch (err) {}
    location.reload();
  });

  /* ---------- datos de muestra: copy real del sitio ---------- */
  const TEXTOS = {
    Portada: [
      ['Hero', [
        ['Titular', 'La mejor versión de la información.<br>Más de 20 años entregándola.', 'Lo primero que se lee', 2],
        ['Párrafo', 'Somos la plataforma que más de 120 gestoras en Chile, Colombia, México y Perú eligen para distribuir, invertir y cumplir.', 'Bajo el titular', 2]
      ]],
      ['Cifras', [
        ['Cifra 1', '+11.000 IRF', 'Franja bajo el hero', 1],
        ['Pie 1', 'Valorizados cada día', '', 1],
        ['Cifra 2', '+1.400 BMKs', '', 1],
        ['Pie 2', 'De renta fija local', '', 1]
      ]],
      ['Soluciones', [
        ['Rótulo', 'SOLUCIONES', 'Sobre el título', 1],
        ['Título', 'Cuatro dominios, un solo estándar de información.', '', 2]
      ]],
      ['__soluciones__', []],
      ['Premios', [
        ['Rótulo', 'PREMIOS', '', 1],
        ['Título', 'El estándar que la industria reconoce.', '', 2],
        ['Bajada', 'El Premio Salmón (Chile) y el Premio Prixtar (Colombia) son los referentes que definen la excelencia en fondos.', '', 3]
      ]],
      ['Tu camino con LVA', [
        ['Paso 1', 'Conocemos tu industria', 'Lleva formato dentro', 2],
        ['Paso 2', 'Construimos tecnología', 'Lleva formato dentro', 2],
        ['Paso 3', 'Tú creces, nosotros también', 'Lleva formato dentro', 2]
      ]]
    ],
    'Agenda tu demo': [
      ['Demo', [
        ['Rótulo', 'AGENDA TU DEMO', '', 1],
        ['Titular', 'Treinta minutos, sobre tu propia cartera.', '', 2],
        ['Bajada', 'Trabajamos con tus datos y tus casos reales, para que veas exactamente qué cambia en tu operación.', '', 2],
        ['Viñeta 1', 'Conversas con quien conoce la industria por dentro.', '', 1],
        ['Viñeta 2', 'Lo vemos en vivo, sobre tus propios instrumentos.', '', 1]
      ]]
    ],
    'Acceso clientes': [
      ['Acceso', [
        ['Titular', 'Bienvenido.', '', 1],
        ['Bajada', 'Ingresa tus datos y accede a tus aplicaciones LVA.', '', 2]
      ]]
    ],
    Blog: [
      ['Cabecera', [
        ['Rótulo', 'BLOG', '', 1],
        ['Titular', 'Blog', '', 1],
        ['Bajada', 'Noticias y novedades desde LVA Índices', '', 1]
      ]]
    ]
  };

  /* Soluciones va aparte: cuatro dominios con su introducción y 19 fichas.
     En una lista plana serían 61 campos seguidos, así que lleva su propia
     navegación por dominio dentro de la tarjeta. */
  const SOLUCIONES = {
    "tabs": [
      "Distribución",
      "Riesgo financiero",
      "Inversión y mercado",
      "Compliance"
    ],
    "paneles": {
      "distribucion": {
        "intro": "Somos los proveedores de servicios financieros más grandes de LATAM. Más de 500 asesores nos usan a diario.",
        "fichas": [
          [
            "UN SOLO CLICK",
            "Consolidación de carteras automática",
            "Qué hay realmente en cada cartera, consolidado en minutos."
          ],
          [
            "PLATAFORMA INTEGRAL",
            "Tu equipo comercial con toda la información",
            "Datos de mercado, análisis y contenido comercial centralizados. Deja de saltar entre sistemas."
          ],
          [
            "PROPUESTAS",
            "+1.000 propuestas al día",
            "Ajustadas al perfil de riesgo del cliente y generadas automáticamente. Tu fuerza de venta está para cerrar negocios, no armar documentos."
          ],
          [
            "INTELLIGENCE",
            "Conoce al comprador antes de la reunión",
            "Comportamientos y preferencias de los compradores institucionales del país. Llega a cada reunión entendiendo qué busca el comprador."
          ],
          [
            "MARKETING DE FONDOS",
            "Fichas y reportes con tu marca",
            "Formato consistente, información al día, sin producción manual. Cada pieza comunica exactamente lo que tú quieres decir."
          ]
        ]
      },
      "riesgo": {
        "intro": "Una nueva forma de entender tu riesgo. +3.000&nbsp;reportes, +70&nbsp;fondos y +6.000&nbsp;millones gestionados.",
        "fichas": [
          [
            "PRE-TRADE",
            "Métricas antes de tomar la decisión",
            "Análisis en tiempo real, conectado a tu proceso de inversión."
          ],
          [
            "CARTERAS COMPLEJAS",
            "Renta fija, derivados y alternativos",
            "Modelamiento apoyado en veinte años de experiencia local."
          ],
          [
            "NCG 507",
            "Cumple la norma a cabalidad",
            "Todas tus políticas y reportes, sin importar la cantidad de fondos."
          ],
          [
            "AUTOMATIZACIÓN",
            "Dedícate al análisis, no a los cálculos",
            "Todo automatizado y sin fricción con tus procesos. Usamos la mejor información del mercado y la combinamos con tu visión."
          ],
          [
            "PLATAFORMA",
            "Tecnología, no solo datos",
            "MCPs para alimentar tus agentes y control operativo del servicio."
          ]
        ]
      },
      "inversion": {
        "intro": "Más de 11.000 instrumentos de deuda valorizados cada día, con metodología auditada y reconocida por reguladores.",
        "fichas": [
          [
            "PRICING OFICIAL",
            "+11.000 precios certificados cada día",
            "Metodología transparente, auditada y reconocida por reguladores. Valoriza tus carteras con confianza absoluta."
          ],
          [
            "ANALYTICS DE DEUDA",
            "Curvas, spreads y comparables",
            "El mercado de renta fija local, completo y en tiempo real."
          ],
          [
            "BENCHMARKING",
            "+1.400 benchmarks",
            "Segmentados por plazo, emisor, rating y clase de activo. Mide tus fondos con los estándares que el mercado entiende."
          ],
          [
            "VALUATION",
            "Activos complejos",
            "Bonos, derivados, alternativos y deuda privada con modelos reconocidos."
          ],
          [
            "INFORMACIÓN DIARIA",
            "Información pre-trade para tu equipo",
            "Maneja toda la información de riesgo de tus fondos antes de tomar la decisión de inversión."
          ]
        ]
      },
      "compliance": {
        "intro": "Más de 90% de adopción del mercado en fichas regulatorias, con un solo sistema para cuatro marcos regulatorios.",
        "fichas": [
          [
            "90% DEL MERCADO",
            "Folletos informativos automáticos",
            "En el formato exacto que exigen la CMF y la SFC. +400 fichas al mes."
          ],
          [
            "4 PAÍSES",
            "Un solo proveedor regional",
            "Chile, Colombia, México y Perú desde un mismo sistema."
          ],
          [
            "TRANSPARENCIA",
            "Apertura completa de carteras",
            "Límites de inversión y reportería lista para el regulador."
          ],
          [
            "COLOMBIA",
            "Proveedor oficial de la industria de fondos",
            "Data certificada y al día para operar y cumplir."
          ]
        ]
      }
    }
  };

  const POSTS = [
    { titulo: 'Tenemos más tiempo, y ese tiempo es más valioso', fecha: '2 septiembre 2026',
      etiqueta: 'Ingeniería', estado: 'Publicado', autor: 'Mati — Jefe de Ingeniería' }
  ];

  const AJUSTES = [
    ['Identidad', [
      ['Título de la página', 'text', 'LVA Índices — La mejor versión de la información para el asset management latinoamericano', 'Lo que se ve en la pestaña del navegador y en Google'],
      ['Descripción para buscadores', 'textarea', 'Somos la plataforma que más de 120 gestoras en Chile, Colombia, México y Perú eligen para distribuir, invertir y cumplir.', 'Hasta 155 caracteres'],
      ['Favicon', 'archivo', 'iso_lva.svg', 'SVG o PNG cuadrado, mínimo 96×96']
    ]],
    ['Medición', [
      ['Identificador de Google Analytics', 'text', '', 'Formato G-XXXXXXXXXX. Vacío = sin medición'],
      ['Etiqueta de LinkedIn (Insight Tag)', 'text', '', 'Opcional']
    ]],
    ['Contacto', [
      ['Correo del formulario de demo', 'email', 'comercial@lvaindices.com', 'A dónde llegan las solicitudes'],
      ['Correo de soporte', 'email', 'soporte@lvaindices.com', 'Aparece en el pie']
    ]],
    ['Redes', [
      ['LinkedIn', 'url', 'https://www.linkedin.com/company/lva-indices', ''],
      ['X (Twitter)', 'url', '', 'Vacío = no se muestra'],
      ['YouTube', 'url', '', 'Vacío = no se muestra']
    ]],
    ['Pie de página', [
      ['Texto de copyright', 'text', '© 2026 LVA Índices. Santiago de Chile.', ''],
      ['Aviso legal', 'textarea', '', 'Opcional, aparece bajo el copyright']
    ]]
  ];

  /* ---------- pintado ---------- */
  const esc = t => String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

  function campo(etiqueta, valor, pista, filas, tipo) {
    const control = tipo === 'archivo'
      ? `<div class="dosCol"><input type="text" value="${esc(valor)}" readonly><button class="btn" type="button">Cambiar archivo</button></div>`
      : (filas > 1
          ? `<textarea rows="${filas}">${esc(valor)}</textarea>`
          : `<input type="${tipo || 'text'}" value="${esc(valor)}">`);
    return `<div class="campo">
      <div class="campo__et"><label>${esc(etiqueta)}</label>
        ${pista ? `<span class="campo__pista">${esc(pista)}</span>` : ''}</div>
      ${control}</div>`;
  }

  const IDS = ['distribucion', 'riesgo', 'inversion', 'compliance'];
  let dominio = 0;

  function tarjetaSoluciones() {
    const total = Object.values(SOLUCIONES.paneles).reduce((a, p) => a + 1 + p.fichas.length * 3, 0);
    const pes = SOLUCIONES.tabs.map((t, i) =>
      `<button type="button" data-dom="${i}" aria-selected="${i === dominio}">${esc(t)}</button>`).join('');
    const p = SOLUCIONES.paneles[IDS[dominio]];
    const fichas = p.fichas.map((f, i) => `
      <div class="ficha">
        <div class="ficha__n">Ficha ${i + 1} de ${p.fichas.length}</div>
        ${campo('Etiqueta', f[0], 'En mayúsculas, sobre el título', 1)}
        ${campo('Título', f[1], '', 2)}
        ${campo('Texto', f[2], '', 3)}
      </div>`).join('');
    return `<section class="tarjeta" id="tarjetaSoluciones">
      <div class="tarjeta__cab"><h2>Soluciones · los cuatro dominios</h2>
        <span class="cuenta">${total} textos</span></div>
      <div class="tarjeta__cuerpo">
        <div class="subpestanas">${pes}</div>
        ${campo('Introducción del dominio', p.intro, 'Bajo las pestañas, antes de las fichas', 3)}
        <div class="fichas">${fichas}</div>
      </div>
    </section>`;
  }

  function pintaTextos(pagina) {
    const secciones = TEXTOS[pagina] || [];
    const n = secciones.reduce((a, s) => a + s[1].length, 0);
    $('#subArea').textContent = pagina + ' · ' + n + ' textos';
    const pestanas = Object.keys(TEXTOS).map(p =>
      `<button type="button" data-pag="${esc(p)}" aria-selected="${p === pagina}">${esc(p)}</button>`).join('');
    const cuerpo = secciones.map(([titulo, campos]) => titulo === '__soluciones__'
      ? tarjetaSoluciones()
      : `
      <section class="tarjeta">
        <div class="tarjeta__cab"><h2>${esc(titulo)}</h2>
          <span class="cuenta">${campos.length} textos</span></div>
        <div class="tarjeta__cuerpo">${campos.map(c => campo(c[0], c[1], c[2], c[3])).join('')}</div>
      </section>`).join('');
    $('#area').innerHTML = `<div class="pestanas">${pestanas}</div>${cuerpo}
      <p class="nota">Los textos que llevan formato dentro (negritas, saltos de línea, enlaces) se editan conservando sus etiquetas.</p>`;
    $('#area').querySelectorAll('[data-pag]').forEach(b =>
      b.addEventListener('click', () => { dominio = 0; pintaTextos(b.dataset.pag); }));
    $('#area').querySelectorAll('[data-dom]').forEach(b =>
      b.addEventListener('click', () => { dominio = +b.dataset.dom; pintaTextos(pagina); }));
  }

  function pintaBlog() {
    $('#subArea').textContent = POSTS.length + (POSTS.length === 1 ? ' entrada' : ' entradas');
    const filas = POSTS.map(p => `
      <tr>
        <td><div class="miniatura">PORTADA</div></td>
        <td><strong style="color:var(--tinta)">${esc(p.titulo)}</strong>
            <div style="font-size:12.5px;color:var(--tenue)">${esc(p.autor)}</div></td>
        <td>${esc(p.fecha)}</td>
        <td><span class="pastilla">${esc(p.etiqueta)}</span></td>
        <td><span class="pastilla">${esc(p.estado)}</span></td>
        <td><div class="acciones"><button type="button">Editar</button><button type="button">Eliminar</button></div></td>
      </tr>`).join('');
    $('#area').innerHTML = `
      <section class="tarjeta">
        <div class="tarjeta__cab"><h2>Entradas publicadas</h2>
          <button class="btn btn--pri" type="button" style="margin-left:auto" id="nuevoPost">Escribir entrada</button></div>
        <div class="tarjeta__cuerpo">
          <table class="tabla">
            <thead><tr><th></th><th>Título</th><th>Fecha</th><th>Etiqueta</th><th>Estado</th><th></th></tr></thead>
            <tbody>${filas}</tbody>
          </table>
        </div>
      </section>
      <section class="tarjeta">
        <div class="tarjeta__cab"><h2>Borradores</h2></div>
        <div class="vacio">No hay borradores. Las entradas sin publicar aparecerán aquí.</div>
      </section>
      <p class="nota">«Escribir entrada» abre el editor de posts, que ya existe y funciona: se escribe sobre el artículo real, con la hoja de estilos del sitio.</p>`;
    $('#nuevoPost').addEventListener('click', () => window.open('../editor/', '_blank'));
  }

  function pintaAjustes() {
    $('#subArea').textContent = 'Configuración general';
    $('#area').innerHTML = AJUSTES.map(([titulo, campos]) => `
      <section class="tarjeta">
        <div class="tarjeta__cab"><h2>${esc(titulo)}</h2></div>
        <div class="tarjeta__cuerpo">${campos.map(c =>
          campo(c[0], c[2], c[3], c[1] === 'textarea' ? 3 : 1, c[1] === 'textarea' ? null : c[1])).join('')}</div>
      </section>`).join('') +
      `<p class="nota">Los cambios de configuración afectan a todas las páginas del sitio.</p>`;
  }

  const AREAS = {
    textos:  { titulo: 'Textos del sitio',  pinta: () => pintaTextos('Portada') },
    blog:    { titulo: 'Blog',              pinta: pintaBlog },
    ajustes: { titulo: 'Configuración',     pinta: pintaAjustes }
  };

  $('#nav').addEventListener('click', e => {
    const b = e.target.closest('[data-area]'); if (!b) return;
    $('#nav').querySelectorAll('button').forEach(x => x.setAttribute('aria-current', String(x === b)));
    const a = AREAS[b.dataset.area];
    $('#tituloArea').textContent = a.titulo;
    a.pinta();
  });

  AREAS.textos.pinta();
})();
