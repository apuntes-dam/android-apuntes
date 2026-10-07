# AA3.2 Sin conexión primero: caché y sincronización

!!! info "Qué se ha ejecutado y qué no"
    Los ejemplos con salida son **Kotlin puro con una API y una base de datos falsas** (clases escritas aquí para simular la red y Room), y se han **ejecutado de verdad** al construir la web. Retrofit, Room y WorkManager **reales** no se pueden ejecutar sin Android: sus fragmentos están marcados «sin ejecutar».

## Una sola fuente de la verdad

La app de un cliente en el metro, en un ascensor o con el móvil en modo avión **no puede quedarse en blanco**. La técnica se llama *offline-first* (sin conexión primero) y se apoya en una regla:

> **La interfaz solo observa la base de datos local.** La red nunca habla con la pantalla: **escribe en la base de datos**, y la base de datos avisa a la pantalla.

Así, la pantalla tiene **una única fuente** y siempre enseña lo último que se sabe, haya o no haya red. Si no hay conexión, el refresco falla y **no se toca nada**: los datos anteriores siguen ahí.

```kotlin
import java.io.IOException

data class Producto(val id: Int, val nombre: String, val precio: Double)

// Hace de Room: una tabla que se puede OBSERVAR
class BdFalsa {
    private val filas = MutableStateFlow<Map<Int, Producto>>(emptyMap())
    fun observar(): Flow<List<Producto>> = filas.map { it.values.sortedBy { p -> p.id } }
    fun guardar(lista: List<Producto>) { filas.update { it + lista.associateBy { p -> p.id } } }
}

// Hace de la red: puede estar sin conexión
class RemotoFalso(var conectado: Boolean, var catalogo: List<Producto>) {
    suspend fun listar(): List<Producto> {
        delay(20)
        if (!conectado) throw IOException("sin red")
        return catalogo
    }
}

class Repositorio(private val bd: BdFalsa, private val remoto: RemotoFalso) {
    val productos: Flow<List<Producto>> = bd.observar()       // la pantalla SOLO mira la base de datos

    suspend fun refrescar(): Boolean = try {
        bd.guardar(remoto.listar())                           // la red escribe en la base de datos, no en la pantalla
        true
    } catch (e: IOException) {
        false
    }
}

fun main() = runBlocking {
    val remoto = RemotoFalso(conectado = false, catalogo = listOf(Producto(1, "Cuaderno", 3.5), Producto(2, "Lápiz", 0.9)))
    val repo = Repositorio(BdFalsa(), remoto)

    val job = launch(Dispatchers.Unconfined) { repo.productos.collect { println("  pantalla ve: ${it.map { p -> p.nombre }}") } }

    println("1) refresco SIN conexión -> ${repo.refrescar()}")
    remoto.conectado = true
    println("2) refresco CON conexión -> ${repo.refrescar()}")
    remoto.conectado = false
    println("3) vuelve a caerse la red -> ${repo.refrescar()}")
    println("(la pantalla no ha cambiado: sigue con lo último que tenía)")
    job.cancel()
}
```

**Salida:**

```text
  pantalla ve: []
1) refresco SIN conexión -> false
  pantalla ve: [Cuaderno, Lápiz]
2) refresco CON conexión -> true
3) vuelve a caerse la red -> false
(la pantalla no ha cambiado: sigue con lo último que tenía)
```

La pantalla ve la lista vacía al empezar, recibe los productos cuando el refresco funciona, y **no pierde nada** cuando la red vuelve a caerse. El `ViewModel` ni siquiera sabe que hay una red.

## Room: la base de datos real (sin ejecutar)

Con Room, `BdFalsa` es un `@Dao` cuyas consultas devuelven `Flow`. Room se encarga de **volver a emitir** la lista cada vez que cambia la tabla:

```kotlin
// Sin ejecutar: necesita Android y las dependencias de Room
@Entity(tableName = "productos")
data class ProductoEntidad(@PrimaryKey val id: Int, val nombre: String, val precio: Double)

@Dao
interface ProductosDao {
    @Query("SELECT * FROM productos ORDER BY id")
    fun observar(): Flow<List<ProductoEntidad>>

    @Upsert                                       // inserta o actualiza
    suspend fun guardar(lista: List<ProductoEntidad>)
}
```

