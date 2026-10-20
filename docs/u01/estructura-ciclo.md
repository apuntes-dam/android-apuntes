# 6. Estructura de una app y ciclo de vida

## Piezas de una app Android

| Pieza | Para qué sirve |
|---|---|
| **`AndroidManifest.xml`** | Declara la app: nombre, icono, pantallas (*activities*), permisos |
| **Activity** | Una pantalla (o punto de entrada) de la app |
| **Recursos (`res/`)** | Textos, colores, imágenes, iconos |
| **Composables** | Funciones que describen la interfaz |
| **Gradle** | Compila y gestiona dependencias |

La jerarquía básica de clases es: `ComponentActivity` → tu `MainActivity`, que sobrescribe métodos del ciclo de vida.

## Los componentes de una app

Una app real no es una sola clase: se reparte en piezas con una responsabilidad cada una.

| Componente | Qué es |
|---|---|
| **Activity** | Una pantalla con la que interactúa el usuario; es el punto de entrada |
| **Fragment** | Un «trozo de pantalla» reutilizable que vive dentro de una `Activity` |
| **ViewModel** | Guarda el **estado de la pantalla** y su lógica, y **sobrevive a los giros** de pantalla |
| **Repository** | La única puerta de los datos: decide si se leen de la red, de una base de datos o de una caché |
| **Service** | Trabajo en segundo plano sin interfaz (música, descargas, sincronización) |
| **BroadcastReceiver** | Escucha eventos del sistema (batería baja, Wi-Fi conectado...) y reacciona |
| **ContentProvider** | Comparte datos con **otras apps** de forma controlada (agenda, fotos) |

Con Compose la interfaz se describe en funciones `@Composable`; con las vistas clásicas, en archivos XML.

### La cadena MVVM

**MVVM** (*Model-View-ViewModel*) separa tres cosas para poder cambiar y probar cada una sin romper las otras:

* **View** (la pantalla): solo **dibuja** lo que le dice el ViewModel y le reenvía los toques del usuario.
* **ViewModel**: el «cerebro de la pantalla»; guarda el estado y decide qué pasa al pulsar algo.
* **Model / Repository**: los datos y de dónde vienen.

El recorrido completo, del icono al dato en pantalla:

1. El usuario toca el icono de la app.
2. Android lee el `AndroidManifest.xml` y arranca la actividad principal.
3. La actividad pide su `ViewModel`.
4. El `ViewModel`, al nacer, pide los datos al `Repository`.
5. El `Repository` decide la fuente (red o base de datos) y devuelve los datos.
6. El `ViewModel` los guarda en su estado.
7. La pantalla **observa** ese estado y se redibuja cuando cambia.
8. Si el usuario pulsa algo, el toque sube al `ViewModel` (el camino inverso).

```kotlin
data class Tarea(val id: Int, val titulo: String)               // los datos

class TareasRepository {                                        // la puerta a los datos
    suspend fun obtener(): List<Tarea> = listOf(Tarea(1, "Comprar pan"), Tarea(2, "Estudiar"))
}

class TareasViewModel : ViewModel() {                           // estado + lógica
    private val repo = TareasRepository()
    private val _tareas = MutableStateFlow<List<Tarea>>(emptyList())
    val tareas: StateFlow<List<Tarea>> = _tareas.asStateFlow()  // lo que observa la pantalla

    init { cargar() }
    fun cargar() { viewModelScope.launch { _tareas.value = repo.obtener() } }
}

class MainActivity : ComponentActivity() {                      // la pantalla
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val vm: TareasViewModel by viewModels()
        setContent {
            val tareas by vm.tareas.collectAsState()
            LazyColumn { items(tareas) { Text(it.titulo) } }
        }
    }
}
```

El `ViewModel` y el flujo de estado (`StateFlow`) se explican con calma en la [unidad 8](../u08/index.md); aquí interesa la **idea**: cada capa sabe lo mínimo de las demás.

## Modelo de estados: el ciclo de vida

Una pantalla (`Activity`) pasa por estados según lo que haga el usuario o el sistema:

```text
onCreate -> onStart -> onResume   (la app está visible y activa)
                          |
                       onPause     (pierde el foco: otra pantalla encima)
                          |
                       onStop      (ya no es visible)
                        /    \
         onRestart -> onStart     onDestroy    (se cierra)
```

Si el usuario vuelve a una pantalla que estaba detenida, se llama a `onRestart` y se repite `onStart` → `onResume`.

| Método | Cuándo se llama |
|---|---|
| `onCreate` | Se crea la pantalla (inicializar la interfaz) |
| `onStart` | Va a hacerse visible |
| `onResume` | Está en primer plano e interactiva |
| `onPause` | Pierde el foco |
| `onStop` | Deja de ser visible |
| `onDestroy` | Se destruye |

Para **observarlo**, registra mensajes:

