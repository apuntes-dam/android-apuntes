# 11.3 Eventos: de los listeners de Swing a `Modifier`

La programación basada en eventos se desmonta en **tres piezas**: la **fuente** (el componente que genera el evento), el **objeto de evento** (lo que se envía) y el **listener** (quien lo escucha). Esa forma de pensar sigue siendo válida: lo que se decide es el **contrato**, a qué responde cada pieza y qué hace cuando responde.

!!! success "En Compose no se registran escuchadores"
    El «listener» es un **parámetro de la función**, y el objeto de evento casi nunca se ve, porque se interpreta dentro del **`Modifier`** de entrada. El contrato se declara en la firma:

    ```kotlin
    fun PanelPuntero(configuracion: ConfigPuntero, onCambio: (ConfigPuntero) -> Unit)
    ```

    Con esa línea ya está dicho todo: el componente no cambia nada por dentro, devuelve la configuración completa cuando el usuario toca y no sabe qué hará el llamador con ella.

## Qué eventos tiene cada componente

| Componente | Eventos que le interesan | Acción razonable |
|---|---|---|
| `Button` | `onClick` | Emitir el evento propio con el estado nuevo |
| `Switch` | `onCheckedChange(activada)` | Copiar la configuración con el booleano cambiado |
| `OutlinedTextField` | `onValueChange`, `onKeyboardAction` | Validar y solo escribir si es válido |
| `Checkbox` / `FilterChip` | `onCheckedChange` / `onClick` | Alternar un filtro |
| `Slider` | `onValueChange`, `onValueChangeFinished` | Previsualizar al arrastrar y confirmar al soltar |
| `Tecla` (propio) | `onPulsar`, `onSoltar` | Sonar y pintar la tecla hundida |
| `FiguraRaton` (propio) | Ninguno: solo recibe | Pintar según lo que le pasan |
| Lista de elementos | Scroll, clic en fila, deslizamiento lateral | Cargar más, abrir detalle, borrar |
| Pantalla completa | Teclas (D-pad, Tab), foco | Mover el foco de forma predecible |

!!! tip "La fila importante: `FiguraRaton`"
    Un componente de dibujo no necesita eventos: es una función de datos a píxeles. Si le metes estado dentro, creas una **segunda fuente de verdad**. **Cuanta más lógica de presentación esté en componentes que solo reciben parámetros, menos pruebas hacen falta y menos fallos hay.**

## Los listeners de Swing, traducidos uno a uno

Conviene tenerlos memorizados: caen en las dos direcciones («¿cómo se hace hoy esto?» y «¿de qué evento viene esto?»).

| Swing / JavaBeans | Método que se sobrescribía | Equivalente en Compose | Nota |
|---|---|---|---|
| `ActionListener` | `actionPerformed(ActionEvent)` | `onClick = { … }` de `clickable`/`Button` | El `ActionEvent` no llega: ya sabes qué control tocaste |
| `KeyListener` | `keyPressed` / `keyReleased` / `keyTyped` | `Modifier.onPreviewKeyEvent { }` / `onKeyEvent { }` | Devuelve `true` si te lo quedas, `false` para que siga subiendo |
| `MouseListener` | `mousePressed` / `mouseReleased` / `mouseClicked` / `mouseEntered` / `mouseExited` | `Modifier.clickable`, `Modifier.hoverable` | En táctil, `clickable` cubre pulsar y soltar |
| `MouseMotionListener` | `mouseDragged` / `mouseMoved` | `Modifier.pointerInput { detectDragGestures { … } }` | El arrastre ya trae la distancia acumulada |
| `FocusListener` | `focusGained` / `focusLost` | `Modifier.onFocusEvent { … }`, `FocusRequester` | Con teclado físico o D-pad no es opcional |
| `ChangeListener` (`JSpinner`) | `stateChanged(ChangeEvent)` | `onValueChange` del `Slider`, `TextField`, `Checkbox` | |
| `ItemListener` (`JComboBox`) | `itemStateChanged(ItemEvent)` | `onClick` en cada opción | |

!!! success "Todo evento en Compose se gestiona igual"
    Un **`Modifier` que observa** y una **lambda que actúa**. Lo único que cambia entre un evento y otro es el `Modifier` que se pone delante.

## Cazar el gesto a mano: `pointerInput`

Si el componente es propio (por ejemplo una tecla de piano sin `Button` debajo), el gesto se caza con `pointerInput`. Es el `MouseListener` de hoy, en versión *suspend* en lugar de una interfaz con cinco métodos vacíos.

```kotlin
@Composable
fun Tecla(nota: Nota, onPulsar: (Nota) -> Unit, onSoltar: (Nota) -> Unit, modifier: Modifier = Modifier) {
    var hundida by remember { mutableStateOf(false) }
    Box(
        modifier
            .background(if (hundida) Color.LightGray else Color.White)
            .pointerInput(nota) {                    // la clave es la nota
                awaitEachGesture {
                    awaitFirstDown()                 // el dedo toca  (mousePressed)
                    hundida = true; onPulsar(nota)
                    waitForUpOrCancellation()        // el dedo se levanta (mouseReleased)
                    hundida = false; onSoltar(nota)
                }
            }
    )
}
```

El mini-protocolo que hay que saber leer:

* **`awaitEachGesture { }`**: bucle; se reactiva con cada gesto nuevo sobre el componente.
* **`awaitFirstDown()`** espera a que el dedo toque (el `mousePressed` de Swing) y **`waitForUpOrCancellation()`** espera a que se levante (el `mouseReleased`). Entre las dos, el componente está «pulsado».
* El bloque es *suspend*: se pausa sin bloquear el hilo de la interfaz. En Swing, algo lento dentro de `actionPerformed` congelaba la ventana (el EDT).
* **`pointerInput(nota)` lleva una clave**: si la nota cambia, el bloque se reinicia y deja de escuchar el gesto viejo. Sin clave, los *closures* se quedan con el valor de la primera composición: es la fuente de errores de eventos más frecuente en Compose.
