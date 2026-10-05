# 5. Emuladores y dispositivos reales

## El emulador de Android

Android Studio incluye un emulador para probar sin un móvil físico. Cada dispositivo virtual se llama **AVD** (*Android Virtual Device*) y se gestiona desde **Device Manager**.

Al crear un AVD eliges:

* **Perfil de hardware**: tamaño y densidad de pantalla (un teléfono, una tableta, un reloj…).
* **Imagen del sistema**: la versión de Android (**API level**) que se instalará.
* **Memoria y almacenamiento** asignados.

!!! tip "Prueba en varios tamaños y versiones"
    Una app debe verse bien en pantallas pequeñas y grandes y funcionar en la **API mínima** que hayas elegido.

## Un móvil real

Probar en un dispositivo físico es más fiel (rendimiento, sensores, cámara):

1. En el móvil, activa las **opciones de desarrollador** (pulsando varias veces el *número de compilación* en *Información del teléfono*).
2. Activa la **depuración USB**.
3. Conéctalo por USB y acepta el aviso de confianza.
4. Aparecerá en la lista de dispositivos de Android Studio.

## Límites del emulador

Es cómodo, pero no reproduce del todo la batería, algunos sensores ni el rendimiento real. Antes de dar una app por buena, pruébala en un dispositivo físico.

## Clasificación de dispositivos

Android describe cada dispositivo con **configuraciones** (tamaño de pantalla, densidad, versión del sistema, hardware disponible). La app indica en el *manifest* qué necesita y las tiendas la ofrecen solo a los dispositivos compatibles.
