# 10.3 Crear `BadgeEstado` y `SelectorMes`

Dos componentes de un mismo kit (módulo `:ui`): uno **solo dibuja** y otro **devuelve información** a la pantalla.

## El caso más simple: una píldora de estado

Un `enum` con datos hace que el color y el mensaje viajen **dentro del estado** y no repartidos por las pantallas:

```kotlin
enum class Estado(val etiqueta: String, val acento: Color) {
    OK("Completado", Color(0xFF2E7D32)),
    AVISO("Revisar", Color(0xFFF9A825)),
    ERROR("Fallido", Color(0xFFC62828)),
}
```

```kotlin
/**
 * Chivato de estado: punto de color y texto.
 * @param estado único dato obligatorio: de él salen el color y el texto por defecto
 * @param texto sustituye la etiqueta sin crear otro componente
 * @param conPunto apaga el punto en las listas donde ya sobra
 */
@Composable
fun BadgeEstado(
    estado: Estado,
    modifier: Modifier = Modifier,
    texto: String = estado.etiqueta,
    conPunto: Boolean = true,
) {
    Row(
        modifier = modifier
            .background(estado.acento.copy(alpha = 0.15f), RoundedCornerShape(50))
            .padding(horizontal = 12.dp, vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        if (conPunto) Box(Modifier.size(8.dp).background(estado.acento, CircleShape))
        Text(texto, color = estado.acento, style = MaterialTheme.typography.labelLarge)
    }
}

@Preview
@Composable
private fun VistaPreviaOk() { BadgeEstado(Estado.OK) }
```

Fíjate en lo que **no** hace: no sabe en qué pantalla está, no sabe qué idioma habla y **no crea estado propio**.

!!! tip "Un componente sin estado propio es más fácil de reutilizar"
    El estado lo decide quien lo usa; el componente solo dibuja lo que le cuentan.

## Un componente con evento: `SelectorMes`

El desplegable de meses es el mismo tipo de componente, con una diferencia: **devuelve información** a la pantalla mediante un evento.

```kotlin
@Composable
fun SelectorMes(
    mesSeleccionado: Int?,                 // lo que se ve lo manda la pantalla
    onSeleccion: (Int) -> Unit,            // evento de salida: sube el número de mes
    modifier: Modifier = Modifier,
) {
    var abierto by remember { mutableStateOf(false) }   // estado INTERNO: solo «está el menú abierto»
    val meses = listOf("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre")
    Box(modifier) {
        OutlinedButton(onClick = { abierto = true }) {
            Text(mesSeleccionado?.let { meses[it - 1] } ?: "Elige un mes")
        }
        DropdownMenu(expanded = abierto, onDismissRequest = { abierto = false }) {
            meses.forEachIndexed { i, nombre ->
                DropdownMenuItem(text = { Text(nombre) }, onClick = { abierto = false; onSeleccion(i + 1) })
            }
        }
    }
}
```

!!! note "Estado interno solo para lo interno"
    Que el menú esté abierto es asunto del componente (`remember`). Qué mes hay elegido es asunto de la **pantalla**: llega como parámetro y se cambia con el evento.

## Caso práctico: recarga del abono del metro

La Red de Transporte quiere una pantalla para recargar el abono mensual: un desplegable con los doce meses y una confirmación.

```kotlin
@Composable
fun PantallaAbono() {
    var mes by remember { mutableStateOf<Int?>(null) }          // estado de la PANTALLA
    Column(Modifier.padding(24.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Text("Recarga del abono", style = MaterialTheme.typography.headlineSmall)
        SelectorMes(mesSeleccionado = mes, onSeleccion = { elegido -> mes = elegido })
        mes?.let { Text("Recargado: mes $it · 20,00 EUR") }
    }
}
```

!!! success "El detalle con nota"
    **El componente no sabe qué es un abono.** `SelectorMes` solo sabe de meses; la lógica del precio y de la confirmación es de la pantalla. Ese reparto es lo que permite reutilizar el mismo desplegable en una cita médica, una reserva o una matrícula.

## Una vista previa por estado

Un componente que se ve distinto según su estado trae **un `@Preview` por estado**. Cuando los estados salen de una lista, se usa `@PreviewParameter` con un proveedor y el editor genera una fila por cada valor:

```kotlin
class ProveedorEstado : PreviewParameterProvider<Estado> {
    override val values = sequenceOf(Estado.OK, Estado.AVISO, Estado.ERROR)
}

@Preview
@Composable
private fun VistaPreviaParametrizada(@PreviewParameter(ProveedorEstado::class) estado: Estado) {
    BadgeEstado(estado)
}
```
