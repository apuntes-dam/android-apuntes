# AA2 · Ejercicios de corrutinas y Flow

<div class="ej-gate" data-unit="a2" data-nombre="AA2 · Corrutinas y Flow en la app"></div>

Igual que en la unidad anterior: parte del esqueleto, escribe la solución en un `.kt` y pega el `main` para comprobarla. Tu salida debe coincidir con el resultado esperado, obtenido ejecutando la solución modelo de verdad. Necesitas la dependencia `kotlinx-coroutines-core` en tu proyecto (en Android Studio ya viene con Compose; en IntelliJ añádela a Gradle). Los marcados con ⭐ son más difíciles.

## Ejercicio AA2.1

**Dos peticiones a la vez.** Escribe `cargarTodo()` para que `pedirPerfil` y `pedirAmigos` se ejecuten **en paralelo** (no una tras otra) y devuelva ambos resultados.

```kotlin
suspend fun pedirPerfil(): String { delay(300); return "Ana" }
suspend fun pedirAmigos(): List<String> { delay(300); return listOf("Luis", "Marta") }

suspend fun cargarTodo(): Pair<String, List<String>> {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    val inicio = System.currentTimeMillis()
    val (perfil, amigos) = cargarTodo()
    val ms = System.currentTimeMillis() - inicio
    println("$perfil · $amigos")
    println("¿en paralelo (menos de 500 ms)? ${ms < 500}")
}
```

**Resultado esperado:**

```text
Ana · [Luis, Marta]
¿en paralelo (menos de 500 ms)? true
```

