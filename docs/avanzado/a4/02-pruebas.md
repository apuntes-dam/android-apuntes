# AA4.2 Probar la lógica de la app

!!! info "Qué se ha ejecutado y qué no"
    El código en Kotlin puro y **las pruebas** (JUnit 4, `kotlin.test` y `kotlinx-coroutines-test`) se han **compilado y ejecutado de verdad** al construir esta web: las salidas que ves, incluida la de un fallo, son las reales. Hilt y las pruebas de Compose **no se han ejecutado aquí** (necesitan Android) y están marcados «sin ejecutar».

## Qué se prueba y dónde

Las pruebas de una app Android se reparten en dos sitios, y la diferencia es de **velocidad**:

| | Pruebas locales (`src/test`) | Pruebas instrumentadas (`src/androidTest`) |
|---|---|---|
| Dónde se ejecutan | En tu **ordenador** (la JVM) | En un **móvil o emulador** |
| Velocidad | Milisegundos | Minutos |
| Qué prueban | **Lógica**: reductores, `ViewModel`, repositorios, mapeos | Interfaz real, base de datos real, la app entera |
| Cuántas | **Muchas** | Pocas, para lo que no se pueda comprobar de otra forma |

De ahí el consejo de toda la unidad: **saca la lógica a clases que no dependan de Android** (como hicimos con el reductor de la [AA1](../a1/01-estado-udf.md)) y la podrás probar en milisegundos. El resto de esta página usa exactamente esa idea.

## Una prueba, de verdad

Con el reductor del contador de la AA1 (`ContadorState`, `EventoContador` y `reducir`). Se usa **JUnit 4** con `kotlin.test` y se ha ejecutado con el ejecutor de JUnit:

```kotlin
import kotlin.test.*

class ContadorTest {
    @Test
    fun sumar_aumenta_en_uno() {
        assertEquals(ContadorState(1), reducir(ContadorState(0), EventoContador.Sumar))
    }

    @Test
    fun restar_nunca_baja_de_cero() {
        assertEquals(0, reducir(ContadorState(0), EventoContador.Restar).valor)
    }

    @Test
    fun reiniciar_vuelve_a_cero() {
        assertEquals(0, reducir(ContadorState(7), EventoContador.Reiniciar).valor)
    }
}
```

**Salida de las pruebas:**

```text
...
OK (3 tests)
```

Cada función con `@Test` es una prueba independiente. Fíjate en el patrón de los nombres: **qué se hace y qué debe pasar** (`restar_nunca_baja_de_cero`). Cuando una falla, el nombre ya te dice qué se ha roto.

### Cuando una prueba falla

Una prueba que nunca ha fallado no te ha demostrado nada. Esta tiene una expectativa equivocada a propósito:

```kotlin
import kotlin.test.*

class ContadorMalTest {
    @Test
    fun suma_bien() {
        assertEquals(1, reducir(ContadorState(0), EventoContador.Sumar).valor)
    }

    @Test
    fun esta_esta_mal() {
        // Esperamos 5, pero el reductor devuelve 2: la prueba debe FALLAR
        assertEquals(5, reducir(ContadorState(1), EventoContador.Sumar).valor, "al sumar 1 a 1")
    }
}
```

**Salida de las pruebas:**

```text
.E.
There was 1 failure:
1) esta_esta_mal(ContadorMalTest)
java.lang.AssertionError: al sumar 1 a 1 expected:<5> but was:<2>
FAILURES!!!
Tests run: 2,  Failures: 1
```

La salida dice **qué prueba falló** (`esta_esta_mal`), el **mensaje** que escribiste, y **lo esperado frente a lo obtenido** (`expected:<5> but was:<2>`). Las líneas de la traza de pila se han omitido aquí por brevedad.

Funciones de comprobación habituales de `kotlin.test`:

| Función | Comprueba |
|---|---|
| `assertEquals(esperado, real)` | Que los dos valores son iguales |
| `assertTrue(c)` / `assertFalse(c)` | Que una condición es verdadera / falsa |
| `assertNull(x)` / `assertNotNull(x)` | Nulo / no nulo |
| `assertFailsWith<IOException> { ... }` | Que el bloque lanza esa excepción |

