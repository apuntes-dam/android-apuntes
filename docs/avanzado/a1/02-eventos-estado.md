# AA1.2 Eventos de un solo disparo y estado que sobrevive

!!! info "Qué se ha ejecutado y qué no"
    Las partes de **Kotlin puro** (estado, reductores, `StateFlow`, eventos) se han **compilado y ejecutado de verdad** al construir esta web, y su salida es la real. El código de **Compose y de Android** (pantallas, `ViewModel` real, `SavedStateHandle`) **no se ha ejecutado aquí**: necesita el SDK y un emulador. Está marcado como «sin ejecutar».

## ¿Estado o evento?

No todo lo que el `ViewModel` le cuenta a la pantalla es un **estado** (algo que se mantiene). Algunas cosas son **sucesos que ocurren una sola vez**:

* Mostrar un aviso («Guardado»).
* Navegar a otra pantalla.
* Abrir un diálogo o pedir un permiso.

Si eso se guardara como estado normal, al **girar el móvil** la pantalla se recrearía, volvería a leer el estado y **repetiría el aviso o la navegación**. Por el contrario, si se enviara como un evento «de usar y tirar» y justo en ese instante la pantalla no está escuchando, **se perdería**. Es un problema clásico de Android, con tres soluciones posibles.

## Las tres estrategias, ejecutadas

```kotlin
import kotlinx.coroutines.*
import kotlinx.coroutines.channels.*
import kotlinx.coroutines.flow.*

fun main() = runBlocking {
    // 1) SharedFlow sin repetición: si nadie escucha en ese momento, el evento SE PIERDE
    val compartido = MutableSharedFlow<String>()
    compartido.emit("Guardado")                      // la pantalla estaba girando: nadie escucha
    val recibido1 = withTimeoutOrNull(100) { compartido.first() }
    println("SharedFlow:   ${recibido1 ?: "(el evento se perdió)"}")

    // 2) Channel: el evento ESPERA en la cola hasta que alguien lo recoja
    val canal = Channel<String>(Channel.BUFFERED)
    canal.send("Guardado")
    val recibido2 = withTimeoutOrNull(100) { canal.receiveAsFlow().first() }
    println("Channel:      ${recibido2 ?: "(perdido)"}")

    // 3) Un valor dentro del estado: se queda hasta que la pantalla lo marca como mostrado
    val estado = MutableStateFlow<String?>(null)
    estado.value = "Guardado"
    println("Estado:       ${estado.value}  (sigue ahí hasta que se consuma)")
    estado.value = null                              // la pantalla avisa «ya lo mostré»
    println("Tras consumir: ${estado.value}")
}
```

**Salida:**

```text
SharedFlow:   (el evento se perdió)
Channel:      Guardado
Estado:       Guardado  (sigue ahí hasta que se consuma)
Tras consumir: null
```

| Estrategia | Qué pasa si la pantalla no escuchaba | Cuándo se usa |
|---|---|---|
| **`SharedFlow` sin repetición** | El evento **se pierde** | Avisos poco importantes; puede ser aceptable perder uno |
| **`Channel`** (+ `receiveAsFlow()`) | El evento **espera** y se entrega después | Eventos que no pueden perderse. Pero **solo uno** recibe cada evento |
| **Un campo en el `UiState`** (`mensaje: String?`) | Se queda en el estado hasta que se **consume** | La opción que **recomienda Google** hoy |

### La opción recomendada: el evento como estado

Se guarda el aviso en el estado, la pantalla lo muestra y **avisa de que ya lo ha mostrado** para que el `ViewModel` lo borre. Así sobrevive a los giros, nunca se pierde y **no se muestra dos veces**.

```kotlin
import kotlinx.coroutines.flow.*

data class FormUiState(
    val nombre: String = "",
    val guardando: Boolean = false,
    val mensaje: String? = null,          // un aviso pendiente de mostrar
    val irAtras: Boolean = false          // una navegación pendiente
)

class FormModelo {
    private val _estado = MutableStateFlow(FormUiState())
    val estado: StateFlow<FormUiState> = _estado.asStateFlow()

    fun alEscribir(texto: String) = _estado.update { it.copy(nombre = texto) }

    fun guardar() {
        if (_estado.value.nombre.isBlank()) {
            _estado.update { it.copy(mensaje = "Escribe un nombre") }
            return
        }
        _estado.update { it.copy(guardando = false, mensaje = "Guardado", irAtras = true) }
    }

    // La pantalla llama a estas dos cuando YA ha mostrado el aviso / ya ha navegado
    fun mensajeMostrado() = _estado.update { it.copy(mensaje = null) }
    fun navegacionHecha() = _estado.update { it.copy(irAtras = false) }
}

fun main() {
    val m = FormModelo()
    m.guardar()
    println("1) con el nombre vacío:  mensaje=${m.estado.value.mensaje}, irAtras=${m.estado.value.irAtras}")
    m.mensajeMostrado()
    m.alEscribir("Ana")
    m.guardar()
    println("2) con nombre:           mensaje=${m.estado.value.mensaje}, irAtras=${m.estado.value.irAtras}")
    // si ahora se gira la pantalla, el estado se conserva: el aviso sigue pendiente, no se pierde
    println("   (tras girar)          mensaje=${m.estado.value.mensaje}")
    m.mensajeMostrado(); m.navegacionHecha()
    println("3) tras consumirlos:     mensaje=${m.estado.value.mensaje}, irAtras=${m.estado.value.irAtras}")
}
```