## Caché con caducidad

Pedir los datos en cada visita a la pantalla gasta datos y batería. Una **caché con caducidad** (TTL, *time to live*) evita repetir una petición si lo guardado es reciente. Para poder probarla, **el reloj se inyecta** en lugar de leer la hora dentro:

```kotlin
class CacheTtl<T>(private val ttlMs: Long, private val reloj: () -> Long) {
    private var valor: T? = null
    private var guardadoEn = 0L

    fun obtener(): T? = valor?.takeIf { reloj() - guardadoEn < ttlMs }
    fun poner(v: T) { valor = v; guardadoEn = reloj() }
}

fun main() {
    var ahora = 1_000L                                   // un reloj de mentira que controlamos
    val cache = CacheTtl<String>(ttlMs = 5_000, reloj = { ahora })

    println("vacía: ${cache.obtener()}")
    cache.poner("lista de productos")
    ahora += 4_000
    println("a los 4 s: ${cache.obtener()}")
    ahora += 2_000
    println("a los 6 s: ${cache.obtener()}")
}
```

**Salida:**

```text
vacía: null
a los 4 s: lista de productos
a los 6 s: null
```

Un reloj falso nos permite «viajar en el tiempo» sin esperar 6 segundos de verdad. Este truco (**inyectar lo que depende del mundo exterior**: reloj, red, aleatoriedad) es la base de la [AA4](../a4/index.md).

## Reintentos con espera creciente

Un fallo de red suele ser **momentáneo**. Reintentar es razonable, pero con cabeza: si cien móviles reintentan cada segundo, **tumban el servidor**. Se espera **cada vez más** (*exponential backoff*):

```kotlin
import java.io.IOException

suspend fun <T> reintentar(intentos: Int, esperaInicial: Long, factor: Double = 2.0, bloque: suspend (Int) -> T): T {
    var espera = esperaInicial
    repeat(intentos - 1) { n ->
        try {
            return bloque(n + 1)
        } catch (e: CancellationException) {
            throw e
        } catch (e: IOException) {                       // solo se reintenta lo que puede arreglarse solo
            println("  intento ${n + 1} falló (${e.message}); espero $espera ms")
            delay(espera)
            espera = (espera * factor).toLong()
        }
    }
    return bloque(intentos)                              // el último intento: si falla, que falle
}

fun main() = runBlocking {
    var llamadas = 0
    val resultado = reintentar(intentos = 4, esperaInicial = 10) { numero ->
        llamadas++
        if (numero < 3) throw IOException("sin red") else "datos recibidos en el intento $numero"
    }
    println(resultado)

    println("— ahora una petición que nunca funciona")
    try {
        reintentar(intentos = 3, esperaInicial = 10) { _ -> throw IOException("sin red") }
    } catch (e: IOException) {
        println("rendido: ${e.message}")
    }
}
```

**Salida:**

```text
  intento 1 falló (sin red); espero 10 ms
  intento 2 falló (sin red); espero 20 ms
datos recibidos en el intento 3
— ahora una petición que nunca funciona
  intento 1 falló (sin red); espero 10 ms
  intento 2 falló (sin red); espero 20 ms
rendido: sin red
```

Dos decisiones importantes del diseño: **solo se reintenta `IOException`** (un error 404 o un fallo de tu código no se arregla reintentando) y **la cancelación se relanza** para no retener una corrutina cancelada. En producción se añade un poco de **aleatoriedad** a la espera (*jitter*) para que no todos los móviles reintenten a la vez.

## Escrituras sin conexión: la cola de pendientes

Leer sin red es la mitad. ¿Y si el usuario **escribe** algo (marca una tarea, envía un mensaje) sin conexión? Se guarda en una **cola de operaciones pendientes** y se envía cuando se pueda, **en orden**. Si una falla, se **detiene** y se conserva el resto:

