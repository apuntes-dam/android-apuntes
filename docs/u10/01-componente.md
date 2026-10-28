# 10.1 Qué es un componente

Un **componente** es una pieza de código **reutilizable y probada** que se comunica con el resto de la aplicación solo a través de su **interfaz pública**: lo que entra (**parámetros**) y lo que sale (**eventos**). Todo lo que no está en esa interfaz es interno y puede cambiar sin romper a nadie.

!!! info "Qué se ha ejecutado y qué no"
    Los fragmentos de Compose de esta unidad **no se han ejecutado** aquí (hacen falta el SDK y un emulador). Pruébalos en tu proyecto. Los ejemplos de Kotlin puro de las unidades 11 y 12 sí se han ejecutado de verdad.

## De usar a fabricar

Hasta ahora has puesto componentes, les has cambiado propiedades y les has conectado eventos. Fabricar el tuyo es el paso siguiente: lo que la librería estándar no trae, con el mismo rigor con el que un fabricante diseña los suyos.

¿Cuándo se crea un componente y no se copia y pega?

| Situación | Qué haces |
|---|---|
| Aparece **dos veces** en la app con el mismo aspecto | Componente |
| Cambia el color, el texto o el tamaño, pero no la estructura | Componente **con parámetros** |
| Lo necesita otro equipo u otro proyecto | Componente en un **módulo de librería** aparte (apartado 10.6) |

## Desarrollo por componentes

Programar «en componentes» significa **ensamblar piezas ya hechas** en lugar de escribirlo todo desde cero. Es un modelo con historia (en Java se hacía con JavaBeans y paletas de editor) y sus ventajas son siempre las mismas:

| Ventaja | En el día a día |
|---|---|
| Reutilización | Escribes la pieza una vez y la usas en todas las pantallas y proyectos |
| Fiabilidad | Ya se probó una vez; no se vuelve a probar desde cero |
| Coste y plazo | Montar pantallas pasa de «escribir» a «componer» |
| Consistencia | Si el botón de aceptar es uno solo, se ve igual en toda la app |
| Mantenimiento | Cambiar el verde de «Completado» es tocar **una** línea, no veinte pantallas |

## Qué se le pide a un componente

Un **componente de interfaz** es una pieza de código que dibuja una parte de la pantalla y se comporta de forma predecible. Para merecer el nombre se le piden seis cosas:

1. **Interfaz pública clara**: parámetros con nombres y tipos que se entienden sin leer el interior.
2. **Valores por defecto sensatos**: se puede usar con lo mínimo (`BadgeEstado(Estado.OK)`).
3. **Sin efectos sorpresa**: no guarda datos «en un sitio raro», no escribe ficheros, no lanza peticiones de red.
4. **Comunicación por eventos**: avisa de lo que pasa con lambdas (`onSeleccion`), no rebuscando en la pantalla.
5. **Aislado y portable**: no depende de una `Activity` concreta ni de ninguna clase de la aplicación.
6. **Documentado y probado**: trae explicación, previsualizaciones y al menos una prueba.

## En Compose, un componente es una función `@Composable`

No hay que heredar de ninguna clase base ni registrar nada en una paleta. Si una función es `@Composable`, el editor la entiende, la previsualiza y el **Layout Inspector** la muestra.

```kotlin
@Composable
fun BadgeEstado(estado: Estado, modifier: Modifier = Modifier) { /* dibuja la píldora */ }
```

## Lo clásico y lo de hoy

| Concepto clásico (Java/Swing) | Equivalente actual |
|---|---|
| Clase JavaBean dentro de un `.jar` | Función `@Composable` en un módulo de librería Android |
| Añadir el JAR a la paleta del editor | `implementation(project(":ui"))` en `build.gradle.kts` |
| `.jar` (solo clases) | `.aar` (clases + recursos + manifiesto) |
| «Proyecto de componente» | Módulo `:ui` dentro del mismo proyecto Gradle, o repositorio aparte |
| Pasarle el JAR a un compañero | Publicarlo en un repositorio Maven (Maven Local, GitHub Packages…) |
