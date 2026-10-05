# 7. Buenas prácticas, errores frecuentes y resumen

## Buenas prácticas

* **Elige la API mínima** con criterio: cuanto más baja, más dispositivos, pero menos funciones.
* **No bloquees la interfaz**: el trabajo largo (red, base de datos) se hace fuera del hilo principal.
* **Pide solo los permisos que necesitas** y explica para qué.
* **Guarda el estado** que no quieras perder al girar la pantalla.
* **Prueba en varios tamaños** de pantalla y en un móvil real.
* **Usa control de versiones** desde el primer día.

## Errores frecuentes

| Error | Causa habitual |
|---|---|
| Gradle no sincroniza | Sin conexión, versión de Gradle o del SDK incompatible |
| La app se cierra al abrir | Falta declarar la `Activity` en el manifest, o excepción no controlada (mira Logcat) |
| El emulador va muy lento | Poca memoria asignada o virtualización desactivada en la BIOS |
| La app pierde datos al girar | El estado no se guarda (`rememberSaveable`, `ViewModel`) |
| No aparece el móvil al conectarlo | Falta la depuración USB o el cable es solo de carga |

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
