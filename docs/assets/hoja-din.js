/* Hoja de repaso de DIN: botón para tapar las respuestas (pulsar una pregunta la destapa) y botón de imprimir.
   Marcas: <div class="hd" id="hoja-din">, <button id="hd-tapar"> y <button id="hd-imprimir">. Sin dependencias ni servidor. */
(function () {
  "use strict";
  function init() {
    var hoja = document.getElementById("hoja-din");
    if (!hoja || hoja.getAttribute("data-listo")) return;
    hoja.setAttribute("data-listo", "1");
    var tapar = document.getElementById("hd-tapar");
    var imprimir = document.getElementById("hd-imprimir");
    if (tapar) tapar.addEventListener("click", function () {
      var tapadas = hoja.classList.toggle("hd-tapadas");
      tapar.textContent = tapadas ? "Destapar respuestas" : "Tapar respuestas (practicar)";
      var vistas = hoja.querySelectorAll(".hd-i.hd-ver");
      for (var i = 0; i < vistas.length; i++) vistas[i].classList.remove("hd-ver");
    });
    hoja.addEventListener("click", function (e) {
      if (!hoja.classList.contains("hd-tapadas")) return;
      var el = e.target;
      if (el.closest && el.closest("summary")) return;
      while (el && el !== hoja && !(el.classList && el.classList.contains("hd-i"))) el = el.parentNode;
      if (el && el !== hoja) el.classList.toggle("hd-ver");
    });
    window.addEventListener("beforeprint", function () {
      var d = hoja.querySelectorAll("details");
      for (var i = 0; i < d.length; i++) d[i].open = true;
    });
    if (imprimir) imprimir.addEventListener("click", function () { window.print(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
