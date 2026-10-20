# A2 · Ejercicios de componentes y botones

<div class="ej-gate" data-unit="u02" data-nombre="U2 · Componentes y botones"></div>

Cada ejercicio es una pantalla nueva con su `@Preview`. Los marcados con ⭐ son más difíciles.

## Ejercicio A2.1

**Tarjeta de presentación.** Con tres `Text` (tu nombre en grande y negrita, tu curso y una frase en cursiva) y distintos colores y tamaños, escribe tu presentación.

## Ejercicio A2.2

**Mi primer botón.** Crea un botón «Saluda» que escriba un mensaje en Logcat con `Log.d` al pulsarlo. Comprueba el mensaje en la ventana Logcat.

## Ejercicio A2.3

**Los cinco botones.** Muestra uno de cada tipo: `Button`, `FilledTonalButton`, `OutlinedButton`, `TextButton` e `IconButton`. Anota en una frase cuándo usarías cada uno.

## Ejercicio A2.4

**Toast.** Haz un botón que muestre un `Toast` con tu nombre. Después cambia el botón para que solo funcione una vez (usa `enabled`).

## Ejercicio A2.5

**Contador.** Un texto con el valor y tres botones: `+1`, `-1` y `Reiniciar`. Impide que baje de 0.

<details class="sol" data-key="android/u02/A2.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Contador() {
    var cuenta by rememberSaveable { mutableStateOf(0) }
    Column(
        modifier = Modifier.fillMaxSize(),
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A2.6

**Cambio de texto.** Un botón alterna un mensaje entre «Encendido» y «Apagado», cambiando también el color del texto.

## Ejercicio A2.7

**Tira el dado.** Un botón genera un número aleatorio del 1 al 6 (`(1..6).random()`) y lo muestra grande. Muestra además cuántas tiradas llevas.

<details class="sol" data-key="android/u02/A2.7">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Dado() {
    var valor by remember { mutableStateOf(1) }
    var tiradas by remember { mutableStateOf(0) }
    Column(Modifier.fillMaxSize(), Arrangement.Center, Alignment.CenterHorizontally) {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A2.8

**Pulsación larga.** Un texto que cuente los toques normales y, por separado, las pulsaciones largas (usa `combinedClickable`).

## Ejercicio A2.9

⭐ **Reto: dos contadores.** Muestra dos contadores independientes (A y B) y, debajo, su **suma**, calculada sin guardarla en una tercera variable. Ambos deben conservar su valor al girar la pantalla.

## Ejercicio A2.10

⭐ **Reto: estado elevado.** Reescribe el contador como dos composables: uno con el estado y otro **sin estado** que reciba `cuenta` y `alSumar`. Haz una `@Preview` del segundo con un valor fijo.

<details class="sol" data-key="android/u02/A2.10">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun ContadorPantalla() {
    var cuenta by rememberSaveable { mutableStateOf(0) }
    ContadorVista(cuenta = cuenta, alSumar = { cuenta++ })
}
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A2.11

**Contador con colores.** Un contador con un botón «SUMAR» verde (con `contentPadding` propio) y otro «REINICIAR» rojo que esté **desactivado** mientras el contador valga 0. Explica por qué se activa solo tras la primera pulsación. Añade `safeContentPadding()` para que el título no quede bajo la cámara.

<details class="sol" data-key="android/u02/A2.11">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun PracticaContador() {
    var pulsaciones by remember { mutableIntStateOf(0) }
    Column(
        modifier = Modifier.fillMaxSize().safeContentPadding().padding(16.dp),
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A2.12

**Tarjeta de producto.** Crea una clase `Producto(nombre, precio, stock)` y un composable `TarjetaProducto(producto)` con una `Card` que muestre los tres datos. Si el stock es 0, el texto debe decir «Agotado» en rojo. Pinta tres productos en una `Column`.

<details class="sol" data-key="android/u02/A2.12">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>class Producto(val nombre: String, val precio: Double, val stock: Int)
@Composable
fun TarjetaProducto(producto: Producto) {
    Card(modifier = Modifier.fillMaxWidth().padding(8.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A2.13

**Un contador como objeto.** Crea una clase `Contador` con un atributo `valor` que sea estado, un método `sumar()` y un método `reiniciar()`. En pantalla, un `Text` con el valor y dos botones. Después cambia `mutableIntStateOf(0)` por un `Int` normal y explica por qué deja de funcionar.

<details class="sol" data-key="android/u02/A2.13">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>class Contador {
    var valor by mutableIntStateOf(0)
        private set
    fun sumar() { valor++ }
    fun reiniciar() { valor = 0 }
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A2.14

**Semáforo.** Tres botones («Rojo», «Ámbar» y «Verde») con el color de fondo de cada nombre, usando `ButtonDefaults.buttonColors`. Al pulsar uno, un `Text` dice «Has pulsado ...». Pon el texto del botón ámbar en negro para que se lea.

<details class="sol" data-key="android/u02/A2.14">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Semaforo() {
    var texto by remember { mutableStateOf("Pulsa un botón") }
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(texto)
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
