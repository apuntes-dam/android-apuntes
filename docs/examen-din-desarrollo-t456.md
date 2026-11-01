# Examen de desarrollo · DIN · Temas 4, 5 y 6

Practica el examen de **Desarrollo de Interfaces** como será de verdad: **escrito y con lo explicado en clase**. Son **40 preguntas de 0,25 puntos** (120 minutos en el examen real), hechas a partir de lo **marcado en verde** en la web del profesor. En cada una puedes escribir tu respuesta y **pedirle a una IA que te corrija o te guíe como un tutor**.

!!! info "Cómo se usa"
    1. **Contesta tú primero**, en el recuadro de la pregunta o en papel. Sin intentarlo no se aprende.
    2. Elige una IA y un **modo**: *Tutor* (te hace preguntas y te da pistas, sin darte la solución de golpe), *Corregir como el profesor* (qué está bien, qué falta y una nota orientativa), *Solo pistas* o *Explícamelo*.
    3. Pulsa **Abrir en…**: se abre la web de esa IA con el texto ya escrito (la pregunta, la respuesta del profesor para que pueda evaluarte, y tu respuesta). Si esa IA no admite texto en el enlace, se **copia** y lo pegas con Ctrl+V.
    4. Sigue la conversación en la IA hasta que lo tengas claro. Después mira la **respuesta del profesor** y compárala con la tuya.
    5. **Para corregirlo todo de una vez:** contesta las preguntas en sus recuadros (se guardan en tu navegador) y, al terminar, usa **Corrección final**: junta tus respuestas y las referencias en un solo texto para que la IA te ponga nota, te diga qué falló en cada una y qué repasar. Se pega una vez con Ctrl+V.

!!! tip "Sin API, sin claves y, si quieres, sin cuenta"
    No hay ninguna API ni clave: la web solo **abre el chat de la IA que tú elijas**. **ChatGPT y Perplexity funcionan sin iniciar sesión**; Claude, Gemini, Copilot y Le Chat piden una cuenta (si ya has iniciado sesión en alguna, se usa tu sesión). Puedes usar la que prefieras: el texto es el mismo.

!!! warning "Qué se envía y a quién"
    Solo lo que ves en el texto, y solo a la IA que elijas, **cuando pulsas el botón**. Esta web no lo guarda en ningún servidor: lo que escribes se queda en tu navegador. Las IA pueden equivocarse: compara siempre con la respuesta del profesor y con tus apuntes.

!!! note "No es el examen real"
    Es un examen de prueba con el formato del «Examen escrito UF1 y UF2» de la Moodle. Repasa antes las unidades [U10](u10/index.md), [U11](u11/index.md) y [U12](u12/index.md) de esta web. El mismo examen, para imprimir, está en tus apuntes.

<div class="tutor-ia-examen" data-banco="t456"></div>

## T4 · Crear componentes

**1.** Define componente. *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="1"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Código probado y reutilizable que se comunica con el resto de la aplicación a través de su interfaz pública: sus parámetros de entrada y sus eventos de salida. Todo lo que no está en esa interfaz es interno y puede cambiar sin romper a nadie.


**2.** Define componente de interfaz. *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="2"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Pieza de código que dibuja una parte de la pantalla y se comporta de forma predecible.


**3.** En Jetpack Compose, ¿qué es un componente? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="3"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Una función `@Composable`. No hay clase base que heredar ni paleta en la que registrarlo: si es `@Composable`, el editor la entiende, la previsualiza y Layout Inspector la muestra.


**4.** En Compose, ¿qué son las propiedades de un componente y qué es su valor por defecto? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="4"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Las propiedades son los parámetros de la función, y el valor por defecto de una propiedad es el valor por defecto del parámetro.


**5.** ¿Qué parámetro va siempre como primer parámetro opcional de un componente y para qué sirve? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="5"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `modifier: Modifier = Modifier`. Permite a quien llama colocar y dar tamaño al componente sin tocar su código. Se aplica al contenedor raíz.


