# 7.1 El tema de Material 3

En vez de poner el color de cada texto y cada botón a mano, defines un **tema** y todos los componentes lo usan. Cambias el tema y cambia toda la app.

## Qué contiene

Un tema (`MaterialTheme`) reúne tres cosas:

| Parte | Qué define |
|---|---|
| `colorScheme` | Colores: `primary`, `secondary`, `background`, `surface`, `error`… |
| `typography` | Estilos de letra: `titleLarge`, `bodyMedium`, `labelSmall`… |
| `shapes` | Formas de las esquinas |

Al crear un proyecto, Android Studio genera `ui/theme/Theme.kt`, `Color.kt` y `Type.kt`.

## Usar el tema en vez de valores fijos

```kotlin
Text("Título", style = MaterialTheme.typography.headlineMedium)
Text("Texto normal", style = MaterialTheme.typography.bodyLarge)

Box(Modifier.background(MaterialTheme.colorScheme.primaryContainer)) {
    Text("Destacado", color = MaterialTheme.colorScheme.onPrimaryContainer)
}
```

Cada color tiene su pareja **`on…`** (el color del contenido que va encima): `primary` con `onPrimary`, `surface` con `onSurface`. Usar siempre la pareja garantiza que el texto se lea bien.

## Definir tus colores

En `Color.kt`:

```kotlin
val Verde40 = Color(0xFF2E7D32)
val Verde80 = Color(0xFFA5D6A7)
```

En `Theme.kt`:

```kotlin
private val Claro = lightColorScheme(primary = Verde40, secondary = Color(0xFF00695C))
private val Oscuro = darkColorScheme(primary = Verde80, secondary = Color(0xFF80CBC4))

@Composable
fun MiAppTheme(oscuro: Boolean = isSystemInDarkTheme(), contenido: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = if (oscuro) Oscuro else Claro,
        typography = Typography,
        content = contenido
    )
}
```

Y en la `MainActivity` envuelves toda la interfaz:

```kotlin
setContent { MiAppTheme { MiApp() } }
```

!!! tip "Generador de colores"
    La herramienta *Material Theme Builder* (de Google) crea un esquema claro y oscuro completo a partir de un color. Puedes copiar el resultado en `Color.kt`.

## Colores dinámicos

En Android 12 o superior el tema puede coger los colores del **fondo de pantalla del usuario**:

```kotlin
val esquema = if (oscuro) dynamicDarkColorScheme(LocalContext.current) else dynamicLightColorScheme(LocalContext.current)
```

!!! note "Código de Android sin ejecutar aquí"
    Los fragmentos de esta unidad usan Jetpack Compose y no se han ejecutado en este entorno (hace falta el SDK y un emulador). Pruébalos siempre en tu proyecto; si algo no compila, suele faltar un `import`: pulsa **Alt+Enter** sobre el nombre en rojo.
