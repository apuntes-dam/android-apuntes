# A4 · Ejercicios de imágenes e iconos

<div class="ej-gate" data-unit="u04" data-nombre="U4 · Imágenes e iconos"></div>

Necesitas unas cuantas imágenes en `res/drawable` (usa fotos que puedas compartir o libres de derechos). Recuerda ponerles un nombre válido.

## Ejercicio A4.1

**Mi foto.** Añade una imagen al proyecto y muéstrala con `Image` y su `contentDescription`. Cambia `contentScale` entre `Fit`, `Crop` y `FillBounds` y anota qué ocurre.

## Ejercicio A4.2

**Foto de perfil.** Muestra la imagen en un círculo de 100 dp con un borde, y a la derecha tu nombre y tu curso.

<details class="sol" data-key="android/u04/A4.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Perfil() {
    Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
        Image(
            painter = painterResource(R.drawable.foto_perfil),
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A4.3

**Galería de iconos.** Una `Row` con cinco iconos de Material de distinto color y tamaño.

## Ejercicio A4.4

**Botón con icono.** Un botón «Compartir» con icono a la izquierda y texto a la derecha.

## Ejercicio A4.5

**Corazón favorito.** Un `IconButton` que alterne entre corazón vacío y relleno y cambie de color. La descripción de contenido debe cambiar también.

## Ejercicio A4.6

**Portada.** Una imagen a pantalla completa como fondo con un título blanco centrado encima. El texto debe leerse bien (añade una capa oscura semitransparente).

<details class="sol" data-key="android/u04/A4.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Portada() {
    Box(Modifier.fillMaxSize()) {
        Image(
            painterResource(R.drawable.fondo), contentDescription = null,
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A4.7

⭐ **Reto: imagen de internet.** Con Coil y `AsyncImage`, muestra una imagen desde una dirección `https`. Añade `placeholder` y `error` y comprueba qué ves al activar el modo avión.

## Ejercicio A4.8

⭐ **Reto: icono de la app.** Crea un icono adaptativo propio con *Image Asset*, ponle el nombre de tu app y comprueba cómo se ve con forma redonda y cuadrada.

## Ejercicio A4.9

**Galería multiplataforma.** En un proyecto de Compose Multiplatform, copia tres imágenes a `composeResources/drawable`, muestra una con `Image` y añade tres botones «Foto 1/2/3» para elegir cuál se ve, más un botón que alterne mostrar/ocultar. Anota qué ocurre si el archivo se llama `Foto 1.PNG`.

<details class="sol" data-key="android/u04/A4.9">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun Galeria() {
    var actual by remember { mutableIntStateOf(1) }
    var visible by remember { mutableStateOf(true) }
    Column(
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
