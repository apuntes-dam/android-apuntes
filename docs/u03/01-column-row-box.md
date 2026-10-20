# 3.1 Column, Row y Box

Los tres layouts básicos:

| Layout | Coloca los hijos… |
|---|---|
| `Column` | Uno debajo de otro (vertical) |
| `Row` | Uno al lado de otro (horizontal) |
| `Box` | Unos **encima** de otros (apilados) |

```kotlin
Column {
    Text("Arriba")
    Text("Medio")
    Text("Abajo")
}

Row {
    Text("Izquierda")
    Text("Derecha")
}

Box {
    Text("Fondo")
    Text("Encima")
}
```

## Paneles: los composables que contienen a otros

En otros sistemas de interfaces se habla de **paneles** (*layouts*): componentes cuya función es **contener** a otros y colocarlos. En Compose un panel no es nada especial, es **un composable que recibe otros composables entre sus llaves**:

* `Column`, `Row` y `Box` colocan a sus hijos en vertical, en horizontal o apilados.
* `Card` y `Surface` los agrupan visualmente (borde, fondo, sombra).
* `Scaffold` ([3.3](03-scaffold.md)) es el panel de **toda la pantalla**, con huecos para la cabecera, la barra inferior y el botón flotante.

Se pueden **anidar** a voluntad: una `Column` con una `Row` dentro, que tiene un `Card`, que tiene otra `Column`...

```kotlin
Scaffold { margen ->
    Column(modifier = Modifier.padding(margen)) {        // panel vertical
        Card {                                           // panel con borde
            Row {                                        // panel horizontal
                Icon(Icons.Default.Person, contentDescription = null)
                Text("Ana")
            }
        }
    }
}
```

El árbol de la interfaz es exactamente esa anidación de paneles, y es lo que muestra el *Component Tree* ([9. El entorno de diseño](../u01/entorno-diseno.md)).

## Alinear y repartir

Cada layout tiene dos ejes. En una `Column` el eje **principal** es el vertical y el **cruzado** el horizontal; en una `Row` es al revés.

* `verticalArrangement` / `horizontalArrangement`: cómo se reparte el espacio en el eje principal.
* `horizontalAlignment` / `verticalAlignment`: cómo se alinean en el eje cruzado.

```kotlin
Column(
    modifier = Modifier.fillMaxSize(),
    verticalArrangement = Arrangement.Center,
    horizontalAlignment = Alignment.CenterHorizontally
) {
    Text("Centrado en la pantalla")
}
```

| Arrangement | Efecto |
|---|---|
| `Start`, `Center`, `End` | Pegados a un lado o al centro |
| `SpaceBetween` | Primero y último en los bordes, hueco entre medias |
| `SpaceAround` | Huecos iguales alrededor de cada hijo |
| `SpaceEvenly` | Todos los huecos iguales |
| `spacedBy(8.dp)` | Separación fija entre hijos |

## Pesos: repartir el sitio sobrante

`Modifier.weight(1f)` hace que un hijo ocupe la parte proporcional del espacio libre:

```kotlin
Row(Modifier.fillMaxWidth()) {
    Text("A", Modifier.weight(1f))
    Text("B", Modifier.weight(2f))
}
```

Aquí `B` ocupa el doble de ancho que `A`.

## Box: apilar

En un `Box` el parámetro `contentAlignment` coloca el contenido, y cada hijo puede usar `Modifier.align(...)`:

```kotlin
Box(Modifier.size(200.dp)) {
    Text("Arriba izquierda", Modifier.align(Alignment.TopStart))
    Text("Abajo derecha", Modifier.align(Alignment.BottomEnd))
}
```
