# 9. El entorno de diseño de interfaces

## Instalación en tres pasos

1. **Descargar** el instalador de Android Studio para tu sistema desde la web oficial.
2. Seguir el asistente con la instalación **Standard**: instala el SDK, las plataformas y las herramientas del emulador.
3. En el **primer arranque**, dejar que el asistente de configuración (*setup wizard*) descargue los componentes que falten.

**Lo que no tienes que instalar aparte:** el JDK (Android Studio trae uno embebido) y Jetpack Compose (el asistente de proyectos lo añade solo).

## Partes del entorno

| Elemento | Para qué sirve |
|---|---|
| **Toolbar** | Acciones generales: sincronizar Gradle, gestor de SDK, emulador, botón **Run ▶** y selector de dispositivo |
| **Vistas Code / Split / Design** | `Code`: solo código. `Design`: solo previsualización. `Split`: las dos a la vez, y lo que escribes se redibuja en vivo |
| **Autocompletado** (`Ctrl+Espacio`) | En Compose hace de «paleta de componentes»: escribes `But`, aceptas `Button` y se inserta con sus parámetros |
| **Component Tree** | Árbol con la jerarquía de la interfaz; al hacer clic salta a su línea de código |
| **Alt+Enter** | Arregla errores: añade `import` que faltan, sugiere cambios |

!!! tip "En Compose el código manda"
    A diferencia de los editores visuales de otras épocas, la vista *Design* **no genera código que no puedas tocar**: el código es la fuente de la verdad y la previsualización solo lo refleja. Todo se puede editar a mano.

## Actividad frente a función composable

| | Actividad (`ComponentActivity`) | Función `@Composable` |
|---|---|---|
| Qué es | Una **clase** que representa la pantalla del sistema | Una **función** que describe un trozo de interfaz |
| Quién la gestiona | Android, con su ciclo de vida (`onCreate`…) | Compose, que la vuelve a ejecutar si cambia el estado |
| ¿Dibuja? | No: solo **aloja** la interfaz | Sí: describe lo que se ve |

Las conecta `setContent { }`:

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MiApp()
        }
    }
}
```

Una analogía: la actividad es el **edificio**, los composables son la **decoración** de una habitación y `setContent` es la puerta que los une.

## Importar librerías

Para usar un componente de Material 3 hay que importarlo. Puedes importar uno o todos:

```kotlin
import androidx.compose.material3.Button   // solo Button
import androidx.compose.material3.*        // todo Material 3
```

Lo habitual es dejar que Android Studio los añada con **Alt+Enter**.
