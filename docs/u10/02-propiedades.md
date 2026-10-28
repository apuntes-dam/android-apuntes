# 10.2 Propiedades, valores por defecto y `modifier`

Las **propiedades** de un componente son los datos públicos que forman su apariencia y su comportamiento. En Java se consultaban y cambiaban con `getX()`/`setX()`. En Compose las **propiedades son los parámetros de la función**, y el **valor por defecto** de una propiedad es, sin más, el valor por defecto del parámetro.

```kotlin
@Composable
fun BadgeEstado(
    estado: Estado,                          // único dato obligatorio
    modifier: Modifier = Modifier,           // lo decide quien te llama
    texto: String = estado.etiqueta,         // por defecto, la etiqueta del estado
    conPunto: Boolean = true,                // propiedad opcional booleana
) { /* ... */ }
```

## JavaBean frente a Compose

| Concepto JavaBean | Equivalente Compose | Ejemplo |
|---|---|---|
| Propiedad con getter/setter | Parámetro de la función | `style: TextStyle` |
| Valor por defecto en el setter | Valor por defecto del parámetro | `texto: String = estado.etiqueta` |
| Propiedad opcional booleana | `Boolean` con valor por defecto | `conPunto: Boolean = true` |
| Propiedad calculada | Expresión en el valor por defecto | `relleno = estado.acento.copy(alpha = 0.15f)` |
| Método `paintComponent(...)` | Cuerpo de la `@Composable` | El `Row { … }` que dibuja la píldora |
| Evento con `ActionListener` | Parámetro **lambda** | `onSeleccion: (Int) -> Unit` |

## Tres reglas que deciden si un componente es bueno

!!! warning "Se preguntan en el examen"
    1. **`modifier: Modifier = Modifier` siempre, como primer parámetro opcional.** Es lo que permite a quien llama colocar y dar tamaño a tu componente sin tocar tu código.
    2. Un parámetro con valor por defecto **es documentación**: dice qué es opcional y cuál es el comportamiento normal.
    3. Si una propiedad se calcula a partir de otra, **calcúlala en el valor por defecto** en vez de obligar a quien llama a repetir la cuenta.

El `modifier` se aplica al **contenedor raíz** del componente:

```kotlin
@Composable
fun Etiqueta(texto: String, modifier: Modifier = Modifier) {
    Text(texto, modifier = modifier.padding(4.dp))   // el modifier del llamador va delante
}
```

## Qué era un JavaBean y por qué ya no se escribe

La especificación **JavaBean** pedía: clase pública, constructor sin argumentos, que implemente **`Serializable`**, con **propiedades privadas** accesibles por **`getX()`/`setX()`** y **eventos por escucha**. Con esas reglas, un editor visual podía crear componentes por reflexión.

De JavaBean nos queda la **idea** (datos públicos bien definidos, constructor sencillo, comportamiento predecible) y nos sobra la **sintaxis**: Kotlin convierte cada propiedad en getter y setter automáticamente.

```kotlin
// 1) JavaBean clásico (Java): 8 líneas para un solo dato
public class Badge {
    private String texto;
    public String getTexto() { return texto; }
    public void setTexto(String t) { texto = t; }
}

// 2) Kotlin: propiedad, getter y setter en una línea
class Badge { var texto: String = "" }

// 3) Compose: la propiedad es un parámetro de la función que dibuja
@Composable fun Badge(texto: String = "") { /* ... */ }
```

## Por qué cambia el modelo

En Compose **no existe una instancia viva del componente** a la que «ponerle» un valor. Cada vez que cambia un dato, la función **se vuelve a ejecutar** y produce la pantalla nueva. Por eso:

* las propiedades son **parámetros de entrada**,
* y las «modificaciones» se devuelven a quien llama con un **evento** (una lambda).
