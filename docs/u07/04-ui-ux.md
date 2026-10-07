# 7.4 Diseño de interfaces: UI y UX

Programar una pantalla es la **última** parte del trabajo. Antes hay que decidir *qué* pantallas hacen falta y *cómo* se usan.

* **UI** (*User Interface*): cómo **se ve** la app (colores, letras, botones).
* **UX** (*User Experience*): cómo **se siente** usarla (si es fácil, rápida, clara).

## El proceso, en cinco pasos

| Paso | Qué haces | Resultado |
|---|---|---|
| 1. Investigar | ¿Quién la usará? ¿Qué necesita? | Descripción de usuarios |
| 2. Organizar | Qué pantallas hay y cómo se conectan | Mapa de navegación |
| 3. Bocetar | Dibujar cada pantalla a mano o con herramienta | *Wireframes* |
| 4. Diseñar | Colores, letras, iconos, componentes | *Mockups* |
| 5. Probar | Que alguien la use mientras observas | Lista de mejoras |

Una *wireframe* es un dibujo simple, en blanco y negro, que solo indica **dónde va cada cosa**. Puedes hacerlo en papel o con herramientas como Figma.

## Principios que se notan

1. **Consistencia**: lo parecido se ve y funciona igual en toda la app.
2. **Jerarquía visual**: lo más importante es lo más grande o llamativo. Una pantalla, **una** acción principal.
3. **Retroalimentación**: cada acción tiene respuesta (el botón cambia, aparece un mensaje, hay una barra de carga).
4. **Espacio en blanco**: dejar aire hace la pantalla legible; el exceso de elementos agobia.
5. **Pulgar primero**: lo que se usa más debe poder alcanzarse con una mano, en la parte baja.
6. **Evitar errores**: mejor deshabilitar un botón que mostrar un error después.

## Estados que hay que diseñar siempre

Una pantalla con datos no es la única que existe:

| Estado | Ejemplo |
|---|---|
| **Cargando** | Indicador de progreso (`CircularProgressIndicator`) |
| **Vacío** | «Aún no tienes tareas. Pulsa + para crear la primera» |
| **Error** | «Sin conexión. Reintentar» |
| **Con datos** | La lista |

```kotlin
when {
    cargando -> CircularProgressIndicator()
    error != null -> Text("No se pudo cargar: $error")
    tareas.isEmpty() -> Text("Aún no tienes tareas")
    else -> LazyColumn { items(tareas) { FilaTarea(it) } }
}
```

## Guías oficiales

Android publica reglas detalladas en **Material Design 3** (m3.material.io) y en la guía de *calidad de apps* de Android Developers. Consúltalas cuando dudes cómo debe verse o comportarse un componente.
