# A7 · Ejercicios de temas, recursos y accesibilidad

<div class="ej-gate" data-unit="u07" data-nombre="U7 · Temas y accesibilidad"></div>

Trabaja sobre una de las apps que ya has hecho (por ejemplo, la lista de tareas de la U6).

## Ejercicio A7.1

**Mis colores.** Elige un color de marca y define un esquema claro y otro oscuro en `Theme.kt`. Cambia los colores de la app **sin tocar ninguna pantalla**.

<details class="sol" data-key="android/u07/A7.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>// Color.kt
val Marca40 = Color(0xFF00695C)
val Marca80 = Color(0xFF80CBC4)
// Theme.kt
private val EsquemaClaro = lightColorScheme(
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A7.2

**Tipografía.** Descarga una fuente libre, ponla en `res/font` y úsala en los títulos de la app mediante `Typography`.

## Ejercicio A7.3

**Todo en strings.xml.** Mueve todos los textos visibles de una pantalla a `strings.xml` y usa `stringResource`. Incluye uno con un parámetro (`%1$s`).

<details class="sol" data-key="android/u07/A7.3">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>&lt;!-- res/values/strings.xml --&gt;
&lt;resources&gt;
    &lt;string name="app_name"&gt;Mis tareas&lt;/string&gt;
    &lt;string name="titulo_lista"&gt;Tus tareas&lt;/string&gt;
    &lt;string name="saludo"&gt;Hola, %1$s&lt;/string&gt;
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A7.4

**Traducción.** Añade `values-en/strings.xml` y cambia el idioma del emulador para comprobar que la app se traduce. Añade un plural («1 tarea» / «3 tareas»).

## Ejercicio A7.5

**Modo oscuro.** Prueba tu app en modo oscuro. Anota **tres** cosas que se vean mal (texto ilegible, imágenes…) y corrígelas.

## Ejercicio A7.6

**Auditoría de accesibilidad.** Revisa tu app con la lista de comprobación de la unidad: describe imágenes, comprueba el tamaño de los botones y sube la letra del sistema al máximo. Escribe qué has arreglado.

## Ejercicio A7.7

⭐ **Reto: TalkBack.** Activa TalkBack y completa una tarea en tu app sin mirar la pantalla. Anota los puntos donde te perdiste y corrígelos.

## Ejercicio A7.8

⭐ **Reto: wireframes.** Diseña en papel o en Figma las pantallas de una app de tu elección (mínimo 4) con su mapa de navegación. Incluye los estados *vacío*, *cargando* y *error* de una de ellas.
