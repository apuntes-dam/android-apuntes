# A8 · Ejercicios avanzados

<div class="ej-gate" data-unit="u08" data-nombre="U8 · Avanzado"></div>

Estos ejercicios combinan varias unidades. Haz primero un esquema de las pantallas y de dónde vive el estado.

## Ejercicio A8.1

**Aparece y desaparece.** Un botón muestra y oculta un panel con `AnimatedVisibility`, con fundido y desplazamiento.

## Ejercicio A8.2

**Tarjeta que se despliega.** Una tarjeta con un texto largo que se expande al pulsar (`animateContentSize`) y gira una flecha (`animateFloatAsState`).

## Ejercicio A8.3

**Contador con ViewModel.** Mueve el contador de A2.5 a un `ViewModel` con `StateFlow`. Gira la pantalla y comprueba que se conserva sin usar `rememberSaveable`.

<details class="sol" data-key="android/u08/A8.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>class ContadorViewModel : ViewModel() {
    private val _cuenta = MutableStateFlow(0)
    val cuenta: StateFlow&lt;Int&gt; = _cuenta.asStateFlow()
    fun sumar() = _cuenta.update { it + 1 }
    fun restar() = _cuenta.update { if (it &gt; 0) it - 1 else 0 }
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A8.4

**Tareas con ViewModel.** Reescribe la app de tareas de la U6 con un `TareasViewModel`: añadir, marcar y borrar. La pantalla solo dibuja.

## Ejercicio A8.5

**Estados de carga.** Simula una carga con `delay(2000)` en el ViewModel y muestra los cuatro estados: cargando, error (aleatorio), vacío y con datos. Añade el botón «Reintentar».

## Ejercicio A8.6

**Datos de internet.** Con Retrofit y la API de pruebas `jsonplaceholder.typicode.com`, muestra la lista de títulos de `/posts` con su estado de carga y de error.

<details class="sol" data-key="android/u08/A8.6">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>data class Publicacion(val id: Int, val title: String, val body: String)
interface ApiService {
    @GET("posts")
    suspend fun publicaciones(): List&lt;Publicacion&gt;
}
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A8.7

**Ajuste que se recuerda.** Guarda con DataStore el interruptor «modo oscuro» y comprueba que se mantiene al cerrar y abrir la app.

## Ejercicio A8.8

⭐ **Reto: tareas con Room.** Guarda las tareas en una base de datos Room. Deben seguir ahí al reiniciar el móvil.

## Ejercicio A8.9

⭐ **Reto: gráfica.** Con `Canvas`, dibuja un gráfico de barras con los valores de una lista. Añade una animación para que las barras crezcan al abrir la pantalla.
