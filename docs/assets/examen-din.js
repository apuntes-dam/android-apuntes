/* Examen de test de DIN (Tema 1 o Temas 4, 5 y 6, según el banco de la página). Todas las preguntas son de test, también las de código. Cada intento sortea las preguntas
   (con cuota por bloque en el examen) y mezcla el orden de las respuestas. Modos: Examen (cronómetro, se corrige al final)
   y Repaso (se corrige cada pregunta al momento, con su explicación). */
(function () {
  "use strict";
  var root = document.getElementById("examen-din");
  var D = root && window[root.getAttribute("data-datos") || "EXAMEN_DIN"];   // cada página trae su banco: data-datos y data-clave
  if (!D || !root) return;
  var KEY = "examenDIN.v3" + (root.getAttribute("data-clave") || ""), L = "abcd";
  var NT = D.nteo || 20, NC = D.ncod || 10;

  function cargar() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } }
  function borrar() { try { localStorage.removeItem(KEY); } catch (e) { /* idem */ } }
  var S = cargar(), timer = null;

  function h(tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") e.className = attrs[k]; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]); else e.setAttribute(k, attrs[k]);
    });
    [].concat(kids == null ? [] : kids).forEach(function (c) { e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function inline(t) {      /* `código` y **negrita** */
    var f = document.createDocumentFragment();
    t.split(/(`[^`]+`|\*\*[^*]+\*\*)/).forEach(function (p) {
      if (!p) return;
      if (p[0] === "`") f.appendChild(h("code", {}, p.slice(1, -1)));
      else if (p.slice(0, 2) === "**") f.appendChild(h("strong", {}, p.slice(2, -2)));
      else f.appendChild(document.createTextNode(p));
    });
    return f;
  }
  function rico(t) {        /* párrafos y bloques de código ``` */
    var box = h("div", { class: "din-txt" });
    t.split(/(```[\s\S]*?```)/).forEach(function (seg) {
      if (!seg.trim()) return;
      if (seg.indexOf("```") === 0) { box.appendChild(h("pre", {}, h("code", {}, seg.replace(/^```\w*\n?/, "").replace(/\n?```$/, "")))); return; }
      seg.split(/\n\s*\n/).forEach(function (par) { if (par.trim()) box.appendChild(h("p", {}, inline(par.replace(/\n/g, " ")))); });
    });
    return box;
  }
  function contenido(t) { return t.indexOf("```") >= 0 ? rico(t) : h("span", {}, inline(t)); }
  function mmss(s) { s = Math.max(0, s); return ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2); }
  function barajar(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function coma(n, d) { return n.toFixed(d).replace(".", ","); }

  /* ---------- selección de este intento ---------- */
  function seleccionar() {
    var ids = [];
    if (S.modo === "examen") {
      var por = {};
      D.test.forEach(function (q, i) { (por[q.g] = por[q.g] || []).push(i); });
      Object.keys(D.cuotas).forEach(function (g) { ids = ids.concat(barajar((por[g] || []).slice()).slice(0, D.cuotas[g])); });
    } else {
      D.test.forEach(function (q, i) { if (S.filtro === "todo" || q.t === S.filtro) ids.push(i); });
      ids = barajar(ids).slice(0, S.n);
    }
    S.tq = barajar(ids).map(function (i) { return { i: i, p: barajar([0, 1, 2, 3]) }; });
  }
  function preguntas() {    /* las del intento, con las opciones en el orden en que se ven */
    return S.tq.map(function (x) {
      var q = D.test[x.i];
      return { q: q.q, o: x.p.map(function (k) { return q.o[k]; }), c: x.p.indexOf(q.c), g: q.g, t: q.t, e: q.e, x: q.x };
    });
  }

  /* ---------- pantalla de inicio ---------- */
  function inicio() {
    root.innerHTML = "";
    var min = h("input", { type: "number", min: "5", max: "180", value: String(D.minutos), "aria-label": "Minutos" });
    var filtro = h("select", { "aria-label": "Qué repasar" }, [
      h("option", { value: "todo" }, "Todo (teoría y código)"), h("option", { value: "teoria" }, "Solo teoría"), h("option", { value: "codigo" }, "Solo código")]);
    var cuantas = h("input", { type: "number", min: "5", max: "60", value: "20", "aria-label": "Número de preguntas" });
    root.appendChild(h("div", { class: "din-card" }, [
      h("h2", {}, "Elige cómo practicar"),
      h("p", {}, [h("strong", {}, "Examen"), " — " + (NT + NC) + " preguntas de test (" + NT + " de teoría y " + NC + " de código), con cronómetro. Se corrige al entregar o cuando se acaba el tiempo."]),
      h("p", {}, ["Tiempo: ", min, " minutos"]),
      h("button", { class: "din-btn", onclick: function () { empezar({ modo: "examen", limite: Math.max(5, parseInt(min.value, 10) || D.minutos) * 60 }); } }, "Empezar el examen"),
      h("hr"),
      h("p", {}, [h("strong", {}, "Repaso"), " — sin tiempo: cada pregunta se corrige al momento y te explica la respuesta."]),
      h("p", {}, ["Qué repasar: ", filtro, " · Preguntas: ", cuantas]),
      h("button", { class: "din-btn din-sec", onclick: function () { empezar({ modo: "repaso", filtro: filtro.value, n: Math.max(5, parseInt(cuantas.value, 10) || 20), limite: 0 }); } }, "Empezar el repaso"),
      h("p", { class: "din-nota" }, "El banco tiene " + D.test.length + " preguntas. En cada intento se sortean y se mezcla el orden de las respuestas.")
    ]));
  }

  function empezar(cfg) {
    S = { v: 3, modo: cfg.modo, filtro: cfg.filtro || "todo", n: cfg.n || 0, inicio: Date.now(), limite: cfg.limite, t: {}, fin: false };
    seleccionar(); guardar(); preguntar();
  }

  /* ---------- las preguntas ---------- */
  function preguntar() {
    clearInterval(timer);
    root.innerHTML = "";
    var repaso = S.modo === "repaso", P = preguntas();
    var bar = h("div", { class: "din-bar" }), reloj = h("span", { class: "din-reloj" }), prog = h("span", { class: "din-prog" });
    bar.appendChild(h("strong", {}, repaso ? "Repaso" : "Examen"));
    bar.appendChild(prog);
    if (S.limite) bar.appendChild(reloj);
    var entregarBtn = h("button", { class: "din-btn", onclick: function () {
      var sin = P.length - Object.keys(S.t).length;
      if (confirm(sin ? "Te quedan " + sin + " sin contestar. ¿Entregar ahora?" : "¿Entregar ahora?")) entregar(false);
    } }, repaso ? "Terminar" : "Entregar");
    bar.appendChild(entregarBtn);
    root.appendChild(bar);
    function actualizar() { prog.textContent = Object.keys(S.t).length + " / " + P.length; }

    P.forEach(function (q, i) {
      var card = h("div", { class: "din-card" });
      card.appendChild(h("div", { class: "din-q" }, [h("strong", {}, (i + 1) + ". "), contenido(q.q)]));
      var ops = [], fb = h("div", { class: "din-fb" });
      q.o.forEach(function (o, k) {
        var inp = h("input", { type: "radio", name: "t" + i, value: String(k), onchange: function () {
          S.t[i] = k; guardar(); actualizar();
          if (repaso) corregir(i, q, ops, fb);
        } });
        var lab = h("label", { class: "din-op" }, [inp, h("span", { class: "din-letra" }, L[k] + ")"), h("div", { class: "din-opc" }, contenido(o))]);
        ops.push({ inp: inp, lab: lab });
        card.appendChild(lab);
        if (S.t[i] === k) inp.checked = true;
      });
      card.appendChild(fb);
      root.appendChild(card);
      if (repaso && S.t[i] != null) corregir(i, q, ops, fb);
    });
    actualizar();
    root.appendChild(h("button", { class: "din-btn", onclick: function () { entregarBtn.click(); } }, repaso ? "Terminar" : "Entregar"));

    if (S.limite) {
      var tick = function () {
        var quedan = S.limite - Math.floor((Date.now() - S.inicio) / 1000);
        reloj.textContent = "Quedan " + mmss(quedan);
        reloj.className = "din-reloj" + (quedan < 300 ? " din-poco" : "");
        if (quedan <= 0) entregar(true);
      };
      tick(); timer = setInterval(tick, 1000);
    }
  }

  function corregir(i, q, ops, fb) {      /* repaso: marca la respuesta, bloquea la pregunta y explica */
    var elegida = S.t[i];
    ops.forEach(function (o, k) {
      o.inp.disabled = true;
      if (k === q.c) o.lab.className = "din-op din-bien";
      else if (k === elegida) o.lab.className = "din-op din-mal";
    });
    fb.innerHTML = "";
    fb.appendChild(h("p", { class: elegida === q.c ? "din-ok" : "din-ko" }, elegida === q.c ? "✔ Correcto" : "✘ Incorrecto: la respuesta es la " + L[q.c] + ")"));
    if (q.x) fb.appendChild(h("p", { class: "din-nota" }, inline(q.x)));
    if (q.e && elegida !== q.c) fb.appendChild(h("p", { class: "din-nota" }, "Repasa: " + q.e));
  }

  function entregar(porTiempo) {
    clearInterval(timer);
    S.fin = true; S.porTiempo = !!porTiempo; S.fin_t = Date.now(); guardar(); resultado();
  }

  /* ---------- resultado ---------- */
  function nota(P) {
    var ac = 0, grupos = {};
    P.forEach(function (q, i) {
      var g = grupos[q.g] = grupos[q.g] || { ok: 0, n: 0 };
      g.n++;
      if (S.t[i] === q.c) { ac++; g.ok++; }
    });
    return { aciertos: ac, grupos: grupos };
  }

  function promptIA(P) {
    var fallos = [];
    P.forEach(function (q, i) {
      if (S.t[i] === q.c) return;
      var r = S.t[i];
      fallos.push((fallos.length + 1) + ". " + q.q.replace(/```\w*\n?/g, "").replace(/\n{2,}/g, "\n") + "\n   Respondí: " + (r == null ? "(en blanco)" : L[r] + ") " + q.o[r].replace(/```\w*\n?/g, "").replace(/\n/g, " ")) +
        "\n   Correcta: " + L[q.c] + ") " + q.o[q.c].replace(/```\w*\n?/g, "").replace(/\n/g, " "));
    });
    return "Soy un alumno de 2.º DAM y acabo de hacer un test de " + (D.tema || "Tema 1") + " de «Desarrollo de Interfaces» (Android Studio, Kotlin y Jetpack Compose). " +
      "Estas son las preguntas que he fallado. Para cada una, explícame en pocas frases por qué la respuesta correcta lo es y en qué me equivoqué, " +
      "con ejemplos de código cortos si ayudan. Al final, dime en 3 puntos qué debería repasar.\n\n" + fallos.join("\n\n");
  }

  function copiar(texto, boton) {
    var ok = function () { boton.textContent = "¡Copiado!"; setTimeout(function () { boton.textContent = "Copiar el prompt"; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(ok, function () { boton.textContent = "Selecciona el texto y copia con Ctrl+C"; });
    else { var ta = h("textarea"); ta.value = texto; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { /* idem */ } ta.remove(); }
  }

  function resultado() {
    root.innerHTML = "";
    var P = preguntas(), n = nota(P), total = P.length, fallos = total - n.aciertos, repaso = S.modo === "repaso";
    var usado = Math.max(0, Math.round(((S.fin_t || Date.now()) - S.inicio) / 1000));
    var cab = [h("h2", {}, S.porTiempo ? "Se acabó el tiempo: entregado" : (repaso ? "Repaso terminado" : "Entregado")),
      h("p", { class: "din-nota-grande" }, repaso ? n.aciertos + " de " + total : "Nota: " + coma(n.aciertos / total * 10, 2) + " sobre 10"),
      h("p", {}, n.aciertos + " aciertos, " + fallos + " fallos" + (S.limite ? " · tiempo usado: " + mmss(usado) : ""))];
    root.appendChild(h("div", { class: "din-card" }, cab));

    var filas = Object.keys(n.grupos).map(function (g) {
      return h("tr", {}, [h("td", {}, g), h("td", {}, n.grupos[g].ok + " / " + n.grupos[g].n)]);
    });
    root.appendChild(h("div", { class: "din-card" }, [h("h3", {}, "Por bloques: qué repasar"),
      h("table", {}, [h("thead", {}, h("tr", {}, [h("th", {}, "Bloque"), h("th", {}, "Aciertos")])), h("tbody", {}, filas)])]));

    var soloFallos = h("input", { type: "checkbox", id: "din-solo" });
    soloFallos.checked = fallos > 0;
    var lista = h("div", { class: "din-lista" });
    function pintar() {
      lista.innerHTML = "";
      P.forEach(function (q, i) {
        var r = S.t[i], bien = r === q.c;
        if (soloFallos.checked && bien) return;
        var card = h("div", { class: "din-card" });
        card.appendChild(h("div", { class: "din-q" }, [h("strong", {}, (i + 1) + ". "), contenido(q.q)]));
        card.appendChild(h("p", { class: bien ? "din-ok" : "din-ko" }, (bien ? "✔ " : "✘ ") + "Tu respuesta: " + (r == null ? "en blanco" : L[r] + ")")));
        if (r != null) card.appendChild(h("div", { class: "din-opc din-tuya" }, contenido(q.o[r])));
        if (!bien) {
          card.appendChild(h("p", { class: "din-ok" }, "Correcta: " + L[q.c] + ")"));
          card.appendChild(h("div", { class: "din-opc din-tuya" }, contenido(q.o[q.c])));
        }
        if (q.x) card.appendChild(h("p", { class: "din-nota" }, inline(q.x)));
        if (!bien && q.e) card.appendChild(h("p", { class: "din-nota" }, "Repasa: " + q.e));
        lista.appendChild(card);
      });
      if (!lista.firstChild) lista.appendChild(h("p", {}, "¡No hay fallos que mostrar!"));
    }
    soloFallos.addEventListener("change", pintar);
    root.appendChild(h("div", { class: "din-card" }, [h("h3", {}, "Revisión de las respuestas"), h("label", {}, [soloFallos, " Mostrar solo los fallos"])]));
    root.appendChild(lista);
    pintar();

    if (fallos) {
      var txt = promptIA(P), area = h("textarea", { rows: "8", readonly: "readonly", "aria-label": "Prompt para la IA" }); area.value = txt;
      var bcopy = h("button", { class: "din-btn din-sec", onclick: function () { copiar(txt, bcopy); } }, "Copiar el prompt");
      root.appendChild(h("details", { class: "din-card" }, [h("summary", {}, "Pedir a una IA que me explique mis fallos"),
        h("p", {}, ["Copia el prompt y pégalo en la IA que prefieras, gratis y sin API: ",
          h("a", { href: "https://chatgpt.com/", target: "_blank", rel: "noopener" }, "ChatGPT"), " · ",
          h("a", { href: "https://claude.ai/new", target: "_blank", rel: "noopener" }, "Claude"), " · ",
          h("a", { href: "https://gemini.google.com/app", target: "_blank", rel: "noopener" }, "Gemini"), "."]),
        bcopy, area]));
    }
    root.appendChild(h("button", { class: "din-btn", onclick: function () { borrar(); S = null; inicio(); window.scrollTo(0, 0); } }, "Empezar de nuevo"));
  }

  if (S && S.v !== 3) { borrar(); S = null; }      /* estado de una versión anterior */
  if (S && S.fin) resultado();
  else if (S && S.inicio) { if (S.limite && Date.now() - S.inicio >= S.limite * 1000) entregar(true); else preguntar(); }
  else inicio();
})();
