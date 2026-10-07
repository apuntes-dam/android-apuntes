# AA2.1 Corrutinas estructuradas y cancelación

!!! info "Qué se ha ejecutado y qué no"
    Los ejemplos con salida se han **compilado y ejecutado de verdad** al construir esta web (Kotlin con `kotlinx-coroutines` 1.11.0). Los fragmentos de `ViewModel` y de Compose marcados como «sin ejecutar» necesitan Android.

## Concurrencia estructurada

La idea que lo ordena todo: **cada corrutina tiene un padre y vive dentro de un ámbito** (*scope*). Eso da tres garantías:

1. El padre **no termina** hasta que acaban sus hijos.
2. **Cancelar al padre cancela a todos los hijos.**
3. Si un hijo **falla**, el fallo sube al padre (que cancela a los demás hijos).

En Android el ámbito lo pone la plataforma: `viewModelScope` (se cancela cuando el `ViewModel` desaparece) y `lifecycleScope` (cuando se destruye la pantalla). Así **no queda trabajo huérfano** cuando el usuario se va.

```kotlin
fun main() = runBlocking {
    val padre = launch {
        launch {
            try { delay(1000); println("hijo 1 termina") }
            finally { println("hijo 1: limpieza") }
        }
        launch {
            try { delay(1000); println("hijo 2 termina") }
            finally { println("hijo 2: limpieza") }
        }
    }
    delay(100)
    padre.cancelAndJoin()                       // cancelamos SOLO al padre
    println("¿padre cancelado? ${padre.isCancelled}")
}
```

**Salida:**

```text
hijo 1: limpieza
hijo 2: limpieza
¿padre cancelado? true
```

Nadie cancela a los hijos directamente, pero los dos pasan por su `finally` y **ninguno llega a terminar**. Esto es lo que ocurre cuando el usuario sale de una pantalla en mitad de una descarga: el trabajo se corta solo.

!!! warning "No uses `GlobalScope`"
    `GlobalScope.launch { ... }` crea una corrutina **sin padre**: nada la cancela y puede seguir viva y gastando batería cuando ya no hace falta. En Android se usa siempre el ámbito de la pantalla (`viewModelScope`, `lifecycleScope`) o uno propio que tú cancelas.

## `launch` y `async`

| | Qué devuelve | Para qué |
|---|---|---|
| `launch` | Un `Job` (sin resultado) | Lanzar y olvidar: guardar, registrar, actualizar el estado |
| `async` | Un `Deferred<T>` (un resultado futuro) | Lanzar **varias cosas a la vez** y recoger los resultados con `await()` |

La diferencia práctica de usar `async` es el **tiempo**. Dos peticiones que tardan 300 ms cada una:

```kotlin
suspend fun pedirPerfil(): String { delay(300); return "perfil de Ana" }
suspend fun pedirAmigos(): List<String> { delay(300); return listOf("Luis", "Marta") }

fun main() = runBlocking {
    val inicio = System.currentTimeMillis()
    val perfil = pedirPerfil()
    val amigos = pedirAmigos()
    val secuencial = System.currentTimeMillis() - inicio
    println("secuencial: $perfil, $amigos")

    val inicio2 = System.currentTimeMillis()
    val p = async { pedirPerfil() }
    val a = async { pedirAmigos() }
    println("en paralelo: ${p.await()}, ${a.await()}")
    val paralelo = System.currentTimeMillis() - inicio2

    println("¿secuencial ≥ 600 ms? ${secuencial >= 600}")
    println("¿paralelo < 500 ms?   ${paralelo < 500}")
}
```

**Salida:**

```text
secuencial: perfil de Ana, [Luis, Marta]
en paralelo: perfil de Ana, [Luis, Marta]
¿secuencial ≥ 600 ms? true
¿paralelo < 500 ms?   true
```

Secuencial suma los dos tiempos; en paralelo el total es **lo que tarda la más lenta**. (Se imprime una comparación y no los milisegundos exactos, porque cambian en cada ejecución.)

## Cuando algo falla

Aquí está la parte que más sorprende. **Por defecto, el fallo de un hijo cancela a sus hermanos** y sube al padre:

```kotlin
fun main() = runBlocking {
    val resultado = runCatching {
        coroutineScope {
            launch {
                delay(100)
                throw IllegalStateException("falló A")
            }
            launch {
                try { delay(500); println("B termina") }
                catch (e: CancellationException) { println("B cancelado porque A falló"); throw e }
            }
        }
    }
    println("coroutineScope -> ${resultado.exceptionOrNull()?.message}")
}
```

**Salida:**

```text
B cancelado porque A falló
coroutineScope -> falló A
```

