# 11.2 Persistencia: `remember`, `rememberSaveable` y `Saver`

El componente tiene que poder **guardar y recuperar su estado** (en Java: serializar, `persistState`). En Android no es un lujo: al **girar el móvil** el sistema destruye la actividad y la vuelve a crear. Si no guardas nada, la pantalla vuelve en blanco.

## Dos memoriales

| | `remember` | `rememberSaveable` |
|---|---|---|
| Vive mientras… | …vive la **composición** | …sobrevive a la **destrucción de la actividad** |
| Cómo | Se queda en memoria | Viaja en el **`Bundle`** del sistema |
| Úsalo para | Lo interno de la pantalla | Lo que el usuario **escribió o eligió** |

```kotlin
var sobrevive by rememberSaveable { mutableStateOf("") }   // pasa por el Bundle
var sePierde  by remember         { mutableStateOf("") }   // vive solo en la composición
```

Tras girar el dispositivo, el campo de `rememberSaveable` conserva el texto y el de `remember` aparece vacío.

## `Saver`: enseñar a guardarse a un tipo propio

`rememberSaveable` solo sabe guardar lo que cabe en un `Bundle`: números, texto, `Parcelable` y listas de eso. Un **tipo de dominio propio** hay que enseñarle a guardarse con un **`Saver`**: dos funciones, una que **reduce** el objeto a algo serializable y otra que lo **reconstruye**. Es el papel que jugaba `Serializable` / `persistState()` en AWT.

```kotlin
val SaverConfigPuntero = listSaver<ConfigPuntero, Any>(
    save = { listOf(it.velocidad, it.principal.name, it.animacion) },
    restore = { ConfigPuntero(it[0] as Int, BotonRaton.valueOf(it[1] as String), it[2] as Boolean) },
)

var config by rememberSaveable(stateSaver = SaverConfigPuntero) { mutableStateOf(ConfigPuntero()) }
```

!!! warning "Qué NO se guarda en el `Bundle`"
    El `Bundle` tiene un tope pequeño (unos cientos de kB). Se guarda lo que el usuario ha puesto o elegido: texto del formulario, filtro de la lista, pestaña activa, id del elemento seleccionado. **No** se guarda lo que se puede volver a pedir: el listado del servidor, un bitmap descargado, el contenido de la base de datos. Para eso están `ViewModel` (sobrevive a la rotación, no al proceso) y la capa de datos.

## Propiedades inmutables

Cuando la propiedad es un objeto de dominio, se cambia de forma **inmutable**: se fabrica uno nuevo con `copy`.

```kotlin
configuracion.copy(velocidad = 50)   // objeto NUEVO; el anterior sigue intacto
```

Con objetos inmutables, el evento puede entregar **la configuración completa**: no hay ambigüedad sobre qué ha cambiado ni quién lo cambió, y el `Saver` puede serializar el objeto entero de golpe. Además, una `data class` da `equals` (Compose puede comparar y no repintar de más), `copy` (cambios parciales) y `toString` (un volcado legible en el log).

Este ejemplo de Kotlin puro (el estado, su copia y la validación del dato) está **ejecutado de verdad**:

```kotlin
enum class BotonRaton(val etiqueta: String) { IZQUIERDO("Izquierdo"), DERECHO("Derecho") }

data class ConfigPuntero(
    val velocidad: Int = 25,
    val principal: BotonRaton = BotonRaton.IZQUIERDO,
    val animacion: Boolean = true,
) {
    /** Longitud (dp) y color de la barra: 0 -> 20 rojo, 25 -> 40 naranja, 50 -> 60 verde. */
    val barra: Pair<Int, String>
        get() = when (velocidad) { 0 -> 20 to "rojo"; 25 -> 40 to "naranja"; else -> 60 to "verde" }
}

fun deVelocidad(texto: String): Int {
    val v = texto.trim().toIntOrNull()
    require(v != null) { "\"$texto\" no es un número" }
    require(v in listOf(0, 25, 50)) { "La velocidad solo puede ser 0, 25 o 50, no $v" }
    return v
}

fun main() {
    val a = ConfigPuntero()
    val b = a.copy(velocidad = 50)
    println("a = $a")
    println("b = $b")
    println("a no ha cambiado: ${a.velocidad == 25}; a y b son distintos: ${a != b}")
    println("barra de b: ${b.barra}")
    println("deVelocidad(\" 25 \") = ${deVelocidad(" 25 ")}")
    for (txt in listOf("75", "abc")) {
        try { deVelocidad(txt) } catch (e: IllegalArgumentException) { println("Rechazado: ${e.message}") }
    }
}
```

**Salida:**

```text
a = ConfigPuntero(velocidad=25, principal=IZQUIERDO, animacion=true)
b = ConfigPuntero(velocidad=50, principal=IZQUIERDO, animacion=true)
a no ha cambiado: true; a y b son distintos: true
barra de b: (60, verde)
deVelocidad(" 25 ") = 25
Rechazado: La velocidad solo puede ser 0, 25 o 50, no 75
Rechazado: "abc" no es un número
```

Dos cosas que ver en la salida: `a` no cambia cuando se hace `b = a.copy(…)`, y la validación con `require` **rechaza lo imposible** (no existe la velocidad 75) antes de tocar el estado.
