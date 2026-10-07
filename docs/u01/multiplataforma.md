# 10. Tu primer proyecto multiplataforma

**Kotlin Multiplatform (KMP)** permite compartir código entre plataformas, y **Compose Multiplatform** permite compartir también la **interfaz**: escribes las pantallas una vez y funcionan en Android, escritorio e incluso iOS y web.

## Crear el proyecto

1. Entra en **kmp.jetbrains.com** (el asistente oficial de JetBrains).
2. Escribe el nombre del proyecto y marca las plataformas: **Android** y **Desktop**.
3. Descarga el `.zip`, **descomprímelo** y ábrelo en Android Studio.
4. Espera a que termine la sincronización de Gradle.

!!! tip "Antivirus"
    Gradle genera miles de archivos y el antivirus puede ralentizar mucho la sincronización. Excluye la carpeta del proyecto y la de Gradle del análisis en tiempo real.

## Los módulos

Los nombres cambian entre versiones del asistente. En las más recientes se ven así:

| Módulo | Qué contiene |
|---|---|
| `shared` | El código **común** con la interfaz de Compose. Dentro, `commonMain` contiene `App.kt`, la interfaz que se ve en todas las plataformas |
| `androidApp` | La actividad de Android (`MainActivity`), que solo llama a `App()` |
| `desktopApp` | La ventana de escritorio, que también llama a `App()` |

Versiones antiguas usaban una carpeta `app/` con `shared` y `androidApp` dentro, e incluso un módulo `core` para la lógica compartida. Si tu enunciado lo menciona y no lo encuentras, es por la versión del asistente: busca el módulo equivalente y explícalo.

!!! note "Por qué casi todo va en `shared`"
    La interfaz se escribe **una vez** en `shared/src/commonMain/kotlin/<paquete>/`. Si pones un archivo de Compose en `androidApp` y usas componentes multiplataforma, puede dar errores de «*unresolved reference*» porque las dependencias están en `shared`.

## Ejecutar en las dos plataformas

* **Android:** elige la configuración `androidApp` y un emulador (o móvil) y pulsa **Run ▶**.
* **Escritorio:** abre el panel **Gradle** y ejecuta la tarea `run` del módulo `desktopApp` (o usa su configuración de ejecución).

Los dos arrancan la misma función `App()`.

## Modificar la interfaz compartida

Solo hay que tocar `App.kt`. Un ejemplo con dos botones en fila:

```kotlin
@Composable
fun App() {
    MaterialTheme {
        Row(
            modifier = Modifier.fillMaxSize(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(onClick = { }) { Text("Aceptar") }
            Spacer(Modifier.width(16.dp))
            Button(onClick = { }) { Text("Cancelar") }
        }
    }
}
```

No hay que tocar `MainActivity` porque solo hace `setContent { App() }`.

## La previsualización en proyectos multiplataforma

`@Preview` de Android **no existe en el código común** (también compila para escritorio, donde no hay esa herramienta). Se escribe en el módulo `androidApp`, en un archivo propio:

```kotlin
// androidApp/src/main/kotlin/<paquete>/Previews.kt
@Preview(showBackground = true)
@Composable
fun AppPreview() {
    App()
}
```

**Ventaja sobre el emulador:** se redibuja en vivo mientras escribes, sin arrancar el emulador ni compilar e instalar la app entera en cada cambio. Iteras más rápido y gastas menos recursos.

## Diferencias que notarás frente a Android «puro»

| Android | Compose Multiplatform |
|---|---|
| `painterResource(R.drawable.foto)` | `painterResource(Res.drawable.foto)` (de `org.jetbrains.compose.resources`) |
| Imágenes en `res/drawable` | Imágenes en `shared/src/commonMain/composeResources/drawable` |
| Textos en `res/values/strings.xml` | `composeResources/values/strings.xml` y `stringResource(Res.string.…)` |
| `Log`, `Toast`, `Context` | Solo existen en Android; no se pueden usar en `commonMain` |

Todo lo demás (`Column`, `Row`, `Text`, `Button`, estado, listas, temas) se escribe igual. Por eso las unidades siguientes valen para los dos.
