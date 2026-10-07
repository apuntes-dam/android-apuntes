# AA4.1 Inyección de dependencias

!!! info "Qué se ha ejecutado y qué no"
    El código en Kotlin puro y **las pruebas** (JUnit 4, `kotlin.test` y `kotlinx-coroutines-test`) se han **compilado y ejecutado de verdad** al construir esta web: las salidas que ves, incluida la de un fallo, son las reales. Hilt y las pruebas de Compose **no se han ejecutado aquí** (necesitan Android) y están marcados «sin ejecutar».

## El problema: una clase que fabrica lo que usa

Una **dependencia** es cualquier cosa que una clase necesita para funcionar: un repositorio, una API, el reloj, un generador de números aleatorios. Hay dos maneras de conseguirla:

* **Fabricarla dentro**: la clase hace `val reloj = RelojReal()` o llama a `LocalTime.now()`. Es lo más directo, pero queda **soldada** a esa versión: no puedes probarla con otra hora ni cambiar de implementación sin tocarla.
* **Recibirla desde fuera**: se la pasan por el **constructor**. A esto se le llama **inyección de dependencias** (DI). La clase no sabe de dónde viene lo que usa, solo qué puede hacer con ello (una **interfaz**).

```kotlin
// ACOPLADO (sin ejecutar: depende de la hora real, así que el resultado cambia cada vez)
class SaludoAcoplado {
    fun saludo() = if (java.time.LocalTime.now().hour < 12) "Buenos días" else "Buenas tardes"
}
```

Esa clase es imposible de probar de forma fiable: ¿qué esperas que devuelva? Depende de **cuándo** ejecutes la prueba. Con inyección:

```kotlin
interface Reloj { fun hora(): Int }

class RelojReal : Reloj {
    override fun hora() = java.time.LocalTime.now().hour
}

class RelojFalso(var h: Int) : Reloj {            // lo controlamos nosotros
    override fun hora() = h
}

class Saludo(private val reloj: Reloj) {          // recibe el reloj, no lo crea
    fun saludo() = when (reloj.hora()) {
        in 0..11 -> "Buenos días"
        in 12..20 -> "Buenas tardes"
        else -> "Buenas noches"
    }
}

fun main() {
    val falso = RelojFalso(9)
    val saludo = Saludo(falso)
    for (h in listOf(9, 15, 22)) {
        falso.h = h
        println("a las $h h: ${saludo.saludo()}")
    }
}
```

**Salida:**

```text
a las 9 h: Buenos días
a las 15 h: Buenas tardes
a las 22 h: Buenas noches
```

Ahora `Saludo` se prueba a **cualquier hora** sin esperar. En la app real se le pasa un `RelojReal`; en las pruebas, un `RelojFalso`. **La clase `Saludo` no cambia.** Esta es toda la idea de la inyección de dependencias; el resto es organización.

!!! tip "Qué conviene inyectar"
    Todo lo que dependa del **mundo exterior** o sea **impredecible**: la red, la base de datos, el reloj, el azar (`Random`), los *dispatchers* de corrutinas, el sistema de archivos. Los objetos simples y puros (una `data class`, una función matemática) no hace falta inyectarlos.

## Un contenedor a mano

Alguien tiene que **crear los objetos y conectarlos**. En una app pequeña basta con una clase que lo haga, creada una vez al arrancar: un **contenedor de dependencias**. Dos decisiones que toma:

* **Un solo objeto compartido** (*singleton*): el repositorio, para que todas las pantallas vean los mismos datos.
* **Un objeto nuevo cada vez** (fábrica): el modelo de cada pantalla.

```kotlin
interface Almacen {
    fun guardar(texto: String)
    fun todo(): List<String>
}

class AlmacenMemoria : Almacen {
    private val datos = mutableListOf<String>()
    init { println("  [se crea AlmacenMemoria]") }
    override fun guardar(texto: String) { datos += texto }
    override fun todo() = datos.toList()
}

class Repositorio(val almacen: Almacen) {
    init { println("  [se crea Repositorio]") }
}

class ModeloLista(val repo: Repositorio) {
    init { println("  [se crea ModeloLista]") }
}

class Contenedor {
    // Compartidos y creados SOLO cuando alguien los pide por primera vez (lazy)
    val almacen: Almacen by lazy { AlmacenMemoria() }
    val repositorio: Repositorio by lazy { Repositorio(almacen) }

    // Fábrica: uno nuevo en cada llamada
    fun crearModelo() = ModeloLista(repositorio)
}

fun main() {
    val contenedor = Contenedor()
    println("contenedor creado (todavía no se ha creado nada más)")
    println("pido el modelo 1")
    val m1 = contenedor.crearModelo()
    println("pido el modelo 2")
    val m2 = contenedor.crearModelo()
    println("¿el mismo repositorio? ${m1.repo === m2.repo} · ¿el mismo modelo? ${m1 === m2}")
}
```

**Salida:**

