# AA1 · Ejercicios de arquitectura y estado

<div class="ej-gate" data-unit="a1" data-nombre="AA1 · Arquitectura y estado"></div>

Cada ejercicio parte del esqueleto que se te da. Escribe la solución en un archivo `.kt` aparte (en IntelliJ IDEA o con `kotlinc`) y pega el `main` del enunciado para comprobarla: tu salida debe ser **idéntica** al resultado esperado, que se ha obtenido ejecutando la solución modelo de verdad. Los marcados con ⭐ son más difíciles.

## Ejercicio AA1.1

**Contador con reductor.** Escribe `reducir` para que `Sumar` sume 1, `Restar` reste 1 **sin bajar nunca de 0** y `Reiniciar` vuelva a 0.

```kotlin
data class ContadorState(val valor: Int = 0)

sealed interface EventoContador {
    data object Sumar : EventoContador
    data object Restar : EventoContador
    data object Reiniciar : EventoContador
}

fun reducir(estado: ContadorState, evento: EventoContador): ContadorState = TODO()
```

Para comprobarlo:

```kotlin
fun main() {
    var e = ContadorState()
    val eventos = listOf(EventoContador.Sumar, EventoContador.Sumar, EventoContador.Restar, EventoContador.Restar,
        EventoContador.Restar, EventoContador.Sumar, EventoContador.Reiniciar, EventoContador.Restar)
    for (ev in eventos) { e = reducir(e, ev); print("${e.valor} ") }
    println()
}
```

**Resultado esperado:**

```text
1 2 1 0 0 1 0 0 
```

