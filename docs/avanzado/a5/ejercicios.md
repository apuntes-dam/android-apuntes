# AA5 · Ejercicios de rendimiento y publicación

<div class="ej-gate" data-unit="a5" data-nombre="AA5 · Rendimiento y publicación"></div>

Los ejercicios AA5.1, AA5.2, AA5.5 y AA5.6 se ejecutan de verdad: tu salida debe coincidir con el resultado esperado, obtenido ejecutando la solución modelo. Los AA5.3 (Gradle) y AA5.4 (Compose) **no se pueden ejecutar aquí**: compáralos con la solución modelo. El AA5.1 usa el *runtime* de Compose (`androidx.compose.runtime`). Los marcados con ⭐ son más difíciles.

## Ejercicio AA5.1

**Avisar solo cuando cambia.** Escribe `quedanPocas` con `derivedStateOf`. Las unidades bajan de 9 a 0 (nueve cambios), pero quien lee `quedanPocas` solo debe enterarse **dos veces**: al empezar y cuando pasa a ser `true`.

```kotlin
import androidx.compose.runtime.*

class Almacen {
    var unidades by mutableStateOf(10)

    // true cuando quedan menos de 5 unidades. Debe avisar SOLO cuando cambie ese resultado.
    val quedanPocas: Boolean
        get() = TODO()
}
```

Para comprobarlo:

```kotlin
import androidx.compose.runtime.snapshots.Snapshot

fun main() = runBlocking {
    val almacen = Almacen()
    val avisos = mutableListOf<Boolean>()
    val job = launch(Dispatchers.Default) { snapshotFlow { almacen.quedanPocas }.collect { avisos += it } }
    delay(200)
    for (u in 9 downTo 0) {
        almacen.unidades = u
        Snapshot.sendApplyNotifications()
        delay(60)
    }
    job.cancel()
    println("avisos recibidos: $avisos")
}
```

**Resultado esperado:**

```text
avisos recibidos: [false, true]
```

