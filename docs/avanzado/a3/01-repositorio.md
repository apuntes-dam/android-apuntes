# AA3.1 Repositorio, errores y mapeo

!!! info "Qué se ha ejecutado y qué no"
    Los ejemplos con salida son **Kotlin puro con una API y una base de datos falsas** (clases escritas aquí para simular la red y Room), y se han **ejecutado de verdad** al construir la web. Retrofit, Room y WorkManager **reales** no se pueden ejecutar sin Android: sus fragmentos están marcados «sin ejecutar».

## Las capas

Una app que mezcla en el mismo sitio dibujar la pantalla, llamar a internet y leer del disco se vuelve imposible de cambiar y de probar. La organización habitual separa tres capas:

| Capa | Qué contiene | Quién la usa |
|---|---|---|
| **Interfaz** | Composables y `ViewModel` | El usuario |
| **Datos** | **Repositorios** y **fuentes de datos** (red, base de datos local, preferencias) | El `ViewModel` |
| **Dominio** (opcional) | Reglas de negocio y casos de uso, cuando son complejas | El `ViewModel` |

El **repositorio** es el único que sabe **de dónde** salen los datos. El `ViewModel` le pregunta («dame los productos») sin saber si vienen de internet, de la caché o de un archivo. Eso permite cambiar de Retrofit a otra librería, o añadir una caché, **sin tocar la pantalla**, y sustituir el repositorio por uno falso en las pruebas.

## Tres modelos para el mismo dato

Un producto no tiene la misma forma en todas partes:

| Modelo | Dónde | Cómo es |
|---|---|---|
| **DTO** (*data transfer object*) | La red | Refleja el JSON **tal cual**, con nombres feos y casi todo opcional (`precio_cent: Int?`) |
| **Entidad** | La base de datos (Room) | Refleja la tabla |
| **Modelo de dominio** | El resto de la app | Limpio, con los tipos que te convienen y **sin nulos imposibles** |

Se convierten con **funciones de mapeo** (normalmente funciones de extensión). La gran ventaja: **si el servidor cambia un nombre de campo, solo se toca el mapeo**.

```kotlin
data class ProductoDto(val id: Int?, val nombre: String?, val precio_cent: Int?, val stock: Int?)   // tal como llega de la red
data class Producto(val id: Int, val nombre: String, val precio: Double, val disponible: Boolean)           // lo que usa la app

fun ProductoDto.toDominio(): Producto? {
    // Un DTO incompleto no se convierte: se devuelve null y quien llama decide qué hacer
    val id = id ?: return null
    val nombre = nombre?.trim()?.takeIf { it.isNotEmpty() } ?: return null
    val centimos = precio_cent ?: return null
    return Producto(id, nombre, centimos / 100.0, (stock ?: 0) > 0)
}

fun main() {
    val dtos = listOf(
        ProductoDto(1, "Cuaderno", 350, 10),
        ProductoDto(2, null, 100, 3),             // sin nombre
        ProductoDto(3, "  Lápiz ", 90, 0),        // con espacios y sin stock
        ProductoDto(4, "Goma", null, 5)           // sin precio
    )
    val productos = dtos.mapNotNull { it.toDominio() }
    productos.forEach(::println)
    println("${dtos.size - productos.size} descartados por estar incompletos")
}
```

**Salida:**

```text
Producto(id=1, nombre=Cuaderno, precio=3.5, disponible=true)
Producto(id=3, nombre=Lápiz, precio=0.9, disponible=false)
2 descartados por estar incompletos
```

El mapeo hace tres trabajos a la vez: **valida** (descarta lo incompleto con `mapNotNull`), **limpia** (`trim`) y **traduce** (céntimos a euros, stock a un `Boolean`). A partir de aquí, el resto de la app trabaja con `Producto`, que **nunca** tiene un nombre nulo.

## Errores: de excepciones a mensajes

