# 8.5 Gestos y dibujo personalizado

## Arrastrar

```kotlin
var desplazamiento by remember { mutableStateOf(Offset.Zero) }

Box(
    Modifier
        .offset { IntOffset(desplazamiento.x.roundToInt(), desplazamiento.y.roundToInt()) }
        .size(80.dp).background(Color.Magenta)
        .pointerInput(Unit) {
            detectDragGestures { cambio, arrastre ->
                cambio.consume()
                desplazamiento += arrastre
            }
        }
)
```

## Toque, doble toque y pulsación larga

```kotlin
Modifier.pointerInput(Unit) {
    detectTapGestures(
        onTap = { },
        onDoubleTap = { },
        onLongPress = { }
    )
}
```

## Pellizcar para ampliar

```kotlin
var zoom by remember { mutableStateOf(1f) }
Image(
    painterResource(R.drawable.mapa), null,
    Modifier.graphicsLayer(scaleX = zoom, scaleY = zoom)
        .pointerInput(Unit) { detectTransformGestures { _, _, z, _ -> zoom = (zoom * z).coerceIn(1f, 5f) } }
)
```

## Dibujar con Canvas

`Canvas` es un lienzo donde dibujas formas con código:

```kotlin
Canvas(Modifier.size(200.dp)) {
    drawRect(Color.LightGray, size = size)
    drawCircle(Color.Red, radius = 50.dp.toPx(), center = center)
    drawLine(Color.Black, start = Offset(0f, 0f), end = Offset(size.width, size.height), strokeWidth = 4f)
}
```

Es la base para gráficas, indicadores circulares o juegos sencillos. Ejemplo de **gráfico de barras**:

```kotlin
@Composable
fun Barras(valores: List<Float>, modifier: Modifier = Modifier) {
    val maximo = valores.max()
    Canvas(modifier.fillMaxWidth().height(160.dp)) {
        val ancho = size.width / (valores.size * 2f)
        valores.forEachIndexed { i, v ->
            val alto = size.height * (v / maximo)
            drawRect(Color(0xFF3DDC84), topLeft = Offset(ancho * (2 * i + 0.5f), size.height - alto), size = Size(ancho, alto))
        }
    }
}
```
