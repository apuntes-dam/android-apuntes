# Avanzado

Material para ir más allá de las nueve unidades: cómo se organiza una app que crece, cómo se programa lo asíncrono, cómo se guardan y sincronizan los datos, cómo se prueba y cómo se publica.

!!! info "Es un modo aparte"
    Esta sección solo aparece en el menú cuando activas el interruptor **Avanzado** de la cabecera. Así, quien está empezando no ve nada que no necesite todavía. Tu elección se guarda en el navegador.

!!! info "Qué se ha ejecutado y qué no"
    La **lógica en Kotlin puro** (estado, reductores, corrutinas, `Flow`, repositorios, pruebas) se ha **compilado y ejecutado de verdad** con `kotlinc` y `kotlinx-coroutines` al construir la web, y las salidas que ves son las reales; los ejercicios incluyen el resultado esperado obtenido igual. El código de **Compose y de Android** (pantallas, `ViewModel` real, Room, Hilt, WorkManager) **no se ha ejecutado aquí**, porque necesita el SDK y un emulador: lo verás marcado como «sin ejecutar».

| Unidad | Contenido |
|---|---|
| [AA1 · Arquitectura y estado](a1/index.md) | `UiState` inmutable, flujo unidireccional, reductores, `StateFlow` y `update`, fases `sealed`, avisos consumibles y `SavedStateHandle` |
| [AA2 · Corrutinas y Flow en la app](a2/index.md) | Alcance y cancelación, `async`, excepciones, `debounce`, `flatMapLatest`, `combine`, `stateIn` y búsquedas reactivas |
| [AA3 · Datos y repositorios](a3/index.md) | Capas, DTO y modelos, `Result`, repositorio con fuente local y remota, caché, reintentos con espera y sincronización |
| [AA4 · Inyección de dependencias y pruebas](a4/index.md) | Dependencias por constructor, interfaces y falsos, Hilt, `runTest`, tiempo virtual y pruebas de ViewModel y de Compose |
| [AA5 · Rendimiento y publicación](a5/index.md) | Estabilidad, `derivedStateOf`, `key`, perfiles, R8, firma, `.aab` y Play Console |

!!! note "Antes de empezar"
    Da por sabidas las nueve unidades de la web, sobre todo la [U8 · Avanzado](../u08/index.md) (animaciones, `ViewModel`, Retrofit y Room) y la [web de Kotlin](https://apuntes-dam.github.io/kotlin-apuntes/) (corrutinas y colecciones).