Una petición falla de muchas maneras: sin red, el servidor devuelve un 500, el recurso no existe... La pantalla no debe ver una `IOException`: debe recibir algo que pueda **explicar al usuario**. Se traduce en el repositorio:

```kotlin
import java.io.IOException

class HttpFalso(val codigo: Int) : Exception("HTTP $codigo")           // hace el papel de la excepción HTTP de Retrofit

sealed interface ErrorApp {
    data object SinConexion : ErrorApp
    data object NoEncontrado : ErrorApp
    data class Servidor(val codigo: Int) : ErrorApp
    data class Desconocido(val causa: Throwable) : ErrorApp
}

fun Throwable.aErrorApp(): ErrorApp = when (this) {
    is IOException -> ErrorApp.SinConexion
    is HttpFalso -> if (codigo == 404) ErrorApp.NoEncontrado else ErrorApp.Servidor(codigo)
    else -> ErrorApp.Desconocido(this)
}

fun ErrorApp.mensaje(): String = when (this) {
    ErrorApp.SinConexion -> "No hay conexión. Revisa tu red."
    ErrorApp.NoEncontrado -> "No se encontró lo que buscas."
    is ErrorApp.Servidor -> "El servidor tuvo un problema (código $codigo). Inténtalo más tarde."
    is ErrorApp.Desconocido -> "Ocurrió algo inesperado."
}

fun main() {
    val fallos = listOf<Throwable>(IOException("timeout"), HttpFalso(404), HttpFalso(503), IllegalStateException("bug"))
    fallos.forEach { println("${it::class.simpleName}: ${it.aErrorApp().mensaje()}") }
}
```

**Salida:**

```text
IOException: No hay conexión. Revisa tu red.
HttpFalso: No se encontró lo que buscas.
HttpFalso: El servidor tuvo un problema (código 503). Inténtalo más tarde.
IllegalStateException: Ocurrió algo inesperado.
```

Con una jerarquía `sealed` y `when` sin `else`, si mañana añades un tipo de error, el compilador te recuerda **todos los sitios** donde falta su mensaje.

## `runCatching` y la cancelación

`runCatching { ... }` convierte una excepción en un `Result` y es muy cómodo, pero tiene una trampa que ya conoces de la [AA2](../a2/01-corrutinas.md): **captura también la `CancellationException`**, así que una corrutina cancelada sigue ejecutándose.

```kotlin
suspend fun pedir(): String { delay(1000); return "datos" }

sealed interface Resultado<out T> {
    data class Ok<T>(val valor: T) : Resultado<T>
    data class Fallo(val error: Throwable) : Resultado<Nothing>
}

// La versión correcta: relanza la cancelación
suspend fun <T> intentar(bloque: suspend () -> T): Resultado<T> =
    try { Resultado.Ok(bloque()) }
    catch (e: CancellationException) { throw e }
    catch (e: Exception) { Resultado.Fallo(e) }

fun main() = runBlocking {
    val malo = launch {
        val r = runCatching { pedir() }
        println("runCatching: fallo=${r.isFailure} y yo sigo ejecutando (¿activo? $isActive)")
    }
    val bueno = launch {
        val r = intentar { pedir() }
        println("esto no se imprime: $r")
    }
    delay(100)
    malo.cancelAndJoin()
    bueno.cancelAndJoin()
    println("intentar respetó la cancelación: ${bueno.isCancelled}")
}
```

**Salida:**

```text
runCatching: fallo=true y yo sigo ejecutando (¿activo? false)
intentar respetó la cancelación: true
```

`runCatching` cogió la cancelación, siguió con la línea siguiente y siguió ejecutando una corrutina ya cancelada. `intentar` la dejó pasar y la corrutina terminó como debía. Si usas `runCatching` con funciones `suspend`, asegúrate de relanzar `CancellationException` (o usa un helper como este).

## El repositorio, completo