## Probar corrutinas: `runTest` y el tiempo virtual

Probar código con `delay(5000)` esperando 5 segundos reales sería inviable. `runTest` ejecuta la prueba con un **reloj virtual**: cuando solo queda esperar, el reloj **salta** al siguiente momento interesante, al instante.

```kotlin
suspend fun cuentaAtras(desde: Int): List<Int> {
    val lista = mutableListOf<Int>()
    for (i in desde downTo 1) {
        delay(1000)
        lista += i
    }
    return lista
}

fun main() {
    val inicioReal = System.currentTimeMillis()
    runTest {
        val resultado = cuentaAtras(5)
        println("resultado: $resultado")
        println("tiempo virtual transcurrido: ${testScheduler.currentTime} ms")
    }
    val real = System.currentTimeMillis() - inicioReal
    println("¿tardó menos de 2 s de verdad? ${real < 2000}")
}
```

**Salida:**

```text
resultado: [5, 4, 3, 2, 1]
tiempo virtual transcurrido: 5000 ms
¿tardó menos de 2 s de verdad? true
```

Cinco segundos de espera simulados en una fracción de segundo. Y con el control del reloj puedes comprobar lo que pasa **en un momento concreto**:

```kotlin
fun main() = runTest {
    var avisos = 0
    val trabajo = launch {
        while (true) {
            delay(1000)
            avisos++
        }
    }

    advanceTimeBy(3500)                       // avanza el reloj virtual 3,5 s
    println("a los 3,5 s: $avisos avisos")
    advanceTimeBy(2000)
    println("a los 5,5 s: $avisos avisos")
    trabajo.cancel()
}
```

**Salida:**

```text
a los 3,5 s: 3 avisos
a los 5,5 s: 5 avisos
```

`advanceTimeBy` ejecuta lo que toque hasta ese instante. Así se prueban **temporizadores, reintentos con espera y `debounce`** sin esperar nunca.

## Probar un `Flow` con tiempo: la búsqueda de la AA2

El buscador de la [AA2.2](../a2/02-flow.md) es el candidato perfecto: tiene `debounce`, y probarlo en tiempo real obligaría a esperar. Aquí el código a probar y sus dos pruebas, ejecutadas:

```kotlin
@OptIn(FlowPreview::class, ExperimentalCoroutinesApi::class)
class Buscador(private val buscar: suspend (String) -> List<String>) {
    fun resultados(teclado: Flow<String>): Flow<List<String>> = teclado
        .debounce(300)
        .distinctUntilChanged()
        .filter { it.length >= 2 }
        .mapLatest { buscar(it) }
}
```

```kotlin
import kotlin.test.*

class BuscadorTest {
    @Test
    fun espera_a_que_deje_de_escribir() = runTest {
        val consultas = mutableListOf<String>()
        val buscador = Buscador { q -> consultas += q; listOf("resultado de $q") }

        val teclado = flow {
            emit("k"); delay(100)
            emit("ko"); delay(100)
            emit("kot"); delay(1000)          // 1 segundo de pausa… en tiempo virtual
        }

        val resultados = buscador.resultados(teclado).toList()
        assertEquals(listOf("kot"), consultas)                      // solo UNA búsqueda
        assertEquals(listOf(listOf("resultado de kot")), resultados)
    }

    @Test
    fun ignora_las_consultas_de_una_letra() = runTest {
        var llamadas = 0
        val buscador = Buscador { llamadas++; emptyList() }

        buscador.resultados(flow { emit("a"); delay(1000) }).toList()
        assertEquals(0, llamadas)
    }
}
```

**Salida de las pruebas:**

```text
..
OK (2 tests)
```

La primera prueba comprueba la promesa del `debounce`: tres pulsaciones seguidas dan **una sola búsqueda**. El flujo contiene un segundo de pausa, pero gracias a `runTest` **no se espera ni un milisegundo real**.

## Dobles de prueba: falsos, no mocks

Para aislar la clase que pruebas hay que sustituir sus dependencias por «dobles». Los tipos, de más simple a más complejo:

