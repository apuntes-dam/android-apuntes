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
| **Kotlin Multiplatform / Compose Multiplatform** | Kotlin | Comparte la lógica (y la interfaz) entre plataformas |
| **React Native** | JavaScript/TypeScript | Usa componentes nativos controlados desde JavaScript |
| **Web / PWA** | HTML, CSS, JavaScript | Una web instalable que funciona en el navegador |

**Ventajas:** menos coste de desarrollo y mantenimiento, un solo equipo.
**Inconvenientes:** a veces menos rendimiento o retraso en funciones nuevas del sistema.

## ¿Cuál elegir?

| Si... | Conviene |
|---|---|
| Necesitas el máximo rendimiento o funciones muy específicas del sistema | Nativo |
| Quieres llegar a Android e iOS con un equipo pequeño | Multiplataforma |
| Solo te interesa Android | Kotlin + Android Studio |
| Ya sabes Dart/Flutter y quieres móvil, web y escritorio | Flutter |

!!! tip "Dónde se aprende cada cosa en esta web"
    Kotlin y Compose: [apuntes de Kotlin](https://apuntes-dam.github.io/kotlin-apuntes/). Flutter: [apuntes de Dart y Flutter](https://apuntes-dam.github.io/dart-flutter-apuntes/).
