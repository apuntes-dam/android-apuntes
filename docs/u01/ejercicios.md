# A1 · Ejercicios de tecnologías móviles

<div class="ej-gate" data-unit="u01" data-nombre="U1 · Tecnologías para dispositivos móviles"></div>

## Ejercicio A1.1 · Limitaciones

Elige una app que uses a diario y enumera **cinco limitaciones** del móvil que sus desarrolladores han tenido que tener en cuenta (batería, red, pantalla…). Explica cómo crees que las resuelve.

## Ejercicio A1.2 · Android frente a iOS

Haz una tabla comparando Android e iOS en: fabricantes, lenguaje, entorno de desarrollo, tienda, fragmentación y requisitos de equipo. Indica qué sistema elegirías para una app solo para tu instituto y por qué.

## Ejercicio A1.3 · Nativo o multiplataforma

Para cada caso, razona si harías la app **nativa** o **multiplataforma** y con qué tecnología: (a) un juego 3D muy exigente, (b) una app de horarios para un instituto, (c) una app bancaria con huella dactilar, (d) una tienda online que también debe funcionar en la web.

## Ejercicio A1.4 · Instalar Android Studio

Instala Android Studio, abre **SDK Manager** y anota qué versión de Android (API level) tienes instalada y cuánto ocupa el SDK. Haz una captura de la pantalla de bienvenida.

## Ejercicio A1.5 · Primer proyecto

Crea un proyecto **Empty Activity** con Compose llamado `HolaMovil`. Cambia el texto a `Hola, <tu nombre>` y ejecútalo. Explica qué hacen `onCreate` y `setContent`.

## Ejercicio A1.6 · Dispositivo virtual

Crea un AVD con un perfil de teléfono y otro con una tableta. Arranca ambos y compara cómo se ve tu app. Anota qué API level usa cada uno.

## Ejercicio A1.7 · Ciclo de vida

Añade mensajes con `Log.d` a los seis métodos del ciclo de vida de `MainActivity`. En Logcat, anota qué métodos se llaman al: abrir la app, pulsar *Inicio*, volver a la app, girar la pantalla y cerrarla. Dibuja el diagrama de estados resultante.

## Ejercicio A1.8 · Reto: el contador que no se pierde

Añade un botón `+` y un contador. Comprueba que al **girar la pantalla** el contador vuelve a 0. Arréglalo con `rememberSaveable` y explica por qué ocurría.

## Ejercicio A1.9

**Imperativo o declarativo.** Clasifica estos lenguajes o tecnologías: SQL, Kotlin, HTML, CSS, Java, Python, XML de layouts y Jetpack Compose. Para cada uno, una frase que justifique tu respuesta.

## Ejercicio A1.10

**Tres modelos.** Explica con tus palabras el modelo orientado a objetos, el basado en eventos y el basado en componentes, y pon un ejemplo de cada uno **dentro de una app de mensajería**.

## Ejercicio A1.11

**Verdadero o falso.** Razona cada respuesta: (a) Kotlin es de bajo nivel porque controla el hardware; (b) en un modelo declarativo describes el resultado, no los pasos; (c) una función `@Composable` es un componente reutilizable; (d) el código de la vista *Design* no se puede editar a mano.

## Ejercicio A1.12

**Tabla del entorno.** Rellena: ¿qué componente muestra texto?, ¿cuál es un botón con acción?, ¿cuál coloca elementos en horizontal?, ¿qué librería de interfaces usamos?, ¿qué IDE usamos?

## Ejercicio A1.13

**Licencias.** Busca la licencia de Android Studio, Gradle y MonoDevelop. ¿Alguna exige pagar? Anota la fuente.

## Ejercicio A1.14

**Recorrido por el IDE.** Identifica en tu Android Studio la *Toolbar*, las vistas *Code/Split/Design*, el *Component Tree* y el autocompletado. Haz una captura anotada y explica para qué sirve cada uno.

## Ejercicio A1.15

**Actividad frente a composable.** Escribe una tabla con tres diferencias entre una actividad y una función `@Composable`, y explica qué hace `setContent`. Usa la analogía que prefieras.

## Ejercicio A1.16

**Importar Material 3.** Explica la diferencia entre `import androidx.compose.material3.Button` e `import androidx.compose.material3.*`. ¿Cuál preferirías en un proyecto grande y por qué?

## Ejercicio A1.17

**Primer proyecto multiplataforma.** Genera un proyecto en **kmp.jetbrains.com** con Android y Desktop. Localiza los módulos `shared`, `androidApp` y `desktopApp`, ejecútalo en el emulador **y** en escritorio y haz una captura de ambos. Cambia el texto de `App()`.

## Ejercicio A1.18

**Fila con dos botones.** En `App()` coloca dos botones, «Aceptar» y «Cancelar», en una `Row` centrada en la pantalla y con 16 dp de separación. Explica por qué no hace falta tocar `MainActivity`.
<details class="sol" data-key="android/u01/A1.18">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun App() {
    MaterialTheme {
        Row(
            modifier = Modifier.fillMaxSize(),
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A1.19

⭐ **Previsualización.** Crea `Previews.kt` en el módulo `androidApp` con un `@Preview` de `App()`. Explica por qué no puede estar en `shared` y qué ventaja tiene sobre el emulador.
<details class="sol" data-key="android/u01/A1.19">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>// androidApp/src/main/kotlin/&lt;tu.paquete&gt;/Previews.kt
@Preview(showBackground = true)
@Composable
fun AppPreview() {
    App()
// ... (resto de la solución bloqueado)</code></pre></div>
</details>