**6.** ¿Qué queda de JavaBean en Kotlin y Compose? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="6"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    La idea (datos públicos bien definidos, constructor sencillo, comportamiento predecible). La sintaxis sobra: Kotlin convierte cada propiedad en getter y setter automáticamente.


**7.** ¿Por qué un componente sin estado propio es más fácil de reutilizar? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="7"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Porque el estado lo decide quien lo usa y el componente solo dibuja lo que le cuentan. El estado interno se deja solo para lo interno (por ejemplo, si un menú está abierto).


**8.** ¿En qué se diferencia `SelectorMes` de `BadgeEstado`? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="8"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Que devuelve información a la pantalla mediante un evento (un parámetro lambda, por ejemplo `onSeleccion: (Int) -> Unit`).


**9.** Caso de la recarga del abono del metro: ¿qué sabe el componente y qué la pantalla? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="9"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    El componente no sabe qué es un abono: `SelectorMes` solo sabe de meses. La lógica del precio y de la confirmación es de la pantalla. Ese reparto permite reutilizar el desplegable en una cita médica, una reserva o una matrícula.


**10.** ¿Qué herramientas sirven para crear el material gráfico y cuáles para diseñar y probar el componente? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="10"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    El material gráfico (iconos, logos) se crea con los editores de siempre (Figma, Inkscape, Vector Asset Studio). El componente se diseña y se prueba con `@Preview`, `@PreviewParameter`, la vista previa en tema oscuro, Layout Inspector, Compose Testing (`createComposeRule`) y lint/Detekt.


**11.** ¿Qué comprueba una prueba de un componente? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="11"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Que el usuario ve lo correcto, no que «el código se ejecuta». Se monta con `createComposeRule`, se busca por `testTag` o por texto y se afirma sobre lo visible.


**12.** ¿Cómo se documenta un componente? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="12"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Tres niveles: KDoc en la declaración (`/** … */` con `@param`), un `@Preview` por estado (documentación viva: el editor la pinta sin compilar la app) y, si hay que publicarla, Dokka (equivalente a Javadoc).


**13.** En Java un componente se empaquetaba en un `.jar` y se añadía a la paleta. ¿Cómo se empaqueta en Compose y cómo lo usa quien lo consume? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="13"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    El paquete es un módulo de librería (`com.android.library`, que produce un `.aar` con clases, recursos y manifiesto) y la «paleta» es el bloque `dependencies` de Gradle. Quien lo consume escribe `implementation(project(":ui"))`: no copia ficheros ni pega código.


**14.** Diferencia entre `api` e `implementation` al declarar una dependencia en el módulo del kit. *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="14"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `api` filtra la dependencia a quien te usa; `implementation` la esconde. Un kit de interfaz usa `api` para Compose, porque quien consume el componente también compila contra Compose.


## T5 · Explotar componentes

**15.** ¿Qué cuatro cosas cumple un componente explotado? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="15"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Responde (a los eventos que le interesan, con una acción concreta para cada uno), recuerda (su estado sobrevive a una rotación o a que Android recupere la app), se deja inspeccionar (Layout Inspector, uiautomator, lector de pantalla) y se prueba (tiene pruebas). Las cuatro, no dos.


**16.** ¿Qué es hoy la «introspección de una interfaz»? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="16"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    El árbol de semántica: el árbol paralelo que Compose mantiene para que el sistema, TalkBack, las pruebas y `uiautomator` puedan preguntar qué hay en la pantalla (rol, contenido, selección, foco…).


**17.** ¿Qué ocurre con un componente que informa de algo y no tiene `contentDescription`? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="17"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Es invisible para un usuario con lector de pantalla. En los botones con `Text` no hace falta, porque el texto ya aporta la etiqueta; en una tecla que se pinta a sí misma, sí.


**18.** Diferencia entre `remember` y `rememberSaveable`. *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="18"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `remember` vive mientras vive la composición. `rememberSaveable` sobrevive a la destrucción de la actividad (por ejemplo al girar el móvil) porque su estado viaja en el `Bundle` del sistema.