**Salida:**

```text
1) con el nombre vacío:  mensaje=Escribe un nombre, irAtras=false
2) con nombre:           mensaje=Guardado, irAtras=true
   (tras girar)          mensaje=Guardado
3) tras consumirlos:     mensaje=null, irAtras=false
```

Y la pantalla, con `LaunchedEffect` para reaccionar a cada aviso nuevo (sin ejecutar):

```kotlin
// Sin ejecutar: necesita Android
@Composable
fun FormRoute(vm: FormViewModel = viewModel(), alVolver: () -> Unit) {
    val estado by vm.estado.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }

    LaunchedEffect(estado.mensaje) {
        estado.mensaje?.let {
            snackbar.showSnackbar(it)
            vm.mensajeMostrado()          // ya lo mostré: bórralo del estado
        }
    }
    LaunchedEffect(estado.irAtras) {
        if (estado.irAtras) { alVolver(); vm.navegacionHecha() }
    }
    // ... Scaffold(snackbarHost = { SnackbarHost(snackbar) }) { ... }
}
```

!!! tip "Cuándo vale cada una"
    Para **mensajes y navegación**, el campo en el estado. Para algo que de verdad es un **flujo de sucesos** (pulsaciones, sensores, mensajes de un chat entrantes), `Flow`/`SharedFlow` es lo natural. Evita `Channel` para eventos de pantalla: si dos observadores lo recogen, **solo uno** recibe cada evento y el otro se queda sin él.

## Cuando el sistema mata tu app: estado que sobrevive

Conviene distinguir **cuatro situaciones** y qué estado sobrevive a cada una:

| Qué ocurre | `remember` | `rememberSaveable` | `ViewModel` | `SavedStateHandle` |
|---|---|---|---|---|
| Se recompone la pantalla | ✅ | ✅ | ✅ | ✅ |
| Giras el móvil (se recrea la actividad) | ❌ | ✅ | ✅ | ✅ |
| El sistema **mata el proceso** en segundo plano y vuelves | ❌ | ✅ | ❌ | ✅ |
| El usuario **cierra la app** (la desliza fuera) | ❌ | ❌ | ❌ | ❌ |

Dos consecuencias importantes:

* El `ViewModel` **no** sobrevive a que el sistema mate el proceso: tu `UiState` se pierde. Para lo imprescindible (el texto que el usuario está escribiendo, el elemento seleccionado, un identificador), guárdalo en el **`SavedStateHandle`**, que sí se restaura.
* No metas **datos grandes** (listas enteras) en el estado guardado: solo caben cosas pequeñas (texto, números, identificadores). El resto se vuelve a pedir al repositorio a partir de ese identificador.

```kotlin
// Sin ejecutar: necesita Android
class BusquedaViewModel(private val guardado: SavedStateHandle) : ViewModel() {
    // Sobrevive incluso a que el sistema mate el proceso
    val consulta: StateFlow<String> = guardado.getStateFlow("consulta", "")

    fun alEscribir(texto: String) { guardado["consulta"] = texto }
}
```

## Estado de pantalla frente a estado de la interfaz

Una distinción fina, pero que ordena el código:

| Tipo | Ejemplo | Dónde vive |
|---|---|---|
| **Estado de la lógica** (datos, reglas) | Lista de tareas, usuario conectado, resultado de una búsqueda | `ViewModel` |
| **Estado de la interfaz pura** | Si un menú está desplegado, el scroll, el foco, un texto aún sin enviar | El composable (`remember`) |

Si algo solo afecta a **cómo se ve** y ninguna regla de negocio depende de ello, no hace falta subirlo al `ViewModel`.

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| Navegar o mostrar un aviso desde un `StateFlow` sin consumirlo | Limpia el campo al consumirlo (`mensajeMostrado()`) |
| `SharedFlow` para un aviso importante | Un campo en el estado, para que no se pierda |
| Esperar que el `ViewModel` sobreviva al cierre del proceso | `SavedStateHandle` para lo mínimo imprescindible |
| Guardar listas grandes en `rememberSaveable` | Guarda un identificador y recarga el resto |
| Subir al `ViewModel` hasta el scroll | Estado de interfaz pura, en el composable |

## Para practicar

Los ejercicios AA1.5 y AA1.6 de [AA1 · Ejercicios](ejercicios.md) practican el aviso consumible y un historial con deshacer.