<details class="sol" data-key="android/av-a2/AA2.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>suspend fun pedirPerfil(): String { delay(300); return "Ana" }
suspend fun pedirAmigos(): List&lt;String&gt; { delay(300); return listOf("Luis", "Marta") }
suspend fun cargarTodo(): Pair&lt;String, List&lt;String&gt;&gt; = coroutineScope {
    val perfil = async { pedirPerfil() }
    val amigos = async { pedirAmigos() }
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA2.2

**Cancelar de verdad.** `contar()` se cancela a sí misma al llegar a 3, pero sigue contando hasta 5. Arréglala con **una sola línea** para que respete la cancelación y se detenga.

```kotlin
// Cuenta de 1 a 5 imprimiendo cada número. Se cancela a sí misma al llegar a 3.
// Hoy imprime los cinco: arréglala para que se detenga tras el 3.
suspend fun contar() = coroutineScope {
    for (i in 1..5) {
        println("número $i")
        if (i == 3) coroutineContext.job.cancel()
    }
}
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    val trabajo = launch(Dispatchers.Default) { contar() }
    trabajo.join()
    println("¿cancelado? ${trabajo.isCancelled}")
}
```

**Resultado esperado:**

```text
número 1
número 2
número 3
¿cancelado? true
```

<details class="sol" data-key="android/av-a2/AA2.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>suspend fun contar() = coroutineScope {
    for (i in 1..5) {
        ensureActive()
        println("número $i")
        if (i == 3) coroutineContext.job.cancel()
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA2.3

**Que falle una no hunde a las demás.** Lanza las tres tareas a la vez y devuelve solo los resultados de las que terminan bien. La `B` falla, y aun así deben salir `A ok` y `C ok`.

```kotlin
suspend fun tarea(nombre: String, falla: Boolean): String {
    delay(50)
    if (falla) throw IllegalStateException("$nombre falló")
    return "$nombre ok"
}

// Lanza las tres tareas a la vez y devuelve los resultados de las que NO fallan.
suspend fun lanzarTodas(): List<String> {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    println(lanzarTodas())
}
```

**Resultado esperado:**

```text
[A ok, C ok]
```

<details class="sol" data-key="android/av-a2/AA2.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>suspend fun tarea(nombre: String, falla: Boolean): String {
    delay(50)
    if (falla) throw IllegalStateException("$nombre falló")
    return "$nombre ok"
}
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA2.4

**Operadores.** Completa `multiplos()` para que emita, de los números del 1 al 20, los **múltiplos de 3**, **multiplicados por 10**, y **solo los 4 primeros**.

```kotlin
// Los números del 1 al 20 que sean múltiplos de 3, multiplicados por 10, quedándote solo con los 4 primeros.
fun multiplos(): Flow<Int> = (1..20).asFlow() // + los operadores que faltan
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    println(multiplos().toList())
}
```

**Resultado esperado:**

```text
[30, 60, 90, 120]
```

<details class="sol" data-key="android/av-a2/AA2.4">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>fun multiplos(): Flow&lt;Int&gt; = (1..20).asFlow()
    .filter { it % 3 == 0 }
    .map { it * 10 }
    .take(4)
fun main() = runBlocking {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA2.5

**Búsqueda mientras escribes.** Escribe `consultas`: tras **100 ms de calma**, sin repetir la misma consulta seguida, ignorando las de **menos de 3 letras** y cancelando una búsqueda en curso si llega otra. Cada búsqueda debe producir el texto `buscado: ` seguido de la consulta.

```kotlin
// Recibe lo que el usuario va escribiendo y devuelve los textos por los que realmente se buscaría:
// espera 100 ms de calma, no repite, ignora menos de 3 letras y descarta la búsqueda anterior si llega otra.
fun consultas(teclado: Flow<String>): Flow<String> {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    val teclado = flow {
        emit("a"); delay(20)
        emit("an"); delay(20)
        emit("ana"); delay(300)          // pausa: se busca «ana»
        emit("ana"); delay(300)          // repetida: no se busca otra vez
        emit("anab"); delay(20)
        emit("anabe"); delay(300)        // pausa: se busca «anabe»
    }
    consultas(teclado).collect { println(it) }
}
```

**Resultado esperado:**

```text
buscado: ana
buscado: anabe
```

<details class="sol" data-key="android/av-a2/AA2.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
fun consultas(teclado: Flow&lt;String&gt;): Flow&lt;String&gt; = teclado
    .debounce(100)
    .distinctUntilChanged()
    .filter { it.length &gt;= 3 }
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA2.6

⭐ **Total calculado.** Construye con `combine` y `stateIn` (arranque inmediato, valor inicial `PrecioUi(0, 0, 0)`) un estado cuyo `total` sea unidades × precio y se **recalcule** al cambiar cualquiera de los dos.

```kotlin
data class PrecioUi(val unidades: Int, val precioUnidad: Int, val total: Int)

// Combina las unidades y el precio por unidad en un StateFlow<PrecioUi> con el total calculado.
fun construir(unidades: Flow<Int>, precio: Flow<Int>, ambito: CoroutineScope): StateFlow<PrecioUi> {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    val unidades = MutableStateFlow(1)
    val precio = MutableStateFlow(10)
    val ui = construir(unidades, precio, CoroutineScope(Dispatchers.Unconfined))
    println(ui.value)
    unidades.value = 3
    println(ui.value)
    precio.value = 12
    println(ui.value)
}
```

**Resultado esperado:**

```text
PrecioUi(unidades=1, precioUnidad=10, total=10)
PrecioUi(unidades=3, precioUnidad=10, total=30)
PrecioUi(unidades=3, precioUnidad=12, total=36)
```

<details class="sol" data-key="android/av-a2/AA2.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class PrecioUi(val unidades: Int, val precioUnidad: Int, val total: Int)
fun construir(unidades: Flow&lt;Int&gt;, precio: Flow&lt;Int&gt;, ambito: CoroutineScope): StateFlow&lt;PrecioUi&gt; =
    combine(unidades, precio) { u, p -&gt; PrecioUi(u, p, u * p) }
        .stateIn(ambito, SharingStarted.Eagerly, PrecioUi(0, 0, 0))
fun main() = runBlocking {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
