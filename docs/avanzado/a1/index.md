# AA1 · Arquitectura y estado

Una app pequeña se puede escribir con `remember` y ya está. Cuando crece, el problema deja de ser «cómo dibujo esto» y pasa a ser **«quién manda sobre los datos»**: dónde vive el estado, quién lo cambia y cómo se entera la pantalla. Esta unidad enseña el patrón que usan casi todas las apps Android modernas: **el estado baja, los eventos suben**.

## Teoría

1. [Estado de pantalla y flujo unidireccional](01-estado-udf.md)
2. [Eventos de un solo disparo y estado que sobrevive](02-eventos-estado.md)

## Antes de empezar: qué debes dominar

* La [unidad 2](../../u02/03-estado.md) (`remember` y estado) y la [unidad 8.2](../../u08/02-viewmodel.md) (`ViewModel`).
* Kotlin: clases de datos, `sealed`, lambdas y `when`. Si dudas, repasa la [web de Kotlin](https://apuntes-dam.github.io/kotlin-apuntes/).

## Ejercicios de la unidad

Hay [6 ejercicios](ejercicios.md) de esta unidad.

## Antes de pasar a los ejercicios

Cuando hayas leído y practicado la teoría, marca la casilla para **desbloquear** los ejercicios:

<div class="ej-check" data-unit="a1"></div>
