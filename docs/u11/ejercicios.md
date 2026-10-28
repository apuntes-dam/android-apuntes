# A11 · Ejercicios de explotar componentes

<div class="ej-gate" data-unit="u11" data-nombre="U11 · Explotar componentes (DIN T5)"></div>

Estos ejercicios son el tema 5 en práctica: **estado que sobrevive al giro**, **eventos con `Modifier`**, **foco y teclado**, **validación** y **pruebas**. Recuerda: la acción de un evento **cambia el estado**; quien repinta es Compose.

## Ejercicio A11.1

**Se pierde o sobrevive.** Escribe una pantalla con dos campos de texto: uno guardado con `remember` y otro con `rememberSaveable`. Escribe algo en los dos y gira el emulador. Explica en un comentario qué ves y por qué.

<details class="sol" data-key="android/u11/A11.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun CamposQueSobreviven() {
    var sePierde by remember { mutableStateOf("") }              // vive solo en la composición
    var sobrevive by rememberSaveable { mutableStateOf("") }     // viaja en el Bundle del sistema
    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A11.2

**Un `Saver` para tu tipo.** Crea `data class Ajustes(val volumen: Int, val silencio: Boolean)` y guárdalo con `rememberSaveable` usando un `Saver` propio (`listSaver`). Los botones deben cambiarlo con `copy`.

<details class="sol" data-key="android/u11/A11.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class Ajustes(val volumen: Int, val silencio: Boolean)
val SaverAjustes = listSaver&lt;Ajustes, Any&gt;(
    save = { listOf(it.volumen, it.silencio) },                              // reduce el objeto a algo serializable
    restore = { Ajustes(it[0] as Int, it[1] as Boolean) },                   // lo reconstruye
)
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A11.3

**Pulsar y soltar.** Crea `Pulsador(onPulsar, onSoltar, modifier)`: un `Box` cuyo color cambia **mientras está pulsado**, usando `pointerInput`, `awaitEachGesture`, `awaitFirstDown` y `waitForUpOrCancellation`. ¿Qué clave pondrías al `pointerInput` si el componente recibiera además un parámetro `id`?

<details class="sol" data-key="android/u11/A11.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Pulsador(onPulsar: () -&gt; Unit, onSoltar: () -&gt; Unit, modifier: Modifier = Modifier) {
    var pulsado by remember { mutableStateOf(false) }
    Box(
        modifier
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A11.4

**Enter para confirmar.** Haz un `Box` que dibuje un borde cuando tenga el foco (`onFocusEvent`) y llame a `onConfirmar()` al soltar la tecla Enter (`onPreviewKeyEvent`). ¿Qué devuelves en cada caso, `true` o `false`, y por qué?

<details class="sol" data-key="android/u11/A11.4">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun CajaConfirmable(onConfirmar: () -&gt; Unit, modifier: Modifier = Modifier) {
    var foco by remember { mutableStateOf(false) }
    Box(
        modifier
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A11.5

**Validar antes de cambiar el estado (Kotlin puro).** Escribe `fun deVolumen(texto: String): Int` que acepte solo enteros de 0 a 100 y rechace lo demás con `require` y un mensaje claro. Ejecútala con `"50"`, `" 7 "`, `"150"` y `"alto"`, y comprueba que el mensaje es el esperado en cada rechazo.

<details class="sol" data-key="android/u11/A11.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>fun deVolumen(texto: String): Int {
    val v = texto.trim().toIntOrNull()
    require(v != null) { "\"$texto\" no es un número entero" }
    require(v in 0..100) { "El volumen va de 0 a 100, no $v" }
    return v
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A11.6

**Traduce los listeners.** Escribe, para cada evento de Swing, su equivalente en Compose: `mouseEntered`, `focusLost`, `itemStateChanged`, `keyReleased`, `stateChanged` (de un `JSpinner`) y `mouseDragged`.

<details class="sol" data-key="android/u11/A11.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>// mouseEntered       -&gt; Modifier.hoverable(interactionSource) (y collectIsHoveredAsState para saber si está encima)
// focusLost          -&gt; Modifier.onFocusEvent { if (!it.hasFocus) { ... } }   (o onFocusChanged)
// itemStateChanged   -&gt; onClick de cada opción del desplegable (DropdownMenuItem) o onSelectedChange de una fila de opciones
// keyReleased        -&gt; Modifier.onKeyEvent / onPreviewKeyEvent { it.type == KeyEventType.KeyUp ... }  (true si te lo quedas)
// stateChanged       -&gt; onValueChange del Slider / TextField / Checkbox (el valor llega como parámetro de la lambda)
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
