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
