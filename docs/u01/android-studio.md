# 4. Android Studio: instalación y primer proyecto

**Android Studio** es el IDE oficial para Android. Incluye editor, compilador (Gradle), emulador, depurador y el **SDK de Android**.

## Instalación

1. Descarga Android Studio desde [developer.android.com/studio](https://developer.android.com/studio).
2. Ejecuta el instalador y deja las opciones por defecto (incluye el SDK y el emulador).
3. En el primer arranque, el asistente descarga los componentes necesarios (puede tardar y ocupa varios GB).

!!! note "Requisitos"
    Necesitas un equipo con suficiente memoria RAM (se recomiendan 8 GB o más) y espacio en disco. Se necesita un JDK, pero Android Studio incluye el suyo.

## Crear tu primer proyecto

1. **New Project** → plantilla **Empty Activity** (con Jetpack Compose).
2. Rellena el **nombre**, el **nombre de paquete** (por ejemplo `com.ejemplo.holamovil`), el **lenguaje** (Kotlin) y la **API mínima**.
3. Pulsa **Finish** y espera a que **Gradle** sincronice el proyecto.

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

!!! note "Ejemplos sin ejecutar aquí"
    Los fragmentos de Android de esta web no se han ejecutado en este entorno, porque requieren el SDK de Android. Pruébalos siempre en tu emulador o móvil.

## Ejecutar la app

Elige un dispositivo (emulador o móvil real) en la barra superior y pulsa **Run** (triángulo verde). Los mensajes aparecen en la ventana **Logcat**.
