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

## Modelo de estados: el ciclo de vida

Una pantalla (`Activity`) pasa por estados según lo que haga el usuario o el sistema:

```text
onCreate -> onStart -> onResume   (la app está visible y activa)
                          |
                       onPause     (pierde el foco: otra pantalla encima)
                          |
                       onStop      (ya no es visible)
                          |
                      onDestroy    (se cierra)
```

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

## Modificar una app existente

Para cambiar una app que ya existe:

1. Ábrela en Android Studio y deja que Gradle sincronice.
2. Localiza la pantalla (`MainActivity` o el composable) y el recurso que quieres cambiar.
3. Haz el cambio, ejecútalo y comprueba en el emulador.
4. Usa control de versiones (ver [Git](https://apuntes-dam.github.io/git-apuntes/)) para poder volver atrás.
