/* Examen de prueba con cronómetro y corrección con cualquier IA (sin API): al entregar o al acabarse el tiempo se corrige el test
   en el navegador y se prepara un prompt para pegar en ChatGPT, Claude, Gemini... que califica el resto. */
(function () {
  "use strict";
  var D = window.EXAMEN_DIN, root = document.getElementById("examen-din");
  if (!D || !root) return;
  var KEY = "examenDIN.v1", L = "abcd";

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
  function rico(t) {        /* párrafos, bloques de código ``` y listas simples */
    var box = h("div", { class: "din-txt" });
    t.split(/(```[\s\S]*?```)/).forEach(function (seg) {
      if (!seg.trim()) return;
      if (seg.indexOf("```") === 0) { box.appendChild(h("pre", {}, h("code", {}, seg.replace(/^```\w*\n?/, "").replace(/\n?```$/, "")))); return; }
      seg.split(/\n\s*\n/).forEach(function (par) { if (par.trim()) box.appendChild(h("p", {}, inline(par.replace(/\n/g, " ")))); });
    });
    return box;
  }
  function mmss(s) { s = Math.max(0, s); return ("0" + Math.floor(s / 60)).slice(-2) + ":" + ("0" + (s % 60)).slice(-2); }

  /* ---------- pantallas ---------- */
  function inicio() {
    root.innerHTML = "";
    var min = h("input", { type: "number", min: "5", max: "180", value: String(D.minutos), "aria-label": "Minutos" });
    root.appendChild(h("div", { class: "din-card" }, [
      h("h2", {}, "Elige cómo practicar"),
      h("p", {}, [h("strong", {}, "Examen de prueba"), " — 20 preguntas de test (5 puntos) y 3 ejercicios de desarrollo y código (5 puntos), con cronómetro. Si se acaba el tiempo, se entrega solo."]),
      h("p", {}, ["Tiempo: ", min, " minutos"]),
      h("button", { class: "din-btn", onclick: function () { empezar("examen", Math.max(5, parseInt(min.value, 10) || D.minutos)); } }, "Empezar el examen"),
      h("hr"),
      h("p", {}, [h("strong", {}, "Banco de prácticas"), " — 10 ejercicios de código y de proyecto, sin límite de tiempo (1 punto cada uno)."]),
      h("button", { class: "din-btn din-sec", onclick: function () { empezar("practicas", 0); } }, "Empezar las prácticas")
    ]));
  }

  function empezar(modo, minutos) {
    S = { modo: modo, inicio: Date.now(), limite: minutos * 60, t: {}, d: {}, fin: false };
    guardar(); examen();
  }

  function examen() {
    clearInterval(timer);
    root.innerHTML = "";
    var items = S.modo === "examen" ? D.desarrollo : D.practicas;
    var bar = h("div", { class: "din-bar" });
    var reloj = h("span", { class: "din-reloj" });
    bar.appendChild(h("strong", {}, S.modo === "examen" ? "Examen" : "Prácticas"));
    if (S.limite) bar.appendChild(reloj);
    bar.appendChild(h("button", { class: "din-btn", onclick: function () { if (confirm("¿Entregar ahora? Después se corrige.")) entregar(false); } }, "Entregar"));
    root.appendChild(bar);

    if (S.modo === "examen") {
      root.appendChild(h("h2", {}, "Parte A · Test (0,25 cada una)"));
      D.test.forEach(function (q, i) {
        var card = h("div", { class: "din-card" }, h("p", {}, [h("strong", {}, (i + 1) + ". "), inline(q.q)]));
        q.o.forEach(function (o, k) {
          var inp = h("input", { type: "radio", name: "t" + i, value: String(k), onchange: function () { S.t[i] = k; guardar(); } });
          if (S.t[i] === k) inp.checked = true;
          card.appendChild(h("label", { class: "din-op" }, [inp, " " + L[k] + ") ", inline(o)]));
        });
        root.appendChild(card);
      });
      root.appendChild(h("h2", {}, "Parte B · Desarrollo y código"));
    }
    items.forEach(function (it) {
      var ta = h("textarea", { rows: "9", spellcheck: "false", placeholder: "Escribe tu respuesta (el código también)…", oninput: function () { S.d[it.id] = ta.value; guardar(); } });
      ta.value = S.d[it.id] || "";
      root.appendChild(h("div", { class: "din-card" }, [
        h("h3", {}, it.id + (it.t ? " · " + it.t : "") + " (" + String(it.pts).replace(".", ",") + (it.pts === 1 ? " punto)" : " puntos)")),
        rico(it.q), ta]));
    });
    root.appendChild(h("button", { class: "din-btn", onclick: function () { if (confirm("¿Entregar ahora? Después se corrige.")) entregar(false); } }, "Entregar"));

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

  function entregar(porTiempo) {
    clearInterval(timer);
    S.fin = true; S.porTiempo = !!porTiempo; guardar(); resultado();
  }

  function nota() {
    var ac = 0, fallos = [];
    D.test.forEach(function (q, i) { if (S.t[i] === q.c) ac++; else fallos.push(i); });
    return { aciertos: ac, fallos: fallos };
  }

  function prompt() {
    var ex = S.modo === "examen", items = ex ? D.desarrollo : D.practicas, n = nota(), p = [];
    p.push("Eres profesor de «Desarrollo de Interfaces» (2.º DAM) y vas a calificar un " + (ex ? "examen de prueba" : "conjunto de prácticas") +
      " del Tema 1 (Android Studio, Kotlin y Jetpack Compose). Corrige con rigor pero con justicia, usando SOLO los criterios y las soluciones modelo que te doy.");
    p.push("REGLAS\n- Pon una nota por ejercicio (sobre sus puntos) y la nota final.\n- En cada ejercicio di qué está bien, qué falta o está mal, y la corrección. Si es código, señala errores de sintaxis o de lógica que se vean leyéndolo (no puedes compilarlo).\n- Acepta respuestas distintas de la modelo si son correctas.\n- Una respuesta en blanco vale 0.\n- Termina con una tabla (ejercicio | nota | máximo) y tres consejos de qué repasar.");
    if (ex) {
      var t = "PARTE A (TEST), ya corregida por el navegador: " + n.aciertos + " de " + D.test.length + " aciertos = " + (n.aciertos * 0.25).toString().replace(".", ",") + " de 5 puntos. Usa esa nota tal cual.";
      if (n.fallos.length) t += "\nPreguntas falladas (explica brevemente por qué la correcta lo es):\n" + n.fallos.map(function (i) {
        var q = D.test[i], r = S.t[i];
        return (i + 1) + ". " + q.q + "\n   Respondió: " + (r == null ? "(en blanco)" : L[r] + ") " + q.o[r]) + "\n   Correcta: " + L[q.c] + ") " + q.o[q.c];
      }).join("\n");
      p.push(t);
    } else if (D.nota_practicas) {
      p.push("NOTA GENERAL DE LAS SOLUCIONES\n" + D.nota_practicas);
    }
    p.push((ex ? "PARTE B (DESARROLLO Y CÓDIGO)" : "EJERCICIOS") + (S.porTiempo ? "\n(El alumno se quedó sin tiempo: lo que falte, está sin hacer.)" : ""));
    items.forEach(function (it) {
      p.push("--- " + it.id + (it.t ? " · " + it.t : "") + " (" + it.pts + " puntos) ---\nENUNCIADO:\n" + it.q + "\n\nSOLUCIÓN MODELO Y CRITERIOS:\n" + it.sol +
        "\n\nRESPUESTA DEL ALUMNO:\n" + ((S.d[it.id] || "").trim() || "(en blanco)"));
    });
    return p.join("\n\n");
  }

  function copiar(texto, boton) {
    var ok = function () { boton.textContent = "¡Copiado!"; setTimeout(function () { boton.textContent = "Copiar el prompt"; }, 2500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(texto).then(ok, function () { boton.textContent = "Selecciona el texto y copia con Ctrl+C"; });
    else { var ta = h("textarea"); ta.value = texto; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); ok(); } catch (e) { /* idem */ } ta.remove(); }
  }

  function resultado() {
    root.innerHTML = "";
    var ex = S.modo === "examen", n = nota(), txt = prompt();
    root.appendChild(h("div", { class: "din-card" }, [
      h("h2", {}, S.porTiempo ? "Se acabó el tiempo: entregado" : "Entregado"),
      ex ? h("p", {}, [h("strong", {}, "Test: " + n.aciertos + " / " + D.test.length), " aciertos = " + (n.aciertos * 0.25).toString().replace(".", ",") + " de 5 puntos."]) : h("p", {}, "Prácticas entregadas."),
      h("p", {}, ex ? "La parte B la califica una IA. Sigue estos pasos:" : "Las prácticas las califica una IA. Sigue estos pasos:")
    ]));
    var area = h("textarea", { rows: "10", readonly: "readonly", "aria-label": "Prompt para la IA" }); area.value = txt;
    var bcopy = h("button", { class: "din-btn", onclick: function () { copiar(txt, bcopy); } }, "Copiar el prompt");
    root.appendChild(h("div", { class: "din-card" }, [
      h("ol", {}, [
        h("li", {}, ["Pulsa ", h("strong", {}, "Copiar el prompt"), "."]),
        h("li", {}, ["Abre una IA (cualquiera, gratis, sin API): ",
          h("a", { href: "https://chatgpt.com/", target: "_blank", rel: "noopener" }, "ChatGPT"), " · ",
          h("a", { href: "https://claude.ai/new", target: "_blank", rel: "noopener" }, "Claude"), " · ",
          h("a", { href: "https://gemini.google.com/app", target: "_blank", rel: "noopener" }, "Gemini"), "."]),
        h("li", {}, "Pega el prompt y envíalo. Te devolverá la nota por ejercicio, los errores y qué repasar.")
      ]),
      bcopy, area,
      h("p", { class: "din-nota" }, "La IA puede equivocarse: el criterio es el de las soluciones modelo, no el del profesor. Nada de lo que escribes sale de tu navegador hasta que pegas tú el prompt.")
    ]));

    if (ex) {
      var det = h("details", { class: "din-card" }, h("summary", {}, "Ver las respuestas del test (" + n.fallos.length + " falladas)"));
      D.test.forEach(function (q, i) {
        var r = S.t[i], bien = r === q.c;
        det.appendChild(h("p", { class: bien ? "din-ok" : "din-ko" }, [(bien ? "✔ " : "✘ ") + (i + 1) + ". ", inline(q.q), h("br"),
          "Tu respuesta: " + (r == null ? "en blanco" : L[r] + ")") + " · Correcta: " + L[q.c] + ") " + q.o[q.c] + " · " + q.e]));
      });
      root.appendChild(det);
    }
    var det2 = h("details", { class: "din-card" }, h("summary", {}, "Ver las soluciones modelo"));
    (ex ? D.desarrollo : D.practicas).forEach(function (it) { det2.appendChild(h("h3", {}, it.id)); det2.appendChild(rico(it.sol)); });
    root.appendChild(det2);
    root.appendChild(h("button", { class: "din-btn din-sec", onclick: function () { borrar(); S = null; inicio(); } }, "Empezar de nuevo"));
  }

  if (S && S.fin) resultado(); else if (S && S.inicio) { if (S.limite && Date.now() - S.inicio >= S.limite * 1000) entregar(true); else examen(); } else inicio();
})();
