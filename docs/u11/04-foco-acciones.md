# 11.4 Foco, teclado y acciones

## Ratón, foco y teclado físico

En escritorio hacen falta `MouseListener` y `FocusListener` porque hay ratón y teclado. En un móvil el ratón casi no se usa, pero **el foco sí**: mando de consola, teclado Bluetooth, accesibilidad y navegación por controles.

```kotlin
var foco by remember { mutableStateOf(false) }
Box(
    Modifier
        .onFocusEvent { evento -> foco = evento.hasFocus }       // el focusGained/focusLost de Swing
        .onPreviewKeyEvent { evento ->                            // antes de que lo consuma el campo
            if (evento.key == Key.Enter && evento.type == KeyEventType.KeyUp) {
                onPulsar(nota); true                              // true = me lo he quedado
            } else false                                          // false = que siga subiendo
        }
) { /* … */ }
```

* **`FocusRequester`** pide el foco (el `requestFocus()` de siempre) y se encadena con `focusRestorer()` para recuperarlo tras una recomposición.
* El recorrido del foco sigue el orden en que se declara la interfaz. Si el orden visual no coincide con el del árbol, se arregla con `focusGroup` y `focusOrder`, no con un `tabIndex` a mano.
* **`onPreviewKeyEvent`** se ejecuta **antes** que el componente; `onKeyEvent` después.

!!! success "Invisible para media clase"
    Un componente propio que **no declara `contentDescription` ni acepta foco** es invisible para media clase: la otra mitad no lo puede usar sin ratón.

## Asociar acciones a eventos

El flujo es ordenado, con otros nombres que en Swing:

```text
1. Detectar    →  2. Interpretar  →  3. Validar  →  4. Mutar el estado  →  5. Recomponer
 (Modifier de      (lambda con         (convertir        (MutableState fuera     (Compose repinta
  gesto)            datos ya            y rechazar        del componente)         lo que cambió)
                    procesados)         lo imposible)
```

| Paso | En Swing | En Compose |
|---|---|---|
| 1. Crear y registrar el escuchador | `spinner1.addChangeListener(…)` | `onClick` / `onValueChange` en el propio componente |
| 2. Averiguar qué ha pasado | `e.getSource()`, `spinner1.getValue()` | El valor llega por parámetro de la lambda |
| 3. Validar | `try { Integer.parseInt(…) } catch …` | `deVelocidad(texto)` con `require` |
| 4. Cambiar el modelo | Mutar campos del `JFrame` y llamar a `repaint()` | `config = config.copy(…)` |
| 5. Refrescar la vista | `repaint()` a mano | Nada: Compose observa el `MutableState` |

!!! success "El error de concepto que hay que arrancar"
    **La acción de un evento no repinta: cambia el estado.** Quien repinta es el sistema de composición. Todo lo que en Swing era «y al final llamo a `repaint()`» es aquí escribir una variable observada. Y **nunca al revés**.

## Cuatro antipatrones de examen

| Antipatrón | Por qué se rompe |
|---|---|
| Mutar una lista dentro del `@Composable` sin `mutableStateListOf` | Compose no se entera: la pantalla no cambia y parece que «el evento no llega» |
| Guardar en el evento el valor anterior «para poder volver» | Dos copias de la verdad: se desincronizan al girar la pantalla |
| Petición de red o disco dentro de la lambda del clic | Si tarda, la interfaz se planta. Se lanza en una *coroutine* o con `LaunchedEffect` |
| `when` de doce ramas dentro del componente para decidir qué hacer | El componente deja de ser reutilizable: la decisión es del llamador |

## Caso práctico: configuración del puntero

Interfaz para elegir la velocidad del ratón (0, 25, 50) y el botón principal (izquierdo o derecho), con una barra de color (0 → 20 dp roja, 25 → 40 dp naranja, 50 → 60 dp verde) y un ratón dibujado. En Swing eran un `JSpinner` (`ChangeListener`) y un `JComboBox` (`ItemListener`).

| En Swing | En Compose | Por qué |
|---|---|---|
| `JSpinner` con 0/25/50 | Tres botones | En móvil un spinner es incómodo; tres opciones se eligen a un toque |
| `ChangeListener.stateChanged` | `onClick` de cada botón | El valor entra ya validado: no existe la velocidad 37 |
| `JComboBox` izquierdo/derecho | Dos botones | Mismo efecto |
| `fillRect` con rojo/naranja/verde | `drawRoundRect` con 20/40/60 **dp** | Misma correspondencia; en dp se ve igual en cualquier densidad |
| `repaint()` al final | Nada | `config` ha cambiado y Compose repinta |
| Campos `private` del `JFrame` | `ConfigPuntero` inmutable | El estado se puede guardar y comparar |

## Errores típicos al explotar componentes

| Error | Síntoma | Solución |
|---|---|---|
| `remember` donde tocaba `rememberSaveable` | La pantalla se limpia al girar | Lo que el usuario escribió, a `rememberSaveable` (con `Saver` si es un tipo propio) |
| `Saver` que no reconstruye un campo | Tras el giro falta media configuración | Probar el giro, no solo el arranque |
| Evento que muta el parámetro del padre | Compose no recompone | El parámetro es `val`: se emite un objeto nuevo por el evento |
| Clave equivocada en `pointerInput` | El gesto responde con datos del elemento anterior | La clave es lo que cambia: `pointerInput(nota)` |
| Aceptar el evento y no hacer nada | El usuario pulsa y no pasa nada | Devolver `false` para que siga subiendo |
