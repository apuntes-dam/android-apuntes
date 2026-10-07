# 5.1 Campos de texto

`TextField` muestra una caja donde se escribe. Es un componente **sin memoria**: tú le das el valor y él te avisa de cada cambio.

```kotlin
var nombre by remember { mutableStateOf("") }

OutlinedTextField(
    value = nombre,
    onValueChange = { nombre = it },
    label = { Text("Nombre") },
    singleLine = true
)
```

Si olvidas actualizar `nombre` en `onValueChange`, **no podrás escribir nada**: lo que se ve es siempre el `value`.

## Variantes

| Composable | Aspecto |
|---|---|
| `TextField` | Relleno |
| `OutlinedTextField` | Con borde |

## Parámetros útiles

```kotlin
OutlinedTextField(
    value = correo,
    onValueChange = { correo = it },
    label = { Text("Correo") },
    placeholder = { Text("nombre@ejemplo.com") },
    leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Next),
    modifier = Modifier.fillMaxWidth()
)
```

* `keyboardType`: `Text`, `Number`, `Email`, `Phone`, `Password`… cambia el teclado que sale.
* `imeAction`: el botón de la esquina del teclado (`Next`, `Done`, `Search`).
* `maxLines`, `minLines`: para texto largo.

## Contraseña

```kotlin
var clave by remember { mutableStateOf("") }
var ver by remember { mutableStateOf(false) }

OutlinedTextField(
    value = clave,
    onValueChange = { clave = it },
    label = { Text("Contraseña") },
    visualTransformation = if (ver) VisualTransformation.None else PasswordVisualTransformation(),
    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
    trailingIcon = {
        IconButton(onClick = { ver = !ver }) {
            Icon(if (ver) Icons.Default.VisibilityOff else Icons.Default.Visibility, contentDescription = "Mostrar u ocultar")
        }
    }
)
```

(`Visibility` está en el paquete de iconos extendidos.)