<details class="sol" data-key="android/av-a1/AA1.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class ContadorState(val valor: Int = 0)
sealed interface EventoContador {
    data object Sumar : EventoContador
    data object Restar : EventoContador
    data object Reiniciar : EventoContador
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA1.2

**Estado derivado.** Completa `CarritoUiState` con tres propiedades **calculadas** (sin guardarlas): `total` (precio × cantidad de todas las líneas), `unidades` (suma de cantidades) y `vacio`.

```kotlin
data class Linea(val nombre: String, val precio: Int, val cantidad: Int)   // el precio, en euros enteros

data class CarritoUiState(val lineas: List<Linea> = emptyList()) {
    // total, unidades y vacio
}
```

Para comprobarlo:

```kotlin
fun main() {
    val vacio = CarritoUiState()
    println("vacío: total=${vacio.total}, unidades=${vacio.unidades}, vacio=${vacio.vacio}")
    val lleno = CarritoUiState(listOf(Linea("Cuaderno", 3, 2), Linea("Bolígrafo", 1, 5), Linea("Mochila", 25, 1)))
    println("lleno: total=${lleno.total}, unidades=${lleno.unidades}, vacio=${lleno.vacio}")
}
```

**Resultado esperado:**

```text
vacío: total=0, unidades=0, vacio=true
lleno: total=36, unidades=8, vacio=false
```

<details class="sol" data-key="android/av-a1/AA1.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class Linea(val nombre: String, val precio: Int, val cantidad: Int)   // el precio, en euros enteros
data class CarritoUiState(val lineas: List&lt;Linea&gt; = emptyList()) {
    val total: Int get() = lineas.sumOf { it.precio * it.cantidad }
    val unidades: Int get() = lineas.sumOf { it.cantidad }
    val vacio: Boolean get() = lineas.isEmpty()
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA1.3

**Las fases de una pantalla.** Escribe `mensaje(p)` con un `when` **sin `else`**: `Cargando` → «Cargando el perfil...»; `Datos` → «Marta (17 años)»; `SinConexion` con menos de 3 intentos → «Sin conexión. Reintentando (1/3)» y con 3 o más → «Sin conexión. Inténtalo más tarde».

```kotlin
sealed interface PerfilUi {
    data object Cargando : PerfilUi
    data class Datos(val nombre: String, val edad: Int) : PerfilUi
    data class SinConexion(val intentos: Int) : PerfilUi
}
```

Para comprobarlo:

```kotlin
fun main() {
    listOf(PerfilUi.Cargando, PerfilUi.Datos("Marta", 17), PerfilUi.SinConexion(1), PerfilUi.SinConexion(3))
        .forEach { println(mensaje(it)) }
}
```

**Resultado esperado:**

```text
Cargando el perfil...
Marta (17 años)
Sin conexión. Reintentando (1/3)
Sin conexión. Inténtalo más tarde
```

<details class="sol" data-key="android/av-a1/AA1.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>sealed interface PerfilUi {
    data object Cargando : PerfilUi
    data class Datos(val nombre: String, val edad: Int) : PerfilUi
    data class SinConexion(val intentos: Int) : PerfilUi
}
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA1.4

**Sin perder incrementos.** Implementa `sumar(n)` de forma que 50 corrutinas sumando 1000 veces cada una den **siempre 50 000**.

```kotlin
class ContadorCompartido {
    val total = MutableStateFlow(0)

    fun sumar(n: Int) { /* ... */ }
}
```

Para comprobarlo:

```kotlin
fun main() = runBlocking {
    val c = ContadorCompartido()
    withContext(Dispatchers.Default) {
        coroutineScope {
            repeat(50) { launch { repeat(1000) { c.sumar(1) } } }
        }
    }
    println("total = ${c.total.value}")
}
```

**Resultado esperado:**

```text
total = 50000
```

<details class="sol" data-key="android/av-a1/AA1.4">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import kotlinx.coroutines.flow.*
class ContadorCompartido {
    val total = MutableStateFlow(0)
    fun sumar(n: Int) {
        total.update { it + n }
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA1.5

**Un aviso que se consume.** `enviar(correo)` debe dejar en `mensaje` «Correo no válido» si no hay `@`, o «Enviado a » seguido del correo si lo hay. `mensajeMostrado()` borra el aviso.

```kotlin
data class CorreoUiState(val mensaje: String? = null)

class CorreoModelo {
    private val _estado = MutableStateFlow(CorreoUiState())
    val estado: StateFlow<CorreoUiState> = _estado.asStateFlow()

    fun enviar(correo: String) { /* ... */ }
    fun mensajeMostrado() { /* ... */ }
}
```

Para comprobarlo:

```kotlin
fun main() {
    val m = CorreoModelo()
    m.enviar("ana.ejemplo.com")
    println(m.estado.value.mensaje)
    m.mensajeMostrado()
    println(m.estado.value.mensaje)
    m.enviar("ana@ejemplo.com")
    println(m.estado.value.mensaje)
}
```

**Resultado esperado:**

```text
Correo no válido
null
Enviado a ana@ejemplo.com
```

<details class="sol" data-key="android/av-a1/AA1.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import kotlinx.coroutines.flow.*
data class CorreoUiState(val mensaje: String? = null)
class CorreoModelo {
    private val _estado = MutableStateFlow(CorreoUiState())
    val estado: StateFlow&lt;CorreoUiState&gt; = _estado.asStateFlow()
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA1.6

⭐ **Deshacer.** Escribe el reductor: `Sumar(n)` suma `n` y **recuerda el valor anterior** en `pasado`; `Deshacer` vuelve al último valor recordado y, si no hay nada que deshacer, no cambia nada.

```kotlin
data class HistState(val valor: Int = 0, val pasado: List<Int> = emptyList())

sealed interface EventoHist {
    data class Sumar(val n: Int) : EventoHist
    data object Deshacer : EventoHist
}
```

Para comprobarlo:

```kotlin
fun main() {
    var e = HistState()
    val eventos = listOf(EventoHist.Sumar(5), EventoHist.Sumar(3), EventoHist.Deshacer, EventoHist.Sumar(10),
        EventoHist.Deshacer, EventoHist.Deshacer, EventoHist.Deshacer)
    for (ev in eventos) {
        e = reducir(e, ev)
        println("valor=${e.valor}, pasos que se pueden deshacer=${e.pasado.size}")
    }
}
```

**Resultado esperado:**

```text
valor=5, pasos que se pueden deshacer=1
valor=8, pasos que se pueden deshacer=2
valor=5, pasos que se pueden deshacer=1
valor=15, pasos que se pueden deshacer=2
valor=5, pasos que se pueden deshacer=1
valor=0, pasos que se pueden deshacer=0
valor=0, pasos que se pueden deshacer=0
```

<details class="sol" data-key="android/av-a1/AA1.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class HistState(val valor: Int = 0, val pasado: List&lt;Int&gt; = emptyList())
sealed interface EventoHist {
    data class Sumar(val n: Int) : EventoHist
    data object Deshacer : EventoHist
}
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