**19.** ¿Qué ventaja tiene que el evento entregue un objeto inmutable (`data class` + `copy`)? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="19"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    El evento entrega la configuración completa: no hay ambigüedad sobre qué ha cambiado ni quién lo cambió, y el `Saver` puede serializar el objeto entero. Además la `data class` da `equals`, `copy` y `toString`.


**20.** ¿Qué tres piezas tiene la programación basada en eventos y cómo cambia en Compose? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="20"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Fuente (quien genera el evento), objeto de evento (lo que se envía) y listener (quien lo escucha). En Compose no se registran escuchadores: el listener es un parámetro de la función (una lambda) y el objeto evento casi nunca se ve, porque se interpreta dentro del `Modifier` de entrada.


**21.** Traduce a Compose: `KeyListener` y `FocusListener`. *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="21"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `KeyListener` → `Modifier.onPreviewKeyEvent { }` / `onKeyEvent { }` (devuelve `true` si te quedas el evento y `false` para que siga subiendo; `onPreview` se ejecuta antes que el componente). `FocusListener` → `Modifier.onFocusEvent { }` y `FocusRequester`.


**22.** ¿A qué equivalen `awaitFirstDown()` y `waitForUpOrCancellation()`? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="22"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `awaitFirstDown()` espera a que el dedo toque (el `mousePressed` de Swing) y `waitForUpOrCancellation()` espera a que se levante (el `mouseReleased`). Van dentro de `awaitEachGesture { }`, un bucle que se reactiva con cada gesto nuevo.


**23.** ¿Por qué `pointerInput(nota)` lleva una clave? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="23"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Porque si la nota cambia, el bloque se reinicia y deja de escuchar el gesto viejo. Sin clave, los closures se quedan con el valor de la primera composición: es el error de eventos más frecuente en Compose.


**24.** Flujo para asociar una acción a un evento, y qué hace esa acción. *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="24"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Detectar (Modifier de gesto) → interpretar (lambda con datos ya procesados) → validar (convertir y rechazar lo imposible) → mutar el estado (MutableState fuera del componente) → recomponer (Compose repinta lo que cambió). La acción de un evento no repinta: cambia el estado, y quien repinta es el sistema de composición. Nunca al revés.


**25.** ¿Cuándo una prueba va en `test` y cuándo en `androidTest`? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="25"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Si la prueba necesita ver la pantalla o tocar algo, va a `androidTest` (corre en el dispositivo o emulador); si solo necesita pensar, va a `test` (corre en la JVM, sin Android). Por eso el `Saver` y los validadores son funciones normales, probables en JVM.


**26.** Tres detalles de las pruebas de componentes que valen punto. *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="26"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    1) `@get:Rule val regla = createComposeRule()` levanta el `ComposeTestRule`: sin eso no hay composición donde mirar. 2) Se afirma sobre la etiqueta y el estado, no sobre píxeles. 3) `assertThrows` también prueba el mensaje de la excepción.


## T6 · Usabilidad y accesibilidad

**27.** ¿Qué tres medidas da la ISO 9241-11 y qué pasa si una falla? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="27"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Eficacia (se consigue el objetivo), eficiencia (con pocos recursos: tiempo, toques, pasos) y satisfacción (el usuario queda a gusto, por ejemplo con el SUS). Si una de las tres falla, la interfaz no es usable.


**28.** ¿Qué partes de la ISO 9241 se citan para los menús, los formularios y los principios de diálogo? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="28"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Menús: la 9241-14 (diálogos controlados por menús). Formularios: la 9241-17. Principios de diálogo (los siete: adecuación a la tarea, autodescriptivo, control del usuario, conformidad con las expectativas, tolerancia al error, personalización y aprendizaje): la 9241-10. La 9241-11 es la guía de usabilidad.


