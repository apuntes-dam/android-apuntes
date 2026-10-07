# 5.3 Menús, diálogos y mensajes

## Lista desplegable

```kotlin
val ciudades = listOf("Madrid", "Valencia", "Sevilla")
var abierto by remember { mutableStateOf(false) }
var ciudad by remember { mutableStateOf(ciudades[0]) }

Box {
    OutlinedButton(onClick = { abierto = true }) { Text(ciudad) }
    DropdownMenu(expanded = abierto, onDismissRequest = { abierto = false }) {
        ciudades.forEach { c ->
            DropdownMenuItem(text = { Text(c) }, onClick = { ciudad = c; abierto = false })
        }
    }
}
```

## Diálogo de alerta

Un **diálogo** interrumpe al usuario para pedirle una confirmación. Se muestra mientras una variable sea `true`:

```kotlin
var mostrar by remember { mutableStateOf(false) }

Button(onClick = { mostrar = true }) { Text("Borrar") }

if (mostrar) {
    AlertDialog(
        onDismissRequest = { mostrar = false },
        title = { Text("¿Borrar la tarea?") },
        text = { Text("Esta acción no se puede deshacer.") },
        confirmButton = { TextButton(onClick = { borrar(); mostrar = false }) { Text("Borrar") } },
        dismissButton = { TextButton(onClick = { mostrar = false }) { Text("Cancelar") } }
    )
}
```

## Snackbar: un aviso con acción

Más moderno que el `Toast`: aparece abajo, puede llevar un botón («Deshacer») y se integra con `Scaffold`.

```kotlin
val snackbar = remember { SnackbarHostState() }
val scope = rememberCoroutineScope()

Scaffold(snackbarHost = { SnackbarHost(snackbar) }) { margen ->
    Button(Modifier.padding(margen), onClick = {
        scope.launch {
            val r = snackbar.showSnackbar("Tarea borrada", actionLabel = "Deshacer")
            if (r == SnackbarResult.ActionPerformed) restaurar()
        }
    }) { Text("Borrar") }
}
```

Mostrar un snackbar es una función **suspendida**, por eso se lanza dentro de `scope.launch`.

## Selector de fecha

Requiere `@OptIn(ExperimentalMaterial3Api::class)`.

```kotlin
val estado = rememberDatePickerState()
DatePicker(state = estado)
// estado.selectedDateMillis contiene la fecha elegida (milisegundos)
```

## ¿Cuál uso?

| Situación | Componente |
|---|---|
| Elegir una opción de varias | `DropdownMenu` |
| Confirmar algo peligroso | `AlertDialog` |
| Informar sin interrumpir | `Snackbar` (o `Toast`) |
| Elegir una fecha | `DatePicker` |
