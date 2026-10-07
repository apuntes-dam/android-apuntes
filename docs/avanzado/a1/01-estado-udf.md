# AA1.1 Estado de pantalla y flujo unidireccional

!!! info "Qué se ha ejecutado y qué no"
    Las partes de **Kotlin puro** (estado, reductores, `StateFlow`, eventos) se han **compilado y ejecutado de verdad** al construir esta web, y su salida es la real. El código de **Compose y de Android** (pantallas, `ViewModel` real, `SavedStateHandle`) **no se ha ejecutado aquí**: necesita el SDK y un emulador. Está marcado como «sin ejecutar».

## El problema: estado repartido

En una pantalla con una lista de tareas, un filtro y un contador de pendientes, es tentador guardar cada cosa en su propia variable (`var tareas`, `var filtro`, `var pendientes`). Y entonces llega el fallo clásico: **actualizas la lista y te olvidas de actualizar el contador**. La pantalla enseña datos que se contradicen.

La solución es doble:

1. **Una sola fuente de la verdad**: todo lo que la pantalla necesita está en **un único objeto de estado**.
2. **Lo que se puede calcular, se calcula**, no se guarda. El número de pendientes sale de la lista, así que no puede quedar desfasado.

## El estado como clase de datos inmutable

Se suele llamar **`UiState`** (estado de la interfaz). Es una `data class` con propiedades `val`: **no se modifica, se sustituye** por una copia con `copy`.

```kotlin
enum class Filtro { TODAS, PENDIENTES, HECHAS }

data class Tarea(val id: Int, val titulo: String, val hecha: Boolean = false)

data class TareasUiState(
    val tareas: List<Tarea> = emptyList(),
    val filtro: Filtro = Filtro.TODAS
) {
    // Estado DERIVADO: se calcula a partir del resto, nunca se guarda aparte
    val visibles: List<Tarea>
        get() = when (filtro) {
            Filtro.TODAS -> tareas
            Filtro.PENDIENTES -> tareas.filter { !it.hecha }
            Filtro.HECHAS -> tareas.filter { it.hecha }
        }
    val pendientes: Int get() = tareas.count { !it.hecha }
}

fun main() {
    val a = TareasUiState(tareas = listOf(Tarea(1, "Comprar pan"), Tarea(2, "Estudiar Kotlin", hecha = true)))
    val b = a.copy(filtro = Filtro.PENDIENTES)
    println("a: filtro=${a.filtro}, visibles=${a.visibles.map { it.titulo }}")
    println("b: filtro=${b.filtro}, visibles=${b.visibles.map { it.titulo }}, pendientes=${b.pendientes}")
    println("¿Mismo objeto? ${a === b} · ¿Misma lista? ${a.tareas === b.tareas}")
}
```

**Salida:**

```text
a: filtro=TODAS, visibles=[Comprar pan, Estudiar Kotlin]
b: filtro=PENDIENTES, visibles=[Comprar pan], pendientes=1
¿Mismo objeto? false · ¿Misma lista? true
```

Fíjate en tres cosas:

* `b` es **otro objeto**, pero **comparte la lista** con `a` (no se copia todo, solo lo que cambia).
* `visibles` y `pendientes` **no se guardan**: son propiedades calculadas, así que siempre cuadran con `tareas` y `filtro`.
* Como el estado es inmutable, **nadie puede cambiarlo a escondidas** desde otro sitio: para modificarlo hay que crear uno nuevo, y eso es justo lo que Compose necesita para saber que algo ha cambiado.

## Flujo unidireccional de datos (UDF)

Es el patrón central. Hay un ciclo de tres pasos que siempre va en el mismo sentido:

| Paso | Quién | Qué hace |
|---|---|---|
| **1. Estado** | El `ViewModel` | Guarda el `UiState` actual y lo **expone** hacia abajo |
| **2. Pantalla** | Los composables | **Dibujan** el estado que reciben. No lo modifican |
| **3. Evento** | Los composables | Cuando el usuario hace algo, **avisan hacia arriba** con un evento |

