# 8.1 Animaciones

Una animación comunica que algo ha cambiado. Compose la hace sencilla: cambias el **estado** y le dices que el cambio sea gradual.

## Aparecer y desaparecer

```kotlin
var visible by remember { mutableStateOf(true) }

Button(onClick = { visible = !visible }) { Text("Alternar") }
AnimatedVisibility(visible = visible, enter = fadeIn() + expandVertically(), exit = fadeOut() + shrinkVertically()) {
    Text("Ahora me ves")
}
```

## Animar un valor

`animate*AsState` transforma un cambio brusco en uno suave:

```kotlin
var grande by remember { mutableStateOf(false) }
val tamano by animateDpAsState(if (grande) 160.dp else 80.dp, label = "tamano")
val color by animateColorAsState(if (grande) Color.Green else Color.Gray, label = "color")

Box(Modifier.size(tamano).background(color).clickable { grande = !grande })
```

Existen versiones para `Float`, `Dp`, `Color`, `Int`, `Offset`…

## Animar el tamaño al cambiar el contenido

```kotlin
var expandida by remember { mutableStateOf(false) }
Card(Modifier.fillMaxWidth().animateContentSize().clickable { expandida = !expandida }) {
    Text(
        "Texto largo que se despliega al tocar la tarjeta…",
        Modifier.padding(16.dp), maxLines = if (expandida) Int.MAX_VALUE else 1
    )
}
```

## Cambiar de contenido con transición

```kotlin
AnimatedContent(targetState = cuenta, label = "cuenta") { valor ->
    Text("$valor", fontSize = 48.sp)
}
```

## Controlar la forma

Las animaciones aceptan una `animationSpec`:

| Especificación | Efecto |
|---|---|
| `tween(500)` | Duración fija, 500 ms |
| `spring()` | Rebote natural, como un muelle |
| `repeatable(...)` / `infiniteRepeatable(...)` | Repetición |

```kotlin
val x by animateFloatAsState(if (mover) 300f else 0f, animationSpec = spring(dampingRatio = Spring.DampingRatioMediumBouncy), label = "x")
```

!!! warning "Con medida"
    Una animación debe ayudar, no distraer. Mantén las transiciones cortas (150–400 ms) y evita animar muchas cosas a la vez.
