# A10 · Ejercicios de componentes propios

<div class="ej-gate" data-unit="u10" data-nombre="U10 · Componentes propios (DIN T4)"></div>

Estos ejercicios son el tema 4 en práctica: crea piezas reutilizables con **parámetros, valores por defecto y `modifier`**, devuelve información con **eventos**, dibuja con **`DrawScope`**, pruébalas y empaquétalas.

## Ejercicio A10.1

**Etiqueta configurable.** Crea el componente `Etiqueta` con: `texto` (obligatorio), `modifier` (el primer parámetro opcional), `color` (con un valor por defecto) y `conPunto` (por defecto `true`). Debe poder usarse como `Etiqueta("Hola")` y como `Etiqueta("Hola", conPunto = false)`.

<details class="sol" data-key="android/u10/A10.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Etiqueta(
    texto: String,
    modifier: Modifier = Modifier,        // primer parámetro opcional
    color: Color = Color(0xFF1565C0),     // valor por defecto
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A10.2

**Selector de opciones.** Crea `SelectorOpcion(opciones, seleccionada, onSeleccion, modifier)`: un botón que abre un desplegable con la lista y **avisa a la pantalla** de la opción elegida. El componente solo guarda si el menú está abierto; qué opción hay elegida lo guarda la pantalla.

<details class="sol" data-key="android/u10/A10.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun SelectorOpcion(
    opciones: List&lt;String&gt;,
    seleccionada: Int?,                    // lo manda la pantalla
    onSeleccion: (Int) -&gt; Unit,            // evento de salida
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A10.3

**Semáforo con `Canvas`.** Dibuja un semáforo con `DrawScope`: un rectángulo oscuro y tres círculos (rojo, ámbar, verde). Un parámetro `encendida: Int` (0, 1 o 2) ilumina solo una luz; las otras se ven apagadas.

<details class="sol" data-key="android/u10/A10.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Semaforo(encendida: Int, modifier: Modifier = Modifier) {
    Canvas(modifier.size(width = 80.dp, height = 220.dp)) {
        drawRoundRect(Color(0xFF263238), cornerRadius = CornerRadius(24f, 24f))
        val colores = listOf(Color(0xFFE53935), Color(0xFFFFB300), Color(0xFF43A047))
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A10.4

**Prueba del semáforo.** Escribe una prueba con `createComposeRule` que monte el semáforo con la luz roja encendida y compruebe que existe un nodo con la descripción «Semáforo en rojo» (añade esa `contentDescription` al componente). ¿En qué carpeta va la prueba y por qué?

<details class="sol" data-key="android/u10/A10.4">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>// src/androidTest: la prueba necesita ver la pantalla (composición real), así que va al dispositivo o emulador.
class SemaforoTest {
    @get:Rule
    val regla = createComposeRule()
    @Test
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A10.5

**Empaqueta el kit.** Escribe el `settings.gradle.kts` de un proyecto con los módulos `:app` y `:ui`, la línea de dependencias del módulo `app` y la de Compose en el módulo `ui`. Explica en un comentario por qué Compose va con `api` y no con `implementation`.

<details class="sol" data-key="android/u10/A10.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>// settings.gradle.kts
rootProject.name = "MiKit"
include(":app")
include(":ui")
// app/build.gradle.kts: quien consume el kit
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A10.6

**Encuentra los cuatro fallos.** Este componente tiene cuatro problemas de los «errores típicos» (no acepta `modifier`, mete un `padding` exterior, guarda un estado que no es suyo y depende de una clase de la aplicación). Corrígelo:

```kotlin
@Composable
fun BotonContador() {
    var cuenta by remember { mutableStateOf(MiAplicacion.contadorGlobal) }
    Button(onClick = { cuenta++ }, modifier = Modifier.padding(32.dp)) {
        Text("Pulsado $cuenta veces")
    }
}
```

<details class="sol" data-key="android/u10/A10.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun BotonContador(
    cuenta: Int,                            // el estado lo decide quien lo usa
    onPulsar: () -&gt; Unit,                   // el evento sube a la pantalla
    modifier: Modifier = Modifier,          // 1) acepta modifier (primer parámetro opcional)
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
