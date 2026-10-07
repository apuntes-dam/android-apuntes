# 3.3 La estructura de una pantalla: Scaffold

Una pantalla típica tiene **barra superior**, **contenido**, a veces **barra inferior** y un **botón flotante**. `Scaffold` coloca todo en su sitio y te da el margen que deja libre cada barra:

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Pantalla() {
    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Mis tareas") })
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { }) {
                Icon(Icons.Default.Add, contentDescription = "Añadir")
            }
        }
    ) { margen ->
        Column(Modifier.padding(margen).padding(16.dp)) {
            Text("Contenido de la pantalla")
        }
    }
}
```

!!! warning "No olvides `padding(margen)`"
    La lambda del contenido recibe un parámetro con el espacio que ocupan las barras. Si no lo aplicas, el contenido queda **tapado** por la barra superior.

## Card: agrupar información

`Card` dibuja una tarjeta con sombra y esquinas redondeadas:

```kotlin
Card(
    modifier = Modifier.fillMaxWidth().padding(8.dp),
    elevation = CardDefaults.cardElevation(4.dp)
) {
    Column(Modifier.padding(16.dp)) {
        Text("Título", fontWeight = FontWeight.Bold)
        Text("Descripción de la tarjeta")
    }
}
```

## Barra inferior

```kotlin
Scaffold(
    bottomBar = {
        NavigationBar {
            NavigationBarItem(selected = true, onClick = { },
                icon = { Icon(Icons.Default.Home, contentDescription = null) }, label = { Text("Inicio") })
            NavigationBarItem(selected = false, onClick = { },
                icon = { Icon(Icons.Default.Settings, contentDescription = null) }, label = { Text("Ajustes") })
        }
    }
) { margen -> /* contenido */ }
```

La navegación real entre pantallas se verá en la [U6](../u06/index.md).
