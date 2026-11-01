# 3.2 Modifier

Todo composable visible acepta un parámetro `modifier`. Un `Modifier` es una **cadena de ajustes** que se aplican de izquierda a derecha:

```kotlin
Text(
    "Hola",
    modifier = Modifier
        .padding(16.dp)
        .background(Color.Yellow)
        .fillMaxWidth()
)
```

## Los modificadores más usados

| Modifier | Qué hace |
|---|---|
| `padding(16.dp)` | Espacio **alrededor** (por dentro del fondo si va después del `background`) |
| `size(100.dp)`, `width`, `height` | Tamaño fijo |
| `fillMaxWidth()`, `fillMaxHeight()`, `fillMaxSize()` | Ocupar todo el espacio disponible |
| `background(Color.Red)` | Color de fondo |
| `border(2.dp, Color.Black)` | Borde |
| `clip(RoundedCornerShape(12.dp))` | Recortar con esquinas redondeadas |
| `clickable { }` | Hacerlo pulsable |
| `weight(1f)` | Repartir espacio en Row/Column |
| `alpha(0.5f)` | Transparencia |

[![Qué hace cada Modifier de la tabla: size, fillMaxWidth, padding, background, border, clip, clickable, alpha y weight](../assets/img/modifier-metodos.svg)](../assets/img/modifier-metodos.svg){ target=_blank title="Abrir a tamaño completo" }

*Figura. Cada modificador de la tabla, con su efecto.*

## El orden importa

```kotlin
// Margen fuera del color
Modifier.padding(16.dp).background(Color.Yellow)

// Margen dentro del color
Modifier.background(Color.Yellow).padding(16.dp)
```

En el primero el amarillo es más pequeño, con aire alrededor. En el segundo el amarillo ocupa todo y el texto queda separado del borde. Piensa en el `padding` como un **marco**: lo que va antes queda fuera, lo que va después queda dentro.

[![El orden del Modifier importa: padding antes o después de background](../assets/img/modifier-orden.svg)](../assets/img/modifier-orden.svg){ target=_blank title="Abrir a tamaño completo" }

*Figura. Los mismos dos modificadores en distinto orden dan resultados distintos.*

## Espacios y separadores

```kotlin
Column {
    Text("Uno")
    Spacer(Modifier.height(16.dp))
    Text("Dos")
}
```

`Spacer` es un hueco vacío. Para líneas de separación existe `HorizontalDivider()`.

[![Spacer deja un hueco vacío y HorizontalDivider dibuja una línea de separación](../assets/img/espacios.svg)](../assets/img/espacios.svg){ target=_blank title="Abrir a tamaño completo" }

*Figura. `Spacer` separa con un hueco; `HorizontalDivider` separa con una línea.*

## Reutilizar un modifier

El composable que escribas debería aceptar siempre un `modifier` como primer parámetro opcional:

```kotlin
@Composable
fun Etiqueta(texto: String, modifier: Modifier = Modifier) {
    Text(texto, modifier = modifier.padding(8.dp))
}
```

Así quien lo use puede colocarlo y dimensionarlo sin tocar tu código.
