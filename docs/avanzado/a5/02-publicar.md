# AA5.2 Preparar y publicar la app

!!! info "Qué se ha ejecutado y qué no"
    El **estado de Compose** (`mutableStateOf`, `derivedStateOf`, `snapshotFlow`) y la lógica de versiones se han **ejecutado de verdad** al construir esta web, con el *runtime* de Compose en la JVM. Los **composables**, la configuración de **Gradle** y los pasos de **Play Console** no se pueden ejecutar aquí (necesitan Android o son procesos manuales): están marcados «sin ejecutar». Las versiones de herramientas cambian con el tiempo: comprueba la documentación oficial al usarlas.

## Del modo *debug* al modo *release*

Hasta ahora has ejecutado tu app en modo **debug**: sin optimizar, con herramientas de depuración y firmada con una clave de pruebas. Para publicar, se genera una compilación **release**: más pequeña, más rápida y firmada con **tu** clave.

| | Debug | Release |
|---|---|---|
| Código | Sin reducir ni ofuscar | **Reducido y ofuscado** con R8 |
| Recursos | Todos | Se eliminan los que no se usan |
| Firma | Clave de pruebas del IDE | **Tu clave** |
| Depuración | Sí | No (`debuggable = false`) |
| Velocidad | Lenta (da medidas falsas) | La real |

## Versiones: `versionCode` y `versionName`

Cada compilación que subas necesita dos números:

| Campo | Para qué | Cómo |
|---|---|---|
| **`versionName`** | Lo que ve el usuario (`1.4.2`) | Texto libre; lo habitual es **mayor.menor.parche** |
| **`versionCode`** | Lo que usa la tienda para saber cuál es **más nueva** | Un **entero que solo puede subir** en cada subida |

Si tienes un `versionName` con el formato mayor.menor.parche, el `versionCode` se puede **derivar** para no llevar dos contadores a mano. Es lógica pura, así que se ejecuta de verdad:

```kotlin
data class Version(val mayor: Int, val menor: Int, val parche: Int) : Comparable<Version> {
    init { require(mayor >= 0 && menor in 0..99 && parche in 0..99) { "versión fuera de rango: $mayor.$menor.$parche" } }

    // Google Play exige un entero que SOLO pueda subir. Lo derivamos del nombre de la versión.
    val codigo: Int get() = mayor * 10_000 + menor * 100 + parche

    override fun compareTo(other: Version) = compareValuesBy(this, other, { it.mayor }, { it.menor }, { it.parche })
    override fun toString() = "$mayor.$menor.$parche"

    companion object {
        fun parse(texto: String): Version {
            val trozos = texto.trim().split(".")
            require(trozos.size == 3) { "«$texto» no tiene el formato mayor.menor.parche" }
            val n = trozos.map { it.toIntOrNull() ?: throw IllegalArgumentException("«$it» no es un número") }
            return Version(n[0], n[1], n[2])
        }
    }
}

fun main() {
    val v = Version.parse("1.4.2")
    println("versionName = $v · versionCode = ${v.codigo}")

    val versiones = listOf("2.0.0", "1.10.0", "1.9.5", "1.10.1").map(Version::parse)
    println("ordenadas:   ${versiones.sorted().joinToString(" < ")}")
    println("sus códigos: ${versiones.sorted().map { it.codigo }}")
    println("¿1.10.0 es más nueva que 1.9.5? ${Version.parse("1.10.0") > Version.parse("1.9.5")}")

    for (mala in listOf("1.4", "1.x.0", "1.4.150")) {
        try { Version.parse(mala) } catch (e: IllegalArgumentException) { println("«$mala» -> ${e.message}") }
    }
}
```

**Salida:**

```text
versionName = 1.4.2 · versionCode = 10402
ordenadas:   1.9.5 < 1.10.0 < 1.10.1 < 2.0.0
sus códigos: [10905, 11000, 11001, 20000]
¿1.10.0 es más nueva que 1.9.5? true
«1.4» -> «1.4» no tiene el formato mayor.menor.parche
«1.x.0» -> «x» no es un número
«1.4.150» -> versión fuera de rango: 1.4.150
```

