# 11.6 Lo marcado en verde (tema 5)

En la web del profesor, los textos con **fondo verde** son los que hay que repasar cada semana y los que entran en el examen. Aquí están todos los del tema 5 **con otras palabras** y con la página de esta unidad donde se explican. Si puedes explicar cada punto sin mirar, lo tienes.

!!! success "Cómo usar esta página"
    Lee el punto, tápalo y repítelo en voz alta. Después haz el [examen de prueba](../examen-din-t456.md): sus preguntas salen de estos puntos.

## Introducción (11.1)

* Este tema **explota** los componentes de la unidad anterior: los convierte en piezas que **responden** al usuario, sobreviven a que el sistema mate la actividad, se pueden inspeccionar desde fuera y tienen pruebas automáticas.
* Un componente explotado **responde, recuerda, se deja inspeccionar y tiene pruebas**: las cuatro cosas, no dos.
* Resultado de aprendizaje **RA3**: crear componentes visuales valorando y empleando herramientas específicas.

## Semántica y persistencia (11.1 y 11.2)

* Lo que hoy se entiende por «introspección de una interfaz» es el **árbol de semántica**.
* Un componente sin **`contentDescription`** en lo que informa de algo es **invisible** para un usuario con lector de pantalla.
* **`remember`** vive mientras vive la composición; **`rememberSaveable`** sobrevive a la destrucción de la actividad porque viaja en el **`Bundle`** del sistema.
* Con **objetos inmutables** el evento puede entregar la configuración completa: no hay ambigüedad sobre qué cambió ni quién lo cambió, y el `Saver` puede serializar el objeto entero.

## Eventos (11.3 y 11.4)

* En Compose **no se registran escuchadores**: el «listener» es un **parámetro de la función** y el objeto evento casi nunca se ve, porque se interpreta dentro del **`Modifier`** de entrada.
* **Todo evento se gestiona igual**: un `Modifier` que observa y una lambda que actúa; solo cambia el `Modifier`.
* **`awaitFirstDown()`** espera a que el dedo toque (el `mousePressed` de Swing) y **`waitForUpOrCancellation()`** a que se levante (el `mouseReleased`).
* **`pointerInput(nota)` lleva una clave**: si la nota cambia, el bloque se reinicia y deja de escuchar el gesto viejo.
* Cuanta más lógica de presentación esté en componentes que solo reciben parámetros, **menos pruebas hacen falta y menos fallos hay**.
* Un componente propio sin `contentDescription` ni foco es invisible para media clase: la otra mitad no lo puede usar sin ratón.
* **La acción de un evento no repinta, cambia el estado.** Quien repinta es el sistema de composición. **Nunca al revés.**

## Pruebas (11.5)

* **Si la prueba necesita ver la pantalla o tocar algo, va a `androidTest`; si solo necesita pensar, va a `test`.**
* **`@get:Rule val regla = createComposeRule()`** levanta el `ComposeTestRule`: sin eso no hay composición donde mirar.
* **Se afirma sobre la etiqueta y el estado, no sobre píxeles.**
* **`assertThrows` también prueba el mensaje.**
* **11 pruebas en verde, `Time: 13.919`** — no «a ojo se ve bien».

## Para repasar en voz alta

| Pregunta | Respuesta corta |
|---|---|
| ¿Cuántas cosas cumple un componente explotado? | Cuatro: responde, recuerda, se deja inspeccionar y se prueba |
| ¿Qué es hoy la «introspección»? | El árbol de semántica |
| ¿`remember` o `rememberSaveable` para lo que escribe el usuario? | `rememberSaveable` (con `Saver` si el tipo es propio) |
| ¿Dónde está el equivalente del `MouseListener`? | `pointerInput` + `awaitEachGesture` |
| ¿Qué hace la acción de un evento? | Cambiar el estado (no repintar) |
| ¿Prueba de interfaz: `test` o `androidTest`? | `androidTest`, con `createComposeRule` |
