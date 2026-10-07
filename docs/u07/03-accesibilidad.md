# 7.3 Accesibilidad

Una app **accesible** la puede usar todo el mundo: personas ciegas (con lector de pantalla), con baja visión, con dificultades motoras o que usan la app al sol o con una mano. Además, suele ser requisito en proyectos reales.

## Lo mínimo imprescindible

1. **Descripción de contenido** en imágenes e iconos con significado:
   ```kotlin
   Icon(Icons.Default.Delete, contentDescription = "Borrar tarea")
   ```
   Para las decorativas, `contentDescription = null`.
2. **Tamaño táctil mínimo de 48 × 48 dp.** Los botones de Material ya lo cumplen; si haces algo pulsable a mano, asegúrate:
   ```kotlin
   Modifier.clickable { }.minimumInteractiveComponentSize()
   ```
3. **Contraste** suficiente entre texto y fondo (mínimo 4,5 : 1). Usa las parejas `on…` del tema.
4. **Texto en `sp`**, para que respete el tamaño de letra que el usuario ha elegido en el sistema.
5. **No transmitir información solo con el color**: un error debe llevar también un icono o un texto.

## Agrupar y describir

El lector de pantalla recorre elemento a elemento. Si una fila tiene un icono y dos textos, mejor que lo lea como una sola cosa:

```kotlin
Row(Modifier.semantics(mergeDescendants = true) { }.clickable { }) {
    Icon(Icons.Default.Person, contentDescription = null)
    Text("Ana García")
    Text("Delegada")
}
```

Y para dar una descripción distinta de lo que se ve:

```kotlin
Text("4,5 ★", Modifier.semantics { contentDescription = "Valoración: cuatro y medio sobre cinco" })
```

## Cómo probarlo

* Activa **TalkBack** en el móvil (*Ajustes → Accesibilidad*) y navega por tu app sin mirar la pantalla.
* En Android Studio, el **Accessibility Scanner** y la pestaña *Layout Inspector* señalan problemas.
* Sube el **tamaño de fuente** del sistema al máximo y comprueba que nada se corta.

!!! example "Lista de comprobación rápida"
    * [ ] Todas las imágenes con significado tienen descripción.
    * [ ] Ningún botón es más pequeño de 48 dp.
    * [ ] Se lee bien con el tamaño de letra máximo.
    * [ ] Se entiende sin distinguir colores.
    * [ ] Se puede usar con TalkBack.
