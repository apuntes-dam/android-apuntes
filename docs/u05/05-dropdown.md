# 5.5 Lista desplegable con ExposedDropdownMenuBox

En [5.3](03-dialogos.md) viste un menú desplegable simple con `DropdownMenu`, que se abre desde un botón. Para un **formulario** hay otro más natural: un **campo** que muestra la opción elegida y se despliega al tocarlo, como el selector de provincia de una web. Eso es `ExposedDropdownMenuBox`.

## Las tres piezas

1. `ExposedDropdownMenuBox`: el contenedor. Sabe si el menú está abierto (`expanded`) y avisa de los toques (`onExpandedChange`).
2. Un **campo de texto de solo lectura** que muestra la opción elegida. Lleva la flecha con `ExposedDropdownMenuDefaults.TrailingIcon`.
3. `ExposedDropdownMenu`: la lista con las opciones, cada una un `DropdownMenuItem`.

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SelectorCurso() {
    val cursos = listOf("1º DAM", "2º DAM", "1º ASIR", "2º ASIR")
    var abierto by remember { mutableStateOf(false) }
    var elegido by remember { mutableStateOf(cursos[0]) }

    ExposedDropdownMenuBox(
        expanded = abierto,
        onExpandedChange = { abierto = it }
    ) {
        OutlinedTextField(
            value = elegido,
            onValueChange = { },                       // el usuario no escribe
            readOnly = true,
            label = { Text("Curso") },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = abierto) },
            modifier = Modifier.menuAnchor()           // ancla el menú a este campo
        )
        ExposedDropdownMenu(
            expanded = abierto,
            onDismissRequest = { abierto = false }
        ) {
            cursos.forEach { curso ->
                DropdownMenuItem(
                    text = { Text(curso) },
                    onClick = { elegido = curso; abierto = false }
                )
            }
        }
    }
}
```

Dos estados: `abierto` (si la lista está desplegada) y `elegido` (la opción actual). Al pulsar una opción se guarda y se cierra.

!!! warning "`menuAnchor()` en versiones recientes"
    En las versiones recientes de Material 3, `Modifier.menuAnchor()` sin parámetros aparece como **obsoleto** y el IDE sugiere la variante con un tipo de ancla (para un campo de solo lectura, `PrimaryNotEditable`). El nombre exacto cambia entre versiones: si lo ves tachado, pulsa **Alt+Intro** y acepta la sugerencia. La estructura de las tres piezas es la misma.

## ¿Cuál uso, `DropdownMenu` o `ExposedDropdownMenuBox`?

| Necesito... | Uso |
|---|---|
| Un menú de acciones desde un botón o un icono (⋮) | `DropdownMenu` |
| **Elegir un valor** dentro de un formulario, mostrando el elegido en un campo | `ExposedDropdownMenuBox` |

## Guardar la opción en un formulario

Como cualquier otro campo, el valor elegido es **estado**. Si el formulario tiene varios selectores, saca cada uno a su propia función para no repetir el código:

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun Selector(etiqueta: String, opciones: List<String>, elegido: String, alElegir: (String) -> Unit) {
    var abierto by remember { mutableStateOf(false) }
    ExposedDropdownMenuBox(expanded = abierto, onExpandedChange = { abierto = it }) {
        OutlinedTextField(
            value = elegido, onValueChange = { }, readOnly = true,
            label = { Text(etiqueta) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = abierto) },
            modifier = Modifier.menuAnchor()
        )
        ExposedDropdownMenu(expanded = abierto, onDismissRequest = { abierto = false }) {
            opciones.forEach { o ->
                DropdownMenuItem(text = { Text(o) }, onClick = { alElegir(o); abierto = false })
            }
        }
    }
}
```

El selector **no guarda** la opción: la recibe (`elegido`) y avisa (`alElegir`). Quien lo usa es dueño del estado. Es el mismo patrón de «el estado sube» que verás con el `ViewModel`.
