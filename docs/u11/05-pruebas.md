# 11.5 Pruebas del componente

El esquema de las pruebas clásicas (clase de prueba, métodos anotados, aserciones y comprobación de errores) **no ha cambiado**. Lo que cambia es **dónde** se escriben y **qué** pueden tocar.

## Dos carpetas

| | Pruebas JVM (`src/test`) | Pruebas instrumentadas (`src/androidTest`) |
|---|---|---|
| Dónde corren | En el portátil, sin Android | En el dispositivo o emulador |
| Velocidad | Milisegundos | Segundos |
| Qué pueden tocar | Lógica pura, `data class`, validaciones | La interfaz real, gestos, semántica, base de datos |
| Compose | Nada (no hay composición) | `createComposeRule()` y `onNodeWithTag(…)` |

!!! success "Regla para no equivocarse de carpeta"
    **Si la prueba necesita ver la pantalla o tocar algo, va a `androidTest`; si solo necesita pensar, va a `test`.** Por eso el `Saver` y el validador `deVelocidad` son funciones normales, que se pueden probar en la JVM.

Las anotaciones y aserciones son las de siempre: `@Test`, `@Before`, `@After`, `assertEquals`, `assertThrows`.

## El vocabulario nuevo de Compose

| Quiero… | Cómo |
|---|---|
| Montar el componente a prueba | `regla.setContent { Tecla(…) }` |
| Buscarlo sin depender del texto | `regla.onNodeWithTag("tecla-Do")` |
| Comprobar que se ve | `.assertIsDisplayed()` |
| Hacer un clic | `.performClick()` |
| Hacer un gesto real | `.performTouchInput { click() }` |
| Preguntar qué dice la semántica | `.fetchSemanticsNode().config[SemanticsProperties.ContentDescription]` |

```kotlin
class EventosTest {

    @get:Rule
    val regla = createComposeRule()                      // levanta el ComposeTestRule

    @Test
    fun laTeclaSePulsa() {
        var pulsadas = 0
        regla.setContent { Tecla(ESCALA[0], onPulsar = { pulsadas++ }, onSoltar = {}) }
        regla.onNodeWithTag("tecla-Do").performTouchInput { click() }
        assertEquals(1, pulsadas)
    }

    @Test
    fun laVelocidadImposibleSeRechazaConSuMensaje() {
        val error = assertThrows(IllegalArgumentException::class.java) { deVelocidad("75") }
        assertEquals("La velocidad solo puede ser 0, 25 o 50, no 75", error.message)
    }
}
```

!!! warning "Tres detalles que valen punto en el examen"
    1. **`@get:Rule val regla = createComposeRule()`** levanta el `ComposeTestRule`: sin eso no hay composición donde mirar.
    2. **Se afirma sobre la etiqueta y sobre el estado, no sobre píxeles.** Una captura que cambia de tamaño no rompe la prueba; un `assertTrue` sobre `null` sí.
    3. **`assertThrows` también prueba el mensaje**: es la «comprobación de errores» de siempre, y es lo que salva una app cuando el usuario escribe `75` donde valían 0, 25 o 50.

## Leer el resultado

```text
com.example.uikit.BadgeEstadoTest:..
com.example.uikit.ConfigPunteroTest:...
com.example.uikit.PanelPunteroTest:...
com.example.uikit.TeclaEventosTest:...
Time: 13.919
OK (11 tests)
```

Once pruebas en cuatro clases, todas en verde: **«11 pruebas en verde»** es una evidencia, no «a ojo se ve bien».

## Errores típicos con las pruebas

| Error | Síntoma | Solución |
|---|---|---|
| Pruebas que buscan por texto literal | Se rompen al traducir o al cambiar una etiqueta | `testTag` estables; el texto, solo de apoyo |
| Probar la interfaz en `src/test` | La prueba no ve nada y falla sin motivo | La interfaz se prueba en `src/androidTest` con `createComposeRule` |
| Instalar el APK de pruebas de la ruta equivocada | `INSTRUMENTATION_FAILED: Unable to find instrumentation info` | En un módulo de librería el APK está en `…/androidTest/debug/` |
