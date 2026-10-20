# 4. Android Studio: instalación y primer proyecto

**Android Studio** es el IDE oficial para Android. Incluye editor, compilador (Gradle), emulador, depurador y el **SDK de Android**.

## Instalación

1. Descarga Android Studio desde [developer.android.com/studio](https://developer.android.com/studio).
2. Ejecuta el instalador y deja las opciones por defecto (incluye el SDK y el emulador).
3. En el primer arranque, el asistente descarga los componentes necesarios (puede tardar y ocupa varios GB).

!!! note "Requisitos"
    Necesitas un equipo con suficiente memoria RAM (mínimo 8 GB; con 16 GB va mucho mejor, sobre todo con el emulador abierto) y espacio en disco. Se necesita un JDK, pero Android Studio incluye el suyo.

## Crear tu primer proyecto

1. **New Project** → plantilla **Empty Activity** (con Jetpack Compose).
2. Rellena el **nombre**, el **nombre de paquete** (por ejemplo `com.ejemplo.holamovil`), el **lenguaje** (Kotlin) y la **API mínima**.
3. Pulsa **Finish** y espera a que **Gradle** sincronice el proyecto.

## Elegir la plantilla del proyecto

Al crear un proyecto (**New Project**) Android Studio ofrece una galería de plantillas. Cada una genera un punto de partida distinto, y conviene saber distinguirlas:

| Plantilla | Qué genera | Cuándo usarla |
|---|---|---|
| **No Activity** | Solo la estructura del proyecto, sin ninguna pantalla | Módulos de librería, o si vas a añadir las pantallas a mano |
| **Empty Activity** | Una actividad con un composable vacío y Compose ya configurado | **La de esta web**: empezar de cero con la interfaz limpia |
| **Navigation UI Activity** | Una actividad con menú de navegación (barra inferior o lateral) y varias pantallas ya conectadas | Apps con varias secciones desde el principio |
| **Gemini API** | Una actividad con un ejemplo ya conectado a la IA de Google | Probar IA generativa en una app |
| **Basic Views / Empty Views Activity** | El sistema clásico de **vistas XML**, sin Compose | Mantener apps antiguas (se ven en la [unidad 9](../u09/index.md)) |
| **Responsive Views Activity** | Un diseño que se adapta a móvil, tableta y escritorio, con Views | Apps que deben verse bien en cualquier tamaño |
| **Game Activity (C++)** | Un proyecto de videojuego con el motor nativo en C++ | Juegos 2D/3D en C++ |
| **Native C++** | Código C++ enlazado con Kotlin o Java | Máximo rendimiento o librerías nativas |

El criterio: para interfaces con Compose, **Empty Activity** (o **Navigation UI Activity** si desde el principio hay varias secciones). Las plantillas *Views* son el sistema anterior a Compose, y las de C++ cambian de lenguaje por completo.

## Estructura de carpetas

```text
mi-app/
├── app/
│   ├── src/main/
│   │   ├── java/.../MainActivity.kt   <- código Kotlin
│   │   ├── res/                       <- recursos (textos, imágenes, colores)
│   │   └── AndroidManifest.xml        <- descripción de la app
│   └── build.gradle.kts               <- dependencias y configuración del módulo
└── build.gradle.kts                   <- configuración del proyecto
```

## La estructura del proyecto, archivo a archivo

En el panel **Project** (a la izquierda), la vista **Android** no muestra las carpetas tal cual están en el disco: las **agrupa por función**. Esto es lo que verás y para qué sirve cada cosa:

| Elemento | Qué guarda | Para qué sirve |
|---|---|---|
| `app/manifests/AndroidManifest.xml` | La «carta de identidad» de la app | Declara el nombre, el icono, las **actividades** (pantallas) y los **permisos** |
| `app/kotlin+java/` | El código Kotlin | `MainActivity.kt`, los composables y todo lo demás |
| `app/res/drawable/` | Imágenes e iconos | Fondos, logos y gráficos de la interfaz |
| `app/res/values/strings.xml` | Los textos de la app | Separados del código, para traducir la app tocando un solo archivo |
| `app/res/values/themes.xml` | El tema base de la ventana | En proyectos con Compose, los **colores y la tipografía** viven en código (`ui/theme/Color.kt`, `Type.kt` y `Theme.kt`) |
| `build.gradle.kts (Project)` | Configuración global | Versión de las herramientas de compilación y repositorios de descarga |
| `build.gradle.kts (Module :app)` | Configuración de tu módulo | **Dependencias** (aquí vive Compose) y versiones mínima y objetivo |
| `settings.gradle.kts` | La lista de módulos | Define qué módulos forman el proyecto (`app`, librerías propias...) |
| `gradle/libs.versions.toml` | El catálogo de versiones | Las versiones de las librerías en un solo sitio |

**Gradle** es el **sistema de construcción**: descarga las librerías, compila el código y genera la app instalable (el **APK**; para publicar en Google Play se usa el **AAB**). Cuando cambias un archivo de Gradle, Android Studio muestra el aviso **Sync Now**: es Gradle volviendo a leer la configuración y descargando lo que falte. Si no sincronizas, las librerías nuevas no se reconocen y el código sale en rojo.

!!! info "Dependencias en proyectos nuevos"
    En las plantillas actuales las versiones de las librerías se declaran en `gradle/libs.versions.toml` y se usan con alias (`libs.androidx.core.ktx`). En esta web se escribe la cadena directa (`implementation("grupo:artefacto:versión")`), que también funciona. Comprueba siempre la **última versión** estable de cada librería.

## El primer código

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Text("Hola, móvil")
        }
    }
}
```

* `MainActivity` es la **pantalla de entrada**.
* `setContent { ... }` define la interfaz con funciones `@Composable`.

## Qué va dentro de `MainActivity`

El archivo completo, con cada parte numerada:

```kotlin
package com.ejemplo.holamovil                       // (1) la «dirección» del archivo

