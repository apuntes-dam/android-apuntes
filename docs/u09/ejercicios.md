# A9 · Ejercicios de vistas XML

<div class="ej-gate" data-unit="u09" data-nombre="U9 · Vistas XML clásicas"></div>

Estos ejercicios usan **XML y ViewBinding**, no Compose. Crea un proyecto nuevo con la plantilla *Empty Views Activity*.

## Ejercicio A9.1

**Hola en XML.** Un `LinearLayout` vertical con un `TextView` y un `Button`. Al pulsar, el texto cambia (usa ViewBinding).

<details class="sol" data-key="android/u09/A9.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>&lt;!-- res/layout/activity_main.xml --&gt;
&lt;LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A9.2

**Perfil con ConstraintLayout.** Una foto circular a la izquierda, nombre y curso a su derecha y un botón «Seguir» debajo que ocupe todo el ancho. Sin anidar layouts.

## Ejercicio A9.3

**Formulario.** `EditText` de nombre, `CheckBox`, `RadioGroup` con dos opciones y un botón que muestre un resumen en un `TextView`.

## Ejercicio A9.4

**Mensajes.** Haz que el botón del ejercicio anterior muestre primero un `Toast` y después un `Snackbar` con acción «Deshacer».

## Ejercicio A9.5

**Lista con RecyclerView.** Una lista de 20 contactos con `Adapter`, `ViewHolder` y un layout de fila con dos textos.

<details class="sol" data-key="android/u09/A9.5">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class Contacto(val nombre: String, val telefono: String)
class ContactoAdapter(private val datos: List&lt;Contacto&gt;) :
    RecyclerView.Adapter&lt;ContactoAdapter.Fila&gt;() {
    class Fila(val binding: ItemContactoBinding) : RecyclerView.ViewHolder(binding.root)
    override fun onCreateViewHolder(padre: ViewGroup, tipo: Int): Fila =
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A9.6

**Menú.** Añade a tu app un menú de opciones con «Ajustes» (dentro del menú) y «Buscar» (como icono). Muestra un `Toast` con la opción elegida.

## Ejercicio A9.7

⭐ **Reto: dos pantallas.** Una `Activity` con una lista y otra de detalle. Al pulsar una fila, abre el detalle con un `Intent` pasando el nombre y el teléfono.

## Ejercicio A9.8

⭐ **Reto: Compose dentro de XML.** Añade un `ComposeView` a uno de tus layouts XML y muestra en él un contador hecho con Compose. Explica en qué casos te interesaría mezclar ambos enfoques.
