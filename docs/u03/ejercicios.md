# A3 · Ejercicios de layouts y Modifier

<div class="ej-gate" data-unit="u03" data-nombre="U3 · Layouts y Modifier"></div>

Haz una `@Preview` de cada ejercicio. Cuando el enunciado diga «sin números mágicos», no repitas el mismo valor: guárdalo en una constante.

## Ejercicio A3.1

**Tres filas.** Con una `Column` coloca tres textos centrados horizontalmente en la pantalla.

## Ejercicio A3.2

**Una barra.** Con una `Row`, un icono a la izquierda, un título que ocupe el espacio central (`weight`) y otro icono a la derecha.

<details class="sol" data-key="android/u03/A3.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun BarraSuperior() {
    Row(
        modifier = Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.primary).padding(12.dp),
        verticalAlignment = Alignment.CenterVertically
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A3.3

**Esquinas.** En un `Box` de 300 dp, coloca un texto en cada una de las cuatro esquinas y uno en el centro.

## Ejercicio A3.4

**El orden importa.** Escribe dos cajas con `padding` y `background` en distinto orden. Haz una captura de ambas y explica la diferencia.

## Ejercicio A3.5

**Tarjeta de producto.** Con `Card`: nombre en negrita, precio, una descripción de dos líneas y un botón «Comprar» a la derecha.

## Ejercicio A3.6

**Bandera.** Dibuja con `Row`/`Column` y `background` la bandera de un país de tres bandas (por ejemplo, Francia o Italia).

## Ejercicio A3.7

**Pantalla con Scaffold.** Una `TopAppBar` con el título de tu app, un `FloatingActionButton` y un contenido con tres tarjetas. Comprueba que nada queda tapado.

## Ejercicio A3.8

⭐ **Reto: calculadora (solo diseño).** Dibuja el teclado de una calculadora con `Column` y `Row`: una pantalla arriba y 4 filas de botones del mismo tamaño (usa `weight`).

<details class="sol" data-key="android/u03/A3.8">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Calculadora() {
    val filas = listOf(
        listOf("7", "8", "9", "÷"),
        listOf("4", "5", "6", "×"),
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A3.9

⭐ **Reto: móvil o tableta.** Con `BoxWithConstraints`, muestra dos paneles uno debajo del otro si la pantalla mide menos de 600 dp y lado a lado si mide más. Pruébalo con dos `@Preview` de distinto ancho.
