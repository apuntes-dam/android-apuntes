# AA5.1 Recomposición y rendimiento

!!! info "Qué se ha ejecutado y qué no"
    El **estado de Compose** (`mutableStateOf`, `derivedStateOf`, `snapshotFlow`) y la lógica de versiones se han **ejecutado de verdad** al construir esta web, con el *runtime* de Compose en la JVM. Los **composables**, la configuración de **Gradle** y los pasos de **Play Console** no se pueden ejecutar aquí (necesitan Android o son procesos manuales): están marcados «sin ejecutar». Las versiones de herramientas cambian con el tiempo: comprueba la documentación oficial al usarlas.

## Qué es la recomposición

Cuando el estado que lee un composable cambia, Compose **vuelve a ejecutar esa función** para actualizar la pantalla: eso es **recomponer**. Compose es listo: solo recompone lo que **leyó** ese estado, y puede **saltarse** (*skip*) las funciones cuyos parámetros no han cambiado. Pero si lees estado en un sitio demasiado alto, o pasas parámetros que Compose no sabe comparar, **recompones mucho más de lo necesario** y la app va a tirones.

!!! warning "Primero medir, después optimizar"
    Casi nunca hace falta optimizar a ciegas. La regla de los profesionales: **mide**, encuentra el cuello de botella, arréglalo y **vuelve a medir**. Y se mide con la app en modo **release** (el modo *debug* es mucho más lento y da conclusiones falsas).

## Cómo medir (sin ejecutar)

| Herramienta | Qué te dice |
|---|---|
| **Layout Inspector** (Android Studio) | Cuántas veces se **recompone y se salta** cada composable. Es la primera parada |
| **Profiler** | Uso de CPU, memoria y red mientras usas la app |
| **Macrobenchmark** | Tiempos medidos y repetibles (arranque, desplazamiento) en un dispositivo real |
| **Informes del compilador de Compose** | Qué funciones y qué clases considera Compose «estables» |
| **GPU / «Profile GPU rendering»** | Cuántos fotogramas tardan más de 16 ms (la barra roja: se nota el tirón) |

## Estabilidad: cuándo Compose se salta una función

Para saltarse un composable, Compose necesita saber si un parámetro **ha cambiado**. Con tipos **estables** puede compararlos con `equals`. Un tipo es estable si Compose puede garantizar que sus cambios **se le notifican** (o que no cambia nunca):

| Tipo | ¿Estable? |
|---|---|
| `Int`, `String`, `Boolean`, lambdas | Sí |
| `data class` con todo `val` de tipos estables | Sí |
| Una clase con una propiedad **`var`** normal | **No**: podría cambiar sin avisar |
| **`List`, `Set`, `Map`** (las interfaces de Kotlin) | **No**: la lista podría ser una `MutableList` por debajo |
| Clases de otro módulo/librería que Compose no puede inspeccionar | Normalmente **no** |

El caso que más sorprende es **`List<T>`**: aunque la declares de solo lectura, Compose no puede estar seguro de que nadie la modifique. Hay varias salidas:

```kotlin
// Sin ejecutar: necesita el compilador de Compose
// 1) Marcar la clase para prometer que es inmutable (la promesa es TUYA: si la rompes, la pantalla se desactualiza)
@Immutable
data class TareasUiState(val tareas: List<Tarea>, val filtro: Filtro)

// 2) Usar una colección inmutable de verdad (librería kotlinx-collections-immutable)
data class TareasUiState2(val tareas: ImmutableList<Tarea>, val filtro: Filtro)

// 3) Activar el modo «strong skipping» (viene activado por defecto en las versiones recientes del compilador de Compose)
```

!!! info "«Strong skipping»"
    Las versiones recientes del compilador de Compose (con Kotlin 2.0.20 en adelante) activan por defecto el modo *strong skipping*, que permite saltarse funciones aunque tengan parámetros inestables (los compara por **identidad** del objeto en lugar de por `equals`). Mejora mucho el caso típico, pero conviene seguir creando objetos nuevos solo cuando el contenido cambia de verdad. Comprueba cómo está configurado tu proyecto.

## Leer el estado lo más tarde posible

Cuanto más arriba lees el estado, más grande es lo que se recompone al cambiar. Un ejemplo clásico es una animación de desplazamiento:

```kotlin
// Sin ejecutar: necesita el compilador de Compose
@Composable
fun Cabecera(scroll: ScrollState) {
    // MAL: lee scroll.value al componer. Cada píxel de desplazamiento RECOMPONE toda la función
    Box(Modifier.offset(y = (-scroll.value / 2).dp)) { /* ... */ }

    // BIEN: la lectura se aplaza a la fase de layout, así no se recompone nada
    Box(Modifier.offset { IntOffset(0, -scroll.value / 2) }) { /* ... */ }
}
```

La regla: si un modificador tiene una versión que acepta **una lambda** (`offset { }`, `graphicsLayer { }`, `drawBehind { }`), usa esa versión cuando el valor cambie muchas veces por segundo.

## `derivedStateOf`: avisar solo cuando cambia el resultado

Mucho estado cambia a menudo pero **lo que te importa de él cambia poco**. Si quieres mostrar un botón «subir arriba» cuando el primer elemento visible ya no es el primero, el índice cambia con cada elemento que pasa, pero la **respuesta** («¿hay que mostrar el botón?») solo cambia dos veces. `derivedStateOf` es para eso: observa un cálculo y **avisa únicamente cuando el resultado cambia**.

