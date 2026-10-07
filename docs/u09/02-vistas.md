# 9.2 Botones, texto e imágenes en XML

## Las vistas básicas

| Vista | Para qué | Equivale en Compose |
|---|---|---|
| `TextView` | Mostrar texto | `Text` |
| `Button` | Botón | `Button` |
| `EditText` | Escribir texto | `TextField` |
| `ImageView` | Imagen | `Image` |
| `CheckBox`, `Switch`, `RadioButton` | Opciones | Igual nombre |
| `SeekBar` | Deslizador | `Slider` |
| `Spinner` | Lista desplegable | `DropdownMenu` |

## Imagen y botón con icono

```xml
<ImageView
    android:id="@+id/foto"
    android:layout_width="120dp"
    android:layout_height="120dp"
    android:src="@drawable/foto_perfil"
    android:scaleType="centerCrop"
    android:contentDescription="Foto de perfil" />

<com.google.android.material.button.MaterialButton
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="Añadir"
    app:icon="@drawable/ic_add" />
```

`scaleType` es el equivalente de `contentScale`: `centerCrop`, `fitCenter`, `fitXY`.

## Conectar el XML con el código: ViewBinding

Para acceder a las vistas desde Kotlin sin `findViewById`, activa **ViewBinding** en `build.gradle.kts`:

```kotlin
android { buildFeatures { viewBinding = true } }
```

Se genera una clase por layout (`activity_main.xml` → `ActivityMainBinding`):

```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.botonPulsar.setOnClickListener {
            binding.textoSaludo.text = "Hola, ${binding.campoNombre.text}"
        }
    }
}
```

* `botonPulsar` sale del `android:id="@+id/botonPulsar"` del XML.
* `setOnClickListener { }` es el equivalente del `onClick` de Compose.
* Lees un `EditText` con `.text.toString()`.

## Mensajes

```kotlin
Toast.makeText(this, "Guardado", Toast.LENGTH_SHORT).show()
Snackbar.make(binding.root, "Tarea borrada", Snackbar.LENGTH_LONG).setAction("Deshacer") { restaurar() }.show()
```

## Estilos y temas en XML

Los colores y estilos se definen en `res/values/themes.xml` y `colors.xml` y se aplican con `style="@style/..."` o `android:theme`. Es la versión XML del tema de Material de la [U7](../u07/index.md).