El `ViewModel` recibe el evento, calcula el **estado nuevo** y lo publica; la pantalla se redibuja. Los datos **bajan**, los eventos **suben**, y nunca se cruzan. La ventaja: para saber por qué la pantalla enseña algo, solo hay un sitio donde mirar.

## Los eventos y el reductor

Los eventos se pueden modelar con una interfaz `sealed`: así `when` obliga a tratar **todos** los casos, y si añades uno nuevo, el compilador te avisa de dónde falta. La función que convierte *(estado, evento)* en *estado nuevo* se llama **reductor** (*reducer*) y conviene que sea **pura**: sin efectos y sin leer nada de fuera.

```kotlin
sealed interface Evento {
    data class Añadir(val titulo: String) : Evento
    data class Marcar(val id: Int) : Evento
    data class Filtrar(val filtro: Filtro) : Evento
    data object BorrarHechas : Evento
}

// Una FUNCIÓN PURA: mismo estado y mismo evento, siempre el mismo resultado. No toca nada fuera.
fun reducir(estado: TareasUiState, evento: Evento): TareasUiState = when (evento) {
    is Evento.Añadir -> {
        val nuevoId = (estado.tareas.maxOfOrNull { it.id } ?: 0) + 1
        estado.copy(tareas = estado.tareas + Tarea(nuevoId, evento.titulo))
    }
    is Evento.Marcar -> estado.copy(
        tareas = estado.tareas.map { if (it.id == evento.id) it.copy(hecha = !it.hecha) else it }
    )
    is Evento.Filtrar -> estado.copy(filtro = evento.filtro)
    Evento.BorrarHechas -> estado.copy(tareas = estado.tareas.filter { !it.hecha })
}

fun main() {
    var estado = TareasUiState()
    val eventos = listOf(
        Evento.Añadir("Comprar pan"), Evento.Añadir("Estudiar Kotlin"), Evento.Añadir("Hacer deporte"),
        Evento.Marcar(2), Evento.Filtrar(Filtro.PENDIENTES), Evento.BorrarHechas
    )
    for (e in eventos) {
        estado = reducir(estado, e)
        println("${e::class.simpleName}: visibles=${estado.visibles.map { it.titulo }} · pendientes=${estado.pendientes} · total=${estado.tareas.size}")
    }
}
```

**Salida:**

```text
Añadir: visibles=[Comprar pan] · pendientes=1 · total=1
Añadir: visibles=[Comprar pan, Estudiar Kotlin] · pendientes=2 · total=2
Añadir: visibles=[Comprar pan, Estudiar Kotlin, Hacer deporte] · pendientes=3 · total=3
Marcar: visibles=[Comprar pan, Estudiar Kotlin, Hacer deporte] · pendientes=2 · total=3
Filtrar: visibles=[Comprar pan, Hacer deporte] · pendientes=2 · total=3
BorrarHechas: visibles=[Comprar pan, Hacer deporte] · pendientes=2 · total=2
```

Cada línea es el estado **después** de un evento. Observa el último: `BorrarHechas` elimina la tarea 2 (la que se marcó) pero el filtro sigue en `PENDIENTES`, porque el reductor **solo cambia lo que le toca**.

!!! tip "Por qué es tan cómodo probarlo"
    `reducir` es una función normal: no necesita Android, ni emulador, ni `ViewModel`. Se prueba con un `assertEquals` (lo verás en la [AA4](../a4/index.md)). Toda la lógica que puedas sacar de los composables y del `ViewModel` y meter en funciones puras te ahorra pruebas lentas.

## `StateFlow`: publicar el estado

Para que la pantalla **se entere** de los cambios hace falta un contenedor observable. En Android moderno se usa **`StateFlow`**: guarda **siempre un valor** (`value`), lo emite a quien lo observe y **solo avisa cuando el valor cambia de verdad**.

El patrón de dos propiedades: una **privada y mutable** (para cambiar el estado desde dentro) y otra **pública y de solo lectura** (para que la pantalla observe, pero no cambie):

En el ejemplo de más abajo (las líneas de `import` van arriba del todo) importan dos detalles:

* **`update { ... }`** en lugar de `_estado.value = ...`. `update` es **atómico**: si dos corrutinas cambian el estado a la vez, no se pisan. Con `value = value + 1` sí pueden pisarse. Más abajo lo ves con números.
* **`asStateFlow()`** devuelve una vista de solo lectura. Si expusieras el `MutableStateFlow`, cualquier pantalla podría modificarlo y se perdería el flujo unidireccional.

```kotlin
class TareasModelo {
    private val _estado = MutableStateFlow(TareasUiState())
    val estado: StateFlow<TareasUiState> = _estado.asStateFlow()

    fun enviar(evento: Evento) {
        _estado.update { reducir(it, evento) }
    }
}

fun main() = runBlocking {
    val modelo = TareasModelo()
    var emisiones = 0
    // Dispatchers.Unconfined: el colector reacciona al instante, así la salida es siempre la misma
    val job = launch(Dispatchers.Unconfined) { modelo.estado.collect { emisiones++ } }

    modelo.enviar(Evento.Añadir("Comprar pan"))
    println("tras Añadir: emisiones=$emisiones")
    modelo.enviar(Evento.Filtrar(Filtro.TODAS))     // el filtro ya era TODAS: el estado queda igual
    println("tras Filtrar(TODAS), que no cambia nada: emisiones=$emisiones")
    modelo.enviar(Evento.Filtrar(Filtro.HECHAS))
    println("tras Filtrar(HECHAS): emisiones=$emisiones")
    job.cancel()
}
```

**Salida:**

```text
tras Añadir: emisiones=2
tras Filtrar(TODAS), que no cambia nada: emisiones=2
tras Filtrar(HECHAS): emisiones=3
```

Un `StateFlow` siempre entrega el **valor actual** a quien empieza a observarlo, y eso ya cuenta como una emisión: por eso, tras `Añadir`, el contador marca 2 (el valor inicial y el nuevo). Después, el evento que **no cambia nada** (`Filtrar(TODAS)` con el filtro ya en `TODAS`) **no provoca ninguna emisión** y el contador sigue en 2: como `data class` compara por contenido, el estado nuevo es *igual* al anterior y `StateFlow` lo descarta. Eso evita redibujar la pantalla para nada.

### `update` frente a `value =`

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking {
    val inseguro = MutableStateFlow(0)
    val seguro = MutableStateFlow(0)
    withContext(Dispatchers.Default) {
        coroutineScope {
            repeat(100) {
                launch {
                    repeat(1000) {
                        inseguro.value = inseguro.value + 1       // leer y escribir en dos pasos: se pueden pisar
                        seguro.update { it + 1 }                   // un solo paso atómico
                    }
                }
            }
        }
    }
    println("esperado: 100000")
    println("seguro:   ${seguro.value}")
    println("inseguro: ${if (inseguro.value == 100000) "100000 (esta vez no se pisaron)" else "menos de 100000 (se pisaron)"}")
}
```

**Salida:**

```text
esperado: 100000
seguro:   100000
inseguro: menos de 100000 (se pisaron)
```

El contador `seguro` llega **siempre** a 100 000. El `inseguro` suele quedarse corto porque dos corrutinas leen el mismo valor, suman cada una 1 y escriben el mismo resultado: se pierde un incremento. Como depende de la velocidad del equipo, la última línea se limita a decir si se pisaron o no. **Regla:** para cambiar un `MutableStateFlow` a partir de su valor anterior, **siempre `update`**.

## Estados con varias fases: `sealed`

Cuando una pantalla **carga datos**, no vale con una lista: hay un momento en que se está cargando, otro en que hay datos y otro en que falló. Se modela con una jerarquía `sealed`, y cada fase lleva **solo los datos que le corresponden**:

```kotlin
sealed interface Pantalla {
    data object Cargando : Pantalla
    data class Exito(val nombres: List<String>) : Pantalla
    data class Error(val mensaje: String, val reintentable: Boolean) : Pantalla
}