Muchas veces **eso es lo que quieres** (si fallan los datos del perfil, no tiene sentido seguir con los amigos). Pero a veces los hijos son **independientes**: una pantalla con tres tarjetas que cargan por separado no debería quedarse sin las otras dos porque una falle. Para eso existe **`supervisorScope`**: el fallo de un hijo **no cancela a los demás**.

```kotlin
fun main() = runBlocking {
    val manejador = CoroutineExceptionHandler { _, e -> println("manejador recibe: ${e.message}") }
    supervisorScope {
        launch(manejador) {
            delay(100)
            throw IllegalStateException("falló A")
        }
        launch {
            delay(300)
            println("B termina con normalidad")
        }
    }
    println("el ámbito terminó")
}
```

**Salida:**

```text
manejador recibe: falló A
B termina con normalidad
el ámbito terminó
```

| Ámbito | Si un hijo falla | Cuándo |
|---|---|---|
| `coroutineScope` | Cancela a los hermanos y relanza la excepción | Las partes forman **un todo** |
| `supervisorScope` | Los hermanos **siguen** | Las partes son **independientes** |

!!! tip "Dónde se captura el error"
    Con **`launch`** una excepción no capturada va al `CoroutineExceptionHandler` (o cierra la app). Con **`async`** la excepción **se guarda** y salta al llamar a `await()`: ahí es donde hay que poner el `try/catch`. Un `try/catch` **alrededor** de `launch { ... }` **no sirve**: el error ocurre más tarde, dentro de la corrutina.

## Cancelar es cooperar

Cancelar una corrutina **no la detiene a la fuerza**: le pide que pare, y ella tiene que **mirar** si se lo han pedido. Todas las funciones de suspensión de `kotlinx.coroutines` (`delay`, `withContext`...) lo miran solas. Un bucle de cálculo que **no suspende nunca**, no:

```kotlin
fun main() = runBlocking {
    // Esta corrutina se cancela a sí misma en la iteración 2, pero NO comprueba la cancelación
    val sinComprobar = launch(Dispatchers.Default) {
        for (i in 1..5) {
            if (i == 2) coroutineContext.job.cancel()
            println("sin comprobar: iteración $i")
        }
    }
    sinComprobar.join()

    // Esta sí comprueba antes de cada vuelta
    val comprobando = launch(Dispatchers.Default) {
        for (i in 1..5) {
            ensureActive()
            if (i == 2) coroutineContext.job.cancel()
            println("comprobando:   iteración $i")
        }
    }
    comprobando.join()
}
```

**Salida:**

```text
sin comprobar: iteración 1
sin comprobar: iteración 2
sin comprobar: iteración 3
sin comprobar: iteración 4
sin comprobar: iteración 5
comprobando:   iteración 1
comprobando:   iteración 2
```

La primera hace las **cinco** vueltas aunque estuviera cancelada desde la segunda. La segunda se detiene al llegar a la siguiente comprobación. En código real, la cancelación llega de fuera, pero el efecto es idéntico. Tienes tres formas de comprobarla en un bucle largo:

| Forma | Qué hace |
|---|---|
| `ensureActive()` | Lanza `CancellationException` si ya está cancelada |
| `isActive` | Una propiedad `Boolean` para usar en `while (isActive)` |
| `yield()` | Cede el turno **y** comprueba la cancelación |

### No te «comas» la cancelación

La cancelación es una **excepción** (`CancellationException`). Si la capturas con un `catch (e: Exception)` genérico y no la vuelves a lanzar, la corrutina cree que sigue viva:

```kotlin
fun main() = runBlocking {
    val trabajo = launch {
        try {
            delay(1000)
        } catch (e: Exception) {                  // ¡captura también la cancelación!
            println("capturé: ${e::class.simpleName}")
        }
        println("sigo vivo, pero ¿cancelado? ${coroutineContext.job.isCancelled}")
    }
    delay(100)
    trabajo.cancelAndJoin()
}
```

**Salida:**

```text
capturé: JobCancellationException
sigo vivo, pero ¿cancelado? true
```

Salió del `delay` por la cancelación, **se la tragó** y siguió ejecutando código de un trabajo ya cancelado (cualquier siguiente `delay` fallaría de inmediato). La regla: o **no capturas `Exception`**, o capturas las concretas que esperas (`IOException`...), o vuelves a lanzar la `CancellationException`:

```kotlin
try { /* ... */ }
catch (e: CancellationException) { throw e }     // siempre se relanza
catch (e: Exception) { /* tu manejo del error */ }
```

### Limpiar después de cancelar: `NonCancellable`

