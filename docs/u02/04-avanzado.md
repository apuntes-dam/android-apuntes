# 2.4 Para ir más allá

## Elevar el estado (*state hoisting*)

Un composable **sin estado propio** es más fácil de reutilizar y de probar. En vez de guardar el contador dentro, recibe el valor y un evento:

```kotlin
@Composable
fun ContadorPantalla() {
    var cuenta by rememberSaveable { mutableStateOf(0) }
    ContadorVista(cuenta = cuenta, alSumar = { cuenta++ })
}

@Composable
fun ContadorVista(cuenta: Int, alSumar: () -> Unit) {
    Column {
        Text("Pulsaciones: $cuenta")
        Button(onClick = alSumar) { Text("Sumar") }
    }
}
```

El patrón se resume como **«el estado baja, los eventos suben»**: el padre guarda el valor y se lo pasa al hijo; el hijo avisa con una lambda.

## derivedStateOf

Para un valor que se calcula a partir de otro estado y no quieres recalcular en cada recomposición:

```kotlin
val esPar by remember { derivedStateOf { cuenta % 2 == 0 } }
```

## Efectos secundarios

Cuando hay que hacer algo *fuera* del dibujo (mostrar un mensaje al cambiar un valor, lanzar una corrutina):

```kotlin
LaunchedEffect(cuenta) {
    if (cuenta == 10) Log.d("APP", "¡Llegaste a 10!")
}
```

`LaunchedEffect` se ejecuta cuando entra en pantalla y cada vez que cambia su clave (`cuenta`).

!!! info "Más adelante"
    En la [U8](../u08/index.md) verás cómo mover el estado a un `ViewModel` para que sobreviva a cualquier cambio de configuración.
