# 12.2 WCAG 2.2 y lo que añade Android

Las **Web Content Accessibility Guidelines 2.2** son una recomendación del **W3C** (octubre de 2023) y la referencia mundial de accesibilidad. Se organizan en **cuatro principios** (el acrónimo inglés es **POUR**) y cada criterio tiene un **nivel**.

| Principio | Significa | Ejemplo de criterio |
|---|---|---|
| **P**erceptible | Se puede percibir con algún sentido | 1.4.3 contraste; 1.2.2 subtítulos |
| **O**perable | Se puede manejar con algún dispositivo | 2.5.8 tamaño del objetivo; 2.1.1 teclado |
| **C**omprensible | Se entiende | 3.3.1 identificación de errores; 3.2.3 navegación coherente |
| **R**obusto | Funciona con las tecnologías de apoyo | 4.1.2 nombre, función, valor |

## Tres niveles

* **A**: el mínimo.
* **AA**: el que exige la ley en Europa. **El objetivo realista y legal es AA.**
* **AAA**: el más exigente; no es obligatorio en general (se persigue en textos críticos).

## Los criterios que se usan en esta unidad

| Criterio | Nivel | Qué exige |
|---|---|---|
| 1.4.3 Contrast (Minimum) | AA | **4,5:1** en texto normal; **3:1** en texto grande |
| 1.4.6 Contrast (Enhanced) | AAA | **7:1** en texto normal; **4,5:1** en texto grande |
| 1.4.11 Non-text Contrast | AA | **3:1** para iconos, bordes y controles |
| 1.4.4 Resize Text | AA | El texto se amplía al **200 %** sin perder contenido |
| 1.4.10 Reflow | AA | Sin scroll horizontal a 320 px de ancho |
| 2.5.8 Target Size (Minimum) | AA | **24 × 24 px** CSS como mínimo absoluto |
| 2.5.5 Target Size (Enhanced) | AAA | **44 × 44 px** CSS |

!!! warning "«Texto grande» no es «el que a mí me parece grande»"
    En WCAG es **18 pt (24 px)**, o **14 pt (18,66 px) en negrita**. Por debajo de eso el umbral es 4,5:1 y no se discute.

## Lo que añade Android (y es lo que se programa)

Las normas son genéricas; Android las traduce a reglas concretas y medibles:

| Regla de Android | De dónde viene | Cómo se cumple en Compose |
|---|---|---|
| **48 × 48 dp** de área de toque | Guías de Material + WCAG 2.5.5/2.5.8 | `Modifier.size(48.dp)` o `minimumInteractiveComponentSize()` |
| Texto en **sp**, no en dp | WCAG 1.4.4 (200 %) | `fontSize = 16.sp`, `MaterialTheme.typography` |
| `contentDescription` en lo que no lleva texto | WCAG 4.1.2 / 1.1.1 | `Modifier.semantics { contentDescription = "…" }` |
| Rol y estado accesibles | WCAG 4.1.2 | `Modifier.semantics { role = Role.Button; stateDescription = "…" }` |
| Nada de información **solo por color** | WCAG 1.4.1 | Icono + texto además del color |
| Orden de foco lógico | WCAG 2.4.3 | Orden de composición y `focusOrder` |

## Tres herramientas para comprobarlo

* **TalkBack**: el lector de pantalla de Android. Lee lo que hay en el árbol de semántica.
* **Accessibility Scanner**: app de Google que audita la pantalla en vivo y marca los fallos (toques pequeños, contraste bajo, falta de etiqueta).
* **`uiautomator dump`**: volcado del árbol de accesibilidad, que es lo que lee TalkBack. Es la **prueba objetiva** de que la etiqueta está puesta.

!!! success "Si algo no aparece en el volcado de `uiautomator`, TalkBack no lo ve"
    No hay debate posible: es el mismo árbol. **El volcado es la prueba objetiva de accesibilidad:** si el nodo está y tiene texto, TalkBack lo lee; si no está, no existe para el usuario.

```kotlin
// Un botón de solo icono: sin etiqueta sería invisible para TalkBack
IconButton(onClick = onBorrar, modifier = Modifier.semantics { role = Role.Button }) {
    Icon(Icons.Default.Delete, contentDescription = "Borrar")     // describe la FUNCIÓN, no la forma
}
```
