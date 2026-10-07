# 4.1 Imágenes del proyecto

## Dónde se guardan

Las imágenes de la app viven en `app/src/main/res/drawable/`. Para añadir una, **arrástrala** a esa carpeta en Android Studio (o usa *Resource Manager → Import Drawables*).

!!! warning "Reglas para el nombre del archivo"
    Solo minúsculas, números y guion bajo (`_`), sin espacios ni tildes y sin empezar por número: `foto_perfil.png` sí; `Foto Perfil.PNG` no.

## Mostrarla con Image

```kotlin
Image(
    painter = painterResource(id = R.drawable.foto_perfil),
    contentDescription = "Foto de perfil de Ana",
    modifier = Modifier.size(120.dp)
)
```

* `R.drawable.foto_perfil` es la referencia al archivo, **sin extensión**.
* `contentDescription` es el texto que leen los lectores de pantalla (accesibilidad). Si la imagen es solo decorativa, pasa `null`.

## Cómo se ajusta: contentScale

| Valor | Resultado |
|---|---|
| `Fit` | Se ve entera, puede dejar huecos |
| `Crop` | Llena el espacio y recorta lo que sobra |
| `FillBounds` | Se estira (deforma) |
| `Inside` | Como `Fit`, pero nunca la agranda |

```kotlin
Image(
    painter = painterResource(R.drawable.paisaje),
    contentDescription = null,
    contentScale = ContentScale.Crop,
    modifier = Modifier.fillMaxWidth().height(180.dp)
)
```

## Imagen circular

```kotlin
Image(
    painter = painterResource(R.drawable.foto_perfil),
    contentDescription = "Foto de perfil",
    contentScale = ContentScale.Crop,
    modifier = Modifier.size(96.dp).clip(CircleShape).border(2.dp, Color.Gray, CircleShape)
)
```

## Imagen como fondo

Con un `Box`, la imagen va primero y el contenido encima:

```kotlin
Box(Modifier.fillMaxSize()) {
    Image(painterResource(R.drawable.fondo), null, Modifier.fillMaxSize(), contentScale = ContentScale.Crop)
    Text("Bienvenido", Modifier.align(Alignment.Center), color = Color.White, fontSize = 32.sp)
}
```

## Formatos y tamaño

* **PNG**: con transparencia. **JPG**: fotos, pesa menos.
* **WebP**: pesa menos que ambos; Android Studio convierte con clic derecho → *Convert to WebP*.
* Una foto de 4000 píxeles de ancho gasta mucha memoria: reduce su tamaño antes de añadirla.