**29.** ISO/IEC 9126-1 e ISO/IEC 25010: ¿qué cambia y dónde queda la accesibilidad? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="29"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    La 9126-1 tenía seis características de calidad; la 25010 (SQuaRE) tiene ocho (añade adecuación funcional, compatibilidad y seguridad) y desglosa la usabilidad en subcaracterísticas: capacidad de aprendizaje, operabilidad, protección contra errores, estética y accesibilidad. La accesibilidad es una subcaracterística de la usabilidad, no un extra.


**30.** ¿Qué norma se cita hoy para el diseño centrado en el usuario y qué papel tiene la ISO 13407? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="30"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Se cita la ISO 9241-210 (2010, revisada en 2019). La ISO 13407:1999 fue la precursora y está sustituida: citarla como norma vigente es un error de examen. La ISO/TR 16982 es el catálogo de métodos (observación, entrevistas, cuestionarios, thinking aloud, evaluación heurística).


**31.** ¿Qué son la EN 301 549, el RD 1112/2018 y la Directiva (UE) 2019/882? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="31"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    La EN 301 549 es la norma europea armonizada de accesibilidad TIC (recoge WCAG 2.1 AA) y se usa en la contratación pública europea. El RD 1112/2018 obliga a webs y apps móviles del sector público a cumplirla. La Directiva 2019/882 (Acta Europea de Accesibilidad) se aplica desde el 28 de junio de 2025 y amplía la obligación a muchos servicios privados (banca, transporte, comercio electrónico, libros digitales). La accesibilidad es requisito legal, no buena voluntad.


**32.** WCAG 2.2: ¿cuáles son los cuatro principios, los tres niveles y el objetivo realista? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="32"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Principios (POUR): perceptible, operable, comprensible y robusto. Niveles: A, AA y AAA. El objetivo realista y legal es AA.


**33.** Cita los criterios WCAG de la unidad con su nivel y lo que exigen. *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="33"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    1.4.3 Contraste mínimo (AA): 4,5:1 en texto normal y 3:1 en grande. 1.4.6 Contraste mejorado (AAA): 7:1 y 4,5:1. 1.4.11 Contraste no textual (AA): 3:1 en iconos, bordes y controles. 1.4.4 Redimensionar texto (AA): 200 % sin perder contenido. 1.4.10 Reflow (AA): sin scroll horizontal a 320 px. 2.5.8 Tamaño del objetivo mínimo (AA): 24 × 24 px. 2.5.5 Tamaño del objetivo mejorado (AAA): 44 × 44 px.


**34.** Si un elemento no aparece en el volcado de `uiautomator`, ¿qué pasa con TalkBack? ¿Qué herramientas se usan para comprobar la accesibilidad? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="34"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    TalkBack no lo ve, porque es el mismo árbol: el volcado es la prueba objetiva de accesibilidad. Herramientas: TalkBack (lector de pantalla de Android), Accessibility Scanner (audita la pantalla en vivo) y `uiautomator dump`.


**35.** ¿Por qué un badge que solo cambia de color es un problema? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="35"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Es invisible para un lector de pantalla y para un daltónico. Por eso `BadgeEstado` lleva texto además del punto de color: el color acelera la lectura de quien lo distingue y el texto la garantiza para todos.


**36.** Escribe las fórmulas del contraste según WCAG y los valores máximo y mínimo del ratio. *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="36"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    1) Canal a luz lineal: si C ≤ 0,03928, C/12,92; si no, ((C + 0,055)/1,055)^2,4. 2) Luminancia relativa: L = 0,2126·R + 0,7152·G + 0,0722·B (con los canales ya lineales). 3) Ratio = (L_claro + 0,05)/(L_oscuro + 0,05). El máximo es 21:1 (negro sobre blanco) y el mínimo 1:1 (un color contra sí mismo).


**37.** ¿Qué hay que hacer antes de medir el contraste de un color con alfa y por qué? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="37"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Componerlo sobre el fondo real: C_resultado = C_capa·α + C_base·(1 − α). Si se mide sin componer, `Color.copy(alpha)` conserva los canales RGB y compara el color consigo mismo: sale 1:1 y la auditoría miente.


