/* Textos del sitio desde la hoja de LVA.
   Cada texto editable lleva data-txt="clave" en el HTML. Este cargador lee la
   hoja publicada y reemplaza los que hayan cambiado.

   Reglas de seguridad del diseño:
   - El HTML manda como respaldo. Si la hoja no responde, tarda o viene vacía,
     el sitio se queda con su texto y nadie se entera.
   - Una clave que no existe en el HTML se ignora; una celda vacía se ignora.
   - Se limpia lo que llegue: no entran scripts ni manejadores de eventos.
   Cambiar de origen es cambiar la constante HOJA por la ruta a un archivo
   local; el resto no se toca. */
(() => {
  const HOJA = 'https://docs.google.com/spreadsheets/d/1cksJRVqbF3Xmz151_-L1d7ZBjAgPqxxIgwwwGVyWtDs/export?format=csv&gid=0';

  /* CSV con comillas, comas y saltos de línea dentro de las celdas */
  const leeCSV = txt => {
    const filas = []; let fila = [], celda = '', comillas = false;
    for (let i = 0; i < txt.length; i++) {
      const c = txt[i];
      if (comillas) {
        if (c === '"') { if (txt[i + 1] === '"') { celda += '"'; i++; } else comillas = false; }
        else celda += c;
      } else if (c === '"') comillas = true;
      else if (c === ',') { fila.push(celda); celda = ''; }
      else if (c === '\n') { fila.push(celda); filas.push(fila); fila = []; celda = ''; }
      else if (c !== '\r') celda += c;
    }
    if (celda || fila.length) { fila.push(celda); filas.push(fila); }
    return filas;
  };

  /* Se aceptan <br>, <strong>, <em> y entidades; se descarta lo demás */
  const limpia = html => {
    const d = document.createElement('div');
    d.innerHTML = html;
    d.querySelectorAll('script, style, iframe, object, embed, link, meta').forEach(e => e.remove());
    d.querySelectorAll('*').forEach(e => {
      [...e.attributes].forEach(a => {
        if (/^on/i.test(a.name) || /javascript:/i.test(a.value)) e.removeAttribute(a.name);
      });
    });
    return d.innerHTML;
  };

  const aplica = filas => {
    if (!filas.length) return 0;
    /* la primera fila es la cabecera; la clave va en la primera columna y el
       texto en la última con contenido */
    const cab = filas[0].map(c => c.trim().toLowerCase());
    const iClave = Math.max(0, cab.indexOf('clave'));
    let iTexto = cab.indexOf('texto');
    if (iTexto < 0) iTexto = filas[0].length - 1;
    const iBorrador = cab.indexOf('borrador');

    /* La vista previa muestra el borrador; el sitio público, solo lo publicado.
       Así se revisa un cambio antes de que lo vea nadie: se escribe en
       «borrador», se comprueba en la vista previa, y publicar es copiar esa
       celda a «texto». La lista de hosts de prueba es lo único que hay que
       tocar si cambia la URL de la vista previa. */
    const enPruebas = /(^|\.)netlify\.app$|^localhost$|^127\.0\.0\.1$/.test(location.hostname);

    let puestos = 0;
    for (let i = 1; i < filas.length; i++) {
      const clave = (filas[i][iClave] || '').trim();
      const publicado = (filas[i][iTexto] || '').trim();
      const borrador = iBorrador >= 0 ? (filas[i][iBorrador] || '').trim() : '';
      const texto = (enPruebas && borrador) ? borrador : publicado;
      if (!clave || !texto) continue;
      const el = document.querySelector('[data-txt="' + CSS.escape(clave) + '"]');
      if (!el) continue;
      const nuevo = limpia(texto);
      if (el.innerHTML.trim() === nuevo.trim()) continue;
      el.innerHTML = nuevo;
      puestos++;
    }
    return puestos;
  };

  const carga = async () => {
    if (!document.querySelector('[data-txt]')) return;
    try {
      const r = await fetch(HOJA, { cache: 'no-store' });
      if (!r.ok) return;
      aplica(leeCSV(await r.text()));
    } catch (e) { /* el HTML ya trae el texto: no se hace nada */ }
  };

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', carga)
    : carga();
})();