```kotlin
data class Operacion(val id: Int, val texto: String)

class ColaPendientes {
    private val pendientes = ArrayDeque<Operacion>()
    val cuantas: Int get() = pendientes.size

    fun añadir(op: Operacion) { pendientes.addLast(op) }

    /** Envía en orden. Para en el primer fallo y deja ahí el resto. Devuelve cuántas se enviaron. */
    suspend fun sincronizar(enviar: suspend (Operacion) -> Boolean): Int {
        var enviadas = 0
        while (pendientes.isNotEmpty()) {
            if (!enviar(pendientes.first())) break
            pendientes.removeFirst()
            enviadas++
        }
        return enviadas
    }
}

fun main() = runBlocking {
    val cola = ColaPendientes()
    (1..4).forEach { cola.añadir(Operacion(it, "tarea $it")) }
    println("sin conexión: ${cola.cuantas} operaciones pendientes")

    var fallarEn: Int? = 3                                // la operación 3 falla la primera vez
    val enviar: suspend (Operacion) -> Boolean = { op ->
        if (op.id == fallarEn) { fallarEn = null; println("  fallo al enviar ${op.id}"); false }
        else { println("  enviada ${op.id}"); true }
    }

    println("1.ª sincronización: ${cola.sincronizar(enviar)} enviadas, quedan ${cola.cuantas}")
    println("2.ª sincronización: ${cola.sincronizar(enviar)} enviadas, quedan ${cola.cuantas}")
}
```

**Salida:**

```text
sin conexión: 4 operaciones pendientes
  enviada 1
  enviada 2
  fallo al enviar 3
1.ª sincronización: 2 enviadas, quedan 2
  enviada 3
  enviada 4
2.ª sincronización: 2 enviadas, quedan 0
```

El orden importa (no puedes enviar «borrar tarea 3» antes de «crear tarea 3») y por eso se **para en el primer fallo**. Cada operación tendrá que ser **idempotente** en la práctica: si se envió pero la respuesta no llegó, se reenviará y el servidor no debe duplicarla (suele hacerse con un identificador único por operación).

## Sincronizar en segundo plano: WorkManager (sin ejecutar)

El sistema puede cerrar tu app, pero la cola debe vaciarse igualmente. **WorkManager** ejecuta trabajo **garantizado**, que sobrevive a cierres y reinicios, y **solo cuando se cumplen las condiciones** que pidas (por ejemplo, haber red):

```kotlin
// Sin ejecutar: necesita Android y la dependencia de WorkManager
class SincronizarWorker(contexto: Context, params: WorkerParameters) : CoroutineWorker(contexto, params) {
    override suspend fun doWork(): Result {
        val enviadas = ColaPendientes.global.sincronizar { api.enviar(it) }
        return if (ColaPendientes.global.cuantas == 0) Result.success() else Result.retry()   // retry = vuelve a intentarlo más tarde
    }
}

val peticion = OneTimeWorkRequestBuilder<SincronizarWorker>()
    .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
    .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
    .build()
WorkManager.getInstance(contexto).enqueue(peticion)
```

## Conflictos: cuando el móvil y el servidor discrepan

Si el mismo dato se cambia en dos sitios sin conexión, al sincronizar hay que decidir cuál gana. Las políticas habituales:

| Política | Cómo funciona | Cuándo |
|---|---|---|
| **Gana el servidor** | Se descarta el cambio local | Datos que el usuario no edita |
| **El último cambio gana** | Se compara la fecha de modificación | Ajustes, notas, listas sencillas |
| **Fusionar** | Se combinan los campos que no chocan | Documentos compartidos (complejo) |
| **Preguntar al usuario** | Se muestra el conflicto | Cuando perder datos es grave |

No hay una respuesta correcta: depende de cuánto duele perder un cambio en tu app.

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| Que la pantalla muestre directamente la respuesta de la red | La red escribe en la base de datos; la pantalla observa la base de datos |
| Reintentar sin espera ni límite | Espera creciente y un máximo de intentos |
| Reintentar errores que no se arreglan solos (404, datos inválidos) | Reintentar solo los fallos de red |
| Leer `System.currentTimeMillis()` dentro de la caché | Inyectar el reloj para poder probarla |
| Cola de pendientes que se envía en desorden | Enviar en orden y parar en el primer fallo |
| Olvidar la política de conflictos | Decidirla desde el diseño |

## Para practicar

Los ejercicios AA3.4 a AA3.6 de [AA3 · Ejercicios](ejercicios.md) practican la caché con reloj falso, los reintentos y la cola de pendientes.