**38.** Área de toque: ¿cuánto pide Android, cuánto WCAG y qué se mide? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="38"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Android: 48 × 48 dp (más exigente que el mínimo legal). WCAG: 24 × 24 px (2.5.8, AA) y 44 × 44 px (2.5.5, AAA). Se mide la zona que responde al dedo, no el dibujo: un icono de 24 dp puede tener 48 dp de zona pulsable con relleno o `minimumInteractiveComponentSize()`.


**39.** ¿Por qué el texto va en `sp` y cómo se prueba el 200 %? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="39"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Porque `sp` escala con la fuente del sistema y `dp` no (con dp, quien necesita letra grande se queda sin ella). Se pone la escala de fuente al 200 % y se comprueba: que no se corte ningún texto, que no se solape nada, que haya scroll vertical y no horizontal (320 px) y que los botones sigan siendo pulsables. No es un caso raro: es la configuración de mucha gente mayor.


**40.** ¿Cuántos usuarios bastan para encontrar el 85 % de los problemas, qué es el SUS y cuál es la media del sector? *[0,25]*

<div class="tutor-ia" data-banco="t456" data-n="40"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Cinco (Nielsen y Landauer, 1993: 1 − (1 − 0,31)^5 ≈ 0,85). El SUS (System Usability Scale) son diez afirmaciones de 1 a 5 que dan una nota de 0 a 100. La media histórica es 68: por debajo, la app está por debajo de la mitad del mercado. Lectura: <51 inaceptable, 51-67 marginal, 68-80 aceptable, >80 excelente.


## Parte B · Ejercicios de práctica (no puntúan)

Por si el examen incluye código o cálculos. Resuélvelos primero en papel.

**B1.** Escribe la firma de un composable `Etiqueta` con: el texto (obligatorio), el `modifier` donde corresponde, un color con un valor por defecto y un booleano `conPunto` que por defecto sea verdadero. ¿Por qué el `modifier` va donde lo has puesto?

<div class="tutor-ia" data-banco="t456" data-n="41"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    ```kotlin
    @Composable
    fun Etiqueta(
        texto: String,                        // lo único obligatorio
        modifier: Modifier = Modifier,        // primer parámetro opcional
        color: Color = Color(0xFF1565C0),     // valor por defecto
        conPunto: Boolean = true,
    ) { /* … */ }
    ```
    El `modifier` va como primer parámetro opcional para que quien llama pueda colocar y dar tamaño al componente sin tocar su código; se aplica al contenedor raíz.


**B2.** Un componente `SelectorMes` guarda dentro `var abierto by remember { mutableStateOf(false) }` y recibe `mesSeleccionado: Int?` y `onSeleccion: (Int) -> Unit`. ¿Qué estado es interno y cuál es de la pantalla? ¿Qué sabe el componente del precio del abono?

<div class="tutor-ia" data-banco="t456" data-n="42"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Es interno solo `abierto` (si el menú está desplegado). El mes elegido es de la pantalla: llega como parámetro y se cambia con el evento `onSeleccion`. El componente no sabe nada del precio ni del abono: solo sabe de meses; el precio y la confirmación son de la pantalla.


**B3.** Calcula el ratio de contraste de un texto cuya luminancia relativa es 0,50 sobre un fondo de luminancia 0,05. ¿Cumple AA para texto normal? ¿Y AAA?

<div class="tutor-ia" data-banco="t456" data-n="43"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    ratio = (0,50 + 0,05) / (0,05 + 0,05) = 0,55 / 0,10 = **5,5:1**. AA para texto normal pide 4,5:1: **cumple**. AAA pide 7:1: **no cumple**. (Siempre se divide la luminancia más clara entre la más oscura, cada una con +0,05.)


**B4.** Un fondo es el color de acento al 15 % de opacidad sobre una tarjeta blanca. Para auditar el contraste del texto sobre ese fondo, ¿qué paso no puedes saltarte y qué ratio sale si te lo saltas?

