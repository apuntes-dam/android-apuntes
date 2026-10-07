# 2.1 Composables y texto

Una **función composable** es una función de Kotlin marcada con `@Composable`. En lugar de devolver un valor, *dibuja* algo en pantalla. Su nombre empieza por mayúscula, como si fuera una clase.

```kotlin
@Composable
fun Saludo(nombre: String) {
    Text("Hola, $nombre")
}
```

Se llama desde otro composable, igual que una función normal:

```kotlin
setContent {
    Saludo("Ana")
}
```

## El componente Text

`Text` muestra texto. Casi todo se personaliza con parámetros con nombre:

```kotlin
Text(
    text = "Título de la app",
    fontSize = 24.sp,
    fontWeight = FontWeight.Bold,
    color = Color.Blue,
    textAlign = TextAlign.Center,
    maxLines = 2,
    overflow = TextOverflow.Ellipsis
)
```

| Parámetro | Para qué sirve |
|---|---|
| `fontSize` | Tamaño, en **sp** (unidad que respeta el tamaño de letra del usuario) |
| `fontWeight` | Grosor: `Normal`, `Bold`… |
| `fontStyle` | `FontStyle.Italic` para cursiva |
| `color` | Color del texto |
| `maxLines` / `overflow` | Limitar líneas y poner «…» si no cabe |
| `textDecoration` | Subrayado o tachado |

## Previsualizar sin ejecutar

Con `@Preview` Android Studio dibuja el composable en el panel **Design**, sin arrancar el emulador:

```kotlin
@Preview(showBackground = true)
@Composable
fun SaludoPreview() {
    Saludo("Ana")
}
```

!!! tip "Trabaja con la vista previa"
    Es mucho más rápido ver los cambios en el panel de previsualización que ejecutar la app cada vez.

## Unidades de medida

* **dp**: tamaño de elementos y espacios. Es independiente de la densidad de la pantalla.
* **sp**: solo para tamaño de texto.
* Escribe `16.dp` y `18.sp` (necesitas `import androidx.compose.ui.unit.dp` y `sp`).

!!! note "Código de Android sin ejecutar aquí"
    Los fragmentos de esta unidad usan Jetpack Compose y no se han ejecutado en este entorno (hace falta el SDK y un emulador). Pruébalos siempre en tu proyecto; si algo no compila, suele faltar un `import`: pulsa **Alt+Enter** sobre el nombre en rojo.
