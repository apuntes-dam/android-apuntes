# AA3 · Ejercicios de datos y repositorios

<div class="ej-gate" data-unit="a3" data-nombre="AA3 · Datos y repositorios"></div>

Como en las unidades anteriores: parte del esqueleto, escribe la solución en un `.kt` y pega el `main` para comprobarla. Tu salida debe coincidir con el resultado esperado, obtenido ejecutando la solución modelo. Los marcados con ⭐ son más difíciles.

## Ejercicio AA3.1

**Mapear con validación.** Completa `toDominio()` para convertir el DTO de un usuario, descartando (`null`) los incompletos o con un email sin `@`.

```kotlin
data class UsuarioDto(val id: Int?, val nombre: String?, val email: String?, val edad: Int?)
data class Usuario(val id: Int, val nombre: String, val email: String, val mayorDeEdad: Boolean)

// null si falta el id, el nombre (o está en blanco) o el email, o si el email no contiene «@».
// El nombre se devuelve sin espacios sobrantes. Si no hay edad, se considera menor de edad.
fun UsuarioDto.toDominio(): Usuario? {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() {
    val dtos = listOf(
        UsuarioDto(1, " Ana ", "ana@ejemplo.com", 20),
        UsuarioDto(2, "Luis", "luis.ejemplo.com", 30),
        UsuarioDto(3, "", "x@y.com", 40),
        UsuarioDto(null, "Marta", "m@ejemplo.com", 15),
        UsuarioDto(5, "Pablo", "p@ejemplo.com", null)
    )
    dtos.mapNotNull { it.toDominio() }.forEach(::println)
}
```

**Resultado esperado:**

```text
Usuario(id=1, nombre=Ana, email=ana@ejemplo.com, mayorDeEdad=true)
Usuario(id=5, nombre=Pablo, email=p@ejemplo.com, mayorDeEdad=false)
```

<details class="sol" data-key="android/av-a3/AA3.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class UsuarioDto(val id: Int?, val nombre: String?, val email: String?, val edad: Int?)
data class Usuario(val id: Int, val nombre: String, val email: String, val mayorDeEdad: Boolean)
fun UsuarioDto.toDominio(): Usuario? {
    val id = id ?: return null
    val nombre = nombre?.trim()?.takeIf { it.isNotEmpty() } ?: return null
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA3.2

**`intentar` sin tragarse la cancelación.** Completa la función para que devuelva `Ok` con el valor, `Fallo` con la excepción, y **deje pasar** la `CancellationException`.

```kotlin
sealed interface Resultado<out T> {
    data class Ok<T>(val valor: T) : Resultado<T>
    data class Fallo(val error: Throwable) : Resultado<Nothing>
}

// Ejecuta el bloque y lo convierte en Resultado, pero SIN tragarse la cancelación.
suspend fun <T> intentar(bloque: suspend () -> T): Resultado<T> {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    println(runBlocking { intentar { 21 * 2 } })
    println(runBlocking { intentar { error("se rompió") } }.let { (it as Resultado.Fallo).error.message })
    val trabajo = launch { intentar { delay(1000) } }
    delay(50)
    trabajo.cancelAndJoin()
    println("cancelación respetada: ${trabajo.isCancelled}")
}
```

**Resultado esperado:**

```text
Ok(valor=42)
se rompió
cancelación respetada: true
```

<details class="sol" data-key="android/av-a3/AA3.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>sealed interface Resultado&lt;out T&gt; {
    data class Ok&lt;T&gt;(val valor: T) : Resultado&lt;T&gt;
    data class Fallo(val error: Throwable) : Resultado&lt;Nothing&gt;
}
suspend fun &lt;T&gt; intentar(bloque: suspend () -&gt; T): Resultado&lt;T&gt; =
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA3.3

**Del error al mensaje.** Escribe `mensajeDe` con un `when` para traducir cada excepción a un mensaje pensado para el usuario.

```kotlin
class HttpFalso(val codigo: Int) : Exception("HTTP $codigo")

// IOException -> "Sin conexión"; HttpFalso 401 -> "Debes iniciar sesión"; HttpFalso 404 -> "No encontrado";
// cualquier otro código HTTP -> "Error del servidor (código X)"; cualquier otra cosa -> "Error inesperado".
fun mensajeDe(e: Throwable): String {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() {
    listOf<Throwable>(IOException("x"), HttpFalso(401), HttpFalso(404), HttpFalso(500), NullPointerException())
        .forEach { println(mensajeDe(it)) }
}
```

**Resultado esperado:**

```text
Sin conexión
Debes iniciar sesión
No encontrado
Error del servidor (código 500)
Error inesperado
```

