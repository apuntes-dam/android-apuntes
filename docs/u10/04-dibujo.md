# 10.4 Dibujar con `DrawScope`

Alguna vez ninguna pieza estándar sirve y hay que **dibujar a mano**. En Java se sobrescribía `paint(Graphics g)`: un lienzo, un color, unas coordenadas y unas figuras. En Compose ese lienzo se llama **`DrawScope`** y está disponible dentro de **`Canvas { }`** o de **`Modifier.drawBehind { }`**.

## De `Graphics` a `DrawScope`

| Java `Graphics` | Compose `DrawScope` | Nota |
|---|---|---|
| Sobrescribir `paint(Graphics g)` | `Canvas { … }` o `Modifier.drawBehind { … }` | No hay `update()` ni `repaint()`: al cambiar el estado se vuelve a dibujar |
| `g.setColor(Color.green)` | `color = Color(0xFF2E7D32)` en cada figura | El color es un **argumento**, no un estado del pincel |
| `g.fillOval(150, 70, 50, 70)` | `drawOval(color, topLeft = Offset(150f, 70f), size = Size(50f, 70f))` | Mismas coordenadas |
| `g.fillRect(350, 70, 50, 70)` | `drawRect(color, topLeft = Offset(350f, 70f), size = Size(50f, 70f))` | Ídem |
| `g.fillPolygon(xs, ys, 3)` | `Path().apply { moveTo(); lineTo(); close() }` + `drawPath(…)` | El polígono se construye con un `Path` |
| `g.drawImage(img, x, y, this)` | `drawImage(image, offset, alpha)` | |
| Pluma gruesa (`Stroke`) | `style = Stroke(width = 10f, cap = StrokeCap.Round)` | Trazos redondeados y degradados con `Brush` |

## Caso práctico: formas básicas

En Swing había que sobrescribir `paint`, llamar a `super.paint(g)` y encadenar `setColor` + `fillOval` + `fillRect` + `fillPolygon`. En Compose:

| Paso en Swing | Paso en Compose |
|---|---|
| 1. Sobrescribir `paint` | Abrir el bloque `Canvas { }` |
| 2. Llamar al `paint` de la superclase | No hace falta: el fondo se pone con `Modifier.background(Color.White)` |
| 3-4. Verde y `fillOval(150, 70, 50, 70)` | `drawOval(Color(0xFF2E7D32), Offset(150f, 70f), Size(50f, 70f))` |
| 5-6. Amarillo y `fillRect(350, 70, 50, 70)` | `drawRect(Color(0xFFF9A825), Offset(350f, 70f), Size(50f, 70f))` |
| 7-8. Naranja y `fillPolygon` | `Path` de tres vértices + `drawPath(…)` |

```kotlin
@Composable
fun LienzoFiguras(modifier: Modifier = Modifier) {
    Canvas(modifier.fillMaxSize().background(Color.White)) {
        drawOval(Color(0xFF2E7D32), topLeft = Offset(150f, 70f), size = Size(50f, 70f))
        drawRect(Color(0xFFF9A825), topLeft = Offset(350f, 70f), size = Size(50f, 70f))

        val triangulo = Path().apply {
            moveTo(250f, 200f); lineTo(200f, 290f); lineTo(300f, 290f); close()
        }
        drawPath(triangulo, Color(0xFFEF6C00))

        drawLine(Color(0xFF1565C0), Offset(50f, 340f), Offset(450f, 340f),
            strokeWidth = 10f, cap = StrokeCap.Round)
    }
}
```

## Imágenes dentro de un componente

Según de dónde venga la imagen, cambia la herramienta:

| Caso | Cómo se hace | Claves |
|---|---|---|
| Icono o logo **vectorial** | `ImageVector` (creado desde un SVG) o *Vector Asset Studio* | Escala sin pixelar y pesa cientos de bytes |
| Imagen **incluida en el paquete** (PNG, WebP) | `painterResource(R.drawable.nombre)` dentro de `Image(…)` | Vive en el módulo: viaja dentro del `.aar` |
| Imagen **remota** | Carga asíncrona: Coil `AsyncImage` (o Fresco) | Ocupa un hueco mientras carga y muestra error si falla |

```kotlin
Image(
    painter = painterResource(R.drawable.ic_logo),
    contentDescription = "Logo de la aplicación",   // obligatoria si la imagen informa de algo
    modifier = Modifier.size(40.dp),
)
```

!!! warning "Accesibilidad de las imágenes"
    `contentDescription = null` es correcto **solo en imágenes decorativas**. En cuanto la imagen informa de algo (un estado, un precio, un avatar) el texto es obligatorio: sin él el componente no pasa una revisión de accesibilidad.
