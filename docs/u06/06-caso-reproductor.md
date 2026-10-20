# 6.6 Caso práctico: reproductor con botones en rejilla

Cuando los elementos siguen un patrón de filas y columnas (un teclado, un mando, una galería), una **rejilla** los coloca sola. Este caso monta un reproductor de música con nueve botones en 3×3 y un texto que dice qué está pasando.

## Plan

1. Una lista con los controles (texto y acción).
2. Una `LazyVerticalGrid` de tres columnas que pinta un botón por control.
3. Un estado para el texto de arriba («Reproduciendo», «Pausado»...).

## Paso 1: los datos

En vez de escribir nueve botones a mano, se guardan en una lista y se pintan con un bucle:

```kotlin
data class Control(val texto: String, val estado: String)

val controles = listOf(
    Control("⏮ Anterior", "Pista anterior"), Control("▶ Play", "Reproduciendo"), Control("⏭ Siguiente", "Pista siguiente"),
    Control("⏪ Atrás", "Retrocediendo"),     Control("⏸ Pausa", "Pausado"),      Control("⏩ Adelante", "Avanzando"),
    Control("⏺ Grabar", "Grabando"),         Control("⏹ Stop", "Detenido"),       Control("⏻ Apagar", "Apagado")
)
```

## Paso 2: la rejilla

```kotlin
@Composable
fun Reproductor() {
    var estado by remember { mutableStateOf("Apagado") }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text(estado, style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(16.dp))

        LazyVerticalGrid(
            columns = GridCells.Fixed(3),                          // tres columnas
            verticalArrangement = Arrangement.spacedBy(8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(controles) { control ->
                Button(
                    onClick = { estado = control.estado },
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(control.texto, fontSize = 12.sp, maxLines = 1)
                }
            }
        }
    }
}
```

* `GridCells.Fixed(3)` fija **tres columnas**: con nueve elementos salen tres filas.
* Cada botón lleva `fillMaxWidth()` para ocupar el ancho de su celda y que las columnas queden alineadas.
* Pulsar un botón cambia `estado`; como es estado, el `Text` de arriba se redibuja solo.

## Paso 3: que se adapte a la pantalla

Con tres columnas fijas, en una tableta los botones salen muy anchos. Si en vez de contar columnas dices **cuánto debe medir cada celda**, la rejilla calcula cuántas caben:

```kotlin
columns = GridCells.Adaptive(minSize = 110.dp)
```

En un móvil estrecho saldrán 3; en una tableta o con el móvil girado, más. Es la misma idea que ya viste al elegir entre `Fixed` y `Adaptive` en [6.1](01-lazycolumn.md).

## ¿Por qué `LazyVerticalGrid` y no filas con `Row`?

Para nueve botones podrías usar tres `Row` dentro de una `Column`. La rejilla gana cuando:

* la lista **crece o cambia** (una galería con cien fotos): solo dibuja lo que se ve, como `LazyColumn`;
* quieres que el **número de columnas se adapte** al tamaño de la pantalla.

## Qué has practicado

* Datos en una lista y una `data class` ([2.5](../u02/05-objetos-interfaz.md)).
* Layouts con rejilla: `LazyVerticalGrid`, `GridCells` y `items`.
* Un estado que se actualiza en un evento y redibuja otro componente.
