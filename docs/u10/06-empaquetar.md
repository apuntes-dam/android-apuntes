# 10.6 Empaquetar el kit

Empaquetar es dejar los componentes en un sitio desde el que **otros** los puedan usar. En Java se hacía un `.jar` y se añadía a la paleta del editor. Aquí el paquete es un **módulo de librería** y la «paleta» es el bloque `dependencies` de Gradle.

## Estructura del proyecto

```text
IsmaelUIKit
├── :app   → la aplicación de demostración (usa el kit)
└── :ui    → el kit de componentes (BadgeEstado, SelectorMes, LienzoFiguras…)
```

```kotlin
// settings.gradle.kts
rootProject.name = "IsmaelUIKit"
include(":app")
include(":ui")
```

El módulo `:ui` se declara como **librería** (no como aplicación):

```kotlin
// ui/build.gradle.kts
plugins {
    alias(libs.plugins.android.library)      // com.android.library
    alias(libs.plugins.kotlin.compose)
}
android {
    namespace = "com.example.uikit"          // paquete raíz del componente
    defaultConfig { minSdk = 24 }
}
dependencies {
    api(platform(libs.androidx.compose.bom))
    api(libs.androidx.compose.material3)     // api: quien use el kit también compila contra Compose
}
```

## Lo que produce y cómo se consume

* Un módulo con `com.android.library` produce un **`.aar`** (*Android Archive*). A diferencia del `.jar`, el `.aar` también lleva **recursos, drawables y el manifiesto**.
* Quien consume el kit escribe **`implementation(project(":ui"))`** y ya tiene los componentes: **no copia ficheros ni pega código**.

```kotlin
// app/build.gradle.kts
dependencies {
    implementation(project(":ui"))
}
```

## `api` frente a `implementation`

| | Qué hace | Cuándo |
|---|---|---|
| `api(…)` | **Filtra** la dependencia a quien te usa | Lo que forma parte de la interfaz pública del componente (Compose en un kit de UI) |
| `implementation(…)` | La **esconde** | Lo que solo usas por dentro |

Un kit de interfaz usa `api` para Compose, porque quien consume el componente también compila contra Compose. Poner `implementation` donde tocaba `api` obliga al consumidor a volver a declarar Compose.

## Compartirlo con otro proyecto

Para usarlo desde **otro** proyecto se publica en un repositorio Maven (Maven Local, GitHub Packages, Artifacts…):

```kotlin
plugins { id("maven-publish") }

publishing {
    publications {
        create<MavenPublication>("release") {
            groupId = "com.example"          // tu «marca»
            artifactId = "uikit"             // nombre del paquete
            version = "1.0.0"                // versionado semántico: mayor.menor.parche
            from(components["release"])      // el AAR ya construido por el módulo
        }
    }
}
```

## Errores típicos al crear componentes

| Error | Síntoma | Solución |
|---|---|---|
| No aceptar `modifier` | El llamador no puede colocar tu componente | Primer parámetro opcional `modifier: Modifier = Modifier`, aplicado al contenedor raíz |
| Meter `padding` «porque queda bien» | El componente se descoloca al cambiar de pantalla | El espacio exterior lo pone el `modifier` del llamador; dentro, `Arrangement.spacedBy` |
| Guardar estado que no es tuyo | «Se acuerda» de cosas y se contradice al girar | Estado interno solo para lo interno; lo demás, parámetro + evento |
| `implementation` donde toca `api` | Quien usa el kit tiene que volver a declarar Compose | `api` para lo que forma parte de la interfaz pública |
| Sin `testTag` | Las pruebas buscan textos que cambian con el idioma | `testTag` estables |
| Depender de una clase de la app | El módulo `:ui` no compila solo | El kit no importa nada de `:app`; si hace falta, se pasa como parámetro |