```kotlin
class MainActivity : ComponentActivity() {
    private val etiqueta = "CicloDeVida"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(etiqueta, "onCreate")
        setContent { Text("Hola, móvil") }
    }

    override fun onStart() { super.onStart(); Log.d(etiqueta, "onStart") }
    override fun onResume() { super.onResume(); Log.d(etiqueta, "onResume") }
    override fun onPause() { super.onPause(); Log.d(etiqueta, "onPause") }
    override fun onStop() { super.onStop(); Log.d(etiqueta, "onStop") }
    override fun onDestroy() { super.onDestroy(); Log.d(etiqueta, "onDestroy") }
}
```

Los mensajes aparecen en **Logcat**. Prueba a girar el móvil, a pulsar *Inicio* y a volver: verás cómo cambian los estados.

!!! warning "Girar la pantalla destruye y recrea la pantalla"
    Al rotar, Android destruye la `Activity` y la crea de nuevo. Lo que solo estaba en variables locales se **pierde**. En Compose se conserva con `rememberSaveable` o con un `ViewModel`.

```kotlin
var contador by rememberSaveable { mutableStateOf(0) }
```

## Qué hacer en cada estado

Android **no te dice** en qué estado está la app: te avisa llamando a los métodos del ciclo de vida, y tú decides qué hacer sobrescribiéndolos. Si no los sobrescribes, existen igualmente con el cuerpo vacío.

| Estado de la app | Métodos ya ejecutados | Qué debería hacer |
|---|---|---|
| **Activa** (visible e interactiva) | `onCreate` → `onStart` → `onResume` | Todo en marcha: cámara, GPS, animaciones |
| **Pausada** (parcialmente tapada) | … → `onPause` | Parar lo costoso: pausar el vídeo, guardar un borrador |
| **En segundo plano** (invisible) | … → `onPause` → `onStop` | Parar **todo** lo costoso y guardar el estado |
| **De vuelta a primer plano** | `onRestart` → `onStart` → `onResume` | Recuperar lo parado y refrescar datos si hace falta |
| **Destruida** | … → `onDestroy` | Ya no hay nada que hacer |

Reglas para recordarlo:

* `onCreate` → `onStart` → `onResume` es la **secuencia de arranque**, siempre en ese orden. `onResume` no significa «reanudar después de una pausa», sino «ahora estoy interactiva».
* `onPause` es «pierdo el foco» (por ejemplo, un diálogo encima) y `onStop` es «ya no se ve nada». Con un diálogo solo llega `onPause`.
* **`onDestroy` no está garantizado**: si el sistema mata el proceso, la app desaparece sin pasar por él. Lo importante se guarda **antes** (en `onPause` o `onStop`).
* **Tú no llamas** a `onPause()` a mano: lo llama el sistema (el usuario pulsa Inicio, entra una llamada, se bloquea la pantalla). Lo que sí puedes es provocar transiciones indirectamente: `finish()` cierra tu pantalla, y `startActivity()` abre otra encima.

Lo que solo tiene sentido en un estado se coloca en el método de ese estado. Por ejemplo, un sensor solo debe estar encendido mientras la app está activa:

```kotlin
override fun onResume() {
    super.onResume()
    sensorManager.registerListener(this, acelerometro, SensorManager.SENSOR_DELAY_NORMAL)
}

override fun onPause() {
    super.onPause()
    sensorManager.unregisterListener(this)      // si no, gastas batería en segundo plano
}

override fun onStop() {
    super.onStop()
    guardarPendientes()                         // lo importante, antes de que te puedan matar
}
```

Para conservar el estado tras un giro de pantalla o un cierre por falta de memoria: `onSaveInstanceState()` (un `Bundle` que sobrevive a la recreación de la pantalla), `rememberSaveable` en Compose, y la **persistencia real** (base de datos, preferencias) para lo importante.

## El ciclo de vida de la aplicación completa

Más allá de una pantalla, una app vive desde que alguien la descubre hasta que la borra:

1. **Descubrimiento**: ficha en la tienda, web, redes, recomendaciones.
2. **Instalación**: descarga del paquete (APK o AAB en Android; IPA en iOS), verificaciones y permisos.
3. **Ejecución**: primera apertura, permisos bajo demanda y reacción a los eventos del sistema (red, batería).
4. **Actualización**: versiones nuevas con migraciones de datos y notas de versión.
5. **Borrado**: al desinstalar se elimina el espacio de la app; si hay datos en la nube, conviene ofrecer exportarlos o borrarlos.

Buenas prácticas de este ciclo: **versionar con SemVer** (`1.4.2`: mayor, menor, parche), probar las **migraciones** de datos, publicar con **despliegue progresivo** y medir con telemetría (cierres inesperados y métricas de uso).

## Modificar una app existente

Para cambiar una app que ya existe:

1. Ábrela en Android Studio y deja que Gradle sincronice.
2. Localiza la pantalla (`MainActivity` o el composable) y el recurso que quieres cambiar.
3. Haz el cambio, ejecútalo y comprueba en el emulador.
4. Usa control de versiones (ver [Git](https://apuntes-dam.github.io/git-apuntes/)) para poder volver atrás.
