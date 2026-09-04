/* Editor WYSIWYG de posts del blog LVA.
   La página que ves ES el post: se edita encima, con la hoja de estilos real
   del sitio. Al exportar se clona el documento y se le quita todo lo del
   editor, así que lo que ves es exactamente lo que se publica.
   Herramienta interna: no se despliega ni se enlaza desde el sitio. */
(() => {
  const $ = s => document.querySelector(s);
  const texto = $('#texto'), zona = $('#zona');
  let media = null;              // { tipo, ext, blob, url } o { tipo:'youtube', id }

  /* ---------- el placeholder vuelve al vaciar ----------
     El CSS lo muestra con :empty, pero al borrar el último carácter el
     navegador deja un <br> dentro y el elemento deja de estar vacío: el
     placeholder no volvía a aparecer nunca. Se limpia ese resto.
     El cuerpo puede llevar imagen o video sin texto, así que ahí se comprueba
     además que no quede ningún medio dentro. */
  const normalizaVacio = el => {
    if (!el) return;
    const sinTexto = el.textContent.replace(/\u200B/g, '').trim() === '';
    const sinMedios = !el.querySelector('img, video, iframe, figure');
    if (sinTexto && sinMedios && el.innerHTML !== '') el.innerHTML = '';
  };
  document.querySelectorAll('[contenteditable][data-vacio]').forEach(el => {
    ['input', 'blur'].forEach(ev => el.addEventListener(ev, () => normalizaVacio(el)));
    normalizaVacio(el);
  });

  /* ---------- utilidades ---------- */
  const aRuta = t => String(t).toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '').slice(0, 60);

  const titulo = () => $('.post__titulo').textContent.trim();
  const base = () => aRuta(titulo()) || 'post';
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let temporizador;
  const avisa = t => {
    const a = $('#aviso'); a.textContent = t; a.classList.add('ver');
    clearTimeout(temporizador); temporizador = setTimeout(() => a.classList.remove('ver'), 4500);
  };

  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio',
                 'agosto','septiembre','octubre','noviembre','diciembre'];
  const hoy = () => { const d = new Date();
    return d.getDate() + ' ' + MESES[d.getMonth()] + ' ' + d.getFullYear(); };
  $('[data-campo="fecha"]').textContent = hoy();

  /* ---------- barra flotante de formato ----------
     Aparece sobre la selección, como en Squarespace. Se usa execCommand: está
     marcado como obsoleto pero no hay sustituto equivalente y funciona en todo.
     Es una herramienta interna, no código del sitio publicado. */
  const flot = $('#flot');

  const colocaBarra = () => {
    const sel = window.getSelection();
    if (!sel.rangeCount || sel.isCollapsed || !texto.contains(sel.anchorNode)) {
      flot.classList.remove('ver'); return;
    }
    const r = sel.getRangeAt(0).getBoundingClientRect();
    if (!r.width && !r.height) { flot.classList.remove('ver'); return; }
    flot.classList.add('ver');
    const x = r.left + r.width / 2 + scrollX - flot.offsetWidth / 2;
    const y = r.top + scrollY - flot.offsetHeight - 10;
    flot.style.left = Math.max(8, Math.min(x, scrollX + innerWidth - flot.offsetWidth - 8)) + 'px';
    flot.style.top  = Math.max(scrollY + 60, y) + 'px';
  };

  document.addEventListener('selectionchange', colocaBarra);
  addEventListener('scroll', () => flot.classList.contains('ver') && colocaBarra());

  flot.addEventListener('mousedown', e => e.preventDefault());
  flot.querySelectorAll('[data-cmd]').forEach(b =>
    b.addEventListener('click', () => { document.execCommand(b.dataset.cmd, false, null); recalcula(); }));
  flot.querySelectorAll('[data-bloque]').forEach(b =>
    b.addEventListener('click', () => { document.execCommand('formatBlock', false, b.dataset.bloque); recalcula(); }));
  $('#bEnlace')?.addEventListener('click', () => {
    const url = prompt('¿A qué dirección lleva el enlace?', 'https://');
    if (url) document.execCommand('createLink', false, url);
  });

  /* Pegar desde Word o Google Docs: conserva lo que es contenido y descarta
     los estilos y etiquetas con que ensucian el portapapeles. */
  texto.addEventListener('paste', e => {
    e.preventDefault();
    const html = e.clipboardData.getData('text/html');
    const plano = e.clipboardData.getData('text/plain');
    if (!html) { document.execCommand('insertText', false, plano); return; }
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const permitidas = ['P','BR','STRONG','B','EM','I','A','UL','OL','LI','H2','H3','BLOCKQUOTE'];
    tmp.querySelectorAll('*').forEach(el => {
      if (!permitidas.includes(el.tagName)) el.replaceWith(...el.childNodes);
      else [...el.attributes].forEach(a => { if (a.name !== 'href') el.removeAttribute(a.name); });
    });
    document.execCommand('insertHTML', false, tmp.innerHTML);
  });

  /* ---------- cabecera ---------- */
  const pintaMedia = () => {
    zona.querySelectorAll('img,video,iframe').forEach(e => e.remove());
    const vacia = $('#zonaVacia');
    if (!media) { vacia.style.display = ''; zona.classList.remove('tiene'); return; }
    vacia.style.display = 'none';
    zona.classList.add('tiene');
    let el;
    if (media.tipo === 'imagen') { el = document.createElement('img'); el.src = media.url; el.alt = titulo(); }
    else if (media.tipo === 'video') { el = document.createElement('video'); el.src = media.url; el.controls = true; el.playsInline = true; }
    else { el = document.createElement('iframe');
           el.src = 'https://www.youtube-nocookie.com/embed/' + media.id;
           el.title = titulo(); el.loading = 'lazy'; el.allowFullscreen = true; }
    zona.insertBefore(el, zona.firstChild);
  };

  const leeArchivo = (input, tipo) => {
    const f = input.files[0]; if (!f) return;
    const ext = (f.name.split('.').pop() || (tipo === 'imagen' ? 'jpg' : 'mp4')).toLowerCase();
    media = { tipo, ext, blob: f, url: URL.createObjectURL(f) };
    pintaMedia();
  };

  $('#bImagen')?.addEventListener('click', () => $('#fImagen').click());
  $('#bVideo')?.addEventListener('click', () => $('#fVideo').click());
  $('#fImagen')?.addEventListener('change', e => leeArchivo(e.target, 'imagen'));
  $('#fVideo')?.addEventListener('change', e => leeArchivo(e.target, 'video'));
  $('#bQuitar')?.addEventListener('click', () => { media = null; pintaMedia(); });
  $('#bYT')?.addEventListener('click', () => {
    const u = prompt('Pega el enlace del video de YouTube', 'https://www.youtube.com/watch?v=');
    if (!u) return;
    const m = String(u).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
    if (!m) { avisa('No reconozco ese enlace de YouTube.'); return; }
    media = { tipo: 'youtube', id: m[1] };
    pintaMedia();
  });

  /* ---------- ajustes ---------- */
  /* El panel de metadatos se comporta como un desplegable: se cierra al pulsar
     fuera o con Escape, no solo volviendo a pulsar el botón. */
  const panel = $('#panel'), bPanel = $('#bAjustes');
  const cierraPanel = () => { if (panel) panel.hidden = true; };

  /* Aviso de metadato obligatorio: se marca el botón y se pone el motivo a su
     lado, sin abrir el panel. Lo abre quien escribe, cuando quiera. */
  const rotuloFalta = $('#falta');
  const marcaFalta = txt => {
    if (!bPanel || !rotuloFalta) return;
    bPanel.classList.add('falta');
    rotuloFalta.textContent = txt;
    rotuloFalta.hidden = false;
  };
  const limpiaFalta = () => {
    bPanel?.classList.remove('falta');
    if (rotuloFalta) { rotuloFalta.hidden = true; rotuloFalta.textContent = ''; }
  };
  $('#resumen')?.addEventListener('input', () => { if ($('#resumen').value.trim()) limpiaFalta(); });
  bPanel?.addEventListener('click', e => { e.stopPropagation(); panel.hidden = !panel.hidden; });
  panel?.addEventListener('click', e => e.stopPropagation());
  document.addEventListener('click', () => { if (panel && !panel.hidden) cierraPanel(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel && !panel.hidden) { cierraPanel(); bPanel?.focus(); }
  });
  $('#resumen')?.addEventListener('input', () => {
    const n = $('#resumen').value.length, c = $('#cuenta');
    c.textContent = n + ' / 155';
    c.classList.toggle('mal', n > 155);
  });

  /* ---------- recuento y ruta ---------- */
  function recalcula() {
    const n = texto.innerText.trim().split(/\s+/).filter(Boolean).length;
    $('[data-campo="lectura"]').textContent = Math.max(1, Math.round(n / 200)) + ' min de lectura';
    $('#ruta').textContent = 'blog/' + base() + '.html';
    guarda();
  }
  document.addEventListener('input', recalcula);
  recalcula();

  /* ---------- exportar ----------
     Se clona el documento vivo y se le quita lo del editor. Así el archivo
     publicado es literalmente lo que hay en pantalla, sin una segunda
     plantilla que se pueda desincronizar. */
  function construye() {
    const d = document.documentElement.cloneNode(true);
    d.querySelectorAll('.adm,.panel,.flot,.aviso,.zona__botones,.zona__vacia,#fImagen,#fVideo,script,style')
      .forEach(e => e.remove());

    /* Todo lo que no puso el editor. Al alojarlo en Netlify, su insignia y sus
       meta acaban en el DOM, y las extensiones del navegador inyectan iframes y
       nodos sueltos: sin esto se cuelan en el archivo exportado. La primera
       exportacion real pesaba 22KB, de los que 13 eran basura de este tipo. */
    d.querySelectorAll('iframe:not(.post__media iframe), meta[name="hosting-provider"],' +
                       'meta[name="netlify-deploy"], input[type="file"], [data-nl-ready],' +
                       '[id^="nl-"], [class^="nl-"]').forEach(e => e.remove());
    d.querySelectorAll('body > *').forEach(e => {
      if ([...e.attributes].some(a => /^data-v-[0-9a-f]{6,}$/.test(a.name))) e.remove();
    });
    // Comentarios inyectados por el host
    const paseo = document.createTreeWalker(d, NodeFilter.SHOW_COMMENT);
    const fuera = [];
    while (paseo.nextNode()) if (/netlify/i.test(paseo.currentNode.nodeValue)) fuera.push(paseo.currentNode);
    fuera.forEach(c => c.remove());

    /* Netlify reescribe los enlaces a rutas absolutas (/blog en vez de
       ../blog.html). En GitHub Pages el sitio cuelga de /potencialweblva/, asi
       que una ruta absoluta apuntaria fuera. Se devuelven a relativas. */
    d.querySelectorAll('a[href^="/"]').forEach(a => {
      const h = a.getAttribute('href');
      if (h.startsWith('//')) return;
      a.setAttribute('href',
        h === '/' ? '../index.html'
        : h.startsWith('/#') ? '../index.html' + h.slice(1)
        : '../' + h.slice(1).replace(/^(blog|acceso)$/, '$1.html'));
    });
    d.querySelectorAll('[contenteditable]').forEach(e => {
      e.removeAttribute('contenteditable'); e.removeAttribute('data-vacio');
    });
    d.querySelectorAll('[data-campo]').forEach(e => e.removeAttribute('data-campo'));
    d.querySelector('#zona')?.classList.remove('zona', 'tiene');
    d.querySelector('#zona')?.removeAttribute('id');
    d.querySelector('#texto')?.removeAttribute('id');
    d.querySelector('meta[name="robots"]')?.remove();

    const img = d.querySelector('.post__media img, .post__media video');
    if (img && media && media.tipo !== 'youtube') img.src = 'images/' + base() + '.' + media.ext;
    d.querySelectorAll('video').forEach(v => { v.removeAttribute('controls'); v.setAttribute('controls',''); });

    d.querySelector('title').textContent = titulo() + ' - Blog - LVA Índices';
    let desc = d.querySelector('meta[name="description"]');
    if (!desc) { desc = d.ownerDocument.createElement('meta'); desc.name = 'description';
                 d.querySelector('head').appendChild(desc); }
    desc.setAttribute('content', $('#resumen').value.trim());
    d.querySelector('link[href="editor.js"]')?.remove();
    d.querySelector('body').style.paddingTop = '';
    d.querySelector('body').removeAttribute('style');

    const cuerpo = '<script src="../assets/brand/field.js"><\/script>';
    return '<!DOCTYPE html>\n<html lang="es">\n' + d.innerHTML.replace('</body>', cuerpo + '\n</body>') + '\n</html>\n';
  }

  const baja = (contenido, nombre, tipo) => {
    const a = document.createElement('a');
    a.href = contenido instanceof Blob ? URL.createObjectURL(contenido)
           : 'data:' + tipo + ';charset=utf-8,' + encodeURIComponent(contenido);
    a.download = nombre; a.click();
  };

  $('#bDescargar')?.addEventListener('click', async () => {
    if (!titulo()) { avisa('Falta el título.'); return; }
    if (!$('#resumen').value.trim()) {
      marcaFalta('Falta el resumen para Google');
      avisa('Falta el resumen para Google: está en Metadatos.'); return; }
    limpiaFalta();
    baja(construye(), base() + '.html', 'text/html');
    if (media && media.tipo !== 'youtube')
      setTimeout(() => baja(media.blob, base() + '.' + media.ext), 400);
    /* Tercer archivo: el listado ya actualizado, para no pegar nada a mano. */
    try {
      const listado = await listadoActualizado();
      setTimeout(() => baja(listado, 'blog.html', 'text/html'), 800);
      avisa('Tres archivos: el post va en blog/, la imagen en blog/images/ y blog.html reemplaza al de la raíz.');
    } catch (e) {
      baja(tarjeta(), base() + '-tarjeta.txt', 'text/plain');
      avisa('No pude actualizar el listado (' + e.message + '). Te dejo la tarjeta en .txt para pegarla en blog.html.');
    }
  });

  /* La tarjeta del listado, con el mismo marcado que usa blog.html */
  const tarjeta = () => {
    const ext = media && media.tipo !== 'youtube' ? media.ext : 'jpg';
    return '            <a class="entrada" href="blog/' + base() + '.html">\n' +
'                <div class="entrada__foto">\n' +
'                    <img src="blog/images/' + base() + '.' + ext + '"\n' +
'                         alt="' + esc(titulo()) + '" loading="lazy">\n' +
'                </div>\n' +
'                <div class="entrada__meta">\n' +
'                    <span>' + esc($('[data-campo="fecha"]').textContent.trim()) + '</span>\n' +
'                    <i></i>\n' +
'                    <span>' + esc($('#etiqueta').value) + '</span>\n' +
'                </div>\n' +
'                <h2 class="entrada__titulo">' + esc(titulo()) + '</h2>\n' +
'                <p class="entrada__bajada">' + esc($('#resumen').value) + '</p>\n' +
'                <span class="entrada__enlace">Leer el artículo &rarr;</span>\n' +
'            </a>';
  };

  /* Devuelve el blog.html actual con la tarjeta ya insertada arriba del listado.
     Se lee el archivo real del sitio, así que respeta lo que ya haya publicado. */
  const listadoActualizado = async () => {
    const r = await fetch('../blog.html', { cache: 'no-store' });
    if (!r.ok) throw new Error('no se pudo leer blog.html');
    const html = await r.text();
    const marca = '<div class="blog__grid">';
    const i = html.indexOf(marca);
    if (i < 0) throw new Error('no se encontró el listado en blog.html');
    if (html.includes('blog/' + base() + '.html'))
      throw new Error('ese post ya está en el listado');
    const corte = i + marca.length;
    /* blog.html usa CRLF: la tarjeta se inserta con el mismo fin de línea del
       archivo, para no dejarlo con finales mezclados. */
    const eol = html.includes('\r\n') ? '\r\n' : '\n';
    const bloque = tarjeta().split('\n').join(eol);
    return html.slice(0, corte) + eol + eol + bloque + html.slice(corte);
  };

  /* ---------- borrador ----------
     Solo texto: la imagen ocuparía demasiado en el almacenamiento del navegador. */
  const CLAVE = 'lva-post-borrador';
  function guarda() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify({
        titulo: $('.post__titulo').innerHTML,
        fecha: $('[data-campo="fecha"]').textContent,
        autor: $('[data-campo="autor"]').textContent,
        resumen: $('#resumen').value,
        etiqueta: $('#etiqueta').value,
        texto: texto.innerHTML
      }));
    } catch (e) {}
  }
  (function recupera() {
    try {
      const b = JSON.parse(localStorage.getItem(CLAVE) || 'null');
      if (!b) return;
      if (b.titulo) $('.post__titulo').innerHTML = b.titulo;
      if (b.fecha) $('[data-campo="fecha"]').textContent = b.fecha;
      if (b.autor) $('[data-campo="autor"]').textContent = b.autor;
      if (b.resumen) { $('#resumen').value = b.resumen; $('#resumen').dispatchEvent(new Event('input')); }
      if (b.etiqueta) $('#etiqueta').value = b.etiqueta;
      if (b.texto) texto.innerHTML = b.texto;
      recalcula();
    } catch (e) {}
  })();
})();