Fíjate en el tropiezo clásico que evita: **como texto**, `"1.10.0"` es *menor* que `"1.9.5"` (el `1` va antes que el `9`), pero como números es mayor. Por eso las versiones se comparan **por partes**. El código resultante nunca baja al subir de versión, que es lo que exige Google Play.

!!! warning "El `versionCode` no se puede repetir ni bajar"
    La tienda rechaza una subida con un `versionCode` igual o menor al ya publicado. Y no se puede deshacer: si te equivocas y subes uno enorme, ya no podrás usar los números intermedios.

## Reducir la app: R8

**R8** hace tres cosas al compilar en modo release:

1. **Reduce** (*shrink*): elimina el código que nadie llama.
2. **Optimiza**: simplifica código.
3. **Ofusca**: renombra clases y métodos a nombres cortos (`a.b.c`). Es más pequeño y dificulta (sin impedirlo) que otros lean tu código.

Además, `shrinkResources` quita los recursos (imágenes, textos) que no se usan. Se activa en `build.gradle.kts`:

```kotlin
// Sin ejecutar: configuración de Gradle de un proyecto Android
android {
    defaultConfig {
        applicationId = "com.ejemplo.miapp"      // identifica la app en la tienda PARA SIEMPRE
        versionCode = 10402
        versionName = "1.4.2"
    }
    buildTypes {
        release {
            isMinifyEnabled = true               // R8: reducir, optimizar y ofuscar
            isShrinkResources = true             // quitar recursos que no se usan
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}
```

!!! danger "El `applicationId` es para siempre"
    Una vez publicada la app, **no se puede cambiar** su `applicationId`: cambiarlo crea una app distinta. Elígelo con cuidado desde el principio (suele ser tu dominio al revés: `com.ejemplo.miapp`).

### Cuando R8 rompe algo

La reducción asume que sabe qué código se usa. Si algo se usa **sin llamarse explícitamente** (por reflexión: algunas librerías de JSON, clases que se crean por su nombre), R8 puede eliminarlo o renombrarlo, y la app **falla solo en release**. Se arregla con reglas `-keep` en `proguard-rules.pro`:

```
# Sin ejecutar
-keep class com.ejemplo.miapp.datos.red.** { *; }      # los DTO que se leen por reflexión
```

Por eso la regla de oro: **prueba siempre la compilación release** antes de subirla, no solo la debug. Las librerías modernas (Retrofit, Room, Hilt) suelen traer sus propias reglas.

## Firmar la app

Android solo instala apps **firmadas**. La firma demuestra que las actualizaciones vienen **de ti** y no de otra persona. La clave se guarda en un archivo **keystore**.

!!! danger "La clave de firma es lo más delicado de la app"
    * **Nunca** la subas a un repositorio (ni las contraseñas).
    * Haz **copia de seguridad** en un sitio seguro: sin ella, no podrías actualizar tu app como tú.
    * Hoy lo habitual es **Play App Signing**: Google guarda la clave de firma definitiva y tú solo usas una *clave de subida* que se puede restablecer si la pierdes.

En el proyecto, los datos de la clave se leen **de fuera** del código (variables de entorno o un archivo que no se sube):

```kotlin
// Sin ejecutar: configuración de Gradle
android {
    signingConfigs {
        create("release") {
            storeFile = file(System.getenv("CLAVE_RUTA") ?: "no-existe.jks")
            storePassword = System.getenv("CLAVE_ALMACEN")
            keyAlias = System.getenv("CLAVE_ALIAS")
            keyPassword = System.getenv("CLAVE_PASSWORD")
        }
    }
    buildTypes {
        release { signingConfig = signingConfigs.getByName("release") }
    }
}
```

## `.apk` frente a `.aab`

| | APK | AAB (*Android App Bundle*) |
|---|---|---|
| Qué es | La app lista para instalar | Un paquete **para la tienda** |
| Uso | Pruebas y enviar a mano | **Obligatorio para subir a Google Play** |
| Ventaja | Se instala directamente | Google genera **APK a medida** de cada móvil (solo su idioma y pantalla): descargas más pequeñas |

