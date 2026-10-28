# 12.6 Evaluar la usabilidad: pruebas, Nielsen, usuarios y SUS

La usabilidad se prueba en **dos niveles**: lo que se puede comprobar con código (**los números**) y lo que necesita personas (**los flujos**).

## Pruebas automáticas (los números)

Una prueba de accesibilidad **no comprueba «que se ve bien»: comprueba un número**. Como el número está en la norma, la prueba no caduca.

| Prueba | Qué demuestra |
|---|---|
| `elRatioDaLosValoresConocidosDeLaNorma` | La fórmula da **21:1 y 1:1** exactos y el orden de los argumentos no cambia el resultado |
| `elAlfaSeComponeAntesDeMedir` | El color translúcido se compone antes de medir (el fallo no vuelve) |
| `losUmbralesSonLosDeWCAG` | 4,5 y 7 están donde dice la norma, y una centésima por debajo suspende |
| `elDetectorDeToquesMarcaCortaLaTeclaDelPiano` | 44 dp no cumple; 48 sí; 40 × 40 tampoco |
| `elPanelEnsenyaElVeredictoDeCadaPar` | La pantalla pinta el ratio y el resumen cuenta bien |

```text
com.example.uikit.test.UsabilidadTest:.....
Time: 20.029
OK (16 tests)          ← las 11 del tema 5 más las 5 de este tema
```

## Menús y distribución de controles

Un menú cumple la **ISO 9241-14** cuando:

* tiene **pocas opciones por nivel** (7 ± 2) y nombres que se entienden sin manual,
* la **profundidad** no pasa de 2-3 niveles,
* las acciones están donde se espera: lo destructivo, separado y confirmado; lo frecuente, a mano,
* hay **coherencia**: el mismo tipo de acción en el mismo sitio de todas las pantallas,
* existe **salida**: se puede volver atrás y deshacer.

En una app táctil el menú suele ser una barra inferior o un `NavigationBar`; los criterios son los mismos.

## Evaluación heurística: las diez de Nielsen

Un experto recorre la interfaz con esta lista y apunta cada fallo con su gravedad. Es barato y rápido, y con 3-5 evaluadores encuentra entre el 70 y el 80 % de los problemas.

| # | Heurística | En una frase |
|---|---|---|
| 1 | Visibilidad del estado | La app dice siempre qué está pasando |
| 2 | Lenguaje del usuario | Habla como el usuario, no como el programador |
| 3 | Control y libertad | Se puede deshacer y salir |
| 4 | Consistencia | Lo mismo se hace igual en todas partes |
| 5 | Prevención de errores | Mejor impedir el error que avisar después |
| 6 | Reconocer antes que recordar | Las opciones se ven, no se memorizan |
| 7 | Flexibilidad y eficiencia | Atajos para el experto, calma para el novato |
| 8 | Diseño minimalista | Lo que no ayuda, estorba |
| 9 | Recuperación de errores | Mensaje claro y salida |
| 10 | Ayuda y documentación | Ayuda en contexto, no un PDF perdido |

**Gravedad** de cada hallazgo, escala de Nielsen:

| Valor | Nombre | Qué hacer |
|---|---|---|
| 0 | No es problema | Nada |
| 1 | Cosmético | Si sobra tiempo |
| 2 | Menor | Prioridad baja |
| 3 | Mayor | Arreglar antes de publicar |
| 4 | Catastrófico | Bloquea la publicación |

## Pruebas con usuarios: cinco bastan, y el SUS

**Cinco usuarios** bastan para encontrar **~85 %** de los problemas de un flujo (Nielsen y Landauer, 1993, con λ ≈ 0,31: `1 − (1 − 0,31)^5`). No hacen falta cien: hacen falta cinco que se parezcan al usuario real.

Para medir la **satisfacción** se usa el **SUS** (*System Usability Scale*): diez afirmaciones de 1 a 5 que dan un número de 0 a 100.

| Puntuación SUS | Lectura |
|---|---|
| < 51 | Inaceptable |
| 51-67 | Marginal |
| **68** | **Media del sector** |
| 68-80 | Aceptable |
| > 80 | Excelente |

!!! success "68 es la media histórica"
    Por debajo, la app está por debajo de la mitad del mercado.

Cómo se calcula (ejecutado): las afirmaciones **impares** puntúan `respuesta − 1`, las **pares** `5 − respuesta`, y la suma se multiplica por **2,5**.

