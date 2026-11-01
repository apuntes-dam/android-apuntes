/* Tutor de IA para los exámenes de desarrollo (respuesta escrita).
   SIN API, SIN claves y SIN servidor propio: el botón abre la web de la IA que elijas (ChatGPT, Perplexity, Claude, Gemini, Copilot o Le Chat)
   con un texto ya escrito que la pone en modo tutor: la pregunta, la respuesta de referencia del profesor y la respuesta de quien estudia.
   Algunos chats aceptan el texto en el enlace (ChatGPT y Perplexity, incluso sin cuenta; Claude, tras iniciar sesión). En los demás, o si el
   texto es muy largo, se copia al portapapeles y se pega con Ctrl+V. Lo que se escribe solo se guarda en el navegador de cada persona.
   Datos: window.TUTOR_IA[banco] = { asig, titulo, preguntas: [{ n, tema, q, r, pts }] }.
   Marcas: <div class="tutor-ia" data-banco="x" data-n="3"> (una pregunta) y <div class="tutor-ia-examen" data-banco="x"> (todo el examen). */
(function () {
  "use strict";

  var URL_MAX = 6500;       // un enlace más largo no lo aceptan todos los chats: entonces se copia el texto
  var IAS = [
    { id: "chatgpt", nombre: "ChatGPT", cuenta: "funciona sin cuenta", base: "https://chatgpt.com/", enlace: "https://chatgpt.com/?q=" },
    { id: "perplexity", nombre: "Perplexity", cuenta: "funciona sin cuenta", base: "https://www.perplexity.ai/", enlace: "https://www.perplexity.ai/search?q=" },
    { id: "claude", nombre: "Claude", cuenta: "pide iniciar sesión (hay plan gratuito)", base: "https://claude.ai/new", enlace: "https://claude.ai/new?q=" },
    { id: "gemini", nombre: "Gemini", cuenta: "pide cuenta de Google", base: "https://gemini.google.com/app" },
    { id: "copilot", nombre: "Copilot", cuenta: "pide cuenta de Microsoft", base: "https://copilot.microsoft.com/" },
    { id: "mistral", nombre: "Le Chat (Mistral)", cuenta: "pide cuenta", base: "https://chat.mistral.ai/chat" }
  ];
  var MODOS = {
    tutor: { nombre: "Tutor: me guía con pistas",
      texto: "MODO TUTOR (quiero aprender, no solo saber la nota):\n" +
             "1. Dime en una línea qué he acertado.\n" +
             "2. De lo que falta o está mal, NO me des la solución: hazme UNA pregunta o dame UNA pista para que lo descubra yo.\n" +
             "3. Espera mi siguiente mensaje antes de dar más ayuda.\n" +
             "4. Si tras dos intentos sigo sin sacarlo, explícamelo con un ejemplo sencillo y vuelve a preguntármelo con otras palabras para comprobar que lo he entendido.\n" +
             "Si no he escrito nada, empieza con una pregunta fácil que me encamine." },
    corregir: { nombre: "Corregir como el profesor",
      texto: "MODO CORRECCIÓN (como en el examen):\n" +
             "1. Lista cada cosa que pide la pregunta y marca: ✅ bien, ⚠️ incompleta o ❌ falta.\n" +
             "2. Pon una nota orientativa sobre la puntuación de la pregunta.\n" +
             "3. Reescribe mi respuesta en 2 o 3 frases, como la escribirías en el examen.\n" +
             "4. Hazme una pregunta de repaso parecida y espera mi respuesta." },
    pistas: { nombre: "Solo pistas",
      texto: "MODO PISTAS: no me corrijas con nota. Dame tres pistas, de menos a más claras, y espera a que lo intente después de cada una." },
    explicar: { nombre: "Explícamelo (me rindo)",
      texto: "MODO EXPLICACIÓN: me he rendido. Explícame la respuesta con palabras sencillas y un ejemplo, y después hazme una pregunta de comprobación para ver si lo he entendido." }
  };
  var NORMAS = "NORMAS: responde en español, tuteándome y con frases cortas. Evalúa con la respuesta de referencia; si algo de lo que digo es cierto aunque no esté en ella, " +
               "dímelo. No inventes datos: si dudas, dilo. Al final pregúntame qué quiero hacer a continuación.";

  /* ---------- utilidades ---------- */
  function guardar(clave, valor) { try { localStorage.setItem("tutor-ia:" + clave, valor); } catch (e) {} }
  function leer(clave) { try { return localStorage.getItem("tutor-ia:" + clave); } catch (e) { return null; } }
  function h(tag, atrib, hijos) {
    var el = document.createElement(tag), k;
    for (k in (atrib || {})) {
      if (k === "class") el.className = atrib[k];
      else if (k.indexOf("on") === 0) el.addEventListener(k.slice(2), atrib[k]);
      else el.setAttribute(k, atrib[k]);
    }
    (hijos instanceof Array ? hijos : hijos === undefined ? [] : [hijos]).forEach(function (c) { el.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return el;
  }
  function ia(id) { for (var i = 0; i < IAS.length; i++) if (IAS[i].id === id) return IAS[i]; return IAS[0]; }
  function prefs() { try { return JSON.parse(leer("prefs") || "{}") || {}; } catch (e) { return {}; } }
  function guardarPrefs(p) { guardar("prefs", JSON.stringify(p)); }

  /* Copia de forma síncrona (dentro del clic) para poder abrir la pestaña justo después sin que la bloqueen. */
  function copiar(texto) {
    var ok = false, ta = h("textarea", { "aria-hidden": "true" });
    ta.value = texto; ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.appendChild(ta); ta.select();
    try { ok = document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
    if (navigator.clipboard && navigator.clipboard.writeText) { try { navigator.clipboard.writeText(texto); ok = true; } catch (e) {} }
    return ok;
  }
  function enviar(ai, texto, aviso, pegarSiempre) {
    var url = ai.enlace && !pegarSiempre ? ai.enlace + encodeURIComponent(texto) : null;
    if (url && url.length <= URL_MAX) {
      window.open(url, "_blank", "noopener");
      aviso("Abierto en " + ai.nombre + " con el texto ya escrito. Si no lo ves, pulsa «Copiar el texto» y pégalo con Ctrl+V.");
      return;
    }
    var ok = copiar(texto);
    window.open(ai.base, "_blank", "noopener");
    aviso(ok ? "Texto copiado. En " + ai.nombre + ", pégalo con Ctrl+V y envíalo."
             : "No he podido copiar solo: pulsa «Copiar el texto» (o selecciona el texto de abajo) y pégalo en " + ai.nombre + ".");
  }

  /* ---------- los textos que se envían ---------- */
  function promptPregunta(banco, p, respuesta, modo) {
    var pts = p.pts ? "Esta pregunta vale " + String(p.pts).replace(".", ",") + " puntos en el examen." : "Es un ejercicio de práctica (no puntúa).";
    return "Actúa como mi TUTOR de «" + banco.asig + "» (ciclo DAM, España). Estoy preparando un examen ESCRITO de desarrollo: se responde con lo explicado en clase " +
           "y lo que se pide en cada pregunta es exactamente lo que debe constar en la respuesta. " + pts + "\n\n" +
           "PREGUNTA\n" + p.q + "\n\n" +
           "RESPUESTA DE REFERENCIA (lo que el profesor da por correcto; úsala para evaluarme, no me la sueltes entera si estoy practicando)\n" + p.r + "\n\n" +
           "MI RESPUESTA\n" + (respuesta && respuesta.trim() ? respuesta.trim() : "(Todavía no he escrito nada.)") + "\n\n" +
           MODOS[modo].texto + "\n\n" + NORMAS;
  }
  function mezclar(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function promptExamen(banco, modo, orden, cuantas) {
    var lista = banco.preguntas.filter(function (p) { return p.pts; });        // las de práctica sin nota se dejan fuera del examen
    if (orden === "azar") lista = mezclar(lista);
    if (cuantas > 0 && cuantas < lista.length) {                                // un recorte en orden reparte las preguntas entre todos los temas
      var total = lista.length;
      lista = Array.apply(null, Array(cuantas)).map(function (_, i) { return lista[Math.floor(i * total / cuantas)]; });
    }
    var bloques = lista.map(function (p, i) {
      return "--- PREGUNTA " + (i + 1) + (p.tema ? " (" + p.tema + ")" : "") + " ---\n" + p.q + "\nREFERENCIA: " + p.r.replace(/\n+/g, "\n");
    }).join("\n\n");
    return "Actúa como mi TUTOR de «" + banco.asig + "» (ciclo DAM, España) y examíname. Es un examen ESCRITO de desarrollo: se responde con lo explicado en clase y " +
           "lo que se pide en cada pregunta es exactamente lo que debe constar en la respuesta. Cada pregunta vale 0,25 puntos.\n\n" +
           "CÓMO FUNCIONA\n" +
           "1. Hazme UNA pregunta cada vez, en el orden del banco, y espera mi respuesta. No me enseñes las referencias ni las preguntas siguientes.\n" +
           "2. Cuando conteste, aplica el modo indicado más abajo y, al terminar, pasa a la siguiente pregunta.\n" +
           "3. Cada 5 preguntas, resume en 2 líneas mis aciertos y fallos.\n" +
           "4. Al final, dame una nota sobre 10 y la lista de temas que debo repasar.\n" +
           "Empieza ya con la pregunta 1.\n\n" +
           MODOS[modo].texto + "\n\n" + NORMAS + "\n\n" +
           "BANCO DE " + lista.length + " PREGUNTAS (con la respuesta de referencia del profesor, solo para que me evalúes)\n\n" + bloques;
  }

  /* ---------- una pregunta ---------- */
  function montarPregunta(el) {
    var banco = (window.TUTOR_IA || {})[el.getAttribute("data-banco")], n = Number(el.getAttribute("data-n"));
    if (!banco || el.getAttribute("data-montado")) return;
    el.setAttribute("data-montado", "1");
    var p = null;
    banco.preguntas.forEach(function (x) { if (x.n === n) p = x; });
    if (!p) return;
    var clave = "resp:" + el.getAttribute("data-banco") + ":" + n, pr = prefs();
    var ta = h("textarea", { class: "tutor-ia-resp", rows: "5", placeholder: "Escribe aquí tu respuesta, como en el examen (solo se guarda en tu navegador)", "aria-label": "Tu respuesta" });
    ta.value = leer(clave) || "";
    ta.addEventListener("input", function () { guardar(clave, ta.value); });
    var selIA = h("select", { "aria-label": "IA" }, IAS.map(function (a) { return h("option", { value: a.id }, a.nombre); }));
    var selModo = h("select", { "aria-label": "Modo" }, Object.keys(MODOS).map(function (m) { return h("option", { value: m }, MODOS[m].nombre); }));
    selIA.value = pr.ia || "chatgpt"; selModo.value = pr.modo || "tutor";
    var nota = h("p", { class: "tutor-ia-nota" });
    var aviso = h("p", { class: "tutor-ia-aviso", role: "status" });
    var boton = h("button", { type: "button", class: "tutor-ia-btn" });
    function pintar() {
      var a = ia(selIA.value);
      boton.textContent = "Abrir en " + a.nombre;
      nota.textContent = a.nombre + " " + a.cuenta + ". " + (a.enlace ? "Se abre con el texto ya escrito." : "Se copia el texto y lo pegas con Ctrl+V.");
      var q = prefs(); q.ia = selIA.value; q.modo = selModo.value; guardarPrefs(q);
    }
    selIA.addEventListener("change", pintar); selModo.addEventListener("change", pintar);
    function texto() { return promptPregunta(banco, p, ta.value, selModo.value); }
    boton.addEventListener("click", function () { enviar(ia(selIA.value), texto(), function (m) { aviso.textContent = m; }); });
    var copia = h("button", { type: "button", class: "tutor-ia-btn sec" }, "Copiar el texto");
    copia.addEventListener("click", function () { aviso.textContent = copiar(texto()) ? "Texto copiado: pégalo en el chat de la IA que prefieras." : "No he podido copiar: usa la opción de tu navegador."; });
    pintar();
    el.appendChild(h("details", { class: "tutor-ia-caja" }, [
      h("summary", {}, "✍️ Contesta y pídele a una IA que te ayude"),
      ta,
      h("div", { class: "tutor-ia-fila" }, [h("label", {}, ["IA ", selIA]), h("label", {}, ["Modo ", selModo]), boton, copia]),
      nota, aviso
    ]));
  }

  /* ---------- corrección final: todas las respuestas escritas, en un solo texto ---------- */
  function guardada(bancoId, n) { return (leer("resp:" + bancoId + ":" + n) || "").trim(); }
  function contestadas(bancoId, banco) {
    return banco.preguntas.filter(function (p) { return p.pts && guardada(bancoId, p.n); }).length;
  }
  function promptCorreccion(bancoId, banco, repasar) {
    var lista = banco.preguntas.filter(function (p) { return p.pts; });
    var bloques = lista.map(function (p, i) {
      return "--- PREGUNTA " + (i + 1) + (p.tema ? " (" + p.tema + ")" : "") + " ---\n" + p.q + "\nREFERENCIA: " + p.r.replace(/\n+/g, "\n") +
             "\nMI RESPUESTA: " + (guardada(bancoId, p.n) || "(sin contestar)");
    }).join("\n\n");
    var maximo = String(lista.length * 0.25).replace(".", ",");
    return "Actúa como mi PROFESOR Y TUTOR de «" + banco.asig + "» (ciclo DAM, España) y corrige mi examen de prueba. Es un examen ESCRITO de desarrollo: se responde con lo explicado en clase " +
           "y lo que se pide en cada pregunta es exactamente lo que debe constar en la respuesta. Cada pregunta vale 0,25 puntos; las " + lista.length + " suman " + maximo + ".\n\n" +
           "CÓMO CORREGIR\n" +
           "1. Para cada pregunta, en una línea: ✅ (0,25), ⚠️ (parcial: 0,10 o 0,15) o ❌ (0), y qué falta o qué está mal, comparando con la REFERENCIA. Las que están sin contestar valen 0: dilo.\n" +
           "2. Si algo de lo que digo es cierto aunque no esté en la referencia, indícalo.\n" +
           "3. Al final: mi nota total sobre " + maximo + ", los puntos por tema y los 5 puntos que más debo repasar, por orden de importancia.\n" +
           (repasar ? "4. Cuando termines la corrección, repasamos mis fallos como TUTOR: empieza por la pregunta en la que más puntos he perdido; hazme UNA pregunta o dame UNA pista para que lo descubra yo, " +
                      "espera mi respuesta y no pases a la siguiente hasta que lo tenga claro.\n"
                    : "4. Termina preguntándome qué quiero repasar primero.\n") + "\n" +
           NORMAS + "\n\n" +
           "PREGUNTAS, REFERENCIAS DEL PROFESOR (solo para que me evalúes) Y MIS RESPUESTAS\n\n" + bloques;
  }

  /* ---------- todo el examen ---------- */
  function montarExamen(el) {
    var banco = (window.TUTOR_IA || {})[el.getAttribute("data-banco")];
    if (!banco || el.getAttribute("data-montado")) return;
    el.setAttribute("data-montado", "1");
    var bancoId = el.getAttribute("data-banco");
    var pr = prefs(), total = banco.preguntas.filter(function (p) { return p.pts; }).length;
    var selIA = h("select", { "aria-label": "IA" }, IAS.map(function (a) { return h("option", { value: a.id }, a.nombre); }));
    var selModo = h("select", { "aria-label": "Modo" }, Object.keys(MODOS).filter(function (m) { return m === "tutor" || m === "corregir"; })
      .map(function (m) { return h("option", { value: m }, MODOS[m].nombre); }));
    var selOrden = h("select", { "aria-label": "Orden" }, [h("option", { value: "orden" }, "En orden"), h("option", { value: "azar" }, "Al azar")]);
    var selNum = h("select", { "aria-label": "Cuántas preguntas" }, [h("option", { value: "10" }, "10 preguntas"), h("option", { value: "20" }, "20 preguntas"),
      h("option", { value: "0" }, "Las " + total)]);
    selIA.value = pr.ia || "chatgpt"; selModo.value = pr.modo === "corregir" ? "corregir" : "tutor"; selNum.value = "10";
    var aviso = h("p", { class: "tutor-ia-aviso", role: "status" });
    var area = h("textarea", { class: "tutor-ia-resp", rows: "6", readonly: "readonly", "aria-label": "Texto que se envía a la IA", style: "display:none" });
    function texto() { return promptExamen(banco, selModo.value, selOrden.value, Number(selNum.value)); }
    var boton = h("button", { type: "button", class: "tutor-ia-btn" }, "Preparar el examen y abrir la IA");
    boton.addEventListener("click", function () {
      var t = texto(), a = ia(selIA.value);
      area.value = t; area.style.display = "block";
      var q = prefs(); q.ia = selIA.value; guardarPrefs(q);
      enviar(a, t, function (m) { aviso.textContent = m; }, true);        // es largo: siempre se copia y se pega
    });
    var copia = h("button", { type: "button", class: "tutor-ia-btn sec" }, "Copiar el texto");
    copia.addEventListener("click", function () { var t = texto(); area.value = t; area.style.display = "block"; aviso.textContent = copiar(t) ? "Texto copiado: pégalo en el chat de la IA que prefieras." : "No he podido copiar solo: selecciona el texto de abajo y cópialo."; });
    el.appendChild(h("details", { class: "tutor-ia-caja", open: "open" }, [
      h("summary", {}, "🎓 Examínate con una IA: tutor de todo el examen"),
      h("p", {}, "Prepara un texto que convierte a la IA en tu tutor: te hace las preguntas de una en una, corrige cada respuesta con la referencia del profesor y al final te da una nota y qué repasar. " +
                 "Es largo (lleva las referencias), así que se copia y lo pegas con Ctrl+V en el chat."),
      h("div", { class: "tutor-ia-fila" }, [h("label", {}, ["IA ", selIA]), h("label", {}, ["Modo ", selModo]), h("label", {}, ["Orden ", selOrden]), h("label", {}, [selNum]), boton, copia]),
      aviso, area
    ]));

    /* corrección final: contestas todo en la página y al terminar se manda de una vez */
    var selIA2 = h("select", { "aria-label": "IA" }, IAS.map(function (a) { return h("option", { value: a.id }, a.nombre); }));
    var selFin = h("select", { "aria-label": "Después de corregir" }, [h("option", { value: "corregir" }, "Solo corregir"),
      h("option", { value: "repasar" }, "Corregir y repasar mis fallos como tutor")]);
    selIA2.value = pr.ia || "chatgpt";
    var cuenta = h("p", { class: "tutor-ia-nota" }), aviso2 = h("p", { class: "tutor-ia-aviso", role: "status" });
    var area2 = h("textarea", { class: "tutor-ia-resp", rows: "6", readonly: "readonly", "aria-label": "Texto que se envía a la IA", style: "display:none" });
    function pintarCuenta() {
      cuenta.textContent = "Has contestado " + contestadas(bancoId, banco) + " de " + total + " preguntas. Las respuestas se guardan en tu navegador al escribirlas; las que dejes vacías cuentan como sin contestar.";
    }
    pintarCuenta();
    document.addEventListener("input", function (ev) { if (ev.target && ev.target.className === "tutor-ia-resp" && !ev.target.readOnly) pintarCuenta(); });
    function texto2() { return promptCorreccion(bancoId, banco, selFin.value === "repasar"); }
    var abrir = h("button", { type: "button", class: "tutor-ia-btn sec" }, "Abrir todos los recuadros");
    abrir.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll(".tutor-ia > details"), function (d) { d.open = true; });
      aviso2.textContent = "Recuadros abiertos: contesta en cada pregunta y vuelve aquí al terminar.";
    });
    var corregir = h("button", { type: "button", class: "tutor-ia-btn" }, "Corregir todas mis respuestas");
    corregir.addEventListener("click", function () {
      pintarCuenta();
      if (!contestadas(bancoId, banco)) { aviso2.textContent = "Todavía no has escrito ninguna respuesta: contesta en los recuadros de cada pregunta y vuelve."; return; }
      var t = texto2(); area2.value = t; area2.style.display = "block";
      var q = prefs(); q.ia = selIA2.value; guardarPrefs(q);
      enviar(ia(selIA2.value), t, function (m) { aviso2.textContent = m; }, true);        // es largo: siempre se copia y se pega
    });
    var copia2 = h("button", { type: "button", class: "tutor-ia-btn sec" }, "Copiar el texto");
    copia2.addEventListener("click", function () {
      pintarCuenta();
      var t = texto2(); area2.value = t; area2.style.display = "block";
      aviso2.textContent = copiar(t) ? "Texto copiado: pégalo en el chat de la IA que prefieras." : "No he podido copiar solo: selecciona el texto de abajo y cópialo.";
    });
    el.appendChild(h("details", { class: "tutor-ia-caja" }, [
      h("summary", {}, "📝 Corrección final: contesta las " + total + " y mándalas todas juntas"),
      h("p", {}, "Contesta las preguntas en sus recuadros (puedes dejarlo a medias y volver: se guarda). Al terminar, pulsa el botón: se prepara un solo texto con tus respuestas y las referencias del profesor, " +
                 "para que la IA te ponga nota, te diga qué falló en cada una y qué repasar. Es largo, así que se copia y lo pegas una vez con Ctrl+V."),
      cuenta,
      h("div", { class: "tutor-ia-fila" }, [h("label", {}, ["IA ", selIA2]), h("label", {}, ["Después ", selFin]), abrir, corregir, copia2]),
      aviso2, area2
    ]));
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll(".tutor-ia[data-banco]"), montarPregunta);
    Array.prototype.forEach.call(document.querySelectorAll(".tutor-ia-examen[data-banco]"), montarExamen);
  }
  window.TutorIA = { montar: init };        // para páginas que pintan tarjetas por su cuenta (las flashcards)
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
