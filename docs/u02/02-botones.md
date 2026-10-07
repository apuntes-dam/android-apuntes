# 2.2 Botones y eventos

Un **botón** necesita dos cosas: qué muestra y qué hace al pulsarlo. Lo segundo se escribe en el parámetro `onClick`, que recibe una **lambda**.

```kotlin
Button(onClick = { Log.d("APP", "Me han pulsado") }) {
    Text("Pulsa aquí")
}
```

El contenido del botón va entre llaves, y puede ser texto, un icono o ambos.

## Los tipos de botón de Material 3

| Composable | Aspecto | Cuándo usarlo |
|---|---|---|
| `Button` | Relleno de color | La acción principal de la pantalla |
| `FilledTonalButton` | Relleno suave | Acción importante pero secundaria |
| `OutlinedButton` | Solo borde | Acción secundaria |
| `TextButton` | Solo texto | Acciones poco importantes (Cancelar) |
| `IconButton` | Solo un icono | Barras de herramientas |
| `FloatingActionButton` | Círculo flotante | La acción estrella (añadir) |

```kotlin
Column {
    Button(onClick = { }) { Text("Guardar") }
    OutlinedButton(onClick = { }) { Text("Editar") }
    TextButton(onClick = { }) { Text("Cancelar") }
    IconButton(onClick = { }) { Icon(Icons.Default.Favorite, contentDescription = "Favorito") }
    FloatingActionButton(onClick = { }) { Icon(Icons.Default.Add, contentDescription = "Añadir") }
}
```

## Desactivar un botón

```kotlin
Button(onClick = { enviar() }, enabled = false) {
    Text("Enviar")
}
```

Con `enabled = false` el botón se ve apagado y no responde. Es útil para impedir enviar un formulario incompleto.

## Un mensaje al pulsar: Toast

```kotlin
val contexto = LocalContext.current
Button(onClick = {
    Toast.makeText(contexto, "Guardado", Toast.LENGTH_SHORT).show()
}) { Text("Guardar") }
```

El **Toast** es un aviso breve que desaparece solo. Necesita un `Context`, que se obtiene con `LocalContext.current`.

## Pulsación larga y doble toque

`Button` solo conoce el toque normal. Para otros gestos se usa el modificador `combinedClickable` (API marcada como experimental: añade `@OptIn(ExperimentalFoundationApi::class)` a la función):

```kotlin
Text(
    "Mantén pulsado",
    modifier = Modifier.combinedClickable(
        onClick = { },
        onLongClick = { Log.d("APP", "Pulsación larga") },
        onDoubleClick = { Log.d("APP", "Doble toque") }
    )
)
```

!!! warning "Un botón no es un texto con `clickable`"
    Cualquier composable se puede hacer pulsable con `Modifier.clickable { }`. Pero un `Button` ya trae el área táctil correcta, el efecto de ondas y la accesibilidad. Úsalo siempre que haya una acción.
