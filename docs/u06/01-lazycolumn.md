# 6.1 Listas con LazyColumn

Una `Column` dibuja **todos** sus hijos a la vez; con mil elementos la app iría lenta. `LazyColumn` solo dibuja los que **se ven** en pantalla y los recicla al hacer scroll.

```kotlin
val frutas = listOf("Manzana", "Pera", "Plátano", "Fresa", "Uva")

LazyColumn {
    items(frutas) { fruta ->
        Text(fruta, Modifier.padding(16.dp))
    }
}
```

## Elementos con aspecto propio

Lo normal es que cada fila sea su propio composable:

```kotlin
data class Contacto(val nombre: String, val telefono: String)

@Composable
fun FilaContacto(c: Contacto) {
    Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(Icons.Default.Person, contentDescription = null, Modifier.size(40.dp))
        Spacer(Modifier.width(12.dp))
        Column {
            Text(c.nombre, fontWeight = FontWeight.Bold)
            Text(c.telefono, style = MaterialTheme.typography.bodySmall)
        }
    }
}

LazyColumn {
    items(contactos) { FilaContacto(it) }
}
```

## Cabeceras, separadores y espacio

```kotlin
LazyColumn(
    contentPadding = PaddingValues(16.dp),
    verticalArrangement = Arrangement.spacedBy(8.dp)
) {
    item { Text("Mis contactos", style = MaterialTheme.typography.headlineSmall) }
    items(contactos) { FilaContacto(it) }
    item { Text("Fin de la lista") }
}
```

* `item { }` añade **un** elemento suelto; `items(lista) { }` añade uno por cada elemento.
* `stickyHeader { }` crea una cabecera que se queda fijada arriba al desplazar.

## Otras listas

| Composable | Para qué |
|---|---|
| `LazyRow` | Lista horizontal |
| `LazyVerticalGrid(columns = GridCells.Fixed(2))` | Cuadrícula |
| `Column(Modifier.verticalScroll(rememberScrollState()))` | Pocos elementos que no caben en pantalla |
