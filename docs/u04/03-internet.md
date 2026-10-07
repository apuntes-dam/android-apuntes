# 4.3 Imágenes de internet

Las imágenes que no van dentro de la app (fotos de usuarios, productos…) se descargan al mostrarlas. Hacerlo a mano es complicado (hilos, caché, memoria), así que se usa una librería: **Coil**.

## Preparar el proyecto

1. Dependencia en `build.gradle.kts` del módulo `app`:

```kotlin
implementation("io.coil-kt:coil-compose:2.7.0")
```

2. Permiso de internet en `AndroidManifest.xml`, **antes** de `<application>`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

!!! tip "Comprueba la versión"
    La versión de la librería cambia con frecuencia. Mira la última en la documentación de Coil o deja que Android Studio te sugiera una actualización.

## Mostrar la imagen

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