Junta todo: el repositorio **recibe una interfaz** (`ProductosApi`), pide los datos, **mapea**, **traduce los errores** y devuelve un `Flow` con las tres fases que necesita la pantalla.

```kotlin
// (necesita import java.io.IOException, como en el ejemplo anterior)
sealed interface Carga<out T> {
    data object Cargando : Carga<Nothing>
    data class Ok<T>(val datos: T) : Carga<T>
    data class Fallo(val error: ErrorApp) : Carga<Nothing>
}

interface ProductosApi { suspend fun listar(): List<ProductoDto> }

class ProductosRepositorio(private val api: ProductosApi) {
    fun productos(): Flow<Carga<List<Producto>>> = flow {
        emit(Carga.Cargando)
        try {
            val lista = api.listar().mapNotNull { it.toDominio() }
            emit(Carga.Ok(lista))
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            emit(Carga.Fallo(e.aErrorApp()))
        }
    }
}

// Dos APIs falsas para probarlo
class ApiBuena : ProductosApi {
    override suspend fun listar() = listOf(ProductoDto(1, "Cuaderno", 350, 10), ProductoDto(2, null, 100, 3))
}
class ApiSinRed : ProductosApi {
    override suspend fun listar(): List<ProductoDto> = throw IOException("sin red")
}
class ApiRota : ProductosApi {
    override suspend fun listar(): List<ProductoDto> = throw HttpFalso(500)
}

fun main() = runBlocking {
    for ((nombre, api) in listOf("buena" to ApiBuena(), "sin red" to ApiSinRed(), "rota" to ApiRota())) {
        println("— API $nombre")
        ProductosRepositorio(api).productos().collect { println("  $it") }
    }
}
```

**Salida:**

```text
— API buena
  Cargando
  Ok(datos=[Producto(id=1, nombre=Cuaderno, precio=3.5, disponible=true)])
— API sin red
  Cargando
  Fallo(error=SinConexion)
— API rota
  Cargando
  Fallo(error=Servidor(codigo=500))
```

Fíjate en lo que **no** hace falta: ni Retrofit, ni emulador, ni una red real. Como el repositorio depende de una **interfaz**, en las pruebas le pasas una API falsa que falla cuando tú quieres. Esa es la razón de ser de las interfaces en esta capa.

## Con Retrofit de verdad (sin ejecutar)

```kotlin
// Sin ejecutar: necesita Android y la dependencia de Retrofit
interface ProductosService {
    @GET("productos")
    suspend fun listar(): List<ProductoDto>

    @GET("productos/{id}")
    suspend fun detalle(@Path("id") id: Int): ProductoDto
}

class ProductosApiRetrofit(private val servicio: ProductosService) : ProductosApi {
    override suspend fun listar() = servicio.listar()
}
```

`ProductosApiRetrofit` es la única clase que conoce Retrofit. El resto de la app solo ve `ProductosApi`. Las excepciones reales que lanza Retrofit son `IOException` (sin red) y `HttpException` (el servidor respondió con un error): el `aErrorApp()` de arriba se adapta a ellas con un caso más en el `when`.

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| Usar el DTO en toda la app | Mapear a un modelo de dominio en el repositorio |
| Dejar pasar excepciones crudas hasta la pantalla | Traducirlas a un tipo propio (`ErrorApp`) |
| `runCatching` con `suspend` sin pensar en la cancelación | Relanzar `CancellationException` |
| Mapear sin validar (`dto.nombre!!`) | Devolver `null` o un error y descartar lo inválido |
| El repositorio crea su propia API (`Retrofit.Builder()` dentro) | Recibirla por el constructor, como interfaz |
| Mostrar `e.message` al usuario | Un mensaje pensado para personas, no el del sistema |

## Para practicar

Los ejercicios AA3.1 a AA3.3 de [AA3 · Ejercicios](ejercicios.md) practican el mapeo, `intentar` y la traducción de errores.
