# 5. Emuladores y dispositivos reales

## El emulador de Android

Android Studio incluye un emulador para probar sin un móvil físico. Cada dispositivo virtual se llama **AVD** (*Android Virtual Device*) y se gestiona desde **Device Manager**.

Al crear un AVD eliges:

* **Perfil de hardware**: tamaño y densidad de pantalla (un teléfono, una tableta, un reloj…).
* **Imagen del sistema**: la versión de Android (**API level**) que se instalará.
* **Memoria y almacenamiento** asignados.

!!! tip "Prueba en varios tamaños y versiones"
    Una app debe verse bien en pantallas pequeñas y grandes y funcionar en la **API mínima** que hayas elegido.

### Configuración de un AVD en detalle

| Aspecto | Qué decides |
|---|---|
| **Imagen del sistema** | La versión de Android (API level) a probar |
| **ABI** | La arquitectura del procesador: `x86_64` suele ser más rápido en un PC, `arm64` imita mejor a los móviles reales |
| **Aceleración** | Hace el emulador mucho más rápido: Hyper-V o WHPX en Windows, KVM en Linux y nativa en macOS |
| **Pantalla** | Tamaño, densidad (dpi), rotación y las zonas seguras (por ejemplo la cámara dentro de la pantalla) |
| **Sensores** | Ubicación (puedes inyectar latitud y longitud), acelerómetro, giroscopio y nivel de batería |
| **Red** | Perfiles de velocidad y de pérdidas (3G, 4G, 5G o red mala) |

### Perfiles de prueba recomendados

| Perfil | Para qué |
|---|---|
| **Gama baja** | 2 GB de RAM, pantalla de 5 pulgadas y una API antigua: comprueba que la app aguanta con poco |
| **Gama media** | 3 o 4 GB de RAM, 6 pulgadas y la API actual: el caso más común |
| **Tableta** | 10 a 12 pulgadas: revisa que los layouts se adaptan |
| **Plegable** | Prueba el paso entre pantalla cerrada y abierta |
| **Wear OS, TV o coche** | Existen emuladores específicos |

## Un móvil real

Probar en un dispositivo físico es más fiel (rendimiento, sensores, cámara):

1. En el móvil, activa las **opciones de desarrollador** (pulsando varias veces el *número de compilación* en *Información del teléfono*).
2. Activa la **depuración USB**.
3. Conéctalo por USB y acepta el aviso de confianza.
4. Aparecerá en la lista de dispositivos de Android Studio.

## Límites del emulador

Es cómodo, pero no reproduce del todo la batería, algunos sensores ni el rendimiento real. Antes de dar una app por buena, pruébala en un dispositivo físico.

## Cuándo hace falta un dispositivo real

Usa un móvil físico cuando pruebes: **cámara avanzada**, **Bluetooth de baja energía (BLE)** o **NFC**, **rendimiento fino**, **gestos complejos** y comportamientos propios de un **fabricante** (cada marca modifica Android a su manera).

## Clasificación de dispositivos

Android describe cada dispositivo con **configuraciones** (tamaño de pantalla, densidad, versión del sistema, hardware disponible). La app indica en el *manifest* qué necesita y las tiendas la ofrecen solo a los dispositivos compatibles.
