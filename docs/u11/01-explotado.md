# 11.1 Un componente explotado

Un componente **explotado** cumple cuatro cosas, **las cuatro, no dos**:

| | Qué significa |
|---|---|
| **Responde** | Responde solo a los eventos que le interesan, y a cada evento le tiene asociada una acción concreta |
| **Recuerda** | Su estado visible sobrevive a una rotación de pantalla o a que Android recupere la app |
| **Se deja mirar** | Desde fuera (Layout Inspector, `uiautomator`, un lector de pantalla) se ve qué es, cómo se llama y dónde está |
| **Se prueba** | Tiene pruebas que fallan si algo se rompe, antes de que lo descubra el usuario |

!!! info "Qué se ha ejecutado y qué no"
    Los fragmentos de Compose **no se han ejecutado** aquí. El ejemplo de Kotlin puro (`data class`, `copy` y validación con `require`) de la página 11.2 **sí** se ha ejecutado de verdad al construir la web.

## Introspección y reflexión

Con la **introspección** un componente sabe qué propiedades tiene, y con la **reflexión** el entorno las descubre sin saber de qué clase es. De ahí salía la paleta del editor, el inspector de propiedades y la serialización. En Java se hacía con `java.beans.Introspector`.

Hoy casi no tocas la reflexión: se reparte entre `@Composable` (las propiedades son los parámetros), `data class` y `copy` (Kotlin genera los accesores) y `@Parcelize` / `kotlinx.serialization` (el código se genera en compilación).

### El árbol de semántica

Lo que hoy se entiende por «introspección de una interfaz» es el **árbol de semántica**: el árbol paralelo que Compose mantiene para que el sistema —TalkBack, las pruebas, `uiautomator`— pueda preguntar *qué hay en la pantalla*. Cada nodo declara su rol, su contenido, si está seleccionado, si es *togglable* y si tiene el foco.

Se puede ver desde fuera del proceso. Una línea en la raíz de la interfaz hace que los `testTag` salgan como `resource-id`:

```kotlin
Box(modifier = Modifier.semantics { testTagsAsResourceId = true }) { /* toda la interfaz */ }
```

```text
$ adb shell uiautomator dump
<node resource-id="velocidad-50"  clickable="true" bounds="[476,288][670,432]" />
<node resource-id="animacion"     clickable="true" checkable="true" checked="false" />
<node resource-id="tecla-Do"      content-desc="Tecla Do" bounds="[72,180][204,630]" />
```

Tres cosas útiles en ese volcado:

* un **nombre estable** para las pruebas (no depende del texto: no se rompe al traducir),
* la **caja de toque** (`bounds`), que debe medir **al menos 48 dp** de lado,
* el **estado accesible** (`checkable`, `checked`), lo que lee un lector de pantalla.

!!! success "Un componente sin `contentDescription` es invisible"
    Un componente que **informa de algo** y no tiene `contentDescription` es **invisible para un usuario con lector de pantalla**. En los botones con `Text` no hace falta: el texto ya aporta la etiqueta. En una tecla que se dibuja a sí misma, sí.
