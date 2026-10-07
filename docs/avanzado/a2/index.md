# AA2 · Corrutinas y Flow en la app

Una app móvil hace casi todo **a la vez**: pide datos a internet, lee del disco, escucha al usuario y dibuja. Las corrutinas son la herramienta para pedirlo sin bloquear la pantalla, y `Flow` es la forma de recibir **datos que cambian con el tiempo**. Aquí aprendes lo que decide si una app es fiable: **quién cancela qué**, qué pasa **cuando algo falla** y cómo combinar fuentes de datos.

## Teoría

1. [Corrutinas estructuradas y cancelación](01-corrutinas.md)
2. [Flow: operadores y estado derivado](02-flow.md)

## Antes de empezar: qué debes dominar

* La [unidad 8.2](../../u08/02-viewmodel.md) (`ViewModel` y corrutinas básicas) y la [AA1](../a1/index.md): `StateFlow` y `UiState`.
* La [web de Kotlin](https://apuntes-dam.github.io/kotlin-apuntes/): `suspend`, `launch`, `async` y `delay`.

## Ejercicios de la unidad

Hay [6 ejercicios](ejercicios.md) de esta unidad.

## Antes de pasar a los ejercicios

Cuando hayas leído y practicado la teoría, marca la casilla para **desbloquear** los ejercicios:

<div class="ej-check" data-unit="a2"></div>
