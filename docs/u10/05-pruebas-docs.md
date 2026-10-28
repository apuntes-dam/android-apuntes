# 10.5 Herramientas, pruebas y documentación

## Herramientas para diseñar y probar componentes

Para **crear el material gráfico** (iconos, logos) se siguen usando editores de imagen y vectores (Figma, Inkscape, *Vector Asset Studio*). Para **diseñar y probar el componente en sí**, las herramientas actuales son estas:

| Herramienta | Qué hace | Cuándo |
|---|---|---|
| `@Preview` y sus variantes | Dibuja el componente en el editor, sin arrancar el móvil | Cada vez que cambias una propiedad |
| `@PreviewParameter` | Genera una vista previa por cada valor de prueba | Componentes con estados o listas |
| `@Preview(uiMode = UI_MODE_NIGHT_YES)` | Vista previa en tema oscuro | Comprobar el contraste sin tocar el móvil |
| **Layout Inspector** | Árbol real de la interfaz: medidas, colores, orden | Cuando algo no se ve donde debía |
| Compose Testing (`createComposeRule`) | Busca nodos por `testTag` o texto y comprueba lo que se ve | Pruebas automáticas |
| `lint` / Detekt | Avisos de estilo y errores típicos | En el build y en la integración continua |

## Pruebas unitarias del componente

Una prueba de un componente **no comprueba «que el código se ejecuta»**, sino **que el usuario ve lo correcto**. En Compose se hace con `createComposeRule`: se monta el componente, se busca por su `testTag` o por su texto y se afirma sobre lo visible.

```kotlin
class BadgeEstadoTest {

    @get:Rule
    val regla = createComposeRule()         // arranca un entorno de Compose en el dispositivo

    @Test
    fun muestraLaEtiquetaPorDefecto() {
        regla.setContent { BadgeEstado(Estado.ERROR) }
        regla.onNodeWithText("Fallido").assertIsDisplayed()
    }

    @Test
    fun sustituyeElTexto() {
        regla.setContent { BadgeEstado(Estado.ERROR, texto = "Reintentar") }
        regla.onNodeWithText("Reintentar").assertIsDisplayed()
        regla.onNodeWithText("Fallido").assertDoesNotExist()   // afirmar la ausencia es más útil que contar píxeles
    }
}
```

Este fichero va en `src/androidTest` (se ejecuta en el dispositivo o emulador). La salida se lee así:

```text
com.example.uikit.BadgeEstadoTest:..
Time: 1.461
OK (2 tests)
```

Cada punto tras el nombre de la clase es una prueba que pasó; una `F` sería un fallo.

!!! tip "`testTag` estables"
    Las pruebas que buscan por texto se rompen al traducir la app. Pon un `Modifier.testTag("badge")` y busca con `onNodeWithTag`; el texto, solo como apoyo.

## Documentar componentes

Tres niveles, y los dos primeros casi no cuestan trabajo:

1. **KDoc** en la declaración (`/** … */` con `@param`): es la ayuda que ve quien usa el componente en el autocompletado.
2. **Previews como documentación viva**: un `@Preview` por estado vale más que un párrafo; el editor las pinta sin compilar la app.
3. **Documentación publicada**: con el plugin **Dokka** los KDoc se exportan a HTML o Markdown (el equivalente a Javadoc en Java).

```kotlin
/**
 * Chivato de estado con punto de color y texto.
 *
 * @param estado único dato obligatorio
 * @param texto permite sustituir la etiqueta del estado
 * @param conPunto apaga el punto de color
 */
```
