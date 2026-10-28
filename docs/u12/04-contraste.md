# 12.4 Contraste: la fórmula que se calcula, no se discute

El contraste entre dos colores **no se estima a ojo**: se calcula con dos fórmulas publicadas en las WCAG.

## Las fórmulas

**1 · Canal de color a luz lineal.** La pantalla aplica una corrección *gamma*, así que 0,5 no es la mitad de luz; la norma deshace esa corrección en dos tramos:

* `C_lineal = C_sRGB / 12,92` si `C_sRGB ≤ 0,03928`
* `C_lineal = ((C_sRGB + 0,055) / 1,055) ^ 2,4` en otro caso

**2 · Luminancia relativa** (0 = negro, 1 = blanco), con los pesos de la percepción humana (el verde pesa mucho más que el azul):

`L = 0,2126 · R_lineal + 0,7152 · G_lineal + 0,0722 · B_lineal`

**3 · Ratio de contraste**, de 1:1 a 21:1:

`ratio = (L_claro + 0,05) / (L_oscuro + 0,05)`

El `+ 0,05` evita dividir por cero cuando el color oscuro es negro puro (luminancia 0).

| Situación | AA | AAA |
|---|---|---|
| Texto normal (< 18 pt) | **4,5:1** | **7:1** |
| Texto grande (≥ 18 pt o ≥ 14 pt en negrita) | **3:1** | **4,5:1** |
| Iconos, bordes, controles (1.4.11) | **3:1** | — |

!!! success "21:1 y 1:1"
    **21:1 es el máximo posible** (negro sobre blanco) y **1:1 el mínimo** (un color contra sí mismo). Son los dos valores con los que se prueba que la fórmula está bien implementada: si tu código no da exactamente 21 y 1, está mal.

## El código que lo calcula (ejecutado)

Tres detalles que se preguntan: `canalLineal` tiene **dos tramos**; `ratio` **ordena** con `max`/`min` antes de dividir (da igual el orden de los argumentos); y `sobre` **compone un color con alfa** sobre su fondo (siguiente apartado).

```kotlin
import kotlin.math.pow

/** Contraste de color según WCAG 2.2 (criterios 1.4.3 y 1.4.6). Colores como entero RGB 0xRRGGBB. */
object Contraste {
    /** 1) Canal sRGB (0..255) a luz lineal: dos tramos. */
    fun canalLineal(c: Int): Double {
        val s = c / 255.0
        return if (s <= 0.03928) s / 12.92 else ((s + 0.055) / 1.055).pow(2.4)
    }

    /** 2) Luminancia relativa: 0 = negro, 1 = blanco. El verde pesa mucho más que el azul. */
    fun luminancia(rgb: Int): Double {
        val r = (rgb shr 16) and 0xFF
        val g = (rgb shr 8) and 0xFF
        val b = rgb and 0xFF
        return 0.2126 * canalLineal(r) + 0.7152 * canalLineal(g) + 0.0722 * canalLineal(b)
    }

    /** 3) Ratio de 1:1 a 21:1. Se ordenan con max/min: da igual el orden de los argumentos. */
    fun ratio(a: Int, b: Int): Double {
        val la = luminancia(a)
        val lb = luminancia(b)
        return (maxOf(la, lb) + 0.05) / (minOf(la, lb) + 0.05)
    }

    /** Compone un color con transparencia sobre un fondo opaco: capa·α + base·(1 − α). */
    fun sobre(fondo: Int, capa: Int, alfa: Double): Int {
        fun mezcla(desplazar: Int): Int {
            val c = (capa shr desplazar) and 0xFF
            val f = (fondo shr desplazar) and 0xFF
            return Math.round(c * alfa + f * (1 - alfa)).toInt()
        }
        return (mezcla(16) shl 16) or (mezcla(8) shl 8) or mezcla(0)
    }

    /** Veredicto con los umbrales de la norma: texto normal 4,5 (AA) y 7 (AAA); texto grande 3 y 4,5. */
    fun veredicto(ratio: Double, textoGrande: Boolean = false): String = when {
        ratio >= (if (textoGrande) 4.5 else 7.0) -> "AAA"
        ratio >= (if (textoGrande) 3.0 else 4.5) -> "AA"
        else -> "no cumple"
    }
}

fun fmt(x: Double) = String.format("%.2f", x).replace('.', ',')

fun main() {
    val negro = 0x000000
    val blanco = 0xFFFFFF
    println("negro sobre blanco : ${fmt(Contraste.ratio(negro, blanco))}:1   (máximo posible)")
    println("blanco sobre negro : ${fmt(Contraste.ratio(blanco, negro))}:1   (el orden no importa)")
    println("un color consigo   : ${fmt(Contraste.ratio(0x336699, 0x336699))}:1   (mínimo posible)")
    println()
    val pares = listOf("gris #767676" to 0x767676, "gris #777777" to 0x777777, "placeholder #BDBDBD" to 0xBDBDBD)
    for ((nombre, gris) in pares) {
        val r = Contraste.ratio(gris, blanco)
        println("$nombre sobre blanco: ${fmt(r)}:1  -> ${Contraste.veredicto(r)}")
    }
    println()
    val ambar = 0xF9A825
    val tinte = Contraste.sobre(blanco, ambar, 0.15)
    println("ámbar contra sí mismo (alfa sin componer): ${fmt(Contraste.ratio(ambar, ambar))}:1  <- falso")
    println("ámbar sobre su tinte al 15 % (compuesto) : ${fmt(Contraste.ratio(ambar, tinte))}:1  -> ${Contraste.veredicto(Contraste.ratio(ambar, tinte))}")
    val oscuro = 0x7A4F00
    println("texto ámbar oscuro sobre ese tinte        : ${fmt(Contraste.ratio(oscuro, tinte))}:1  -> ${Contraste.veredicto(Contraste.ratio(oscuro, tinte))}")
    println("umbral del texto grande: 3,00 -> ${Contraste.veredicto(3.0, textoGrande = true)} ; 2,99 -> ${Contraste.veredicto(2.99, textoGrande = true)}")
}
```

