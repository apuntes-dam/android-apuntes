# 8. Interfaces: paradigmas y modelos

Una **interfaz de usuario** es todo lo que permite a una persona interactuar con un programa: lo que ve, lo que toca y lo que recibe como respuesta. Antes de escribir código conviene entender **cómo se piensa** una interfaz.

## Dos formas de describirla

| | Imperativo | Declarativo |
|---|---|---|
| **Idea** | Explicas **cómo** construirla, paso a paso | Explicas **qué** debe mostrarse |
| **Quién actualiza la pantalla** | Tú, a mano, cada vez que algo cambia | El sistema, al cambiar el estado |
| **Riesgo** | Olvidar actualizar algo y que la pantalla quede desincronizada | Más abstracto al principio |
| **Ejemplos** | Java, Kotlin, Python, Swing, vistas clásicas de Android | SQL, HTML, CSS, XML de layouts, Jetpack Compose |

El mismo texto en pantalla, de las dos formas:

```kotlin
// Imperativo (vistas clásicas): construyes y modificas el objeto
val texto = TextView(this)
texto.text = "Hola"
layout.addView(texto)
// y cuando cambia el dato, tú escribes: texto.text = contador.toString()

// Declarativo (Compose): describes el resultado
@Composable
fun Saludo() {
    Text("Hola")
}
```

En Compose se resume con la fórmula **UI = f(estado)**: la interfaz es una función del estado. No modificas la pantalla; cambias el estado y la pantalla se vuelve a dibujar sola.

!!! note "En la práctica se combinan"
    Incluso con vistas XML (declarativas) la lógica y los eventos se escriben en Kotlin (imperativo). Un lenguaje de programación suele ser imperativo; lo declarativo describe estructuras o resultados.

## Tres modelos para programar interfaces

| Modelo | Idea | En una interfaz |
|---|---|---|
| **Orientado a objetos** | El programa se compone de objetos con atributos y métodos que colaboran | Cada elemento (botón, texto) es un objeto |
| **Basado en eventos** | Algo externo ocurre y el programa **reacciona** | «Cuando se pulse el botón, haz esto» (`onClick`) |
| **Basado en componentes** | Se reutilizan piezas ya hechas y empaquetadas | Un `Button` o una tarjeta que usas en muchas pantallas |

Compose usa los tres: los componentes son funciones reutilizables, reaccionan a eventos y, por detrás, hay objetos.

## Lenguajes de alto nivel

Kotlin es un lenguaje de **alto nivel**: se compila a *bytecode* que ejecuta una máquina virtual (la JVM en el escritorio, **ART** en Android). No controla el hardware directamente, lo hace el sistema operativo.

## Licencias de las herramientas

| Herramienta | Qué es | Licencia |
|---|---|---|
| Android Studio | IDE oficial de Android | Libre y gratuito |
| Gradle | Sistema que compila el proyecto | Libre |
| MonoDevelop | IDE (base de Xamarin) | Libre |
