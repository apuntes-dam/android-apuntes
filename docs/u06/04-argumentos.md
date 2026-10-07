# 6.4 Pasar datos y barra inferior

## Argumentos en la ruta

Para abrir el detalle **de un elemento concreto**, se pasa su identificador dentro de la ruta:

```kotlin
NavHost(nav, startDestination = "lista") {
    composable("lista") {
        PantallaLista(alAbrir = { id -> nav.navigate("detalle/$id") })
    }
    composable(
        route = "detalle/{id}",
        arguments = listOf(navArgument("id") { type = NavType.IntType })
    ) { entrada ->
        val id = entrada.arguments?.getInt("id") ?: 0
        PantallaDetalle(id = id)
    }
}
```

* `{id}` es un **hueco** que se rellena al navegar.
* Pasa solo identificadores sencillos (números, textos cortos). Para datos grandes, pasa el `id` y busca el objeto en otro sitio (un `ViewModel`, una base de datos).

## Barra de navegación inferior

Las apps con 3–5 secciones principales usan una barra abajo:

```kotlin
data class Destino(val ruta: String, val titulo: String, val icono: ImageVector)

val destinos = listOf(
    Destino("inicio", "Inicio", Icons.Default.Home),
    Destino("buscar", "Buscar", Icons.Default.Search),
    Destino("perfil", "Perfil", Icons.Default.Person)
)

@Composable
fun AppConBarra() {
    val nav = rememberNavController()
    val actual = nav.currentBackStackEntryAsState().value?.destination?.route

    Scaffold(bottomBar = {
        NavigationBar {
            destinos.forEach { d ->
                NavigationBarItem(
                    selected = actual == d.ruta,
                    onClick = {
                        nav.navigate(d.ruta) {
                            popUpTo(nav.graph.startDestinationId) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    icon = { Icon(d.icono, contentDescription = null) },
                    label = { Text(d.titulo) }
                )
            }
        }
    }) { margen ->
        NavHost(nav, startDestination = "inicio", modifier = Modifier.padding(margen)) {
            composable("inicio") { Text("Inicio") }
            composable("buscar") { Text("Buscar") }
            composable("perfil") { Text("Perfil") }
        }
    }
}
```

Las tres opciones de `navigate { }` evitan que, al pulsar varias veces una pestaña, se acumulen copias de la pantalla y permiten **recordar** en qué estado quedó cada pestaña.

## Resumen de la navegación

| Quiero… | Código |
|---|---|
| Ir a otra pantalla | `nav.navigate("ruta")` |
| Volver | `nav.popBackStack()` |
| Pasar un dato | `nav.navigate("detalle/$id")` |
| Saber en qué pantalla estoy | `currentBackStackEntryAsState()` |

!!! note "Código de Android sin ejecutar aquí"
    Los fragmentos de esta unidad usan Jetpack Compose y no se han ejecutado en este entorno (hace falta el SDK y un emulador). Pruébalos siempre en tu proyecto; si algo no compila, suele faltar un `import`: pulsa **Alt+Enter** sobre el nombre en rojo.
