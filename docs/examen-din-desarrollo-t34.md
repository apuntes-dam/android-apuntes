# Examen de desarrollo · DIN · Temas 3 y 4

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
    Es un examen de prueba con el formato del «Examen escrito UF1 y UF2» de la Moodle. Repasa antes el tema 3 en [la web del profesor](https://revilofe.github.io/section6/u03/teoria/DI-U3.1.-GeneracionInterfacesXML/) y el tema 4 en [U10](u10/index.md) de esta web. El mismo examen, para imprimir, está en tus apuntes.

<div class="tutor-ia-examen" data-banco="t34"></div>

## T3 · Documentos de descripción

**1.** Hasta hace poco, ¿qué dos lenguajes había que escribir para crear la pantalla de una app Android y qué papel tenía el XML? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="1"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    XML para el diseño (los layouts) y Java o Kotlin para la lógica. El XML era el «documento de descripción»: definía qué botones, textos o campos tenía la pantalla y dónde se colocaban, y unas herramientas lo traducían a código compilado.


**2.** ¿Qué cambia con Jetpack Compose y por qué sigue importando el XML? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="2"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Con Compose la interfaz se describe directamente con código Kotlin declarativo, sin documento intermedio. El XML sigue importando: es el formato universal de intercambio de datos (RSS, facturas, configuraciones, mapas GML), sigue describiendo la interfaz en otras plataformas (XHTML en webs, SVG en gráficos, XUL en escritorio) y es la lengua madre de los layouts Android heredados.


**3.** Idea central del tema: ¿qué equivalencias hay entre describir y programar una interfaz? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="3"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Una interfaz se puede describir (en un documento) o programar (en código); Android pasó de lo primero a lo segundo con Compose. Las dos vías tienen las mismas piezas: etiquetas ↔ composables, atributos ↔ parámetros, eventos ↔ lambdas.


**4.** ¿Qué es XML? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="4"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Un metalenguaje: no describe nada por sí mismo, pero permite definir lenguajes que sí lo hacen.


**5.** XHTML: ¿qué es, qué exige y cómo se usa dentro de una app de Compose? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="5"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Es el lenguaje de marcas de las páginas web. Exige documentos bien formados (well-formed): toda etiqueta cerrada, atributos entrecomillados y un único nodo raíz. En Compose se incrusta con un `WebView`, que sigue consumiendo XHTML puro: el documento describe la interfaz web y el navegador la genera.


**6.** GML: ¿qué describe y cómo se relaciona con la pantalla? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="6"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Describe datos geográficos (puntos, rutas, zonas) como documentos XML. Por ejemplo, la ficha de un mirador (coordenadas, nombre, descripción) es un documento GML y la pantalla que lo muestra se genera a partir de él.


**7.** MathML: ¿qué describe y cómo se muestra en Android? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="7"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Describe fórmulas matemáticas con etiquetas (`<mfrac>` es una fracción, `<msup>` un exponente…) para que un motor de composición las renderice. Android no lo entiende de forma nativa: la vía práctica es meter el MathML dentro de un `WebView` y dejar que el motor de Chrome lo maquete.


**8.** RSS/Atom: ¿qué es y cómo es la estructura de un feed? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="8"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Es el XML de las noticias: un `<channel>` con `<item>`s que tienen `title`, `link` y `description`. Un lector de noticias es un parser de RSS que compone una interfaz: en el Android clásico era un `ListView` con un adaptador alimentado por el feed; en Compose es un bucle sobre los ítems parseados.


**9.** XSLT: ¿qué es y a qué equivale conceptualmente? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="9"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Es XML que transforma otros XML: una hoja de reglas del tipo «cada vez que veas `<titulo>`, saca un `<h2>` con su contenido». Es el abuelo conceptual de cualquier capa de presentación: recibe datos y produce una representación.


**10.** SVG: ¿qué describe y cómo se usa en Android y en Compose? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="10"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Describe gráficos vectoriales en XML: la imagen no es un mapa de bits sino una lista de trazados (`path`). Android los adopta como Vector Drawable (XML) y en Compose se dibujan con `ImageVector`: el atributo `d` del `path` se copia como `pathData` y se parsea con `addPathNodes`.


**11.** ¿Con qué tres conceptos se lee un documento XML y a qué equivale un composable? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="11"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Etiquetas, atributos y valores. Documento XML = etiquetas + atributos + valores; composable = función + parámetros + argumentos (un composable es un documento XML convertido en función).


**12.** Etiquetas: ¿qué es una etiqueta y cómo se traduce de Android clásico a Compose? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="12"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Una etiqueta abre un elemento y encierra contenido u otros elementos. En Android clásico la etiqueta define el control (`<Button android:id="@+id/btnEnviar" android:text="Enviar" />`); en Compose la etiqueta es una función que se llama en el orden en que debe pintarse: `Button(onClick = { enviar() }) { Text("Enviar") }`.


**13.** Atributos: ¿qué son y cómo se traducen a Compose? ¿Qué ventaja tienen los parámetros? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="13"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Son las propiedades del elemento. En XML van entre comillas dentro de la etiqueta; en Compose son parámetros con nombre de la función: `android:textSize="14sp"` → `fontSize = 14.sp` y `android:layout_marginTop="8dp"` → `Modifier.padding(top = 8.dp)`. Los parámetros de Kotlin admiten expresiones, no solo literales: un atributo XML no podía llamar a una función; un parámetro sí.


**14.** Valores: ¿qué dos formas tiene un valor y cuál es la regla de oro? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="14"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Un literal (`23,5`) o una referencia a recurso (`@string/temperatura`). Regla de oro: en un proyecto real, nada de valores mágicos en el layout. Sigue viva en Compose con `stringResource(R.string.…)` y los colores del `MaterialTheme`.


**15.** Eventos: ¿cómo se conectaban en el mundo del documento y cómo se hace en Compose? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="15"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    En el documento se conectaban por nombre: `android:onClick="enviar"` buscaba un método en la actividad (en web, `onclick` y `addEventListener`); el acoplamiento era débil y el compilador no avisaba de una errata. En Compose se pasa una lambda directa: el evento es un parámetro más de la función-etiqueta y el estado que cambia vive junto a él con `remember`/`mutableStateOf`.


**16.** Compara las herramientas de edición de documentos XML del tema. *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="16"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Notepad++: editor de texto de Windows, rápido, con resaltado XML y plugins (XML Tools). Atom: editor hackable de GitHub, muerto oficialmente en 2022 (su espíritu vive en Pulsar). Adobe Dreamweaver CC: IDE visual web con edición WYSIWYG de XHTML/CSS, en declive. Visual Studio Code: editor multiextensión, el estándar actual. Android Studio: IDE de Android, edita código y genera la interfaz en tiempo real con `@Preview` (es la nuestra).


**17.** ¿Qué es `@Preview` y qué se puede variar con él? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="17"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    El generador de interfaces integrado: en Compose el generador es el propio compilador pintando tus funciones. `@Preview` ejecuta un composable en el panel de diseño sin lanzar el emulador. Con `@PreviewParameter`, `@UiMode` o `@Configuration` se sacan variantes (oscuro/claro, tamaños de fuente, dispositivos) del mismo composable.


**18.** Generación de código para diferentes plataformas: ¿qué se hacía con XML y qué se hace hoy? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="18"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    De un mismo documento XML se podía generar código para Java, C++ o web. Hoy la descripción ya no se traduce a cada plataforma: se ejecuta en cada una (Compose + Kotlin Multiplatform). Además, la interfaz se «genera» sola desde el código: Compose interpreta los composables y emite el árbol de dibujo en cada pantalla, configuración y tema.


**19.** Caso práctico 1 (logo con gráficos vectoriales): ¿cuáles son los pasos? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="19"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Partiendo del trazado de una estrella en SVG: se copia el atributo `d` como `pathData` y se parsea con `addPathNodes`; se monta el `ImageVector` con el `fill` original en `SolidColor`; se presenta con `Image` dentro de una `Box` con degradado; y se comprueba la escalabilidad a 40, 140 y 400 dp: al ser trazados, no pixelea nunca (la ventaja del SVG vectorial).


**20.** Caso práctico 2 (estructura de documento XML): ¿qué se pedía y cómo se resuelve? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="20"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Simular una entrada de un documento GML/RSS con título y descripción y construir una ficha editable cuya previsualización se actualiza al vuelo. Solución: dos `OutlinedTextField` anclados a `remember` (la edición del documento) más una `Card` que refleja el estado (la interfaz generada).


## T4 · Crear componentes

**21.** Define componente. *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="21"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Código probado y reutilizable que se comunica con el resto de la aplicación a través de su interfaz pública: sus parámetros de entrada y sus eventos de salida. Todo lo que no está en esa interfaz es interno y puede cambiar sin romper a nadie.


**22.** ¿Qué significa programar «en componentes»? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="22"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Ensamblar piezas ya hechas en lugar de escribirlo todo desde cero.


**23.** Define componente de interfaz. *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="23"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Pieza de código que dibuja una parte de la pantalla y se comporta de forma predecible.


**24.** ¿Qué seis cosas se le piden a un componente de interfaz? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="24"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Interfaz pública clara; valores por defecto sensatos; sin efectos sorpresa (no guarda datos en sitios raros, no escribe ficheros, no lanza redes); comunicación por eventos (lambdas); aislado y portable (no depende de una Activity ni de clases de la app); documentado y probado.


**25.** En Jetpack Compose, ¿qué es un componente? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="25"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Una función `@Composable`. No hay clase base que heredar ni paleta en la que registrarlo: si es `@Composable`, el editor la entiende, la previsualiza y Layout Inspector la muestra.


**26.** En Compose, ¿qué son las propiedades de un componente y qué es su valor por defecto? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="26"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Las propiedades son los parámetros de la función, y el valor por defecto de una propiedad es el valor por defecto del parámetro.


**27.** ¿Qué parámetro va siempre como primer parámetro opcional de un componente y para qué sirve? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="27"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `modifier: Modifier = Modifier`. Permite a quien llama colocar y dar tamaño al componente sin tocar su código. Se aplica al contenedor raíz.


**28.** ¿Qué pedía un JavaBean? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="28"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Una clase pública con constructor sin argumentos, que implementa `Serializable`, con propiedades privadas accesibles por `getX()`/`setX()` y eventos por escucha.


**29.** ¿Qué queda de JavaBean en Kotlin y Compose? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="29"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    La idea (datos públicos bien definidos, constructor sencillo, comportamiento predecible). La sintaxis sobra: Kotlin convierte cada propiedad en getter y setter automáticamente.


**30.** Escribe la firma de `BadgeEstado` (el componente del tema): ¿qué parámetro es obligatorio y qué valor por defecto tiene `relleno`? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="30"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `@Composable fun BadgeEstado(estado: Estado, texto: String = estado.etiqueta, modifier: Modifier = Modifier, conPunto: Boolean = true, relleno: Color = estado.acento.copy(alpha = 0.15f))`. El único obligatorio es `estado` (de él salen el color, el punto y el texto por defecto). `texto` sustituye la etiqueta sin crear otro componente, `conPunto` apaga el punto y `relleno` es por defecto el acento del estado al 15 % de opacidad. (En el código del profesor `texto` va antes que `modifier`; la regla que se pregunta es «`modifier` siempre como primer parámetro opcional».)


**31.** ¿Qué es `Estado` en el kit y por qué lleva `etiqueta`, `acento` y `mensaje`? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="31"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Un `enum class` con datos: sus tres valores (`OK` «Completado», `AVISO` «Revisa» y `ERROR` «Fallido») traen las propiedades puestas. `etiqueta` es el texto que ve el usuario, `acento` el color de referencia (punto, texto y borde) y `mensaje` la frase larga para los sitios donde el estado se explica. Así el color y el mensaje viajan dentro del estado y no repartidos por las pantallas: cambiar el verde de «Completado» es tocar una línea.


**32.** ¿Qué hace `BadgeEstado` por dentro y qué no hace? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="32"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Es una `Row` con `testTag("badge_" + estado.name)` (nombre estable para las pruebas), recorte en píldora (`clip(RoundedCornerShape(percent = 50))`), fondo `relleno` y relleno interior de 12 dp y 6 dp. Dentro, si `conPunto`, un `Box` de 10 dp recortado en círculo con el acento, y un `Text` con el acento y la tipografía `labelLarge` del tema (la decide el tema, no el componente). No sabe en qué pantalla está, ni qué idioma habla, ni crea estado propio. Lleva un `@Preview` con los tres estados (el último con `conPunto = false`) como documentación viva.


**33.** ¿Por qué un componente sin estado propio es más fácil de reutilizar? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="33"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Porque el estado lo decide quien lo usa y el componente solo dibuja lo que le cuentan. El estado interno se deja solo para lo interno (por ejemplo, si un menú está abierto).


**34.** ¿En qué se diferencia `SelectorMes` de `BadgeEstado`? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="34"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Que devuelve información a la pantalla mediante un evento (un parámetro lambda, por ejemplo `onSeleccion: (Int) -> Unit`).


**35.** Caso de la recarga del abono del metro: ¿qué sabe el componente y qué la pantalla? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="35"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    El componente no sabe qué es un abono: `SelectorMes` solo sabe de meses. La lógica del precio y de la confirmación es de la pantalla. Ese reparto permite reutilizar el desplegable en una cita médica, una reserva o una matrícula.


**36.** ¿Qué comprueba una prueba de un componente? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="36"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Que el usuario ve lo correcto, no que «el código se ejecuta». Se monta con `createComposeRule`, se busca por `testTag` o por texto y se afirma sobre lo visible.


**37.** ¿Cómo se documenta un componente? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="37"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Tres niveles: KDoc en la declaración (`/** … */` con `@param`), un `@Preview` por estado (documentación viva: el editor la pinta sin compilar la app) y, si hay que publicarla, Dokka (equivalente a Javadoc).


**38.** En Java un componente se empaquetaba en un `.jar` y se añadía a la paleta. ¿Cómo se empaqueta en Compose y cómo lo usa quien lo consume? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="38"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    El paquete es un módulo de librería (`com.android.library`, que produce un `.aar` con clases, recursos y manifiesto) y la «paleta» es el bloque `dependencies` de Gradle. Quien lo consume escribe `implementation(project(":ui"))`: no copia ficheros ni pega código.


**39.** Diferencia entre `api` e `implementation` al declarar una dependencia en el módulo del kit. *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="39"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `api` filtra la dependencia a quien te usa; `implementation` la esconde. Un kit de interfaz usa `api` para Compose, porque quien consume el componente también compila contra Compose.


**40.** ¿Cómo se llama el lienzo para dibujar a mano en Compose y dónde está disponible? *[0,25]*

<div class="tutor-ia" data-banco="t34" data-n="40"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    `DrawScope`, dentro de `Canvas { }` o de `Modifier.drawBehind { }`. Es la versión actual de `java.awt.Graphics`.


## Parte B · Ejercicios de práctica (no puntúan)

Por si el examen incluye código o cálculos. Resuélvelos primero en papel.

**B1.** Traduce a Compose este fragmento de layout XML y di qué equivale a qué:
```xml
<LinearLayout android:orientation="vertical">
    <TextView android:text="Hola" android:textSize="14sp" android:layout_marginTop="8dp" />
    <Button android:id="@+id/btnEnviar" android:text="Enviar" android:onClick="enviar" />
</LinearLayout>
```

<div class="tutor-ia" data-banco="t34" data-n="41"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    ```kotlin
    Column {
        Text("Hola", fontSize = 14.sp, modifier = Modifier.padding(top = 8.dp))
        Button(onClick = { enviar() }) { Text("Enviar") }
    }
    ```
    `LinearLayout` vertical → `Column`; etiqueta → composable; atributos → parámetros con nombre (`textSize` → `fontSize`, `layout_marginTop` → `Modifier.padding(top = …)`); `android:onClick="enviar"` (conexión por nombre) → lambda directa `onClick = { enviar() }`. El `id` ya no hace falta para conectar el evento.


**B2.** ¿Cuáles de estos documentos XML están bien formados? Razona los que no. (a) `<libro><titulo>Clean Code</titulo><pag>464</pag></libro>`  (b) `<libro><titulo>Clean Code<pag>464</titulo></pag></libro>`  (c) `<libro titulo=Clean Code />`  (d) `<a/><b/>`

<div class="tutor-ia" data-banco="t34" data-n="42"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    Solo el **(a)**. El (b) tiene las etiquetas mal anidadas (se cierra `titulo` antes que `pag`, que se abrió después). El (c) tiene el atributo sin comillas. El (d) tiene **dos nodos raíz**. Un documento well-formed necesita: toda etiqueta cerrada, atributos entrecomillados y un único nodo raíz.


**B3.** Escribe un composable `LectorRss` que pinte como tarjetas tres noticias (título y fecha) que ya están parseadas en una lista, y explica a qué equivale en el Android clásico.

<div class="tutor-ia" data-banco="t34" data-n="43"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    ```kotlin
    data class Noticia(val titulo: String, val fecha: String)

    @Composable
    fun LectorRss(items: List<Noticia>) {
        Column {
            items.forEach { n ->
                Card { Text(n.titulo); Text(n.fecha) }
            }
        }
    }
    ```
    En el Android clásico era un `ListView` con un adaptador alimentado por el feed; en Compose es un bucle sobre los ítems parseados. Un lector de noticias es un parser de RSS que compone una interfaz.


**B4.** Explica los pasos para convertir en un recurso vectorial de la app el `path` de un SVG con `d="M12,2 L15,9 L22,9 …"` y cómo compruebas que escala bien.

<div class="tutor-ia" data-banco="t34" data-n="44"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    1) Copiar el atributo `d` como `pathData` y parsearlo con `addPathNodes`. 2) Montar el `ImageVector` (con `ImageVector.Builder`) usando el `fill` original del SVG en `SolidColor`. 3) Mostrarlo con `Image` dentro de una `Box` con degradado. 4) Probarlo a 40, 140 y 400 dp: al ser trazados (no un mapa de bits), nunca pixelea.


**B5.** Crea un componente `Aviso(texto)` que cumpla las reglas del tema 4: primer parámetro opcional, valor por defecto calculado y un evento de cierre. Di qué es estado interno y qué no.

<div class="tutor-ia" data-banco="t34" data-n="45"></div>

??? success "Respuesta del profesor (mírala después de intentarlo)"
    ```kotlin
    @Composable
    fun Aviso(
        texto: String,
        modifier: Modifier = Modifier,                 // primer parámetro opcional
        color: Color = MaterialTheme.colorScheme.error, // valor por defecto
        onCerrar: () -> Unit = {},                      // evento de salida (lambda)
    ) { /* Row con el texto y un botón que llama a onCerrar() */ }
    ```
    El componente no guarda si el aviso está visible: eso lo decide la pantalla (el estado lo decide quien lo usa). Solo sería interno algo propio del componente, como si un menú interno está abierto.


<link rel="stylesheet" href="../assets/tutor-ia.css?v=02da5ced">
<script src="../assets/examen-din-desarrollo-t34-datos.js?v=8623383c"></script>
<script src="../assets/tutor-ia.js?v=9c8cb5a9"></script>
