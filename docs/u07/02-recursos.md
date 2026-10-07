# 7.2 Recursos, idiomas y modo oscuro

## Los recursos de la app

Todo lo que no es código vive en `app/src/main/res/`:

| Carpeta | Contiene |
|---|---|
| `drawable/` | Imágenes y dibujos vectoriales |
| `mipmap-*/` | Iconos de la app |
| `values/` | Textos (`strings.xml`), colores, medidas |
| `font/` | Tipografías |
| `raw/` | Audio y otros archivos |

## Textos en `strings.xml`

**Nunca** escribas un texto visible directamente en el código. Guárdalo como recurso:

```xml
<!-- res/values/strings.xml -->
<resources>
    <string name="app_name">Mis tareas</string>
    <string name="boton_guardar">Guardar</string>
    <string name="saludo">Hola, %1$s</string>
    <plurals name="num_tareas">
        <item quantity="one">%d tarea</item>
        <item quantity="other">%d tareas</item>
    </plurals>
</resources>
```

Y se usa con `stringResource`:

```kotlin
Text(stringResource(R.string.boton_guardar))
Text(stringResource(R.string.saludo, "Ana"))
Text(pluralStringResource(R.plurals.num_tareas, n, n))
```

## Traducir la app

Crea una carpeta `values-en/` (inglés) con su propio `strings.xml` con **los mismos nombres**:

```xml
<!-- res/values-en/strings.xml -->
<resources>
    <string name="boton_guardar">Save</string>
</resources>
```

Android elige la carpeta según el idioma del móvil. En Android Studio, clic derecho en `strings.xml` → **Open Translations Editor** para traducir en una tabla.

## Modo oscuro

Con el tema de la sección anterior ya lo tienes: `isSystemInDarkTheme()` devuelve `true` si el móvil usa modo oscuro. Para probar, activa el modo oscuro en el emulador (*Ajustes → Pantalla*) o en la vista previa:

```kotlin
@Preview(uiMode = Configuration.UI_MODE_NIGHT_YES, showBackground = true)
@Composable
fun VistaOscura() { MiAppTheme { Pantalla() } }
```

## Medidas y colores como recurso

```xml
<!-- res/values/dimens.xml -->
<dimen name="margen">16dp</dimen>
```

```kotlin
Modifier.padding(dimensionResource(R.dimen.margen))
```

## Tipografías propias

Copia el archivo `.ttf` en `res/font/` (nombre en minúsculas) y úsalo:

```kotlin
val Rubik = FontFamily(Font(R.font.rubik_regular), Font(R.font.rubik_bold, FontWeight.Bold))
Text("Hola", fontFamily = Rubik)
```
