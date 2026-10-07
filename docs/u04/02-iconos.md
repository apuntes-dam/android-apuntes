# 4.2 Iconos

Un **icono** es una imagen vectorial pequeña y nítida a cualquier tamaño.

## Iconos de Material

Compose incluye un conjunto básico en `Icons.Default`:

```kotlin
Icon(Icons.Default.Home, contentDescription = "Inicio")
Icon(Icons.Default.Favorite, contentDescription = "Favorito", tint = Color.Red)
Icon(Icons.Default.Settings, contentDescription = "Ajustes", modifier = Modifier.size(32.dp))
```

Para el catálogo completo añade la dependencia `androidx.compose.material:material-icons-extended`.

## Icono con texto en un botón

```kotlin
Button(onClick = { }) {
    Icon(Icons.Default.Add, contentDescription = null)
    Spacer(Modifier.width(8.dp))
    Text("Añadir tarea")
}
```

## Tus propios iconos: Vector Asset

1. Clic derecho en `res/drawable` → **New → Vector Asset**.
2. Elige **Clip Art** (catálogo de Material) o **Local file** para importar un `.svg`.
3. Se genera un `.xml` que se usa con `painterResource` o `ImageVector.vectorResource`:

```kotlin
Icon(painterResource(R.drawable.ic_mascota), contentDescription = "Mascota")
```

## Iconos con estado

```kotlin
var favorito by remember { mutableStateOf(false) }
IconButton(onClick = { favorito = !favorito }) {
    Icon(
        imageVector = if (favorito) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
        contentDescription = if (favorito) "Quitar de favoritos" else "Añadir a favoritos",
        tint = if (favorito) Color.Red else Color.Gray
    )
}
```
