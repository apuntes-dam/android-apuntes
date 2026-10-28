# 12.3 Perfiles, adaptadores y formatos alternativos

## Perfiles funcionales: a quién le falla la interfaz

Un perfil funcional **no es una etiqueta médica**: es la descripción de lo que una persona puede y no puede hacer delante de la pantalla.

| Limitación | Barrera típica en una app | Qué hace la app | Adaptador del sistema |
|---|---|---|---|
| **Visual** (baja visión, ceguera) | Texto pequeño, contraste bajo, iconos sin texto | Texto en `sp`, contraste AA, `contentDescription` | TalkBack, lupa, fuente grande, alto contraste, braille |
| **Daltonismo** | Información solo por color (verde = bien, rojo = mal) | Color + icono + texto | Filtros de color, alto contraste |
| **Auditiva** | Avisos solo con sonido | Vibración, aviso visual, subtítulos | Subtítulos, transcripción, vibración |
| **Motriz** | Botones pequeños, gestos obligatorios, tiempo límite | 48 dp, alternativas a los gestos, sin límite de tiempo | Switch Access, control por voz, teclado externo |
| **Cognitiva** | Lenguaje enrevesado, pasos que memorizar | Lenguaje claro, consistencia, ayudas visibles | Lectura fácil, tiempo ajustable |

!!! success "Permanentes, temporales o situacionales"
    Las limitaciones pueden ser **permanentes, temporales o situacionales**, y **el diseño que resuelve la permanente beneficia a las otras dos**. Un subtítulo sirve al sordo, al que está en un bar con ruido y al que ve el vídeo sin cascos. Un botón grande sirve al que tiene artrosis, al que lleva una escayola y al que va en el metro agarrado a la barra. Es el mismo diseño.

## Los adaptadores que hay que conocer por su nombre

| Adaptador | Qué hace | A quién sirve |
|---|---|---|
| **TalkBack** | Lector de pantalla: lee el árbol de semántica y se navega por gestos | Ceguera y baja visión severa |
| **Switch Access** | Recorre los elementos con uno o dos pulsadores externos | Movilidad muy reducida |
| **Control por voz** | «Abrir ajustes», «pulsar» | Manos ocupadas o sin movilidad fina |
| **Teclado / D-pad** | Navegación por foco con Tab o flechas | Usuarios de teclado, TV, mandos |
| **Lupa y fuente grande** | Ampliación y escalado del texto | Baja visión |
| **Alto contraste** | Fuerza colores de máximo contraste | Baja visión, fotosensibilidad |
| **Braille (HID)** | Línea braille por Bluetooth o USB | Sordoceguera |

!!! success "Ninguno necesita código especial si la app está bien etiquetada"
    Todos funcionan leyendo la semántica. Por eso el trabajo real es poner bien `contentDescription`, rol y estado, no «hacer una versión para discapacitados».

## Formatos alternativos

El mismo contenido en otro formato, para que llegue a quien no puede usar el original:

| Contenido | Alternativa | Cuándo es obligatoria |
|---|---|---|
| Imagen con información | Texto alternativo (`contentDescription`) | Siempre que la imagen aporte información |
| Imagen decorativa | `contentDescription = null` | Siempre: no se anuncia |
| Icono sin texto | Etiqueta accesible + `Role` | Siempre |
| Audio o vídeo | Subtítulos y transcripción | WCAG 1.2.2 (A) para vídeo grabado |
| Gráfico de datos | Tabla de datos equivalente | Cuando el gráfico es la única fuente del dato |
| Aviso de color | Icono + texto («Completado», no solo verde) | WCAG 1.4.1 |
| Texto complejo | **Lectura fácil**: frases cortas, una idea por frase | Contenido para público general |
| Mensaje de error | Qué pasó + cómo se arregla, sin códigos internos | WCAG 3.3.1 y 3.3.3 |

### El texto alternativo bien puesto

Describe la **función**, no la forma: en un botón de borrar, `contentDescription = "Borrar"`, no `"icono de papelera"`. En una imagen decorativa, `null`, para que el lector no anuncie adornos.

!!! success "Un badge que solo cambia de color es invisible"
    Lo es para un lector de pantalla y para un daltónico. Por eso `BadgeEstado` lleva **texto además del punto de color**: el color acelera la lectura de quien lo distingue; el texto la garantiza para todos.

### Subtítulos y transcripciones

Si la app reproduce vídeo o audio, el subtítulo **no es un extra**: es el criterio 1.2.2 en nivel A, el más básico. La transcripción resuelve además el caso de quien no puede ver el vídeo pero sí leer.

### Mensajes: extensión y claridad

Un mensaje útil tiene tres partes: **qué ha pasado** (en lenguaje del usuario), **por qué** (si se sabe y ayuda) y **qué hacer ahora** (imperativo y concreto).

| Mal | Bien |
|---|---|
| `Error 500` | «No se ha podido guardar el abono. Comprueba la conexión y vuelve a intentarlo.» |
| `Campo inválido` | «El teléfono debe tener 9 cifras. Has escrito 7.» |
| `Operación no permitida` | «No puedes cambiar la fecha de un turno ya cerrado. Pide el cambio a tu supervisor.» |