```kotlin
import kotlin.math.pow

/** SUS: diez afirmaciones de 1 a 5. Impares: respuesta - 1. Pares: 5 - respuesta. La suma se multiplica por 2,5. */
fun sus(respuestas: List<Int>): Double {
    require(respuestas.size == 10 && respuestas.all { it in 1..5 }) { "Hacen falta 10 respuestas de 1 a 5" }
    val suma = respuestas.mapIndexed { i, r -> if (i % 2 == 0) r - 1 else 5 - r }.sum()   // i = 0 es la afirmación 1 (impar)
    return suma * 2.5
}

fun lectura(p: Double) = when {
    p < 51 -> "Inaceptable"
    p < 68 -> "Marginal"
    p <= 80 -> if (p == 68.0) "Media del sector" else "Aceptable"
    else -> "Excelente"
}

/** Proporción de problemas hallada por n usuarios, con λ ≈ 0,31 (Nielsen y Landauer, 1993). */
fun problemasHallados(n: Int, lambda: Double = 0.31) = 1 - (1 - lambda).pow(n)

fun main() {
    val casos = mapOf(
        "todo lo mejor posible" to listOf(5, 1, 5, 1, 5, 1, 5, 1, 5, 1),
        "todo neutral (un 3)" to List(10) { 3 },
        "una app del montón" to listOf(4, 2, 4, 2, 3, 3, 4, 2, 4, 3),
        "cuestionario peor" to listOf(1, 5, 1, 5, 1, 5, 1, 5, 1, 5),
    )
    for ((nombre, r) in casos) println("${nombre.padEnd(22)} SUS = ${sus(r)} -> ${lectura(sus(r))}")
    println()
    for (n in listOf(1, 3, 5, 10)) println("$n ${if (n == 1) "usuario encuentra" else "usuarios encuentran"} ${"%.1f".format(problemasHallados(n) * 100)} % de los problemas")
}
```

**Salida:**

```text
todo lo mejor posible  SUS = 100.0 -> Excelente
todo neutral (un 3)    SUS = 50.0 -> Inaceptable
una app del montón     SUS = 67.5 -> Marginal
cuestionario peor      SUS = 0.0 -> Inaceptable

1 usuario encuentra 31,0 % de los problemas
3 usuarios encuentran 67,1 % de los problemas
5 usuarios encuentran 84,4 % de los problemas
10 usuarios encuentran 97,6 % de los problemas
```

## El informe de usabilidad

1. **Objetivo y alcance**: qué se ha evaluado y qué no.
2. **Método**: heurística con N expertos, o test con N usuarios y qué tareas.
3. **Perfil de los participantes.**
4. **Resultados por hallazgo**: captura, heurística o criterio incumplido, gravedad, recomendación.
5. **Métricas**: tiempo por tarea, errores, SUS.
6. **Priorización**: qué se arregla antes de publicar.

Los hallazgos se ordenan **por gravedad**, no por el orden en que se encontraron, y cada uno lleva su **evidencia** (una captura o un número). Sin evidencia no es un hallazgo: es una queja.

## Errores típicos al auditar

| Error | Por qué está mal | Qué hacer |
|---|---|---|
| Medir el contraste «a ojo» | El ojo se adapta y engaña | Calcular con la fórmula |
| Medir un color con alfa sin componerlo | Da 1:1 y conclusiones falsas | Componer sobre el fondo real |
| Confundir área de toque con dibujo | El icono puede ser pequeño y la zona grande | Medir la zona que responde |
| Texto en `dp` | No escala con la fuente del sistema | `sp` siempre |
| Información solo por color | Invisible para daltónicos y lectores | Color + icono + texto |
| `contentDescription` en imágenes decorativas | El lector anuncia adornos | `null` en lo decorativo |
| Probar solo en un móvil de gama alta | El fallo aparece en el móvil del usuario | Probar con fuente al 200 %, modo oscuro y pantalla pequeña |
| Confundir «accesible» con «feo» | Se sacrifica el diseño sin necesidad | Se puede ser accesible y bonito |
| Arreglar sin volver a medir | Se cambia un color y se rompe otro par | Repetir la auditoría tras el cambio |
| Informe sin gravedad | Todo parece igual de urgente | Escala 0-4 |
