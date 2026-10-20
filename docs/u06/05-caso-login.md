# 6.5 Caso práctico: login con navegación

Vas a montar una app de **dos pantallas**: una de acceso con usuario y contraseña y otra de bienvenida. Si los datos son correctos se entra; si no, se avisa. Junta lo de las unidades 5 (campos y validación) y 6 (navegación).

!!! warning "Solo para aprender"
    Comparar la contraseña dentro de la app es válido para practicar, pero en una app real **nunca** se hace así: la comprobación la hace un servidor.

## Plan

1. Dos rutas: `"login"` y `"bienvenida"`.
2. La pantalla de login guarda usuario, contraseña y si hay error (tres estados).
3. Al pulsar **Entrar**, si los datos son correctos navega; si no, marca el error.
4. La bienvenida tiene un botón para **cerrar sesión** y volver.

## Paso 1: las dos pantallas, sin saber nada de la navegación

Cada pantalla recibe **lambdas** para avisar de lo que ocurre, en vez de recibir el `NavController`. Así no dependen de la navegación y son fáciles de probar y de reutilizar.

```kotlin
@Composable
fun PantallaLogin(onEntrar: () -> Unit) {
    var usuario by remember { mutableStateOf("") }
    var clave by remember { mutableStateOf("") }
    var error by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier.fillMaxSize().padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        OutlinedTextField(
            value = usuario,
            onValueChange = { usuario = it; error = false },
            label = { Text("Usuario") },
            isError = error,
            singleLine = true
        )
        Spacer(Modifier.height(12.dp))
        OutlinedTextField(
            value = clave,
            onValueChange = { clave = it; error = false },
            label = { Text("Contraseña") },
            visualTransformation = PasswordVisualTransformation(),
            isError = error,
            singleLine = true
        )
        if (error) {
            Text("Usuario o contraseña incorrectos", color = MaterialTheme.colorScheme.error)
        }
        Spacer(Modifier.height(16.dp))
        Button(onClick = {
            if (usuario == "admin" && clave == "1234") onEntrar() else error = true
        }) { Text("Entrar") }
    }
}

@Composable
fun PantallaBienvenida(usuario: String, onSalir: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("¡Hola, $usuario!", style = MaterialTheme.typography.headlineMedium)
        Spacer(Modifier.height(16.dp))
        OutlinedButton(onClick = onSalir) { Text("Cerrar sesión") }
    }
}
```

Al escribir se hace `error = false`, para que el rojo desaparezca en cuanto el usuario corrige.

## Paso 2: conectar con el `NavHost`

```kotlin
@Composable
fun AppNavegacion() {
    val nav = rememberNavController()
    NavHost(navController = nav, startDestination = "login") {
        composable("login") {
            PantallaLogin(onEntrar = {
                nav.navigate("bienvenida") {
                    popUpTo("login") { inclusive = true }   // el botón Atrás no vuelve al login
                }
            })
        }
        composable("bienvenida") {
            PantallaBienvenida(usuario = "admin", onSalir = {
                nav.navigate("login") {
                    popUpTo("bienvenida") { inclusive = true }
                }
            })
        }
    }
}
```

Y en la actividad: `setContent { AppNavegacion() }`.

## Qué hace `popUpTo`

Sin él, al entrar la pila de pantallas sería *login → bienvenida*, y el botón **Atrás** del móvil llevaría de vuelta al formulario con la sesión abierta. `popUpTo("login") { inclusive = true }` **saca el login de la pila** al navegar, así que Atrás cierra la app en vez de volver. Para una pantalla de detalle sí querrías volver atrás y no lo usarías (mira [6.3](03-navegacion.md)).

## Qué has practicado

* Estado en el formulario (`remember`) y validación (`isError`) → [unidad 5](../u05/index.md).
* Contraseña oculta con `PasswordVisualTransformation` → [5.1](../u05/01-textfield.md).
* `NavHost`, rutas y pila → [6.3](03-navegacion.md).
* Pantallas que reciben **lambdas** en vez del `NavController`: el estado y la navegación quedan separados.
