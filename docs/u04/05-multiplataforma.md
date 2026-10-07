# 4.5 Imágenes en Compose Multiplatform

Si tu proyecto es multiplataforma (por ejemplo, el creado con el asistente de JetBrains), las imágenes **no** van en `res/drawable`.

## Paso a paso

1. Copia las imágenes (por ejemplo `foto1.png`, `foto2.png`, `foto3.png`) en:

   `shared/src/commonMain/composeResources/drawable/`

   Nombres en **minúsculas**, sin espacios, guiones ni tildes.
2. Reconstruye el proyecto: **Build → Rebuild Project**. Se genera la clase `Res` con un acceso por imagen: `Res.drawable.foto1`, `Res.drawable.foto2`…
3. Úsalas con `Image` y `painterResource`:

```kotlin
import org.jetbrains.compose.resources.painterResource
// y los imports de Res y de cada imagen (Alt+Enter los añade)

@Composable
fun Galeria() {
    Image(
        painter = painterResource(Res.drawable.foto1),
        contentDescription = "Foto 1 de la galería",
        modifier = Modifier.size(240.dp)
    )
}
```

!!! warning "Errores típicos"
    * *Unresolved reference `Res`*: no has reconstruido el proyecto o el archivo está en el módulo equivocado (debe estar en `shared`).
    * *Unresolved reference `foto1`*: el archivo tiene un nombre no válido o falta el `import` de la imagen.

## Mostrar y ocultar

Se guarda en una variable de estado si la imagen es visible y un `if` decide qué dibujar:

```kotlin
var visible by remember { mutableStateOf(true) }

if (visible) {
    Image(painterResource(Res.drawable.foto1), contentDescription = "Foto", modifier = Modifier.size(240.dp))
} else {
    Text("(imagen oculta)")
}

Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
    Button(onClick = { visible = true }) { Text("Mostrar") }
    Button(onClick = { visible = false }) { Text("Ocultar") }
    Button(onClick = { visible = !visible }) { Text(if (visible) "Ocultar" else "Mostrar") }   // alternar
}
```

El tercer botón es un **interruptor** (*toggle*): invierte el valor y, como el texto depende del estado, su etiqueta cambia sola.

## Una galería con selector

Se guarda **qué foto** se muestra y un `when` elige el recurso:

```kotlin
var actual by remember { mutableIntStateOf(1) }

val foto = when (actual) {
    1 -> Res.drawable.foto1
    2 -> Res.drawable.foto2
    else -> Res.drawable.foto3
}
Image(painterResource(foto), contentDescription = "Foto $actual de la galería", modifier = Modifier.size(240.dp))

Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceEvenly) {
    Button(onClick = { actual = 1 }) { Text("Foto 1") }
    Button(onClick = { actual = 2 }) { Text("Foto 2") }
    Button(onClick = { actual = 3 }) { Text("Foto 3") }
}
```

`mutableIntStateOf` es una versión de `mutableStateOf` pensada para enteros: evita convertir el número a objeto y es un poco más eficiente.

!!! note "Código de Android sin ejecutar aquí"
    Los fragmentos de esta unidad usan Jetpack Compose y no se han ejecutado en este entorno (hace falta el SDK y un emulador). Pruébalos siempre en tu proyecto; si algo no compila, suele faltar un `import`: pulsa **Alt+Enter** sobre el nombre en rojo.