Se genera con Gradle (o desde Android Studio, *Build → Generate Signed App Bundle*):

```
# Sin ejecutar
./gradlew bundleRelease
# resultado habitual: app/build/outputs/bundle/release/app-release.aab
```

## Publicar en Google Play (proceso manual, sin ejecutar)

1. **Crea una cuenta de desarrollador** de Google Play (tiene una cuota de registro única) y **verifica tu identidad**.
2. En **Play Console**, **crea la app**: nombre, idioma, si es gratuita o de pago.
3. Rellena la **ficha de la tienda**: descripción corta y larga, icono, capturas de pantalla y gráfico de cabecera.
4. Rellena los **formularios obligatorios**: clasificación de contenido, público objetivo, **política de privacidad** (una URL pública, imprescindible si la app maneja datos personales) y el apartado de **seguridad de los datos** (qué datos recoges y para qué).
5. Sube el **`.aab`** a una **pista de pruebas**.
6. Cuando esté probada, **envíala a producción**.

Las pistas de pruebas permiten ir ganando confianza antes de enseñarla al mundo:

| Pista | Quién la ve | Para qué |
|---|---|---|
| **Pruebas internas** | Hasta un pequeño grupo de tu equipo | Comprobar cada compilación en minutos |
| **Pruebas cerradas** | Una lista de testers que invitas | Probar con gente real. Las cuentas personales nuevas pueden tener **requisitos mínimos de pruebas** antes de pasar a producción: consúltalos |
| **Pruebas abiertas** | Cualquiera que se una | Probar con muchos usuarios |
| **Producción** | Todo el mundo | La versión pública. Se puede publicar **por fases** (por ejemplo, al 10 % de los usuarios) para detectar fallos antes de llegar a todos |

!!! note "Las normas de la tienda cambian"
    Google Play actualiza cada cierto tiempo sus requisitos (versión mínima de Android a la que debe apuntar la app, formularios, pruebas previas a producción). **No te fíes de una lista fija**: consulta la documentación de Play Console cuando vayas a publicar.

## Después de publicar

* **Informes de fallos**: Play Console y Firebase Crashlytics te dicen en qué móviles y con qué error se cierra tu app.
* **Actualizaciones por fases** para limitar el daño si una versión falla.
* **Reseñas**: contestarlas mejora la valoración y te da pistas de qué arreglar.
* **Versionado**: cada actualización, `versionCode` más alto.

## Lista de comprobación antes de subir

| ¿Hecho? | Comprobación |
|---|---|
| ☐ | `versionCode` mayor que el último publicado |
| ☐ | `isMinifyEnabled = true` y **probada** la compilación release |
| ☐ | Firmada con la clave de subida; la clave **fuera** del repositorio y con copia de seguridad |
| ☐ | `debuggable` en `false` |
| ☐ | Sin claves de API ni contraseñas escritas en el código |
| ☐ | Permisos revisados: solo los que de verdad se usan |
| ☐ | Política de privacidad publicada y formulario de seguridad de datos rellenado |
| ☐ | Probada en un móvil de verdad (y con pantalla pequeña, modo oscuro y otro idioma) |
| ☐ | Textos revisados en todos los idiomas que declaras |

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| Probar solo en debug | Prueba siempre la compilación release |
| Subir la clave de firma (o sus contraseñas) a GitHub | Variables de entorno o un archivo ignorado por Git |
| Perder la clave de firma | Copia de seguridad y Play App Signing |
| Elegir un `applicationId` provisional | Es definitivo: elígelo bien desde el principio |
| Comparar versiones como texto | Comparar mayor, menor y parche como números |
| Dejar claves de API en el código | Fuera del repositorio (y, mejor, en un servidor tuyo) |
| Publicar a todos de golpe | Pistas de prueba y publicación por fases |

## Para practicar

Los ejercicios AA5.2, AA5.3, AA5.5 y AA5.6 de [AA5 · Ejercicios](ejercicios.md) practican las versiones, la configuración de release y una lista de comprobación automática.