```text
contenedor creado (todavía no se ha creado nada más)
pido el modelo 1
  [se crea AlmacenMemoria]
  [se crea Repositorio]
  [se crea ModeloLista]
pido el modelo 2
  [se crea ModeloLista]
¿el mismo repositorio? true · ¿el mismo modelo? false
```

Lo que enseña la salida:

* **Nada se crea hasta que se necesita** (`by lazy`): el arranque de la app es más rápido.
* El repositorio (y su almacén) se creó **una sola vez** y lo comparten los dos modelos.
* Cada llamada a `crearModelo()` da **un modelo nuevo**.

En Android, ese contenedor suele colgar de la clase `Application` (que vive tanto como la app) y las pantallas lo consultan para construir su `ViewModel`.

## Pasarle dependencias a un `ViewModel` (sin ejecutar)

Los `ViewModel` los crea el sistema, así que no puedes llamar tú al constructor: hace falta una **fábrica** (*factory*).

```kotlin
// Sin ejecutar: necesita Android
class MiApp : Application() {
    val contenedor by lazy { Contenedor() }
}

@Composable
fun ListaRoute() {
    val app = LocalContext.current.applicationContext as MiApp
    val vm: ListaViewModel = viewModel(
        factory = viewModelFactory {
            initializer { ListaViewModel(app.contenedor.repositorio) }
        }
    )
    // ...
}
```

Funciona y no necesita librerías, pero a medida que la app crece, mantener el contenedor y las fábricas a mano es mucho trabajo repetitivo. Para eso están las librerías de DI.

## Hilt (sin ejecutar)

**Hilt** (de Google, sobre Dagger) genera el contenedor por ti, **al compilar**. Tú solo describes cómo se crean las cosas con anotaciones:

```kotlin
// Sin ejecutar: necesita Android y las dependencias de Hilt
@HiltAndroidApp
class MiApp : Application()

@AndroidEntryPoint
class MainActivity : ComponentActivity() { /* ... */ }

// Una INTERFAZ con su implementación: @Binds
@Module
@InstallIn(SingletonComponent::class)
abstract class DatosModule {
    @Binds @Singleton
    abstract fun almacen(impl: AlmacenRoom): Almacen
}

// Algo que NO controlas (una librería): @Provides
@Module
@InstallIn(SingletonComponent::class)
object RedModule {
    @Provides @Singleton
    fun retrofit(): Retrofit = Retrofit.Builder().baseUrl("https://api.ejemplo.com/").build()
}

// Una clase propia: solo hay que marcar el constructor con @Inject
class Repositorio @Inject constructor(private val almacen: Almacen, private val api: ProductosApi)

@HiltViewModel
class ListaViewModel @Inject constructor(private val repositorio: Repositorio) : ViewModel()

@Composable
fun ListaRoute(vm: ListaViewModel = hiltViewModel()) { /* ... */ }
```

| Anotación | Para qué |
|---|---|
| `@HiltAndroidApp` | Activa Hilt en la aplicación |
| `@AndroidEntryPoint` | Permite inyectar en una `Activity`/`Fragment` |
| `@Inject constructor` | «Para crear esta clase, pide estas dependencias» |
| `@Binds` | Enlaza una **interfaz** con su implementación |
| `@Provides` | Explica cómo crear algo que **no es tuyo** |
| `@Singleton` | Un único objeto en toda la app |
| `@HiltViewModel` + `hiltViewModel()` | Inyección en `ViewModel` sin fábricas |

### ¿A mano, Hilt o Koin?

| | A mano | Hilt | Koin |
|---|---|---|---|
| Librería | Ninguna | Sí (Dagger) | Sí |
| ¿Cuándo detecta una dependencia que falta? | Al compilar | **Al compilar** | **Al ejecutar** (la app se cae) |
| Código repetitivo | Mucho si la app crece | Poco | Poco |
| Curva de aprendizaje | Ninguna | Alta al principio | Baja |
| Se usa en | Apps pequeñas, aprender | La mayoría de apps Android grandes | Proyectos multiplataforma |

Para aprender, **empieza a mano**: entenderás qué hace Hilt por ti. Pasa a Hilt cuando el contenedor empiece a ser un estorbo.

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| Crear la dependencia dentro (`val api = Retrofit...`) | Recibirla por el constructor |
| Depender de la clase concreta (`RelojReal`) | Depender de la **interfaz** (`Reloj`) |
| Pasar el `Context` a todas partes | Inyectar solo lo que se necesita; cuidado con guardar una `Activity` en un singleton (fuga de memoria) |
| Un singleton con estado mutable sin protección | `StateFlow`/`update` o confinar el acceso |
| Un contenedor global al que cualquiera pide cualquier cosa (*service locator*) | Declarar las dependencias en el constructor, para que se vean |
| Interfaces para todo, aunque solo tengan una implementación y nunca se sustituyan | Interfaz donde de verdad haya algo que cambiar o falsear |

## Para practicar

Los ejercicios AA4.1 a AA4.3 de [AA4 · Ejercicios](ejercicios.md) practican la inyección, el contenedor y el tiempo virtual.