import android.os.Bundle                            // (2) cada clase que usas se importa
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.material3.Text

class MainActivity : ComponentActivity() {          // (3) la actividad

    private val etiqueta = "CicloDeVida"            // (4) propiedades de la clase

    override fun onCreate(savedInstanceState: Bundle?) {   // (5) Android lo llama al crear la pantalla
        super.onCreate(savedInstanceState)          // (6) obligatorio y siempre primero
        setContent {                                // (7) aquí empieza la interfaz
            Text("Hola, móvil")                     // (8) lo que se ve
        }
    }
}
```

1. **`package`**: lo escribe Android Studio. Tiene que coincidir con la carpeta.
2. **`import`**: si algo sale en rojo, falta su `import`. **Alt+Intro** (Alt+Enter) lo añade.
3. **`class MainActivity : ComponentActivity()`**: los `:` significan «hereda de». Es la pantalla del sistema.
4. **Propiedades**: dentro de la clase y **fuera de los métodos**.
5. **`onCreate`**: lo llama Android **una vez**, al crear la pantalla. `override` significa «reescribo lo que ya existe».
6. **`super.onCreate(...)`**: ejecuta primero lo que hace Android por defecto. Si lo quitas, la app falla.
7. **`setContent { }`**: el puente entre la actividad y Compose.
8. **El contenido**: lo normal es llamar a **tu composable** (`setContent { MiPantalla() }`) y escribirlo **fuera de la clase**.

**Dónde colocar cada cosa:**

| Qué | Dónde |
|---|---|
| Variables y propiedades de la actividad | Dentro de la clase, antes de los métodos |
| Código que se ejecuta al crear la pantalla (un `Log.d`, `enableEdgeToEdge()`) | Dentro de `onCreate`, **antes** de `setContent` |
| La interfaz | Dentro de `setContent { }`, llamando a un composable |
| Los composables (`@Composable fun ...`) | **Fuera** de la clase, al nivel del archivo |
| Más métodos del ciclo de vida (`onStart`, `onPause`...) | Dentro de la clase, junto a `onCreate` pero fuera de él |
| Las funciones `@Preview` | Fuera de la clase, al nivel del archivo |

!!! tip "Teléfonos con la cámara dentro de la pantalla"
    Para que la app se dibuje bajo la barra de estado y la cámara se llama a `enableEdgeToEdge()` en `onCreate`, y en la pantalla se usa `Modifier.safeDrawingPadding()` (o el `innerPadding` de `Scaffold`) para que nada quede tapado. Está explicado en [3.4](../u03/04-avanzado.md).

!!! note "Ejemplos sin ejecutar aquí"
    Los fragmentos de Android de esta web no se han ejecutado en este entorno, porque requieren el SDK de Android. Pruébalos siempre en tu emulador o móvil.

## Ejecutar la app

Elige un dispositivo (emulador o móvil real) en la barra superior y pulsa **Run** (triángulo verde). Los mensajes aparecen en la ventana **Logcat**.

### Escribir mensajes en Logcat: `Log`

Para ver por dónde pasa tu programa, escribe mensajes con `Log`. No salen en la pantalla del móvil: salen en la ventana **Logcat** de Android Studio.

```kotlin
import android.util.Log

Log.d("MiApp", "Entro en onCreate")           // d = depuración
Log.e("MiApp", "Algo ha fallado")             // e = error
```

El primer parámetro es la **etiqueta** (`tag`): el nombre con el que marcas tus mensajes para encontrarlos. El segundo, el mensaje.

| Función | Nivel | Úsala para |
|---|---|---|
| `Log.v` | Verbose | Detalle máximo (casi nunca) |
| `Log.d` | Debug | Seguir lo que hace tu programa |
| `Log.i` | Info | Hechos normales de interés |
| `Log.w` | Warning | Algo raro que no es un error |
| `Log.e` | Error | Algo falló |

**Para verlo:** ejecuta la app con **Run**, abre la pestaña **Logcat** (abajo) y escribe en el buscador `tag:MiApp` (o solo `MiApp`) para filtrar. Sin filtro verás cientos de mensajes del sistema. Si no sale nada, comprueba que has elegido el dispositivo correcto en Logcat y que el `import android.util.Log` está.

### Atajos que ahorran tiempo

| Atajo (Windows y Linux) | Qué hace |
|---|---|
| **Ctrl+Espacio** | Autocompletado (en Compose es tu «paleta» de componentes) |
| **Alt+Intro** | Arregla el error bajo el cursor: añade el `import`, crea la función... |
| **Shift+F10** | Ejecuta la app |
| **Ctrl+/** | Comenta o descomenta la línea o el bloque seleccionado |
| **Ctrl+Alt+L** | Da formato al código |
| **Shift dos veces** | Buscar en todo: archivos, ajustes, acciones |
| **Ctrl+Z** | Deshacer |

En macOS, **Ctrl** pasa a ser **Cmd** y **Alt** pasa a ser **Option**.