<details class="sol" data-key="android/av-a5/AA5.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>import androidx.compose.runtime.*
import androidx.compose.runtime.snapshots.Snapshot
class Almacen {
    var unidades by mutableStateOf(10)
    val quedanPocas by derivedStateOf { unidades &lt; 5 }
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA5.2

**El código de versión.** Escribe `versionCode`: convierte `mayor.menor.parche` en `mayor*10000 + menor*100 + parche` y rechaza los formatos incorrectos.

```kotlin
// Convierte "2.13.7" en 21307 (mayor*10000 + menor*100 + parche).
// Si el texto no tiene tres números separados por puntos, lanza IllegalArgumentException.
fun versionCode(nombre: String): Int {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() {
    println(versionCode("2.13.7"))
    println(versionCode("0.1.0"))
    for (mala in listOf("1.2", "1.a.3")) {
        try { versionCode(mala) } catch (e: IllegalArgumentException) { println("«$mala» -> ${e.message}") }
    }
}
```

**Resultado esperado:**

```text
21307
100
«1.2» -> formato esperado: mayor.menor.parche
«1.a.3» -> «a» no es un número
```

<details class="sol" data-key="android/av-a5/AA5.2">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>fun versionCode(nombre: String): Int {
    val partes = nombre.split(".").map { it.toIntOrNull() ?: throw IllegalArgumentException("«$it» no es un número") }
    require(partes.size == 3) { "formato esperado: mayor.menor.parche" }
    return partes[0] * 10_000 + partes[1] * 100 + partes[2]
}
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA5.3

Escribe el bloque `buildTypes { release { ... } }` de `build.gradle.kts` para que la compilación release:

* **reduzca y ofusque** el código con R8 y **quite los recursos** sin usar,
* use el archivo de reglas por defecto `proguard-android-optimize.txt` y tu `proguard-rules.pro`,
* se **firme** con la configuración `release` (`signingConfigs`),
* **no** sea depurable.

*Este ejercicio es de Gradle: no se puede ejecutar aquí y no tiene resultado esperado. Compara tu solución con la modelo.*

<details class="sol" data-key="android/av-a5/AA5.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>// Sin ejecutar: configuración de Gradle (Kotlin DSL)
buildTypes {
    release {
        isMinifyEnabled = true
        isShrinkResources = true
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA5.4

**Una lista con identidad.** *(Compose: no se puede ejecutar aquí.)* Corrige `ListaTareas` para que cada fila se identifique por el `id` de la tarea y las de igual tipo reutilicen su estructura.

```kotlin
// Una lista de tareas (cada Tarea tiene id: Int y tipo: String). Hoy no usa key ni contentType,
// así que al insertar una tarea al principio Compose cree que todas han cambiado.
@Composable
fun ListaTareas(tareas: List<Tarea>) {
    LazyColumn {
        items(tareas) { tarea ->
            FilaTarea(tarea)
        }
    }
}
```

<details class="sol" data-key="android/av-a5/AA5.4">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>// Sin ejecutar: necesita el compilador de Compose
@Composable
fun ListaTareas(tareas: List&lt;Tarea&gt;) {
    LazyColumn {
        items(
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA5.5

**La versión siguiente.** Escribe `siguiente`: según el tipo de cambio sube el parche, el menor (y el parche vuelve a 0) o el mayor (y los otros dos vuelven a 0).

```kotlin
data class Version(val mayor: Int, val menor: Int, val parche: Int) {
    override fun toString() = "$mayor.$menor.$parche"
}

enum class Cambio { PARCHE, MENOR, MAYOR }

// PARCHE: sube el parche. MENOR: sube el menor y pone el parche a 0.
// MAYOR: sube el mayor y pone menor y parche a 0.
fun siguiente(v: Version, cambio: Cambio): Version {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() {
    val v = Version(1, 4, 2)
    for (c in Cambio.entries) println("${c.name.padEnd(6)} -> ${siguiente(v, c)}")
}
```

**Resultado esperado:**

```text
PARCHE -> 1.4.3
MENOR  -> 1.5.0
MAYOR  -> 2.0.0
```

<details class="sol" data-key="android/av-a5/AA5.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class Version(val mayor: Int, val menor: Int, val parche: Int) {
    override fun toString() = "$mayor.$menor.$parche"
}
enum class Cambio { PARCHE, MENOR, MAYOR }
fun siguiente(v: Version, cambio: Cambio): Version = when (cambio) {
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio AA5.6

⭐ **Lista de comprobación automática.** Escribe `problemas`: devuelve los motivos por los que una compilación release no está lista para publicar, en el orden indicado.

```kotlin
data class ConfigRelease(
    val versionCode: Int,
    val ultimoPublicado: Int,
    val minificada: Boolean,
    val depurable: Boolean,
    val firmada: Boolean
)

// Devuelve la lista de problemas que impiden publicar (vacía si todo está bien):
//  - "versionCode no supera al publicado"  si versionCode <= ultimoPublicado
//  - "sin minificar"                       si no está minificada
//  - "es depurable"                        si es depurable
//  - "sin firmar"                          si no está firmada
fun problemas(c: ConfigRelease): List<String> {
    // ...
}
```

Para comprobarlo:

```kotlin
fun main() {
    val buena = ConfigRelease(10402, 10401, minificada = true, depurable = false, firmada = true)
    val mala = ConfigRelease(10401, 10401, minificada = false, depurable = true, firmada = false)
    println("buena: ${problemas(buena)}")
    println("mala:  ${problemas(mala)}")
}
```

**Resultado esperado:**

```text
buena: []
mala:  [versionCode no supera al publicado, sin minificar, es depurable, sin firmar]
```

<details class="sol" data-key="android/av-a5/AA5.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class ConfigRelease(
    val versionCode: Int,
    val ultimoPublicado: Int,
    val minificada: Boolean,
    val depurable: Boolean,
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
