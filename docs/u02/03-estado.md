# 2.3 Estado: la pantalla que cambia

Si pulsas un botón y quieres que cambie un texto, necesitas **estado**: un valor que, al cambiar, hace que Compose **vuelva a dibujar** lo que depende de él (se llama *recomposición*).

```kotlin
@Composable
fun Contador() {
    var cuenta by remember { mutableStateOf(0) }

    Column {
        Text("Pulsaciones: $cuenta")
        Button(onClick = { cuenta++ }) {
            Text("Sumar")
        }
    }
}
```

* `mutableStateOf(0)` crea un valor observable.
* `remember { }` lo **recuerda** entre recomposiciones; sin `remember`, la variable volvería a 0 cada vez que se redibuja.
* `by` permite usar `cuenta` directamente en lugar de `cuenta.value`.

## ¿Y si giro la pantalla?

Al girar el móvil la *activity* se destruye y se crea de nuevo, y `remember` pierde su valor. Para sobrevivir al giro se usa `rememberSaveable`:

```kotlin
var cuenta by rememberSaveable { mutableStateOf(0) }
```

| Función | Sobrevive a recomposición | Sobrevive al giro |
|---|---|---|
| `remember` | Sí | No |
| `rememberSaveable` | Sí | Sí |

## Reglas de oro

1. La interfaz es **una función del estado**: cambia el estado y la pantalla se actualiza sola. No se modifica la vista a mano.
2. Un composable no debe tener efectos secundarios en su cuerpo (no hagas peticiones de red ahí).
3. Guarda en el estado solo lo mínimo; lo que se puede calcular, se calcula.

!!! example "Ejemplo: alternar un texto"
    ```kotlin
    var visible by remember { mutableStateOf(true) }
    Button(onClick = { visible = !visible }) { Text(if (visible) "Ocultar" else "Mostrar") }
    if (visible) Text("¡Hola!")
    ```

!!! note "Código de Android sin ejecutar aquí"
    Los fragmentos de esta unidad usan Jetpack Compose y no se han ejecutado en este entorno (hace falta el SDK y un emulador). Pruébalos siempre en tu proyecto; si algo no compila, suele faltar un `import`: pulsa **Alt+Enter** sobre el nombre en rojo.
