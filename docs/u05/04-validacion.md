# 5.4 Validación y formularios completos

Validar es comprobar que lo que escribió el usuario tiene sentido **antes** de usarlo. Hazlo al instante y explica el error con claridad.

## Mostrar el error en el campo

```kotlin
var correo by remember { mutableStateOf("") }
val esValido = correo.contains("@") && correo.contains(".")
val hayError = correo.isNotEmpty() && !esValido

OutlinedTextField(
    value = correo,
    onValueChange = { correo = it },
    label = { Text("Correo") },
    isError = hayError,
    supportingText = { if (hayError) Text("Escribe un correo válido") }
)
```

`isError` pone el campo en rojo y `supportingText` escribe el mensaje debajo.

## Un formulario entero

```kotlin
@Composable
fun Registro() {
    var nombre by remember { mutableStateOf("") }
    var edad by remember { mutableStateOf("") }
    var acepto by remember { mutableStateOf(false) }

    val edadNum = edad.toIntOrNull()
    val edadOk = edadNum != null && edadNum in 16..99
    val todoOk = nombre.isNotBlank() && edadOk && acepto

    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        OutlinedTextField(nombre, { nombre = it }, label = { Text("Nombre") }, modifier = Modifier.fillMaxWidth())
        OutlinedTextField(
            edad, { edad = it.filter(Char::isDigit) }, label = { Text("Edad") },
            isError = edad.isNotEmpty() && !edadOk,
            supportingText = { if (edad.isNotEmpty() && !edadOk) Text("Entre 16 y 99") },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
            modifier = Modifier.fillMaxWidth()
        )
        Row(verticalAlignment = Alignment.CenterVertically) {
            Checkbox(acepto, { acepto = it }); Text("Acepto las condiciones")
        }
        Button(onClick = { /* enviar */ }, enabled = todoOk, modifier = Modifier.fillMaxWidth()) { Text("Registrarme") }
    }
}
```

Observa tres ideas:

1. `toIntOrNull()` convierte sin que la app se cierre si el texto no es un número.
2. El botón se **activa solo** cuando todo es correcto.
3. `filter(Char::isDigit)` impide escribir letras en la edad.

## Buenas prácticas de formularios

* Pon una **etiqueta** en cada campo; el `placeholder` desaparece al escribir y no la sustituye.
* No muestres errores antes de que el usuario haya escrito nada.
* Elige el **teclado adecuado** (`Email`, `Number`, `Phone`).
* Usa `ImeAction.Next` para pasar de campo en campo y `Done` en el último.
* Un error debe decir **cómo arreglarlo**, no solo «inválido».

!!! info "Para ir más allá"
    Con muchos campos, agrupa el estado en una `data class FormState(...)` y guárdala en un `ViewModel` ([U8](../u08/index.md)).

!!! note "Código de Android sin ejecutar aquí"
    Los fragmentos de esta unidad usan Jetpack Compose y no se han ejecutado en este entorno (hace falta el SDK y un emulador). Pruébalos siempre en tu proyecto; si algo no compila, suele faltar un `import`: pulsa **Alt+Enter** sobre el nombre en rojo.
