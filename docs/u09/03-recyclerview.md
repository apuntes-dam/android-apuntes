# 9.3 Listas con RecyclerView

`RecyclerView` es el `LazyColumn` clásico: reutiliza las vistas que salen de pantalla. Necesita tres cosas:

1. Un **layout para cada fila** (`item_contacto.xml`).
2. Un **Adapter** que rellena cada fila con sus datos.
3. Un **LayoutManager** que decide cómo se colocan (lista, cuadrícula).

## 1. El layout de la fila

```xml
<!-- res/layout/item_contacto.xml -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent" android:layout_height="wrap_content"
    android:orientation="vertical" android:padding="12dp">
    <TextView android:id="@+id/nombre" android:layout_width="wrap_content"
        android:layout_height="wrap_content" android:textStyle="bold" />
    <TextView android:id="@+id/telefono" android:layout_width="wrap_content"
        android:layout_height="wrap_content" />
</LinearLayout>
```

## 2. El adapter

```kotlin
data class Contacto(val nombre: String, val telefono: String)

class ContactoAdapter(private val datos: List<Contacto>) :
    RecyclerView.Adapter<ContactoAdapter.Fila>() {

    class Fila(val binding: ItemContactoBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(padre: ViewGroup, tipo: Int): Fila {
        val b = ItemContactoBinding.inflate(LayoutInflater.from(padre.context), padre, false)
        return Fila(b)
    }

    override fun onBindViewHolder(fila: Fila, posicion: Int) {
        val c = datos[posicion]
        fila.binding.nombre.text = c.nombre
        fila.binding.telefono.text = c.telefono
    }

    override fun getItemCount() = datos.size
}
```

| Método | Cuándo se llama |
|---|---|
| `onCreateViewHolder` | Cuando hace falta **crear** una fila nueva |
| `onBindViewHolder` | Cada vez que una fila se **rellena** con un dato |
| `getItemCount` | Para saber cuántos elementos hay |

## 3. Conectarlo

```xml
<androidx.recyclerview.widget.RecyclerView
    android:id="@+id/lista"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

```kotlin
binding.lista.layoutManager = LinearLayoutManager(this)
binding.lista.adapter = ContactoAdapter(contactos)
```

## Cuando los datos cambian

Con `ListAdapter` y `DiffUtil`, el adapter calcula solo qué filas cambiaron y las anima:

```kotlin
adapter.submitList(nuevaLista)
```

!!! info "Compose frente a RecyclerView"
    Con `LazyColumn` ([6.1](../u06/01-lazycolumn.md)) lo mismo se resuelve en una veintena de líneas y sin XML. Conocer `RecyclerView` sigue siendo necesario para mantener apps existentes.
