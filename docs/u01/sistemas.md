# 2. Sistemas operativos móviles

## Android

* Sistema de **código abierto** (AOSP) desarrollado por Google, basado en Linux.
* Lo montan muchos fabricantes, con gran variedad de dispositivos.
* Las apps se programan en **Kotlin** (recomendado) o Java y se distribuyen como paquetes `.apk` o `.aab`, sobre todo por **Google Play**.
* Cada versión tiene un **nivel de API** (*API level*) que indica qué funciones ofrece.

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
