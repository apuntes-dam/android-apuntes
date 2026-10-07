# 9.4 Menús, Activities y Fragments

## Menú de opciones

Un menú se define en XML (`res/menu/menu_principal.xml`):

```xml
<menu xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">
    <item android:id="@+id/accion_ajustes" android:title="Ajustes"
        app:showAsAction="never" />
    <item android:id="@+id/accion_buscar" android:title="Buscar"
        android:icon="@drawable/ic_search" app:showAsAction="ifRoom" />
</menu>
```

Y se enlaza en la Activity:

```kotlin
override fun onCreateOptionsMenu(menu: Menu): Boolean {
    menuInflater.inflate(R.menu.menu_principal, menu)
    return true
}

override fun onOptionsItemSelected(item: MenuItem): Boolean = when (item.itemId) {
    R.id.accion_ajustes -> { abrirAjustes(); true }
    R.id.accion_buscar -> { buscar(); true }
    else -> super.onOptionsItemSelected(item)
}
```

`showAsAction="ifRoom"` lo muestra como icono en la barra si cabe; `never`, dentro del menú de tres puntos.

## Varias Activities

Cada pantalla puede ser una `Activity`. Para abrir otra, se usa un **Intent**:

```kotlin
val intent = Intent(this, DetalleActivity::class.java)
intent.putExtra("id", 7)
startActivity(intent)
```

Y en la nueva actividad:

```kotlin
val id = intent.getIntExtra("id", 0)
```

Cada Activity nueva debe estar declarada en el `AndroidManifest.xml` (Android Studio lo hace al crearla con el asistente).

### Intents implícitos

También se pueden pedir acciones a **otras apps**:

```kotlin
startActivity(Intent(Intent.ACTION_VIEW, Uri.parse("https://developer.android.com")))   // abrir web
startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:600123456")))                    // marcar
```

## Fragments

Un **Fragment** es una parte reutilizable de una pantalla, con su propio layout y su propio ciclo de vida. Hoy lo habitual es **una sola Activity** que cambia de Fragment, con el **componente Navigation** (el equivalente en XML de lo que ya viste en la [U6](../u06/index.md)).

```kotlin
class InicioFragment : Fragment(R.layout.fragment_inicio) {
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val binding = FragmentInicioBinding.bind(view)
        binding.botonDetalle.setOnClickListener {
            findNavController().navigate(R.id.action_inicio_to_detalle)
        }
    }
}
```

Las pantallas y sus conexiones se dibujan en un **grafo de navegación** (`res/navigation/nav_graph.xml`) con un editor visual.

## Compose y XML a la vez

No hay que elegir una vez para siempre. Se pueden mezclar:

```kotlin
// Compose dentro de una pantalla XML
<androidx.compose.ui.platform.ComposeView android:id="@+id/compose" ... />
binding.compose.setContent { Text("Esto es Compose") }

// Una vista XML dentro de Compose
AndroidView(factory = { contexto -> TextView(contexto).apply { text = "Vista clásica" } })
```

Así se puede migrar una app antigua **poco a poco**.
