# 9.1 Layouts XML y ConstraintLayout

En el enfoque clásico, cada pantalla tiene dos partes:

* Un archivo **XML** en `res/layout/` que describe **cómo se ve**.
* Una clase **Activity** (o Fragment) en Kotlin que describe **qué hace**.

```kotlin
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)   // carga el XML
    }
}
```

## Un XML sencillo

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/saludo"
        android:textSize="24sp" />

    <Button
        android:id="@+id/botonPulsar"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="@string/boton_guardar" />
</LinearLayout>
```

## Tamaño: ancho y alto son obligatorios

| Valor | Significa |
|---|---|
| `match_parent` | Ocupa todo el espacio del padre |
| `wrap_content` | Lo justo para su contenido |
| `0dp` | «Que lo decida la restricción o el peso» |
| `120dp` | Tamaño fijo |

## Los layouts clásicos

| Layout | Equivale en Compose a |
|---|---|
| `LinearLayout` (`orientation`) | `Column` / `Row` |
| `FrameLayout` | `Box` |
| `ConstraintLayout` | `ConstraintLayout` |
| `ScrollView` | `verticalScroll` |

## ConstraintLayout

Es el layout recomendado: cada vista se **ancla** a otras o a los bordes, sin anidar layouts. Cada vista necesita al menos una restricción **horizontal** y una **vertical**:

```xml
<androidx.constraintlayout.widget.ConstraintLayout ...>
    <TextView
        android:id="@+id/titulo"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Título"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        android:layout_margin="16dp" />

    <Button
        android:id="@+id/aceptar"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:text="Aceptar"
        app:layout_constraintTop_toBottomOf="@id/titulo"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />
</androidx.constraintlayout.widget.ConstraintLayout>
```

Con `width = 0dp` y anclado a ambos lados, el botón **se estira** entre ellos.

!!! tip "Editor visual"
    En Android Studio abre el XML en la pestaña **Design**: puedes arrastrar vistas desde la paleta y trazar las restricciones con el ratón. Cambia a **Code** para ver el XML resultante.
