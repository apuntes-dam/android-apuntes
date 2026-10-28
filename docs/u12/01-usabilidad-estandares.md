# 12.1 Usabilidad y estándares

!!! info "Qué se ha ejecutado y qué no"
    Los cálculos de esta unidad (contraste, área de toque, SUS) son Kotlin puro y se han **ejecutado de verdad** al construir la web. Los fragmentos de Compose **no** se han ejecutado aquí.

Una interfaz es **usable** cuando el usuario consigue su objetivo sin pelearse con la herramienta, y es **accesible** cuando *cualquier* usuario puede conseguirlo, tenga la vista, el pulso o el dispositivo que tenga. Las dos cosas **se miden**. La norma que fija cómo es la **UNE-EN ISO 9241-11:2018**.

## Tres medidas, no una

| Medida | Qué es | Cómo se mide en una app |
|---|---|---|
| **Eficacia** | Se consigue el objetivo | ¿Termina la tarea? ¿Cuántos la terminan? |
| **Eficiencia** | Se consigue con pocos recursos | Tiempo, toques, clics, pasos de más |
| **Satisfacción** | El usuario queda a gusto | Cuestionario SUS, entrevista, escala |

!!! success "Si una de las tres falla, la interfaz no es usable"
    Una app en la que todos terminan la tarea pero tardando veinte minutos y enfadados cumple la eficacia y suspende las otras dos.

## La definición que hay que saber

> **Usabilidad**: grado en que un sistema, producto o servicio puede ser utilizado por **usuarios específicos** para lograr **objetivos concretos** con **eficacia, eficiencia y satisfacción** en un **contexto de uso** especificado.

Sus piezas son las preguntas de cualquier auditoría: *quién* (usuarios específicos), *para qué* (objetivos), *con qué resultado* (eficacia), *a qué coste* (eficiencia), *a gusto o no* (satisfacción) y *en qué circunstancias* (contexto). **Si una auditoría no responde a todas, no es una auditoría: es una opinión.**

## Los estándares uno por uno

### ISO/IEC 9241: ergonomía de la interacción persona-sistema

Va por partes. Las que se citan en interfaces son de la **10 a la 17** (diálogo):

| Parte | Título | Qué regula |
|---|---|---|
| 9241-10 | Principios de diálogo | Los siete principios: adecuación a la tarea, autodescriptivo, control del usuario, conformidad con las expectativas, tolerancia al error, personalización y aprendizaje |
| 9241-11 | Guía de usabilidad | La definición de usabilidad y sus tres medidas |
| 9241-12 | Presentación de la información | Cómo se organiza y se presenta la información en pantalla |
| 9241-13 | Guía del usuario | Ayudas, mensajes y documentación en línea |
| **9241-14** | **Diálogos controlados por menús** | Estructura, profundidad y navegación de menús |
| 9241-15 | Diálogos por órdenes | Lenguajes de comandos |
| 9241-16 | Diálogos de manipulación directa | Arrastrar, soltar, seleccionar |
| **9241-17** | **Diálogos de relleno de formularios** | Campos, validación, orden de llenado |

!!! success "Para los menús se cita la 9241-14"
    Y para los formularios, la 9241-17. Los siete principios de la parte 10 son los mismos que reaparecen en las diez heurísticas de Nielsen: la misma idea contada dos veces.

### ISO/IEC 9126-1 y su heredera ISO/IEC 25010

La **9126-1** metía la usabilidad en un modelo de calidad con **seis** características: funcionalidad, fiabilidad, usabilidad, eficiencia, mantenibilidad y portabilidad. La actual es la familia **ISO/IEC 25010 (SQuaRE)**, con **ocho** (añade adecuación funcional, compatibilidad y seguridad) y desglosa la usabilidad en subcaracterísticas evaluables por separado:

* capacidad de aprendizaje,
* operabilidad,
* protección contra errores del usuario,
* estética de la interfaz,
* **accesibilidad** (la añadió la versión de 2011; en la 9126 no existía como subcaracterística).

!!! success "La accesibilidad es una subcaracterística de la usabilidad, no un extra"
    Una interfaz inaccesible es, por definición del modelo, una interfaz de peor calidad.

### ISO 14915 e IEC TR 61997: interfaz multimedia

La **ISO 14915** (ergonomía del software para interfaces multimedia) tiene cuatro partes: principios y marco de diseño, control y navegación, selección y combinación de medios, y dominio de aplicación. La **IEC TR 61997** son directrices para equipos multimedia de uso general. Se citan cuando la interfaz lleva vídeo, audio o animación: el medio se elige por la **tarea**, no por lo vistoso.

### ISO 13407 e ISO/TR 16982: proceso y métodos

* **ISO 13407:1999** describía el proceso de diseño centrado en el usuario (entender el contexto, especificar requisitos, producir soluciones, evaluar). Está **sustituida por la ISO 9241-210** (2010, revisada en 2019).
* **ISO/TR 16982:2002** es el catálogo de **métodos** que apoyan ese proceso: observación, entrevistas, cuestionarios, *thinking aloud*, evaluación heurística…

!!! warning "Error de examen"
    **Citar la 13407 como norma vigente es un error de examen:** se cita la **9241-210**. La 13407 solo se menciona para decir que fue la precursora.

### EN 301 549, RD 1112/2018 y la normativa europea

* La **EN 301 549** es la norma europea armonizada de accesibilidad de productos y servicios TIC. Su versión 3.2.1 recoge los criterios WCAG 2.1 nivel AA y añade requisitos de software, documentos, hardware y servicios de apoyo. **Es la que se usa en la contratación pública europea.**
* En España se concreta en el **Real Decreto 1112/2018**: los sitios web y las apps móviles del sector público deben ser accesibles según la EN 301 549 (transpone la Directiva (UE) 2016/2102).
* Desde el **28 de junio de 2025** se aplica además la **Directiva (UE) 2019/882** (Acta Europea de Accesibilidad), que amplía la obligación a muchos productos y servicios privados: banca, transporte, comercio electrónico, libros digitales.

!!! success "Traducción práctica"
    La accesibilidad ya no es buena voluntad: es **requisito legal** en una parte enorme del mercado.