<details class="sol" data-key="android/av-a3/AA3.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import java.io.IOException
class HttpFalso(val codigo: Int) : Exception("HTTP $codigo")
fun mensajeDe(e: Throwable): String = when (e) {
    is IOException -&gt; "Sin conexión"
    is HttpFalso -&gt; when (e.codigo) {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA3.4

**Caché con caducidad.** Implementa `CacheTtl`: `obtener` devuelve el valor solo si **han pasado menos** de `ttlMs` desde que se puso; `invalidar` lo borra.

```kotlin
// Una caché que guarda UN valor y deja de devolverlo cuando pasa el tiempo indicado.
class CacheTtl<T>(private val ttlMs: Long, private val reloj: () -> Long) {
    fun obtener(): T? { /* ... */ return null }
    fun poner(valor: T) { /* ... */ }
    fun invalidar() { /* ... */ }
}
```

Para comprobarlo:

```kotlin
fun main() {
    var ahora = 0L
    val cache = CacheTtl<String>(ttlMs = 1000, reloj = { ahora })
    println(cache.obtener())
    cache.poner("A")
    ahora = 999
    println(cache.obtener())
    ahora = 1000
    println(cache.obtener())
    cache.poner("B")
    cache.invalidar()
    println(cache.obtener())
}
```

**Resultado esperado:**

```text
null
A
null
null
```

<details class="sol" data-key="android/av-a3/AA3.4">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>class CacheTtl&lt;T&gt;(private val ttlMs: Long, private val reloj: () -&gt; Long) {
    private var valor: T? = null
    private var guardadoEn = 0L
    fun obtener(): T? = valor?.takeIf { reloj() - guardadoEn &lt; ttlMs }
    fun poner(valor: T) { this.valor = valor; guardadoEn = reloj() }
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA3.5

**Reintentar con espera creciente.** Escribe `reintentar` según las indicaciones. Con 5 intentos y una espera inicial de 10 ms, una petición que falla tres veces debe esperar 10, 20 y 40 ms antes de acertar al cuarto intento.

```kotlin
// Ejecuta `bloque` hasta `intentos` veces. Si falla con IOException, espera y reintenta, DUPLICANDO la espera cada vez.
// Imprime "espero X ms" antes de cada espera. En el último intento, si falla, deja pasar la excepción.
suspend fun <T> reintentar(intentos: Int, esperaInicial: Long, bloque: suspend (Int) -> T): T {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    val r = reintentar(5, 10) { n -> if (n < 4) throw IOException("sin red") else "ok en el intento $n" }
    println(r)
}
```

**Resultado esperado:**

```text
espero 10 ms
espero 20 ms
espero 40 ms
ok en el intento 4
```

<details class="sol" data-key="android/av-a3/AA3.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import java.io.IOException
suspend fun &lt;T&gt; reintentar(intentos: Int, esperaInicial: Long, bloque: suspend (Int) -&gt; T): T {
    var espera = esperaInicial
    repeat(intentos - 1) { n -&gt;
        try {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA3.6

⭐ **Cola de pendientes.** Implementa `enviarTodos`: manda los mensajes en orden y, al primer fallo, se detiene sin perder ese mensaje ni los siguientes.

```kotlin
// Una cola de mensajes por enviar. `enviarTodos` los manda EN ORDEN con `enviar` (que devuelve false si falla);
// al primer fallo se detiene y conserva ese mensaje y los siguientes. Devuelve cuántos se enviaron.
class Bandeja {
    private val pendientes = ArrayDeque<String>()
    fun añadir(m: String) { pendientes.addLast(m) }
    val quedan: List<String> get() = pendientes.toList()

    suspend fun enviarTodos(enviar: suspend (String) -> Boolean): Int {
        // ...
    }
}
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    val b = Bandeja()
    listOf("hola", "¿qué tal?", "adiós", "hasta luego").forEach(b::añadir)
    val n1 = b.enviarTodos { it != "adiós" }          // «adiós» no se puede enviar
    println("enviados $n1, quedan ${b.quedan}")
    val n2 = b.enviarTodos { true }
    println("enviados $n2, quedan ${b.quedan}")
}
```

**Resultado esperado:**

```text
enviados 2, quedan [adiós, hasta luego]
enviados 2, quedan []
```

<details class="sol" data-key="android/av-a3/AA3.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>class Bandeja {
    private val pendientes = ArrayDeque&lt;String&gt;()
    fun añadir(m: String) { pendientes.addLast(m) }
    val quedan: List&lt;String&gt; get() = pendientes.toList()
    suspend fun enviarTodos(enviar: suspend (String) -&gt; Boolean): Int {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
