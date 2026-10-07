# A6 · Ejercicios de listas y navegación

<div class="ej-gate" data-unit="u06" data-nombre="U6 · Listas y navegación"></div>

Para las listas puedes inventar los datos con `listOf(...)`. Cada fila debe ser su propio composable.

## Ejercicio A6.1

**Lista de nombres.** Una `LazyColumn` con 30 nombres generados con `List(30) { "Elemento ${it + 1}" }`. Comprueba que hace scroll.

## Ejercicio A6.2

**Contactos.** Una `data class Contacto` y una lista de diez. Cada fila lleva un icono, el nombre en negrita y el teléfono debajo.

## Ejercicio A6.3

**Con cabecera.** Añade a A6.2 un título al principio (`item`), separación entre filas y un `HorizontalDivider`.

## Ejercicio A6.4

**Lista de la compra.** Un campo para escribir, un botón «Añadir» y una lista con botón de borrar en cada fila (`mutableStateListOf`).

## Ejercicio A6.5

**Tareas con check.** Cada tarea tiene un `Checkbox` y, si está hecha, el texto aparece tachado. Usa una `data class` con `copy` y claves únicas (`key`).

<details class="sol" data-key="android/u06/A6.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class Tarea(val id: Int, val texto: String, val hecha: Boolean = false)
@Composable
fun Tareas() {
    val tareas = remember {
        mutableStateListOf(Tarea(1, "Estudiar Kotlin"), Tarea(2, "Hacer la práctica"), Tarea(3, "Repasar Compose"))
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A6.6

**Dos pantallas.** Con Navigation Compose, una pantalla de inicio con un botón que lleva a una pantalla «Acerca de» que tiene un botón para volver.

<details class="sol" data-key="android/u06/A6.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun MiApp() {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = "inicio") {
        composable("inicio") {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A6.7

**Lista y detalle.** Al pulsar una fila de contactos, se abre una pantalla con los datos de **ese** contacto (pasa el `id` en la ruta).

## Ejercicio A6.8

⭐ **Reto: barra inferior.** Una app con tres pestañas (Inicio, Buscar, Perfil) con `NavigationBar`. Comprueba que al volver a una pestaña no se acumulan copias.

## Ejercicio A6.9

⭐ **Reto: buscador.** Añade a la lista de contactos un campo de búsqueda que filtre mientras escribes y un mensaje «Sin resultados» cuando no haya coincidencias.
