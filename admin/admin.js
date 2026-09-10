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
        ['Título', 'Cuatro dominios, un solo estándar de información.', '', 2],
        ['Intro · Distribución', 'Somos los proveedores de servicios financieros más grandes de LATAM.', 'Bajo las pestañas', 2],
        ['Ficha · etiqueta', 'UN SOLO CLICK', 'Primera ficha de Distribución', 1],
        ['Ficha · título', 'Consolidación de carteras automática', '', 2],
        ['Ficha · texto', 'Qué hay realmente en cada cartera, consolidado en minutos.', '', 3]
      ]],
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

  function pintaTextos(pagina) {
    const secciones = TEXTOS[pagina] || [];
    const n = secciones.reduce((a, s) => a + s[1].length, 0);
    $('#subArea').textContent = pagina + ' · ' + n + ' textos';
    const pestanas = Object.keys(TEXTOS).map(p =>
      `<button type="button" data-pag="${esc(p)}" aria-selected="${p === pagina}">${esc(p)}</button>`).join('');
    const cuerpo = secciones.map(([titulo, campos]) => `
      <section class="tarjeta">
        <div class="tarjeta__cab"><h2>${esc(titulo)}</h2>
          <span class="cuenta">${campos.length} textos</span></div>
        <div class="tarjeta__cuerpo">${campos.map(c => campo(c[0], c[1], c[2], c[3])).join('')}</div>
      </section>`).join('');
    $('#area').innerHTML = `<div class="pestanas">${pestanas}</div>${cuerpo}
      <p class="nota">Los textos que llevan formato dentro (negritas, saltos de línea, enlaces) se editan conservando sus etiquetas.</p>`;
    $('#area').querySelectorAll('[data-pag]').forEach(b =>
      b.addEventListener('click', () => pintaTextos(b.dataset.pag)));
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
