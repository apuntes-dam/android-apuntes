# A12 · Ejercicios de usabilidad y accesibilidad

<div class="ej-gate" data-unit="u12" data-nombre="U12 · Usabilidad y accesibilidad (DIN T6)"></div>

Estos ejercicios son el tema 6 en práctica: **calcula** el contraste, el área de toque y el SUS (Kotlin puro, para que puedas ejecutarlos), y corrige una interfaz con los criterios de **WCAG** y de Android.

## Ejercicio A12.1

**Luminancia y ratio (Kotlin puro).** Con colores como enteros `0xRRGGBB`, implementa `canalLineal`, `luminancia` y `ratio` según las fórmulas de WCAG. Comprueba que negro sobre blanco da **21,00** y un color contra sí mismo da **1,00**, y que el orden de los argumentos no importa.

<details class="sol" data-key="android/u12/A12.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import kotlin.math.pow
fun canalLineal(c: Int): Double {
    val s = c / 255.0
    return if (s &lt;= 0.03928) s / 12.92 else ((s + 0.055) / 1.055).pow(2.4)
}
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A12.2

**Componer antes de medir.** Implementa `sobre(fondo, capa, alfa)` y mide el contraste de un texto azul `0x1565C0` sobre su propio tinte al 15 % sobre blanco. Muestra también el resultado **falso** que da medir sin componer, y explica por qué es 1:1.

<details class="sol" data-key="android/u12/A12.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import kotlin.math.pow
fun canalLineal(c: Int): Double {
    val s = c / 255.0
    return if (s &lt;= 0.03928) s / 12.92 else ((s + 0.055) / 1.055).pow(2.4)
}
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A12.3

**Detector de toque.** Crea `ControlToque(nombre, anchoDp, altoDp)` con una propiedad `cumple` (48 dp en las **dos** dimensiones). Audita cuatro controles —uno de 44 × 150, otro de 48 × 48, otro de 40 × 40 y otro de 56 × 48— y cuenta los que se quedan cortos.

<details class="sol" data-key="android/u12/A12.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class ControlToque(val nombre: String, val anchoDp: Int, val altoDp: Int) {
    val cumple: Boolean get() = anchoDp &gt;= 48 &amp;&amp; altoDp &gt;= 48      // las DOS dimensiones
}
fun main() {
    val controles = listOf(
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A12.4

**Corrige la pantalla.** Esta fila falla en cuatro criterios de accesibilidad (zona de toque, etiqueta del icono, información solo por color y altura fija que corta el texto al 200 %). Corrígela:

```kotlin
@Composable
fun FilaEstado(correcto: Boolean, onBorrar: () -> Unit) {
    Row(Modifier.height(24.dp)) {
        Box(Modifier.size(12.dp).background(if (correcto) Color.Green else Color.Red))
        Icon(Icons.Default.Delete, contentDescription = null,
            modifier = Modifier.size(24.dp).clickable { onBorrar() })
    }
}
```

<details class="sol" data-key="android/u12/A12.4">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun FilaEstado(correcto: Boolean, onBorrar: () -&gt; Unit) {
    Row(
        Modifier.heightIn(min = 48.dp),                       // altura mínima, no fija: crece con la letra al 200 %
        verticalAlignment = Alignment.CenterVertically,
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A12.5

**Informe de hallazgos.** Para cada hallazgo indica la **heurística de Nielsen** que incumple y su **gravedad** (0-4), y ordénalos por gravedad: (a) el botón «Pagar» no muestra nada mientras procesa; (b) el mensaje de error dice `Error 500`; (c) el icono de ayuda se ve un poco desalineado; (d) no hay manera de volver atrás tras borrar un pedido.

<details class="sol" data-key="android/u12/A12.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>// Orden por gravedad (de mayor a menor), cada hallazgo con su evidencia (captura o número) en un informe real:
//
// 1. (d) No se puede volver atrás tras borrar un pedido      -&gt; Heurística 3: Control y libertad          -&gt; gravedad 3 (mayor)
// 2. (a) «Pagar» no muestra nada mientras procesa            -&gt; Heurística 1: Visibilidad del estado      -&gt; gravedad 3 (mayor)
// 3. (b) El mensaje dice «Error 500»                         -&gt; Heurísticas 2 y 9: Lenguaje del usuario / Recuperación de errores -&gt; gravedad 2 (menor)
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A12.6

**SUS (Kotlin puro).** Implementa `sus(respuestas)` (diez valores de 1 a 5: impares `r − 1`, pares `5 − r`, suma × 2,5) y `lectura(puntos)` con la tabla del tema. Pruébalas con tres cuestionarios y calcula con `1 − (1 − 0,31)^n` qué porcentaje de problemas encuentran 5 usuarios.

<details class="sol" data-key="android/u12/A12.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import kotlin.math.pow
fun sus(respuestas: List&lt;Int&gt;): Double {
    require(respuestas.size == 10 &amp;&amp; respuestas.all { it in 1..5 }) { "Hacen falta 10 respuestas de 1 a 5" }
    val suma = respuestas.mapIndexed { i, r -&gt; if (i % 2 == 0) r - 1 else 5 - r }.sum()   // i = 0 es la afirmación 1 (impar)
    return suma * 2.5
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
