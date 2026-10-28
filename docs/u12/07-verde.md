# 12.7 Lo marcado en verde (tema 6)

En la web del profesor, los textos con **fondo verde** son los que hay que repasar cada semana: según su leyenda, **son los datos que se preguntan en el examen**. Aquí están todos los del tema 6 **con otras palabras** y con la página de esta unidad donde se explican. Si puedes explicar cada punto sin mirar, lo tienes.

!!! success "Cómo usar esta página"
    Lee el punto, tápalo y repítelo en voz alta. Después haz el [examen de prueba](../examen-din-t456.md): sus preguntas salen de estos puntos.

## Resultado de aprendizaje y definiciones (12.1)

* **RA4**: diseñar interfaces gráficas identificando y aplicando criterios de usabilidad y accesibilidad. Esta unidad trabaja los nueve criterios, de la a a la i.
* Una interfaz es **usable** cuando el usuario consigue su objetivo sin pelearse con la herramienta.
* **Usable = eficacia + eficiencia + satisfacción** (ISO 9241-11). **Si una de las tres falla, no es usable.**
* **Si una auditoría no responde a las cinco preguntas de la definición** (quién, para qué, eficacia, eficiencia/satisfacción, contexto), no es una auditoría: es una opinión.

## Estándares (12.1)

* Para los **menús** se cita la **ISO 9241-14**.
* La **accesibilidad es una subcaracterística de la usabilidad** (ISO/IEC 25010), no un extra.
* **Citar la ISO 13407 como norma vigente es un error de examen**: se cita la **ISO 9241-210**.
* **EN 301 549**: la norma que se usa en la **contratación pública europea**.
* La accesibilidad **ya no es buena voluntad: es requisito legal** en una parte enorme del mercado.

## WCAG y Android (12.2 y 12.3)

* **WCAG 2.2**: cuatro principios (**perceptible, operable, comprensible, robusto**) y tres niveles (**A, AA, AAA**). **El objetivo realista y legal es AA.**
* **«Texto grande»** en WCAG es 18 pt (24 px) o 14 pt (18,66 px) en negrita.
* **Si algo no aparece en el volcado de `uiautomator`, TalkBack no lo ve** (es el mismo árbol).
* Las limitaciones son **permanentes, temporales o situacionales**, y el diseño que resuelve la permanente beneficia a las otras dos.
* **Ningún adaptador necesita código especial** si la app está bien etiquetada: funcionan leyendo la semántica.
* **Un badge que solo cambia de color es invisible** para un lector de pantalla y para un daltónico.

## Contraste (12.4)

* **21:1 es el máximo posible y 1:1 el mínimo.**
* Un **color con alfa se compone antes de medirlo**: si no, da 1:1 y la auditoría miente.

## Toque y letra (12.5)

* **Android es más exigente que el mínimo legal: 48 dp.**
* **El volcado de `uiautomator` es la prueba objetiva de accesibilidad.**
* **El 200 % no es un caso raro**: es la configuración de muchísima gente mayor.
* **Lo importante no es el arreglo: es que ahora hay un número que lo demuestra y una prueba que avisará si vuelve a pasar.**
* **Una auditoría que no encuentra nada casi siempre está mal hecha.**
* Los dos defectos reales del kit: el **badge de aviso a 3,37:1** y la **tecla a 44 dp**.

## Pruebas y usuarios (12.6)

* **Una prueba de accesibilidad no comprueba «que se ve bien»: comprueba un número.**
* **16 pruebas en verde, `Time: 20.029`.**
* **68** es la media histórica del SUS: por debajo, la app está por debajo de la mitad del mercado.

## Las cifras que hay que saber

| Dato | Valor |
|---|---|
| Contraste AA texto normal / grande | 4,5:1 / 3:1 |
| Contraste AAA texto normal / grande | 7:1 / 4,5:1 |
| Contraste de iconos y controles (1.4.11) | 3:1 |
| Área de toque en Android | 48 × 48 dp |
| Mínimo WCAG 2.5.8 (AA) / 2.5.5 (AAA) | 24 px / 44 px |
| Letra | 200 % con `sp` |
| Usuarios para ~85 % de los problemas | 5 |
| SUS: media del sector | 68 |
| Gravedad de Nielsen | 0 a 4 |
| Directiva europea de accesibilidad aplicable desde | 28 de junio de 2025 |
