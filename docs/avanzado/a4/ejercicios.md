# AA4 · Ejercicios de inyección de dependencias y pruebas

<div class="ej-gate" data-unit="a4" data-nombre="AA4 · Inyección de dependencias y pruebas"></div>

Como en las unidades anteriores: escribe la solución en un `.kt` y comprueba que tu salida coincide con el resultado esperado, obtenido ejecutando la solución modelo. En los ejercicios AA4.4 y AA4.6 **escribes pruebas** y la comprobación es que se ejecuten **todas con éxito**. Necesitas JUnit 4, `kotlin-test` y `kotlinx-coroutines-test` en tu proyecto. Los marcados con ⭐ son más difíciles.

## Ejercicio AA4.1

**Inyectar el reloj.** Haz que `Saludo` reciba el `Reloj` por el constructor y devuelva el saludo según la hora, sin leer nunca la hora del sistema.

```kotlin
interface Reloj { fun hora(): Int }

// De 6 a 11 -> "Buenos días"; de 12 a 20 -> "Buenas tardes"; el resto -> "Buenas noches"
class Saludo(/* ... */) {
    fun saludo(): String { /* ... */ return "" }
}
```

Para comprobarlo:

```kotlin
fun main() {
    var h = 0
    val saludo = Saludo(object : Reloj { override fun hora() = h })
    for (hora in listOf(3, 6, 11, 12, 20, 21)) {
        h = hora
        println("$hora h -> ${saludo.saludo()}")
    }
}
```

**Resultado esperado:**

```text
3 h -> Buenas noches
6 h -> Buenos días
11 h -> Buenos días
12 h -> Buenas tardes
20 h -> Buenas tardes
21 h -> Buenas noches
```

<details class="sol" data-key="android/av-a4/AA4.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>interface Reloj { fun hora(): Int }
class Saludo(private val reloj: Reloj) {
    fun saludo(): String = when (reloj.hora()) {
        in 6..11 -&gt; "Buenos días"
        in 12..20 -&gt; "Buenas tardes"
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA4.2

**Un contenedor a mano.** Escribe `Contenedor`: un único `Servicio` compartido que se crea **solo cuando se pide por primera vez**, y una `Pantalla` nueva en cada llamada a `crearPantalla()`.

```kotlin
class Servicio {
    init { creados++ }
    companion object { var creados = 0 }
}

class Pantalla(val servicio: Servicio)

// Un solo Servicio compartido, creado SOLO cuando se pide por primera vez.
// crearPantalla() devuelve una Pantalla nueva cada vez que se llama.
class Contenedor {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() {
    val c = Contenedor()
    println("servicios creados al principio: ${Servicio.creados}")
    val p1 = c.crearPantalla()
    val p2 = c.crearPantalla()
    val p3 = c.crearPantalla()
    println("servicios creados tras 3 pantallas: ${Servicio.creados}")
    println("¿mismo servicio en todas? ${p1.servicio === p2.servicio && p2.servicio === p3.servicio}")
    println("¿pantallas distintas? ${p1 !== p2 && p2 !== p3}")
}
```

**Resultado esperado:**

```text
servicios creados al principio: 0
servicios creados tras 3 pantallas: 1
¿mismo servicio en todas? true
¿pantallas distintas? true
```

<details class="sol" data-key="android/av-a4/AA4.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>class Servicio {
    init { creados++ }
    companion object { var creados = 0 }
}
class Pantalla(val servicio: Servicio)
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA4.3

**Esperar sin esperar.** Escribe `contarHasta` y comprueba con `runTest` que, aunque son 8 segundos de espera, el tiempo transcurrido es virtual.

```kotlin
// Espera 2 segundos entre cada número y devuelve los números de 1 a n.
suspend fun contarHasta(n: Int): List<Int> {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() = runTest {
    val lista = contarHasta(4)
    println(lista)
    println("tiempo virtual: ${testScheduler.currentTime} ms")
}
```

**Resultado esperado:**

```text
[1, 2, 3, 4]
tiempo virtual: 8000 ms
```

<details class="sol" data-key="android/av-a4/AA4.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>suspend fun contarHasta(n: Int): List&lt;Int&gt; {
    val lista = mutableListOf&lt;Int&gt;()
    for (i in 1..n) {
        delay(2000)
        lista += i
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA4.4

**Tus primeras pruebas.** Escribe la clase `CarritoTest` con **tres pruebas** para este reductor: añadir suma una unidad, quitar no baja de cero y vaciar deja cero unidades.

```kotlin
data class CarritoState(val unidades: Int = 0)

sealed interface EventoCarrito {
    data object Añadir : EventoCarrito
    data object Quitar : EventoCarrito
    data object Vaciar : EventoCarrito
}

fun reducir(estado: CarritoState, evento: EventoCarrito): CarritoState = when (evento) {
    EventoCarrito.Añadir -> estado.copy(unidades = estado.unidades + 1)
    EventoCarrito.Quitar -> estado.copy(unidades = maxOf(0, estado.unidades - 1))
    EventoCarrito.Vaciar -> estado.copy(unidades = 0)
}
```

**Resultado esperado** al ejecutar tus pruebas con JUnit:

```text
...
OK (3 tests)
```

<details class="sol" data-key="android/av-a4/AA4.4">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import kotlin.test.*
data class CarritoState(val unidades: Int = 0)
sealed interface EventoCarrito {
    data object Añadir : EventoCarrito
    data object Quitar : EventoCarrito
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA4.5

**Probar un `Flow` con tiempo.** Escribe `temporizador()` y comprueba con `runTest` que emite `[1, 2, 3]` y que el tiempo virtual es de 3000 ms.

```kotlin
// Emite 1, 2 y 3, esperando un segundo ANTES de cada uno.
fun temporizador(): Flow<Int> {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() = runTest {
    val valores = temporizador().toList()
    println(valores)
    println("tiempo virtual: ${testScheduler.currentTime} ms")
}
```

**Resultado esperado:**

```text
[1, 2, 3]
tiempo virtual: 3000 ms
```

<details class="sol" data-key="android/av-a4/AA4.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>fun temporizador(): Flow&lt;Int&gt; = flow {
    for (i in 1..3) {
        delay(1000)
        emit(i)
    }
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA4.6

⭐ **Probar el `debounce`.** Escribe la clase `BuscadorTest` con **dos pruebas** para este `Buscador`: (1) cinco pulsaciones seguidas, con 50 ms entre ellas, producen **una sola búsqueda** con el último texto; (2) un texto de una sola letra **no** lanza ninguna búsqueda.

```kotlin
@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
class Buscador(private val buscar: suspend (String) -> List<String>) {
    fun resultados(teclado: Flow<String>): Flow<List<String>> = teclado
        .debounce(300)
        .distinctUntilChanged()
        .filter { it.length >= 2 }
        .mapLatest { buscar(it) }
}
```

**Resultado esperado** al ejecutar tus pruebas con JUnit:

```text
..
OK (2 tests)
```

<details class="sol" data-key="android/av-a4/AA4.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import kotlin.test.*
@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
class Buscador(private val buscar: suspend (String) -&gt; List&lt;String&gt;) {
    fun resultados(teclado: Flow&lt;String&gt;): Flow&lt;List&lt;String&gt;&gt; = teclado
        .debounce(300)
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
