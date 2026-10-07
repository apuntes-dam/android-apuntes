# 5.2 Casillas, interruptores y deslizadores

Todos siguen el patrón del campo de texto: **tú guardas el valor y ellos avisan del cambio**.

## Checkbox: sí o no

```kotlin
var acepto by remember { mutableStateOf(false) }
Row(verticalAlignment = Alignment.CenterVertically) {
    Checkbox(checked = acepto, onCheckedChange = { acepto = it })
    Text("Acepto las condiciones")
}
```

## Switch: activar o desactivar

```kotlin
var avisos by remember { mutableStateOf(true) }
Row(verticalAlignment = Alignment.CenterVertically) {
    Text("Notificaciones", Modifier.weight(1f))
    Switch(checked = avisos, onCheckedChange = { avisos = it })
}
```

Usa `Switch` para ajustes que se aplican **al momento** y `Checkbox` para elecciones que se confirman después.

## RadioButton: una sola opción

```kotlin
val opciones = listOf("Pequeña", "Mediana", "Grande")
var elegida by remember { mutableStateOf(opciones[1]) }

Column(Modifier.selectableGroup()) {
    opciones.forEach { texto ->
        Row(
            Modifier.fillMaxWidth().selectable(selected = (texto == elegida), onClick = { elegida = texto }, role = Role.RadioButton),
            verticalAlignment = Alignment.CenterVertically
        ) {
            RadioButton(selected = (texto == elegida), onClick = null)
            Text(texto, Modifier.padding(start = 8.dp))
        }
    }
}
```

Toda la fila es pulsable (más cómodo) y `onClick = null` en el radio evita que se gestione dos veces.

## Slider: un valor en un rango

```kotlin
var volumen by remember { mutableStateOf(0.5f) }
Column {
    Text("Volumen: ${(volumen * 100).toInt()}%")
    Slider(value = volumen, onValueChange = { volumen = it }, valueRange = 0f..1f, steps = 9)
}
```

## Resumen

| Quieres… | Usa |
|---|---|
| Texto libre | `TextField` |
| Sí / no | `Checkbox` o `Switch` |
| Una de varias | `RadioButton` o lista desplegable |
| Un número en un rango | `Slider` |
| Varias opciones a la vez | Varios `Checkbox` |

!!! note "Código de Android sin ejecutar aquí"
    Los fragmentos de esta unidad usan Jetpack Compose y no se han ejecutado en este entorno (hace falta el SDK y un emulador). Pruébalos siempre en tu proyecto; si algo no compila, suele faltar un `import`: pulsa **Alt+Enter** sobre el nombre en rojo.