Dentro de un `finally` de una corrutina **ya cancelada**, cualquier `delay` o llamada de suspensión falla al instante. Si necesitas una limpieza que suspenda (cerrar un archivo, avisar al servidor), se protege con `NonCancellable`. Y para poner **límite de tiempo** a algo, `withTimeoutOrNull`:

```kotlin
fun main() = runBlocking {
    val resultado = withTimeoutOrNull(200) {
        try {
            delay(1000)
            "terminó"
        } finally {
            withContext(NonCancellable) {          // aquí sí se puede suspender
                delay(10)
                println("limpieza completa")
            }
        }
    }
    println("resultado: $resultado")
}
```

**Salida:**

```text
limpieza completa
resultado: null
```

## Hilos: `withContext` y la regla de la «seguridad en el hilo principal»

La interfaz solo se puede tocar desde el **hilo principal**, y ese hilo **no puede bloquearse** (si pasa de unos segundos, Android muestra el famoso «la app no responde»). Por eso el trabajo pesado se manda a otro **dispatcher**:

| Dispatcher | Para qué |
|---|---|
| `Dispatchers.Main` | Interfaz y estado. Es el de `viewModelScope` |
| `Dispatchers.IO` | Red, disco, base de datos (esperas largas) |
| `Dispatchers.Default` | Cálculo pesado (ordenar, procesar imágenes) |

La buena práctica: una función `suspend` debe ser **segura para llamarla desde el hilo principal**, y si hace trabajo pesado, es **ella** quien cambia de dispatcher con `withContext`, no quien la llama:

```kotlin
suspend fun leerDelDisco(): String = withContext(Dispatchers.IO) {
    println("  dentro de leerDelDisco: ¿en un hilo de IO? ${Thread.currentThread().name.startsWith("DefaultDispatcher")}")
    delay(50)
    "contenido"
}

fun main() = runBlocking {
    println("antes: ¿en el hilo principal? ${Thread.currentThread().name == "main"}")
    val texto = leerDelDisco()
    println("después: ¿vuelta al hilo principal? ${Thread.currentThread().name == "main"} · $texto")
}
```

**Salida:**

```text
antes: ¿en el hilo principal? true
  dentro de leerDelDisco: ¿en un hilo de IO? true
después: ¿vuelta al hilo principal? true · contenido
```

La función **cambia de hilo, hace su trabajo y devuelve la ejecución al hilo de quien la llamó**. (En este ejemplo el «hilo principal» es el de `runBlocking`, llamado `main`; en Android es el hilo de la interfaz.)

## En un `ViewModel` (sin ejecutar)

```kotlin
// Sin ejecutar: necesita Android
class PerfilViewModel(private val repositorio: PerfilRepositorio) : ViewModel() {
    private val _estado = MutableStateFlow<PerfilUi>(PerfilUi.Cargando)
    val estado: StateFlow<PerfilUi> = _estado.asStateFlow()

    private var trabajoCarga: Job? = null

    fun cargar(id: Int) {
        trabajoCarga?.cancel()                       // si ya había una carga en marcha, la cancelo
        trabajoCarga = viewModelScope.launch {
            _estado.value = PerfilUi.Cargando
            try {
                val (perfil, amigos) = coroutineScope {
                    val p = async { repositorio.perfil(id) }
                    val a = async { repositorio.amigos(id) }
                    p.await() to a.await()
                }
                _estado.value = PerfilUi.Datos(perfil, amigos)
            } catch (e: CancellationException) {
                throw e                              // nunca se traga
            } catch (e: Exception) {
                _estado.value = PerfilUi.Error(e.message ?: "Error desconocido")
            }
        }
    }
}
```

Reúne casi todo lo de esta página: ámbito del `ViewModel`, **cancelar la carga anterior** si el usuario pide otra, dos peticiones **en paralelo**, y el error convertido en **estado** (visto en la [AA1](../a1/01-estado-udf.md)).

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| `GlobalScope.launch` | `viewModelScope` / `lifecycleScope` |
| `catch (e: Exception)` sin relanzar la cancelación | Captura excepciones concretas o relanza `CancellationException` |
| `try/catch` alrededor de `launch` | El `try/catch` va **dentro** de la corrutina (o en `await()`) |
| Peticiones en secuencia que no dependen entre sí | `async` + `await()` |
| Bucle de cálculo sin puntos de suspensión | `ensureActive()` / `isActive` / `yield()` |
| Llamar a `Thread.sleep` en una corrutina | `delay` (no bloquea el hilo) |
| Lanzar una carga nueva sin cancelar la anterior | Guarda el `Job` y cancélalo antes |

## Para practicar

Los ejercicios AA2.1 a AA2.3 de [AA2 · Ejercicios](ejercicios.md) practican `async`, la cancelación cooperativa y `supervisorScope`.
