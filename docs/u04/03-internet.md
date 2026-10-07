# 4.3 Imágenes de internet

Las imágenes que no van dentro de la app (fotos de usuarios, productos…) se descargan al mostrarlas. Hacerlo a mano es complicado (hilos, caché, memoria), así que se usa una librería: **Coil**.

## Preparar el proyecto

1. Dependencia en `build.gradle.kts` del módulo `app`:

```kotlin
implementation("io.coil-kt.coil3:coil-compose:3.0.4")
implementation("io.coil-kt.coil3:coil-network-okhttp:3.0.4")
```

Coil 3 es la versión actual y funciona también en Compose Multiplatform. La segunda línea es el *motor de red* que descarga las imágenes.

2. Permiso de internet en `AndroidManifest.xml`, **antes** de `<application>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

!!! tip "Comprueba la versión"
    El número de versión cambia con frecuencia: mira la última en la documentación de Coil. Con la versión antigua (Coil 2) la dependencia era `io.coil-kt:coil-compose` y el `import` de `AsyncImage` distinto.

## Mostrar la imagen

Importa `coil3.compose.AsyncImage`.

```kotlin
AsyncImage(
    model = "https://ejemplo.com/foto.jpg",
    contentDescription = "Foto del producto",
    contentScale = ContentScale.Crop,
    modifier = Modifier.size(150.dp).clip(RoundedCornerShape(12.dp))
)
```

## Mientras carga y si falla

```kotlin
AsyncImage(
    model = "https://ejemplo.com/foto.jpg",
    contentDescription = "Foto",
    placeholder = painterResource(R.drawable.cargando),
    error = painterResource(R.drawable.sin_imagen)
)
```

* `placeholder`: se ve mientras descarga.
* `error`: se ve si no hay red o la dirección falla.

## Ideas clave

* Coil guarda las imágenes en **caché**: la segunda vez no se vuelven a descargar.
* Usa siempre `https`. Android bloquea por defecto las direcciones `http` sin cifrar.
* Una app que muestra internet debe contemplar el caso **sin conexión**.
