# 2.5 Objetos y atributos en la interfaz

Hasta ahora has pasado a los composables textos y números sueltos. Cuando los datos se complican (un producto con nombre, precio y stock), lo natural es agruparlos en un **objeto** y pasar el objeto entero.

## Clase, objeto, atributo y método

* Una **clase** es un molde: dice qué datos y qué acciones tiene algo.
* Un **objeto** (o instancia) es una cosa concreta creada con ese molde.
* Los **atributos** (o propiedades) son sus datos: nombre, precio...
* Los **métodos** son lo que sabe hacer: calcular un descuento, aumentar el stock...

```kotlin
class Producto(
    val nombre: String,      // atributo
    val precio: Double,      // atributo
    var stock: Int           // atributo que puede cambiar
) {
    fun conDescuento(porcentaje: Int): Double =    // método
        precio - precio * porcentaje / 100
}
```

## Pintar los atributos de un objeto

La interfaz **lee** los atributos y los coloca en componentes. Cada atributo acaba en un `Text`, y alguno puede decidir cómo se ve algo (por ejemplo, un color si no queda stock):

```kotlin
@Composable
fun TarjetaProducto(producto: Producto) {
    Card(modifier = Modifier.fillMaxWidth().padding(8.dp)) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(producto.nombre, style = MaterialTheme.typography.titleLarge)
            Text("${producto.precio} €")
            Text(
                if (producto.stock > 0) "Quedan ${producto.stock}" else "Agotado",
                color = if (producto.stock > 0) Color.Unspecified else Color.Red
            )
        }
    }
}

// uso: se crea el objeto y se pasa a la interfaz
TarjetaProducto(Producto("Auriculares", 29.9, 4))
```

Los datos viven en el objeto y la interfaz solo los dibuja. Si mañana el producto tiene una foto, se añade un atributo y un componente, sin tocar nada más.

## La trampa: un atributo que cambia no redibuja

Este botón **no funciona** como esperas:

```kotlin
class Contador { var valor = 0 }                   // atributo normal

@Composable
fun PantallaMala() {
    val c = remember { Contador() }
    Button(onClick = { c.valor++ }) { Text("Pulsado: ${c.valor}") }   // la cifra no cambia
}
```

El atributo cambia, pero Compose **no se entera**, así que no vuelve a dibujar. Para que la interfaz reaccione, el atributo tiene que ser **estado**:

```kotlin
class Contador {
    var valor by mutableIntStateOf(0)             // atributo observado por Compose
        private set                                // solo la clase puede cambiarlo
    fun sumar() { valor++ }                        // método que lo modifica
}

@Composable
fun PantallaBuena() {
    val c = remember { Contador() }
    Button(onClick = { c.sumar() }) { Text("Pulsado: ${c.valor}") }
}
```

!!! info "Por qué importa"
    Esto es justo lo que ya hacías con `var cuenta by remember { mutableStateOf(0) }`: un valor que, al cambiar, **provoca que la interfaz se redibuje**. Aquí lo has metido dentro de un objeto. En la [U8](../u08/index.md) verás el `ViewModel`, que es esta misma idea llevada a una pantalla entera.

!!! tip "`data class` para datos"
    Si la clase solo guarda datos (una tarea, un contacto), usa `data class Tarea(val titulo: String, val hecha: Boolean)`. Kotlin le añade solo `toString`, comparación y `copy()`, que es muy cómodo para cambiar un atributo creando un objeto nuevo.

## Resumen

* Agrupa los datos relacionados en una **clase** y pasa el **objeto** al composable.
* La interfaz lee los **atributos**; los **métodos** los modifican.
* Si un atributo debe redibujar la pantalla, hazlo **estado** (`mutableStateOf`, `mutableIntStateOf`...).
