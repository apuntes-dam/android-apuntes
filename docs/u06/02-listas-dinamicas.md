# 6.2 Listas que cambian

Si una lista cambia (añadir, borrar), Compose debe enterarse. Una lista normal (`mutableListOf`) **no** avisa. Hay que usar `mutableStateListOf`:

```kotlin
val tareas = remember { mutableStateListOf("Comprar pan", "Estudiar Kotlin") }
var nueva by remember { mutableStateOf("") }

Column(Modifier.padding(16.dp)) {
    Row {
        OutlinedTextField(nueva, { nueva = it }, Modifier.weight(1f), label = { Text("Nueva tarea") })
        Button(onClick = { if (nueva.isNotBlank()) { tareas.add(nueva); nueva = "" } }) { Text("Añadir") }
    }
    LazyColumn {
        items(tareas) { tarea ->
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                Text(tarea, Modifier.weight(1f))
                IconButton(onClick = { tareas.remove(tarea) }) { Icon(Icons.Default.Delete, contentDescription = "Borrar $tarea") }
            }
        }
    }
}
```

## La clave de cada elemento

Para que Compose distinga bien los elementos al insertar o borrar (y anime los cambios), dale a cada uno una **clave única**:

```kotlin
data class Tarea(val id: Int, val texto: String, val hecha: Boolean = false)

LazyColumn {
    items(tareas, key = { it.id }) { t -> FilaTarea(t) }
}
```

## Listas de datos inmutables

Con `data class` y `copy` se modifica un elemento sin tocar el original:

```kotlin
val tareas = remember { mutableStateListOf(Tarea(1, "Estudiar")) }
// marcar como hecha
val i = tareas.indexOfFirst { it.id == 1 }
tareas[i] = tareas[i].copy(hecha = true)
```

## Buscar y filtrar

```kotlin
var filtro by remember { mutableStateOf("") }
val visibles = tareas.filter { it.texto.contains(filtro, ignoreCase = true) }
LazyColumn { items(visibles, key = { it.id }) { FilaTarea(it) } }
```