| Doble | Qué es | Ejemplo |
|---|---|---|
| **Falso** (*fake*) | Una implementación **simple pero real** | `BdFalsa` en memoria, `RelojFalso` |
| **Stub** | Devuelve respuestas fijas | `ApiSinRed` que siempre lanza `IOException` |
| **Mock** | Verifica **que se llamó** a algo (librerías como MockK) | «comprueba que se llamó a `guardar` una vez» |

La recomendación actual en Android es **preferir falsos**: son código normal, se reutilizan y se rompen menos cuando refactorizas, porque comprueban **el resultado** y no **cómo** se hizo. Los mocks atan la prueba a la implementación interna.

## Probar un `ViewModel`

Un `ViewModel` usa `viewModelScope`, que corre en `Dispatchers.Main`, y en un test local no hay hilo principal de Android. Hay dos soluciones:

1. **Inyectar el ámbito o el dispatcher** (lo más limpio): el `ViewModel` recibe un `CoroutineScope` o un `CoroutineDispatcher`, y la prueba le pasa el de prueba.
2. **Sustituir `Dispatchers.Main`** con `Dispatchers.setMain(...)` antes de cada prueba y `resetMain()` después:

```kotlin
class Modelo {
    val estado = MutableStateFlow("vacío")
    private val ambito = CoroutineScope(SupervisorJob() + Dispatchers.Main)    // como viewModelScope

    fun cargar() {
        ambito.launch {
            delay(500)
            estado.value = "cargado"
        }
    }
}

fun main() {
    val dispatcher = StandardTestDispatcher()
    Dispatchers.setMain(dispatcher)                      // «el hilo principal» pasa a ser el de prueba
    try {
        runTest(dispatcher) {
            val modelo = Modelo()
            modelo.cargar()
            println("justo después de llamar: ${modelo.estado.value}")
            advanceTimeBy(600)
            runCurrent()
            println("tras 600 ms virtuales:   ${modelo.estado.value}")
        }
    } finally {
        Dispatchers.resetMain()                          // siempre se deja como estaba
    }
}
```

**Salida:**

```text
justo después de llamar: vacío
tras 600 ms virtuales:   cargado
```

## Pruebas de Compose (sin ejecutar)

Las pantallas de Compose se prueban con `createComposeRule()`, buscando elementos por su **texto** o por una **etiqueta de prueba** (`testTag`). Son pruebas **instrumentadas**: necesitan un móvil o emulador.

```kotlin
// Sin ejecutar: necesita Android y las dependencias de pruebas de Compose
class ContadorPantallaTest {
    @get:Rule val regla = createComposeRule()

    @Test
    fun al_pulsar_sumar_el_texto_cambia() {
        regla.setContent { ContadorScreen(estado = ContadorState(0), onEvento = {}) }

        regla.onNodeWithText("Valor: 0").assertIsDisplayed()
        regla.onNodeWithTag("boton_sumar").performClick()
    }
}
```

Como `ContadorScreen` es una función que **recibe estado y eventos** (no sabe nada de `ViewModel`, como vimos en la AA1), se prueba pasándole el estado que quieras, sin red ni base de datos. Esa es la recompensa de separar la pantalla de la lógica.

## Errores frecuentes

| Error | Cómo evitarlo |
|---|---|
| Probar con `Thread.sleep` o `delay` real | `runTest` y tiempo virtual |
| Pruebas que dependen de la hora o del azar | Inyectar el reloj y `Random` |
| Pruebas que dependen unas de otras | Cada una crea su propio estado |
| Mocks por todas partes | Falsos simples; mocks solo cuando de verdad haga falta verificar una llamada |
| Probar solo el «caso feliz» | Prueba también el error, el vacío y los límites (0, lista vacía, texto en blanco) |
| Olvidar `resetMain()` | Siempre en `finally` o en `@After` |
| Todo en pruebas instrumentadas | La lógica, en pruebas locales: son cien veces más rápidas |

## Para practicar

Los ejercicios AA4.4 a AA4.6 de [AA4 · Ejercicios](ejercicios.md) practican el tiempo virtual y escribir pruebas JUnit que se ejecutan de verdad.
