# 2. Sistemas operativos móviles

## Cómo se organiza un sistema operativo móvil

Igual que en un ordenador, el sistema operativo oculta el hardware concreto y ofrece servicios a las aplicaciones. Casi todos se organizan en **capas**:

| Capa | Qué hace |
|---|---|
| **Núcleo** (*kernel*) | Accede al hardware mediante controladores (*drivers*) y ofrece a las capas de arriba la gestión de procesos, de memoria y del sistema de archivos |
| **Middleware** | Módulos intermedios que hacen posible que existan aplicaciones; el usuario no los ve |
| **Aplicaciones** | Las apps nativas del sistema y las que instalas |

## Android

* Sistema de **código abierto** (AOSP) desarrollado por Google, basado en Linux.
* Lo montan muchos fabricantes, con gran variedad de dispositivos.
* Las apps se programan en **Kotlin** (recomendado) o Java y se distribuyen como paquetes `.apk` (instalación directa) o `.aab` (el formato que exige **Google Play**).
* Cada versión tiene un **nivel de API** (*API level*) que indica qué funciones ofrece.

### La pila de software de Android

De abajo arriba, **Android** se organiza así:

1. **Kernel de Linux**: el núcleo.
2. **Capa de abstracción de hardware** (*HAL*): interfaces estándar para que el sistema hable con cámara, sensores, audio...
3. **Entorno de ejecución** (*runtime*): cada app se ejecuta en **su propio proceso** y con su propia instancia.
4. **Bibliotecas nativas** de C/C++: muchos componentes y servicios del sistema están escritos en estos lenguajes.
5. **Framework de API**: la parte que usas tú, con las clases para pantallas, vistas, notificaciones, ubicación...
6. **Apps del sistema**: correo, navegador, calendario, etc.

Tu app vive en lo más alto de esa pila, y por eso depende de la **versión** de Android en la que se ejecute (el *API level*).

## iOS

* Sistema **propietario** de Apple, solo en iPhone (iPadOS en iPad).
* Las apps se programan en **Swift** (u Objective-C) con **Xcode**, que solo funciona en macOS.
* Se distribuyen mediante la **App Store**, con revisión previa de Apple.

## Otros

Existen alternativas minoritarias (por ejemplo HarmonyOS). Los relojes y otros dispositivos tienen variantes específicas.

| | Android | iOS |
|---|---|---|
| Fabricantes | Muchos | Solo Apple |
| Lenguaje principal | Kotlin | Swift |
| Entorno | Android Studio | Xcode (solo macOS) |
| Tienda | Google Play (y otras) | App Store |
| Fragmentación | Alta (muchos modelos y versiones) | Baja |

## Seguridad y distribución

* Cada app se ejecuta **aislada** (*sandbox*) y debe pedir **permisos** para usar cámara, ubicación, contactos…
* Las apps van **firmadas** para garantizar su origen.
* Las tiendas revisan y distribuyen el software, y gestionan las actualizaciones.
