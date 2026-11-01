# 10.7 Lo marcado en verde (tema 4)

En la web del profesor, los textos con **fondo verde** son los que hay que repasar cada semana y los que entran en el examen. Aquí están todos los del tema 4, **con otras palabras** y con el apartado de esta unidad donde se explican. Úsalo como lista de comprobación: si puedes explicar cada punto sin mirar, lo tienes.

!!! success "Cómo usar esta página"
    Lee el punto, tápalo y repítelo en voz alta. Después haz el [examen de prueba](../examen-din-t456.md): sus preguntas salen de estos puntos.

## El resultado de aprendizaje

* **RA3**: crear componentes visuales valorando y empleando herramientas específicas (RD 405/2023, módulo 0488).

## Concepto de componente (10.1)

* Hasta ahora **usabas** componentes: les cambiabas propiedades y les conectabas eventos. Ahora los **fabricas**.
* Un componente es código **probado y reutilizable** que se comunica con el resto por su **interfaz pública**: parámetros de entrada y eventos de salida.
* Programar en componentes es **ensamblar piezas hechas** en vez de escribirlo todo.
* Un componente de interfaz es una pieza de código que **dibuja una parte de la pantalla y se comporta de forma predecible**.
* En Compose un componente es una **función `@Composable`**: no hay clase base que heredar ni paleta donde registrarlo.

## Propiedades y JavaBean (10.2)

* En Compose las **propiedades son parámetros de la función** y el valor por defecto es el valor por defecto del parámetro.
* **`modifier: Modifier = Modifier` siempre como primer parámetro opcional**: así quien llama coloca y da tamaño sin tocar tu código. Se repite en el resumen: *siempre, para que decida el llamador*.
* JavaBean: clase que implementa **`Serializable`**, con propiedades privadas con **`getX()`/`setX()`** y eventos por escucha.
* De JavaBean queda la **idea** y sobra la **sintaxis**: Kotlin convierte cada propiedad en getter y setter automáticamente.

## Crear componentes (10.3)

* Se empieza por el caso más simple que cumple todas las reglas: una **píldora de estado** con un punto de color y un texto (`BadgeEstado`).
* Un componente **sin estado propio** es más fácil de reutilizar: el estado lo decide quien lo usa.
* `SelectorMes` es el mismo tipo de componente, pero **devuelve información** a la pantalla con un evento.
* **El componente no sabe qué es un abono**: solo sabe de meses; el precio y la confirmación son de la pantalla.

## Herramientas, pruebas y documentación (10.5)

* Para **crear el material gráfico** se usan los editores de siempre; para **diseñar y probar el componente**, las herramientas de Compose (`@Preview`, Layout Inspector, Compose Testing…).
* Una prueba de componente comprueba **que el usuario ve lo correcto**, no que «el código se ejecuta».
* Documentar: **KDoc** + **un `@Preview` por estado** (documentación viva, el editor las pinta sin compilar la app) + Dokka si se publica.

## Empaquetar (10.6)

* En Java se empaquetaba en un `.jar` y se añadía a la paleta; aquí el paquete es un **módulo de librería** y la paleta es el `dependencies` de Gradle.
* Quien consume el kit escribe **`implementation(project(":ui"))`**: no copia ficheros ni pega código.
* **`api` filtra la dependencia a quien te usa; `implementation` la esconde.**

## Dibujar (10.4)

* En Compose el lienzo se llama **`DrawScope`** y está disponible dentro de **`Canvas { }`** o de `Modifier.drawBehind { }`.

## Para repasar en voz alta

| Pregunta | Respuesta corta |
|---|---|
| ¿Qué es un componente en Compose? | Una función `@Composable` |
| ¿Qué va primero entre los parámetros opcionales? | `modifier: Modifier = Modifier` |
| ¿Quién sabe lo que es un abono? | La pantalla, no el `SelectorMes` |
| ¿`api` o `implementation` para Compose en un kit de UI? | `api` |
| ¿Cómo se consume el módulo de componentes? | `implementation(project(":ui"))` |
| ¿Dónde se dibuja a mano? | En `Canvas { }` con `DrawScope` |
