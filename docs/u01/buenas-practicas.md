# 7. Buenas prácticas, errores frecuentes y resumen

## Buenas prácticas

* **Elige la API mínima** con criterio: cuanto más baja, más dispositivos, pero menos funciones.
* **No bloquees la interfaz**: el trabajo largo (red, base de datos) se hace fuera del hilo principal.
* **Pide solo los permisos que necesitas** y explica para qué.
* **Guarda el estado** que no quieras perder al girar la pantalla.
* **Prueba en varios tamaños** de pantalla y en un móvil real.
* **Usa control de versiones** desde el primer día.
* **Diseña para el cambio de contexto**: la red, la batería y la orientación cambian sin avisar; la app debe reaccionar y conservar su estado.
* **Elige la tecnología por requisitos**: rendimiento y sensores apuntan a nativo; el plazo de entrega apunta a multiplataforma.
* **Versiona con SemVer, mide y publica de forma progresiva** para que una actualización no sea una sorpresa.

## Errores frecuentes

| Error | Causa habitual |
|---|---|
| Gradle no sincroniza | Sin conexión, versión de Gradle o del SDK incompatible |
| La app se cierra al abrir | Falta declarar la `Activity` en el manifest, o excepción no controlada (mira Logcat) |
| El emulador va muy lento | Poca memoria asignada o virtualización desactivada en la BIOS |
| La app pierde datos al girar | El estado no se guarda (`rememberSaveable`, `ViewModel`) |
| No aparece el móvil al conectarlo | Falta la depuración USB o el cable es solo de carga |
| Probar solo en el emulador | Usa los recursos del PC y oculta problemas reales | Probar al menos en un móvil real |
| Cargar los datos en `onResume` sin caché | Cada vuelta a primer plano repite la petición | Cargar en `onCreate` o en el `ViewModel` y refrescar solo si toca |
| Elegir multiplataforma «para ahorrar» sin mirar los requisitos | Un HTML empaquetado no iguala al nativo en gráficos exigentes | Analizar gráficos, sensores y presupuesto antes de decidir |
| Usar una librería sin comprobar el soporte | No todos los dispositivos la admiten | Revisar los dispositivos objetivo y probar en varios AVD |
| Publicar una actualización sin probarla | Una migración de datos fallida rompe la app del usuario | Migraciones probadas, despliegue progresivo y telemetría |

## Resumen

* Un móvil es un ordenador con **limitaciones** de batería, memoria, pantalla y red.
* **Android** (Kotlin, Android Studio) e **iOS** (Swift, Xcode) son los sistemas dominantes.
* Se puede programar **nativo** (una plataforma) o **multiplataforma** (Flutter, Kotlin Multiplatform, React Native, web).
* **Android Studio** incluye el SDK, el emulador y el depurador.
* Una pantalla pasa por un **ciclo de vida**: `onCreate` → `onStart` → `onResume` → `onPause` → `onStop` → `onDestroy`.

## Glosario

| Término | Significa |
|---|---|
| **APK / AAB** | Paquete instalable de una app Android |
| **API level** | Número de versión de las funciones de Android |
| **AVD** | Dispositivo virtual del emulador |
| **Activity** | Pantalla de una app Android |
| **Gradle** | Herramienta que compila el proyecto |
| **Logcat** | Ventana con los mensajes de la app |
| **Manifest** | Archivo que describe la app |
| **adb** | Herramienta de línea de comandos para controlar un dispositivo desde el ordenador |
| **MVVM** | Patrón que separa la pantalla (*View*), su estado (*ViewModel*) y los datos (*Model*) |
| **ViewModel** | Guarda el estado de la pantalla y sobrevive a los giros |
| **Service** | Componente que trabaja en segundo plano sin interfaz |
| **SemVer** | Forma de numerar versiones: mayor.menor.parche |
