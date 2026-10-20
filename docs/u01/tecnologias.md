# 3. Tecnologías de desarrollo: nativo y multiplataforma

## Desarrollo nativo

Una app **nativa** se escribe con el lenguaje y las herramientas oficiales de **una** plataforma.

* **Android:** Kotlin + Android Studio (interfaz con **Jetpack Compose** o vistas XML).
* **iOS:** Swift + Xcode (interfaz con SwiftUI).

**Ventajas:** mejor rendimiento, acceso completo a las funciones del sistema, última tecnología desde el primer día.
**Inconvenientes:** hay que mantener **un código por plataforma**.

## Desarrollo multiplataforma

Un único código genera apps para varias plataformas.

| Tecnología | Lenguaje | Idea |
|---|---|---|
| **Flutter** | Dart | Dibuja la interfaz con su propio motor |
| **Kotlin Multiplatform / Compose Multiplatform** | Kotlin | Comparte la lógica y, con Compose Multiplatform, también la interfaz (Android, iOS, escritorio y web) |
| **.NET MAUI** | C# | La opción de Microsoft; sustituye a **Xamarin**, que ya no tiene soporte |
| **React Native** | JavaScript/TypeScript | Usa componentes nativos controlados desde JavaScript |
| **Web / PWA** | HTML, CSS, JavaScript | Una web instalable que funciona en el navegador |

**Ventajas:** menos coste de desarrollo y mantenimiento, un solo equipo.
**Inconvenientes:** a veces menos rendimiento o retraso en funciones nuevas del sistema.

## Dos formas de ser multiplataforma

No todas las tecnologías multiplataforma funcionan igual:

| Tipo | Cómo funciona | Rendimiento | Ejemplos |
|---|---|---|---|
| **Compilado a nativo** | Un único lenguaje que se compila al código de cada plataforma | Igual que el nativo o muy cercano | .NET MAUI (sucesor de Xamarin), Kotlin Multiplatform |
| **Basado en web** | La app es una web empaquetada dentro de un contenedor | Menor, sobre todo en gráficos exigentes | Ionic y Cordova (antes PhoneGap) |
| **Con motor propio** | Dibuja la interfaz con su propio motor gráfico | Muy bueno | Flutter |

## Entornos que verás citados

* **Kotlin**: lo creó JetBrains y Google lo señala como el lenguaje principal para Android. Se ejecuta sobre la máquina virtual de Java y convive con él en el mismo proyecto.
* **Ionic**: apps híbridas con HTML, CSS y JavaScript y los *frameworks* web habituales (Angular, React, Vue), con una sola base de código.
* **NativeScript**: código abierto, programa con JavaScript, TypeScript, Angular o Vue y obtiene interfaces **nativas**.
* **Unity**: no es un entorno general, sino un motor específico de **videojuegos**.
* **Xamarin** ya no tiene soporte; Microsoft lo sustituyó por **.NET MAUI**.

!!! example "Ejemplo de elección"
    Para una app interna de una empresa que debe salir ya en Android e iOS con un equipo pequeño, Flutter o .NET MAUI recortan mucho el esfuerzo. Para una app de realidad aumentada que exprime la gráfica, lo razonable es lo **nativo**: Kotlin en Android y Swift en iOS.

## ¿Cuál elegir?

| Si... | Conviene |
|---|---|
| Necesitas el máximo rendimiento o funciones muy específicas del sistema | Nativo |
| Quieres llegar a Android e iOS con un equipo pequeño | Multiplataforma |
| Solo te interesa Android | Kotlin + Android Studio |
| Ya sabes Dart/Flutter y quieres móvil, web y escritorio | Flutter |

!!! tip "Dónde se aprende cada cosa en esta web"
    Kotlin y Compose: [apuntes de Kotlin](https://apuntes-dam.github.io/kotlin-apuntes/). Flutter: [apuntes de Dart y Flutter](https://apuntes-dam.github.io/dart-flutter-apuntes/).