**Salida:**

```text
negro sobre blanco : 21,00:1   (máximo posible)
blanco sobre negro : 21,00:1   (el orden no importa)
un color consigo   : 1,00:1   (mínimo posible)

gris #767676 sobre blanco: 4,54:1  -> AA
gris #777777 sobre blanco: 4,48:1  -> no cumple
placeholder #BDBDBD sobre blanco: 1,88:1  -> no cumple

ámbar contra sí mismo (alfa sin componer): 1,00:1  <- falso
ámbar sobre su tinte al 15 % (compuesto) : 1,78:1  -> no cumple
texto ámbar oscuro sobre ese tinte        : 6,44:1  -> AA
umbral del texto grande: 3,00 -> AA ; 2,99 -> no cumple
```

Dos lecturas de esta salida: `#767676` sobre blanco da **4,54:1** (justo AA) y `#777777` da **4,48:1** (no llega): una diferencia que el ojo no ve y la fórmula sí.

## La trampa del alfa

Un badge que pinta su fondo con `acento.copy(alpha = 0.15f)` conserva los canales RGB del acento y solo cambia la opacidad. Si mides el contraste entre ese color y el texto, comparas el acento **consigo mismo**: da **1:1** siempre (arriba, la línea «falso»). El número es correcto y la conclusión es falsa.

Un color con alfa no se ve tal cual: se ve **la mezcla con lo que hay debajo**:

`C_resultado = C_capa · α + C_base · (1 − α)`

!!! success "Se compone antes de medir"
    **Antes de medir un color translúcido se compone sobre el fondo real** (el que hay debajo en la pantalla, no el blanco del editor). Si no, da 1:1 y la auditoría miente.

## Qué hacer cuando un contraste no llega

De menos a más invasivo:

1. **Oscurecer el texto** (o aclararlo si el fondo es oscuro): casi siempre basta (arriba, el ámbar oscuro pasa de 1,78 a 6,44).
2. **Aclarar el fondo**: bajar la intensidad del tinte.
3. **Subir el tamaño o el peso**: si el texto pasa a «grande», el umbral baja de 4,5 a 3.
4. **Cambiar el par de colores**: texto oscuro sobre tinte claro en vez del acento sobre su propio tinte (es lo que hace Material 3 con los roles `container` / `onContainer`).
5. **No usar el color como única señal**: icono + texto.

Lo que **no** se hace: dejar el fallo y escribir «se ve bien». La norma tiene un número y el número está o no está.
