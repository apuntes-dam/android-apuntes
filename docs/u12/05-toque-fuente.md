# 12.5 Área de toque, letra al 200 % y auditoría

## Área de toque: 48 dp

Un dedo no es un cursor: la yema mide entre 8 y 10 mm. El objetivo táctil recomendado por Android es **48 × 48 dp** (unos 9 mm en un móvil de densidad media). WCAG pide un mínimo absoluto de **24 × 24 px** CSS (2.5.8, AA) y **44 × 44** para el nivel AAA (2.5.5).

!!! success "Android es más exigente que el mínimo legal"
    En la práctica se audita contra **48 dp**.

**El área de toque no es el dibujo.** Un icono de 24 dp puede tener una zona pulsable de 48 dp si se le añade relleno o `minimumInteractiveComponentSize()`. Lo que se mide es la **zona que responde al dedo**, no el píxel pintado.

```kotlin
IconButton(onClick = onAbrir) {                       // el botón ya reserva 48 dp
    Icon(Icons.Default.Menu, contentDescription = "Abrir el menú")   // el dibujo mide 24 dp
}

Box(Modifier.minimumInteractiveComponentSize()) { /* zona pulsable de al menos 48 dp */ }
```

### El detector (ejecutado)

Un control cumple solo si **las dos dimensiones** llegan a 48 dp. Una tecla de piano de 44 × 150 **no cumple**: el alto sobra y el ancho no llega.

```kotlin
data class ControlToque(val nombre: String, val anchoDp: Int, val altoDp: Int) {
    /** Exige las DOS dimensiones: un control de 44 x 150 no cumple (el alto sobra, el ancho no llega). */
    val cumple: Boolean get() = anchoDp >= 48 && altoDp >= 48
}

fun main() {
    val controles = listOf(
        ControlToque("tecla Do (piano)", 44, 150),
        ControlToque("botón Material 3", 48, 48),
        ControlToque("icono pequeño", 40, 40),
        ControlToque("icono 24 dp con relleno hasta 48", 48, 48),
    )
    for (c in controles) {
        val veredicto = if (c.cumple) "cumple" else "corto (${minOf(c.anchoDp, c.altoDp)} < 48)"
        println("${c.nombre.padEnd(34)} ${c.anchoDp} x ${c.altoDp} dp -> $veredicto")
    }
    println("controles que se quedan cortos: ${controles.count { !it.cumple }} de ${controles.size}")
}
```

**Salida:**

```text
tecla Do (piano)                   44 x 150 dp -> corto (44 < 48)
botón Material 3                   48 x 48 dp -> cumple
icono pequeño                      40 x 40 dp -> corto (40 < 48)
icono 24 dp con relleno hasta 48   48 x 48 dp -> cumple
controles que se quedan cortos: 2 de 4
```

Arreglo para la tecla: envolverla en un `Box` de 48 dp con el dibujo de 44 dentro, o añadir relleno horizontal. Se ve igual y responde mejor.

## Letra al 200 %: la prueba que casi nadie hace

El criterio 1.4.4 (AA) pide que el texto se pueda ampliar al **200 %** sin perder contenido ni funcionalidad. En Android no se hace con zoom: se cambia la **escala de fuente del sistema**, y para que funcione hay que haber escrito las letras en **`sp`**, no en `dp`.

| Unidad | ¿Escala con la fuente del sistema? | Se usa para |
|---|---|---|
| `dp` | No | Tamaños, márgenes, iconos, áreas de toque |
| `sp` | **Sí** | **Todo texto** |

Si un texto está en `dp`, el usuario que necesita letra grande se queda sin ella: es un fallo **silencioso** (en el emulador normal no se ve).

Las cuatro comprobaciones, en este orden:

1. ¿Se corta algún texto? Ni una letra fuera de su caja ni puntos suspensivos donde había un dato.
2. ¿Se solapa algo? Texto sobre texto o sobre un botón.
3. ¿Sigue habiendo scroll **vertical** y no horizontal? A 320 px de ancho no debe aparecer scroll lateral (1.4.10).
4. ¿Los botones siguen siendo pulsables? Un texto que crece puede empujar un botón fuera de la pantalla.

!!! success "El 200 % no es un caso raro"
    Es la configuración de muchísima gente mayor, y la diferencia entre una app que se puede usar y una que no.

## La auditoría hecha pantalla

Una pantalla de auditoría calcula el ratio de cada par de colores, marca el veredicto y hace lo mismo con las áreas de toque. Con `testTagsAsResourceId = true`, los números salen en el volcado de `uiautomator` y se pueden leer desde fuera:

```text
ratio-texto principal      | 16,23:1
ratio-badge completado     | 5,91:1
ratio-badge revisa         | 3,37:1      ← no llega a 4,5
ratio-placeholder gris     | 1,88:1      ← a propósito
resumen-contraste          | 4 de 6 pares cumplen AA
resumen-toques             | 1 de 2 controles se quedan cortos
```

Una auditoría de verdad **encuentra defectos**: en un kit propio es lo normal; lo raro sería no encontrar ninguno. Aquí aparecieron dos: **el badge de aviso a 3,37:1** (no llega a AA) y **la tecla del piano a 44 dp** (corta).

!!! success "Una auditoría que no encuentra nada casi siempre está mal hecha"
    Lo importante no es el arreglo: es que ahora hay un **número** que lo demuestra y una **prueba** que avisará si vuelve a pasar.
