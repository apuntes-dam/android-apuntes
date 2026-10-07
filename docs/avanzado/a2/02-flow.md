# AA2.2 Flow: operadores y estado derivado

!!! info "Qué se ha ejecutado y qué no"
    Los ejemplos con salida se han **compilado y ejecutado de verdad** al construir esta web (Kotlin con `kotlinx-coroutines` 1.11.0). Los fragmentos de `ViewModel` y de Compose marcados como «sin ejecutar» necesitan Android.

## Flow frío: no hace nada hasta que lo recoges

Un `Flow` describe una **secuencia de valores que llegan con el tiempo**. Un `Flow` normal es **frío**: el código de su constructor **no se ejecuta** hasta que alguien lo recoge con `collect`, y se ejecuta **de nuevo por cada colector**.

```kotlin
fun numeros(): Flow<Int> = flow {
    println("  (el flow empieza)")
    for (i in 1..3) {
        delay(10)
        emit(i)
    }
}

fun main() = runBlocking {
    val f = numeros()
    println("creado, aún no ha pasado nada")
    f.collect { println("colector A recibe $it") }
    f.collect { println("colector B recibe $it") }
}
```

**Salida:**

```text
creado, aún no ha pasado nada
  (el flow empieza)
colector A recibe 1
colector A recibe 2
colector A recibe 3
  (el flow empieza)
colector B recibe 1
colector B recibe 2
colector B recibe 3
```

`flow { ... }` no imprimió nada al crearse; cada `collect` lo **arranca desde cero**. Esto es lo contrario de un `StateFlow`, que es **caliente**: existe y guarda su valor aunque nadie lo recoja.

## Los operadores del día a día

Se encadenan como en las colecciones, pero trabajan **cuando llegan los valores**:

```kotlin
fun main() = runBlocking {
    (1..10).asFlow()
        .filter { it % 2 == 0 }
        .map { it * it }
        .onEach { println("  pasa por onEach: $it") }
        .take(3)
        .onCompletion { println("fin del flujo") }
        .collect { println("recibido $it") }
}
```

**Salida:**

```text
  pasa por onEach: 4
recibido 4
  pasa por onEach: 16
recibido 16
  pasa por onEach: 36
recibido 36
fin del flujo
```

`take(3)` **corta el flujo** al tercer valor, y fíjate en que ni siquiera se calcula el cuadrado de 8 ni de 10: las tuberías de `Flow` son **perezosas**.

| Operador | Qué hace |
|---|---|
| `map`, `filter`, `take`, `onEach` | Como en las listas |
| `distinctUntilChanged()` | Ignora un valor igual al anterior |
| `debounce(ms)` | Solo deja pasar un valor si **no llega otro** en los siguientes `ms` |
| `flowOn(dispatcher)` | Cambia **dónde se ejecuta lo de arriba** (nunca lo de abajo) |
| `catch { }` | Captura errores **del flujo de arriba** |
| `onCompletion { }` | Se ejecuta al terminar, con o sin error |

### Errores en un flujo: `catch` solo mira hacia arriba

```kotlin
fun main() = runBlocking {
    flow {
        emit(1)
        emit(2)
        throw IllegalStateException("se cayó la red")
    }
        .catch { e ->
            println("catch captura: ${e.message}")
            emit(-1)                         // puedo emitir un valor de recuperación
        }
        .collect { println("recibido $it") }
}
```

**Salida:**

```text
recibido 1
recibido 2
catch captura: se cayó la red
recibido -1
```

El `catch` captura lo que falló **antes** que él y deja emitir un valor de recuperación. **No** captura errores del `collect` de después. Si el error es del `collect`, el `try/catch` va alrededor del `collect`.

## Búsqueda mientras escribes

Es el caso estrella. El usuario teclea, y no quieres lanzar **una petición por letra**. Cuatro operadores resuelven el problema:

```kotlin
suspend fun buscarEnElServidor(consulta: String): List<String> {
    delay(50)                                           // la «red»
    return listOf("$consulta-1", "$consulta-2")
}

fun main() = runBlocking {
    // lo que el usuario escribe: tres letras seguidas muy rápido, una pausa, y una más
    val teclado = flow {
        emit("k"); delay(30)
        emit("ko"); delay(30)
        emit("kot"); delay(400)                         // pausa larga: aquí se lanza la búsqueda
        emit("kotl"); delay(400)
    }

    teclado
        .debounce(150)                                   // espera a que deje de escribir
        .distinctUntilChanged()                          // si no cambió, no repitas
        .filter { it.length >= 2 }                       // mínimo dos letras
        .onEach { println("buscando «$it»") }
        .mapLatest { buscarEnElServidor(it) }            // si llega otra consulta, cancela la anterior
        .collect { println("resultados: $it") }
}
```

**Salida:**

```text
buscando «kot»
resultados: [kot-1, kot-2]
buscando «kotl»
resultados: [kotl-1, kotl-2]
```

Las tres primeras pulsaciones (`k`, `ko`, `kot`) llegan con 30 ms entre sí, así que `debounce(150)` **las descarta menos la última**: solo se busca «kot», después de la pausa. Luego llega «kotl» y se busca de nuevo. **Dos peticiones en vez de cuatro.**

**`mapLatest`** (y su hermano `flatMapLatest`) añade lo más importante: si llega una consulta **mientras la anterior aún se está buscando**, **cancela** la antigua. Así una respuesta lenta de «kot» nunca puede pisar a los resultados de «kotl».

## Combinar varias fuentes: `combine`

Una pantalla casi nunca depende de una sola fuente. `combine` junta varios flujos y emite **cada vez que cambia cualquiera de ellos**, con el último valor de todos:

```kotlin
data class ListaUi(val consulta: String, val resultados: List<String>)

fun main() = runBlocking {
    val consulta = MutableStateFlow("")
    val catalogo = MutableStateFlow(listOf("manzana", "pera", "plátano", "mandarina"))

    val ui: Flow<ListaUi> = combine(consulta, catalogo) { q, lista ->
        ListaUi(q, lista.filter { it.contains(q, ignoreCase = true) })
    }

    val job = launch(Dispatchers.Unconfined) { ui.collect { println(it) } }

    consulta.value = "man"
    catalogo.value = catalogo.value + "mango"       // el catálogo cambia: se recalcula con la consulta actual
    consulta.value = "pl"
    job.cancel()
}
```

**Salida:**

```text
ListaUi(consulta=, resultados=[manzana, pera, plátano, mandarina])
ListaUi(consulta=man, resultados=[manzana, mandarina])
ListaUi(consulta=man, resultados=[manzana, mandarina, mango])
ListaUi(consulta=pl, resultados=[plátano])
```

Es la forma de construir un `UiState` **derivado**: la entrada son varias fuentes de verdad y la salida es lo que la pantalla muestra, siempre coherente.

## De frío a caliente: `stateIn`

Un `ViewModel` quiere exponer un `StateFlow`, pero lo que tiene tras `combine` es un `Flow` frío. **`stateIn`** lo convierte, y el parámetro más importante es **cuándo** debe estar activo el flujo de arriba:

| Estrategia | Se activa | Se para |
|---|---|---|
| `SharingStarted.Eagerly` | Nada más crearlo | Nunca (mientras viva el ámbito) |
| `SharingStarted.Lazily` | Con el primer colector | Nunca |
| **`SharingStarted.WhileSubscribed(5000)`** | Con el primer colector | **5 segundos después** del último colector |

`WhileSubscribed(5000)` es la elección habitual en Android: mientras la pantalla se ve, el flujo trabaja; si la app pasa a segundo plano, **se pausa** y no gasta batería; y los **5 segundos de margen** evitan reiniciarlo en un giro de pantalla (que desconecta y vuelve a conectar al colector en un instante). Se puede ver:

```kotlin
fun main() = runBlocking {
    val origen = flow {
        println("  [origen] arranca")
        try {
            var i = 0
            while (true) { emit(i++); delay(20) }
        } finally {
            println("  [origen] se detiene")
        }
    }

    val estado = origen.stateIn(this, SharingStarted.WhileSubscribed(100), initialValue = -1)
    println("creado: valor inicial ${estado.value} (el origen aún no ha arrancado)")

    val job = launch { estado.collect { } }             // aparece el primer colector
    delay(70)
    println("con colector: ¿ya hay valores del origen? ${estado.value >= 0}")
    job.cancel()                                        // desaparece el último colector
    delay(50)
    println("50 ms después de irse el colector, el origen sigue vivo (margen de 100 ms)")
    delay(150)
    println("pasado el margen, se detuvo")
    coroutineContext.cancelChildren()
}
```