Se puede comprobar con el *runtime* de Compose real: `snapshotFlow` convierte una lectura de estado en un `Flow` que emite cada vez que el valor leído cambia (justo lo que le ocurriría a un composable que lo leyera):

```kotlin
import androidx.compose.runtime.*
import androidx.compose.runtime.snapshots.Snapshot

fun main() = runBlocking {
    var indice by mutableStateOf(0)                       // el índice del primer elemento visible
    val mostrarBoton by derivedStateOf { indice > 0 }     // ¿hay que mostrar «subir arriba»?

    val viendoIndice = mutableListOf<Int>()
    val viendoBoton = mutableListOf<Boolean>()
    val j1 = launch(Dispatchers.Default) { snapshotFlow { indice }.collect { viendoIndice += it } }
    val j2 = launch(Dispatchers.Default) { snapshotFlow { mostrarBoton }.collect { viendoBoton += it } }
    delay(200)

    for (i in 1..6) {                                     // el usuario se desplaza: el índice sube de 1 en 1
        indice = i
        Snapshot.sendApplyNotifications()                 // publica el cambio de estado (Compose lo hace solo)
        delay(80)
    }
    j1.cancel(); j2.cancel()

    println("quien lee el índice se entera:      $viendoIndice  (${viendoIndice.size} veces)")
    println("quien lee mostrarBoton se entera:   $viendoBoton  (${viendoBoton.size} veces)")
}
```

**Salida:**

```text
quien lee el índice se entera:      [0, 1, 2, 3, 4, 5, 6]  (7 veces)
quien lee mostrarBoton se entera:   [false, true]  (2 veces)
```

Seis cambios de índice (más el valor inicial) llegan a quien lee `indice`, pero quien lee `mostrarBoton` se entera **solo dos veces**: al empezar y al pasar de `false` a `true`. En una pantalla real, eso son **cinco recomposiciones evitadas**. En una lista larga, desplazándose a toda velocidad, es la diferencia entre fluidez y tirones.

```kotlin
// Sin ejecutar: necesita el compilador de Compose
@Composable
fun ListaConBoton(items: List<String>) {
    val estado = rememberLazyListState()
    val mostrarBoton by remember { derivedStateOf { estado.firstVisibleItemIndex > 0 } }

    Box {
        LazyColumn(state = estado) { items(items) { Text(it) } }
        if (mostrarBoton) {
            FloatingActionButton(onClick = { /* animar hasta el principio */ }) { Icon(Icons.Default.KeyboardArrowUp, "Subir") }
        }
    }
}
```

`remember { derivedStateOf { ... } }` es el patrón completo: el `remember` conserva el `derivedStateOf` entre recomposiciones.

!!! tip "No lo uses siempre"
    `derivedStateOf` merece la pena cuando **la entrada cambia mucho más a menudo que el resultado**. Si el resultado cambia cada vez que cambia la entrada (por ejemplo, `nombre + apellido`), solo añade coste. Un cálculo sencillo se hace directamente en la composición.

## Listas: `key` y `contentType`

En una `LazyColumn`, Compose necesita saber **qué fila es cuál**. Sin pistas, identifica las filas por su **posición**: si insertas una al principio, cree que todas han cambiado de contenido y las recompone todas.

```kotlin
// Sin ejecutar: necesita el compilador de Compose
LazyColumn {
    items(
        items = tareas,
        key = { it.id },                       // identidad estable: al insertar o reordenar solo cambia lo necesario
        contentType = { it.tipo }              // las filas del mismo tipo reutilizan su estructura
    ) { tarea ->
        FilaTarea(tarea)
    }
}
```

* **`key`** debe ser **único y estable** (un identificador, no la posición). Además hace que el estado de cada fila (`remember`) siga a **su** elemento al reordenar.
* **`contentType`** sirve cuando la lista mezcla filas de aspecto muy distinto (cabeceras, anuncios, tarjetas): permite reutilizar filas del mismo tipo al desplazarse.

## Trabajo pesado: fuera de la composición

Una función `@Composable` puede ejecutarse **muchas veces por segundo**. Todo lo que pongas dentro se repite:

| Malo (en la composición) | Mejor |
|---|---|
| `val ordenada = lista.sortedBy { ... }` | `remember(lista) { lista.sortedBy { ... } }`, o mejor, calcularlo en el `ViewModel` |
| Llamar a la red o leer del disco | `LaunchedEffect` o el `ViewModel` |
| Crear objetos pesados (formateadores, `Regex`) | `remember { ... }` |
| Operaciones con efectos (`Log`, guardar) | Efectos (`LaunchedEffect`, `SideEffect`) |

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| Optimizar sin medir | Layout Inspector y modo release primero |
| Medir en modo *debug* | Siempre con una compilación release |
| Pasar `List` y asumir que se salta la recomposición | `@Immutable`, colecciones inmutables o *strong skipping* |
| Leer el scroll o una animación en la composición | Versión con lambda del modificador |
| `LazyColumn` sin `key` | `key = { it.id }` con un identificador estable |
| `derivedStateOf` para todo | Solo si el resultado cambia menos que la entrada |
| Ordenar o filtrar listas dentro del composable | En el `ViewModel`, o dentro de `remember(clave)` |

## Para practicar

Los ejercicios AA5.1 y AA5.4 de [AA5 · Ejercicios](ejercicios.md) practican `derivedStateOf` y las listas con `key`.