<div class="tutor-ia" data-banco="t456" data-n="44"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Hay que **componer** el color con alfa sobre el fondo real antes de medir: resultado = capa·α + base·(1 − α), canal a canal. Si se mide `acento.copy(alpha = 0.15f)` directamente, se compara el acento consigo mismo y sale **1:1**, que es falso. (Con el ámbar `#F9A825` sobre su tinte compuesto al 15 % sale 1,78:1, que no llega a 4,5:1; oscureciendo el texto a `#7A4F00` sube a 6,44:1.)


**B5.** Audita estos controles según Android (48 × 48 dp): tecla de piano 44 × 150 dp; botón de Material 3 48 × 48 dp; icono 40 × 40 dp; fila 56 × 48 dp. ¿Cuáles cumplen y por qué la tecla no?

<div class="tutor-ia" data-banco="t456" data-n="45"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Cumplen el botón (48 × 48) y la fila (56 × 48). No cumplen la tecla (44 < 48 de ancho) y el icono (40 × 40). Hay que cumplir **las dos dimensiones**: en la tecla el alto sobra y el ancho no llega. Arreglo: envolverla en un `Box` de 48 dp con el dibujo de 44 dentro, o añadir relleno horizontal.


**B6.** Calcula la puntuación SUS de estas respuestas (afirmaciones 1 a 10): 4, 2, 4, 2, 3, 3, 4, 2, 4, 3. ¿Cómo se lee?

<div class="tutor-ia" data-banco="t456" data-n="46"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Impares (1, 3, 5, 7, 9): respuesta − 1 → 3 + 3 + 2 + 3 + 3 = 14. Pares (2, 4, 6, 8, 10): 5 − respuesta → 3 + 3 + 2 + 3 + 2 = 13. Suma 27 × 2,5 = **67,5**. Lectura: **marginal** (51-67); la media del sector es 68, así que está justo por debajo.


**B7.** Traduce a Compose este código de Swing y explica qué ocurre con `repaint()`:
```java
spinner.addChangeListener(e -> { velocidad = (int) spinner.getValue(); repaint(); });
```

<div class="tutor-ia" data-banco="t456" data-n="47"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    ```kotlin
    Slider(value = config.velocidad.toFloat(), onValueChange = { config = config.copy(velocidad = it.toInt()) })
    ```
    `ChangeListener` → `onValueChange` (el listener es un parámetro lambda). No hay `repaint()`: la acción **cambia el estado** (`config = config.copy(…)`) y es el sistema de composición el que repinta. Antes de mutar se valida (por ejemplo con `require`).


**B8.** Estas tres pruebas, ¿en `src/test` o en `src/androidTest`? (a) comprueba que `deVelocidad("75")` lanza `IllegalArgumentException` con su mensaje; (b) monta `BadgeEstado` con `createComposeRule` y comprueba que se ve «Fallido»; (c) comprueba que el `Saver` reconstruye una `ConfigPuntero`.

<div class="tutor-ia" data-banco="t456" data-n="48"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    (a) `src/test`: lógica pura, solo necesita «pensar» (`assertThrows` comprueba también el mensaje). (b) `src/androidTest`: necesita ver la pantalla (composición real). (c) `src/test`: el `Saver` es una función normal, probable en la JVM. Regla: si necesita ver la pantalla o tocar algo, a `androidTest`; si solo piensa, a `test`.


**B9.** Tienes `var a by remember { mutableStateOf("") }` y `var b by rememberSaveable { mutableStateOf("") }`, ambos con texto escrito. Giras el móvil. ¿Qué pasa con cada uno y por qué?

<div class="tutor-ia" data-banco="t456" data-n="49"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `a` aparece vacío y `b` conserva el texto. Al girar, el sistema destruye y recrea la actividad: `remember` solo vive mientras vive la composición, y `rememberSaveable` sobrevive porque su estado viaja en el `Bundle`. Para un tipo propio habría que darle un `Saver`.


<link rel="stylesheet" href="../assets/tutor-ia.css?v=02da5ced">
<script src="../assets/examen-din-desarrollo-t456-datos.js?v=832950be"></script>
<script src="../assets/tutor-ia.js?v=9c8cb5a9"></script>