fun texto(p: Pantalla): String = when (p) {
    Pantalla.Cargando -> "Cargando..."
    is Pantalla.Exito -> if (p.nombres.isEmpty()) "No hay nada que mostrar" else "Hay ${p.nombres.size}: ${p.nombres.joinToString()}"
    is Pantalla.Error -> "Error: ${p.mensaje}" + if (p.reintentable) " (puedes reintentar)" else ""
}

fun main() {
    listOf(
        Pantalla.Cargando,
        Pantalla.Exito(listOf("Ana", "Luis")),
        Pantalla.Exito(emptyList()),
        Pantalla.Error("Sin conexión", reintentable = true)
    ).forEach { println(texto(it)) }
}
```

**Salida:**

```text
Cargando...
Hay 2: Ana, Luis
No hay nada que mostrar
Error: Sin conexión (puedes reintentar)
```

Esto evita estados imposibles. Con tres variables sueltas (`cargando`, `datos`, `error`) puede pasar que `cargando` y `error` sean `true` a la vez; con `sealed` **no se puede representar**. Además, `when` sin `else` te avisa si olvidas una fase.

## Cómo se conecta con Compose (sin ejecutar)

El `ViewModel` real de Android no es más que una clase que **sobrevive a los giros de pantalla** y trae un `viewModelScope` para lanzar corrutinas. Todo lo que has visto arriba (estado, reductor, `StateFlow`) va dentro. La pantalla lo observa así:

```kotlin
// Sin ejecutar: necesita Android
class TareasViewModel : ViewModel() {
    private val _estado = MutableStateFlow(TareasUiState())
    val estado: StateFlow<TareasUiState> = _estado.asStateFlow()

    fun enviar(evento: Evento) { _estado.update { reducir(it, evento) } }
}

@Composable
fun TareasRoute(vm: TareasViewModel = viewModel()) {
    val estado by vm.estado.collectAsStateWithLifecycle()   // se actualiza solo mientras la pantalla está visible
    TareasScreen(estado = estado, onEvento = vm::enviar)
}

@Composable
fun TareasScreen(estado: TareasUiState, onEvento: (Evento) -> Unit) {
    Column {
        Text("Pendientes: ${estado.pendientes}")
        LazyColumn {
            items(estado.visibles, key = { it.id }) { t ->
                Row {
                    Checkbox(checked = t.hecha, onCheckedChange = { onEvento(Evento.Marcar(t.id)) })
                    Text(t.titulo)
                }
            }
        }
    }
}
```

Fíjate en el reparto: `TareasRoute` **conoce al `ViewModel`**; `TareasScreen` **no**: solo recibe un estado y una función. Eso la hace fácil de **previsualizar** (`@Preview` con un estado inventado) y de **probar**, y es la versión a gran escala del *state hoisting* de la [unidad 2](../../u02/03-estado.md).

| Concepto | Para qué sirve |
|---|---|
| `collectAsStateWithLifecycle()` | Convierte el `StateFlow` en estado de Compose y **deja de observar** cuando la app no está visible (ahorra batería). Necesita la dependencia `lifecycle-runtime-compose` |
| `onEvento: (Evento) -> Unit` | Un solo canal hacia arriba, en vez de diez lambdas sueltas |
| `key = { it.id }` | Identifica cada fila para que Compose la conserve al reordenar |

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| Exponer el `MutableStateFlow` | `private val _estado` + `val estado = _estado.asStateFlow()` |
| `_estado.value = _estado.value.copy(...)` desde varias corrutinas | `_estado.update { it.copy(...) }` |
| Guardar un dato derivado (el contador de pendientes) | Propiedad calculada en el `UiState` |
| Varios booleanos para las fases de la pantalla | Una jerarquía `sealed` |
| Pasar el `ViewModel` a los composables hijos | Pasar solo el estado y las lambdas necesarias |
| Colecciones mutables (`MutableList`) dentro del `UiState` | `List` de solo lectura y crear una nueva en cada cambio |

## Para practicar

Los ejercicios AA1.1 a AA1.4 de [AA1 · Ejercicios](ejercicios.md) practican reductores, estado derivado, fases `sealed` y `update`.
