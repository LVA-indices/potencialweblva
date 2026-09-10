/* Editor de textos del sitio LVA.
   Carga las páginas reales, muestra sus textos como formulario y devuelve el
   archivo con los textos cambiados. No añade nada al sitio: la sustitución se
   hace sobre el HTML original como texto, así que el resto del archivo —código,
   formato, finales de línea— sale byte por byte igual que entró.
   Herramienta interna: no se enlaza desde el sitio. */
(() => {
  const $ = s => document.querySelector(s);

  /* Solo secciones de contenido. Fuera navegación, pie y campos de formulario:
     ahí un cambio no es "texto", es estructura. */
  const PAGINAS = [
    { archivo: '../index.html', nombre: 'Portada', secciones: [
      ['.hero', 'Hero'], ['.kpis', 'Cifras'], ['.solutions', 'Soluciones'],
      ['.data', 'Datos'], ['.awards', 'Premios'], ['.about', 'Nosotros'],
      ['.how', 'Tu camino con LVA'] ] },
    { archivo: '../demo.html', nombre: 'Agenda tu demo', secciones: [['.demo', 'Demo']] },
    { archivo: '../acceso.html', nombre: 'Acceso clientes', secciones: [['.hero', 'Acceso']] },
    { archivo: '../blog.html', nombre: 'Blog', secciones: [['.blog__hero', 'Cabecera'], ['.blog', 'Listado']] }
  ];

  const ETIQUETAS = { H1:'Titular', H2:'Título', H3:'Subtítulo', P:'Párrafo', LI:'Viñeta', DIV:'Rótulo', SPAN:'Rótulo' };
  const SELECTOR = 'h1, h2, h3, p, li, .eyebrow';

  let actual = null;                 // { pag, crudo, campos[] }
  const estado = new Map();          // archivo -> { crudo, campos }

  let temporizador;
  const avisa = t => {
    const a = $('#aviso'); a.textContent = t; a.classList.add('ver');
    clearTimeout(temporizador); temporizador = setTimeout(() => a.classList.remove('ver'), 5000);
  };

  /* ---------- extracción ---------- */
  async function cargar(pag) {
    if (estado.has(pag.archivo)) return estado.get(pag.archivo);

    const r = await fetch(pag.archivo, { cache: 'no-store' });
    if (!r.ok) throw new Error('no se pudo leer ' + pag.archivo);
    const crudo = await r.text();
    const doc = new DOMParser().parseFromString(crudo, 'text/html');

    const campos = [];
    pag.secciones.forEach(([sel, grupo]) => {
      const sec = doc.querySelector(sel);
      if (!sec) return;
      sec.querySelectorAll(SELECTOR).forEach(el => {
        /* nada anidado: si un padre ya entró, el hijo se salta */
        if (el.parentElement.closest(SELECTOR)) return;
        const html = el.innerHTML.trim();
        const plano = el.textContent.replace(/\s+/g, ' ').trim();
        if (plano.length < 3) return;

        /* El ancla tiene que ser única en el archivo para sustituir sin tocar
           nada más. Primero se prueba con el texto solo; si aparece repetido
           —pasa con rótulos como SOLUCIONES— se usa la etiqueta completa, que
           lleva sus clases y casi siempre distingue. Si ninguna es única, el
           campo se muestra bloqueado en vez de arriesgar un cambio equivocado. */
        const corto = '>' + html + '<';
        const largo = el.outerHTML;
        let ancla = null, molde = null;
        if (crudo.split(corto).length - 1 === 1) { ancla = corto; molde = 'corto'; }
        else if (crudo.split(largo).length - 1 === 1) { ancla = largo; molde = 'largo'; }

        campos.push({
          grupo, etiqueta: ETIQUETAS[el.tagName] || el.tagName.toLowerCase(),
          conFormato: /<[a-z]/i.test(html),
          original: html, valor: html, ancla, molde, unico: ancla !== null
        });
      });
    });

    const datos = { crudo, campos };
    estado.set(pag.archivo, datos);
    return datos;
  }

  /* ---------- pintado ---------- */
  function pinta(pag, datos) {
    const lista = $('#lista');
    lista.innerHTML = '';
    let grupoActual = null, cont = null;

    datos.campos.forEach((c, i) => {
      if (c.grupo !== grupoActual) {
        grupoActual = c.grupo;
        cont = document.createElement('section');
        cont.className = 'grupo';
        cont.innerHTML = '<div class="grupo__titulo">' + c.grupo + '</div>';
        lista.appendChild(cont);
      }
      const campo = document.createElement('div');
      campo.className = 'campo' + (c.conFormato ? ' campo--codigo' : '');
      const et = document.createElement('div');
      et.className = 'campo__et';
      et.innerHTML = '<span class="campo__tipo">' + c.etiqueta + '</span>' +
        (c.conFormato ? '<span class="campo__formato">lleva formato dentro — conserva las etiquetas</span>' : '') +
        (c.unico ? '' : '<span class="campo__formato">texto repetido en la página: no se puede editar aquí</span>');
      const ta = document.createElement('textarea');
      ta.value = c.valor;
      ta.rows = Math.min(6, Math.ceil(c.valor.length / 78) + 1);
      ta.disabled = !c.unico;
      ta.addEventListener('input', () => {
        c.valor = ta.value;
        campo.classList.toggle('cambiado', c.valor !== c.original);
        refrescaCuenta();
      });
      campo.append(et, ta);
      cont.appendChild(campo);
    });

    $('#ruta').textContent = pag.nombre + ' · ' + datos.campos.length + ' textos';
    refrescaCuenta();
  }

  function cambiados(datos) { return datos.campos.filter(c => c.valor !== c.original); }

  function refrescaCuenta() {
    const datos = estado.get(actual.archivo);
    const n = cambiados(datos).length;
    $('#cuenta').textContent = n ? (n === 1 ? '1 texto editado' : n + ' textos editados') : '';
    $('#bDescargar').disabled = n === 0;
    $('#bDeshacer').disabled = n === 0;
    document.querySelectorAll('#paginas button').forEach(b => {
      const d = estado.get(b.dataset.archivo);
      b.classList.toggle('tocada', !!d && cambiados(d).length > 0);
    });
  }

  /* ---------- descarga ---------- */
  function descarga() {
    const datos = estado.get(actual.archivo);
    let salida = datos.crudo, aplicados = 0, fallidos = [];

    cambiados(datos).forEach(c => {
      if (!c.ancla || salida.split(c.ancla).length - 1 !== 1) { fallidos.push(c.etiqueta); return; }
      const nuevo = c.molde === 'corto'
        ? '>' + c.valor + '<'
        : c.ancla.replace('>' + c.original + '<', '>' + c.valor + '<');
      if (nuevo === c.ancla) { fallidos.push(c.etiqueta); return; }
      salida = salida.replace(c.ancla, nuevo);
      aplicados++;
    });

    if (!aplicados) { avisa('No se pudo aplicar ningún cambio.'); return; }

    const a = document.createElement('a');
    a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(salida);
    a.download = actual.archivo.replace('../', '');
    a.click();

    const cuantos = aplicados === 1 ? '1 cambio aplicado' : aplicados + ' cambios aplicados';
    avisa(fallidos.length
      ? cuantos + '. ' + fallidos.length + ' no se pudieron aplicar (' + fallidos.join(', ') + ').'
      : cuantos + '. El archivo descargado reemplaza a ' + a.download + ' en el sitio.');
  }

  /* ---------- comprobación de la hoja ----------
     El sitio lee los textos de una hoja de LVA. Si deja de leerse, el sitio no
     se rompe: se queda con el texto del HTML, y el cambio simplemente no
     aparece. Como eso es invisible desde fuera, aquí se dice en voz alta. */
  const HOJA = 'https://docs.google.com/spreadsheets/d/1cksJRVqbF3Xmz151_-L1d7ZBjAgPqxxIgwwwGVyWtDs/export?format=csv&gid=0';
  const ENLACE_HOJA = 'https://docs.google.com/spreadsheets/d/1cksJRVqbF3Xmz151_-L1d7ZBjAgPqxxIgwwwGVyWtDs/edit';

  async function compruebaHoja() {
    const caja = $('#salud');
    const pon = (clase, html) => { caja.className = 'salud ' + clase; caja.innerHTML = html; };
    const abrir = ' <a href="' + ENLACE_HOJA + '" target="_blank" rel="noopener">abrir la hoja</a>';
    try {
      const r = await fetch(HOJA, { cache: 'no-store' });
      const txt = await r.text();
      if (!r.ok || /^\s*<!DOCTYPE/i.test(txt)) {
        pon('mal', '<b>La hoja no se puede leer.</b> El sitio sigue mostrando su texto, ' +
          'así que los cambios que hagas ahí <b>no se verán</b>. Suele ser el permiso: ' +
          'en Compartir, «Acceso general» tiene que estar en <b>Cualquier persona con el enlace · Lector</b>.' + abrir);
        return;
      }
      /* Claves de la hoja frente a marcas del sitio. Hay celdas con saltos de
         línea dentro, así que partir por líneas cuenta filas de más: se usa un
         analizador que respeta las comillas. */
      const leeCSV = t => {
        const f = []; let fila = [], celda = '', q = false;
        for (let i = 0; i < t.length; i++) {
          const c = t[i];
          if (q) { if (c === '"') { if (t[i+1] === '"') { celda += '"'; i++; } else q = false; } else celda += c; }
          else if (c === '"') q = true;
          else if (c === ',') { fila.push(celda); celda = ''; }
          else if (c === '\n') { fila.push(celda); f.push(fila); fila = []; celda = ''; }
          else if (c !== '\r') celda += c;
        }
        if (celda || fila.length) { fila.push(celda); f.push(fila); }
        return f;
      };
      const filas = leeCSV(txt).slice(1).map(f => (f[0] || '').trim()).filter(Boolean);
      const marcas = new Set();
      await Promise.all(PAGINAS.map(async p => {
        try {
          const h = await (await fetch(p.archivo, { cache: 'no-store' })).text();
          (h.match(/data-txt="([^"]+)"/g) || []).forEach(m => marcas.add(m.slice(10, -1)));
        } catch (e) { /* nada */ }
      }));
      const huerfanas = filas.filter(k => !marcas.has(k));
      const sinFila = [...marcas].filter(k => !filas.includes(k));

      let extra = '';
      if (huerfanas.length) extra += ' <b>' + huerfanas.length + '</b> fila(s) con una clave que ya no existe en el sitio: no se aplican.';
      if (sinFila.length) extra += ' <b>' + sinFila.length + '</b> texto(s) del sitio sin fila en la hoja: solo se pueden cambiar desde aquí.';
      pon('bien', '<b>La hoja se lee bien.</b> ' + filas.length + ' filas, ' +
        (filas.length - huerfanas.length) + ' aplicándose al sitio.' + extra + abrir);
    } catch (e) {
      pon('mal', '<b>No se pudo consultar la hoja</b> (' + e.message + '). El sitio sigue mostrando su texto.' + abrir);
    }
  }

  /* ---------- arranque ---------- */
  async function abre(pag, boton) {
    document.querySelectorAll('#paginas button').forEach(b => b.setAttribute('aria-selected', String(b === boton)));
    actual = pag;
    $('#lista').innerHTML = '<p class="cargando">Cargando ' + pag.nombre + '…</p>';
    try {
      pinta(pag, await cargar(pag));
    } catch (e) {
      $('#lista').innerHTML = '<p class="cargando">No se pudo cargar ' + pag.archivo + ': ' + e.message + '</p>';
    }
  }

  const barra = $('#paginas');
  PAGINAS.forEach((pag, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = pag.nombre; b.dataset.archivo = pag.archivo;
    b.setAttribute('aria-selected', String(i === 0));
    b.addEventListener('click', () => abre(pag, b));
    barra.appendChild(b);
    if (i === 0) setTimeout(() => abre(pag, b), 0);
  });

  compruebaHoja();

  $('#bDescargar').addEventListener('click', descarga);
  $('#bDeshacer').addEventListener('click', () => {
    const datos = estado.get(actual.archivo);
    datos.campos.forEach(c => { c.valor = c.original; });
    pinta(actual, datos);
    avisa('Se deshicieron los cambios de esta página.');
  });
})();
