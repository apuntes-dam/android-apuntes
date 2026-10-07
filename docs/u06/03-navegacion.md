# 6.3 Navegar entre pantallas

Una app con varias pantallas necesita un **controlador de navegación** que sabe en cuál estás y a dónde ir. Se usa la librería **Navigation Compose**.

## Dependencia

```kotlin
implementation("androidx.navigation:navigation-compose:2.8.0")
```

## Las tres piezas

1. **Rutas**: un nombre para cada pantalla.
2. **NavController**: el que cambia de pantalla.
3. **NavHost**: el contenedor que dibuja la pantalla actual.

```kotlin
@Composable
fun MiApp() {
    val nav = rememberNavController()

    NavHost(navController = nav, startDestination = "inicio") {
        composable("inicio") {
            PantallaInicio(alIrADetalle = { nav.navigate("detalle") })
        }
        composable("detalle") {
            PantallaDetalle(alVolver = { nav.popBackStack() })
        }
    }
}

@Composable
fun PantallaInicio(alIrADetalle: () -> Unit) {
    Column(Modifier.padding(16.dp)) {
        Text("Inicio")
        Button(onClick = alIrADetalle) { Text("Ver detalle") }
    }
}

@Composable
fun PantallaDetalle(alVolver: () -> Unit) {
    Column(Modifier.padding(16.dp)) {
        Text("Detalle")
        Button(onClick = alVolver) { Text("Volver") }
    }
}
```

## Cómo funciona la pila

* `navigate("detalle")` **apila** una pantalla encima.
* `popBackStack()` (o el botón *Atrás* del móvil) la **quita** y vuelves a la anterior.

!!! tip "Las pantallas no conocen al NavController"
    Fíjate en que `PantallaInicio` recibe una lambda (`alIrADetalle`) y no el `NavController`. Así la pantalla es reutilizable y se puede previsualizar sin navegación: es el mismo patrón de «estado abajo, eventos arriba».

## Rutas sin escribir texto a mano

Para evitar errores de escritura, agrupa las rutas en un `object`:

```kotlin
object Rutas {
    const val INICIO = "inicio"
    const val DETALLE = "detalle"
}
```

!!! note "Código de Android sin ejecutar aquí"
    Los fragmentos de esta unidad usan Jetpack Compose y no se han ejecutado en este entorno (hace falta el SDK y un emulador). Pruébalos siempre en tu proyecto; si algo no compila, suele faltar un `import`: pulsa **Alt+Enter** sobre el nombre en rojo.