**Salida:**

```text
creado: valor inicial -1 (el origen aún no ha arrancado)
  [origen] arranca
con colector: ¿ya hay valores del origen? true
50 ms después de irse el colector, el origen sigue vivo (margen de 100 ms)
  [origen] se detiene
pasado el margen, se detuvo
```

Sin colectores, el origen **ni siquiera arranca**; con uno, funciona; al marcharse el último, **espera el margen** y solo entonces se detiene.

## Convertir una API de callbacks en `Flow`

Muchas APIs antiguas de Android (ubicación, sensores, conectividad) avisan con **callbacks**. `callbackFlow` las convierte en un `Flow`. Aquí con una API inventada, para poder ejecutarla:

```kotlin
// Una API «antigua» con registro y baja de oyentes
class SensorFalso {
    private var oyente: ((Int) -> Unit)? = null
    fun registrar(f: (Int) -> Unit) { oyente = f; println("  sensor: oyente registrado") }
    fun quitar() { oyente = null; println("  sensor: oyente quitado") }
    fun medir(valor: Int) { oyente?.invoke(valor) }
}

fun SensorFalso.lecturas(): Flow<Int> = callbackFlow {
    registrar { trySend(it) }
    awaitClose { quitar() }                         // se ejecuta al dejar de recoger: ¡imprescindible!
}

fun main() = runBlocking {
    val sensor = SensorFalso()
    val job = launch(Dispatchers.Unconfined) { sensor.lecturas().collect { println("lectura: $it") } }
    sensor.medir(10)
    sensor.medir(20)
    job.cancelAndJoin()
    sensor.medir(30)                                // nadie escucha ya
    println("fin")
}
```

**Salida:**

```text
  sensor: oyente registrado
lectura: 10
lectura: 20
  sensor: oyente quitado
fin
```

El bloque `awaitClose { ... }` es **obligatorio**: es donde se da de baja el oyente. Sin él, al dejar de recoger el flujo el oyente se quedaría registrado (una **fuga**). El valor 30 no se imprime porque el oyente ya se quitó.

## En la pantalla (sin ejecutar)

Con `stateIn` el `ViewModel` expone un `StateFlow` que se recoge como en la [AA1](../a1/01-estado-udf.md):

```kotlin
// Sin ejecutar: necesita Android
class BuscadorViewModel(repositorio: ProductosRepositorio) : ViewModel() {
    private val consulta = MutableStateFlow("")

    val estado: StateFlow<BuscadorUi> = consulta
        .debounce(300)
        .distinctUntilChanged()
        .flatMapLatest { q -> repositorio.buscar(q) }           // devuelve un Flow<List<Producto>>
        .map<List<Producto>, BuscadorUi> { BuscadorUi.Datos(it) }
        .catch { emit(BuscadorUi.Error(it.message ?: "Error")) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), BuscadorUi.Cargando)

    fun alEscribir(texto: String) { consulta.value = texto }
}
```

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| Recoger un `Flow` en `lifecycleScope.launch` sin más | `repeatOnLifecycle` o `collectAsStateWithLifecycle()` en Compose |
| Lanzar una petición por cada letra | `debounce` + `distinctUntilChanged` + `flatMapLatest` |
| `callbackFlow` sin `awaitClose` | Siempre: ahí se da de baja el oyente |
| `flowOn` para cambiar el hilo de **abajo** | `flowOn` solo afecta a lo que está **por encima** |
| `catch` esperando capturar un error del `collect` | `try/catch` alrededor del `collect` |
| `stateIn(Eagerly)` para todo | `WhileSubscribed(5000)` para pausar en segundo plano |

## Para practicar

Los ejercicios AA2.4 a AA2.6 de [AA2 · Ejercicios](ejercicios.md) practican operadores, la búsqueda con `debounce` y `combine`.
