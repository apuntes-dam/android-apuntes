# 11. Administrador de aplicaciones: adb

Hasta ahora has instalado y lanzado la app con el botón **Run**. Detrás de ese botón hay una herramienta de línea de comandos que puedes usar tú mismo: **adb** (*Android Debug Bridge*). Con ella controlas un móvil o un emulador **desde el terminal, sin tocar la pantalla del dispositivo**: instalar y desinstalar apps, arrancar pantallas, dar permisos, leer los mensajes del sistema y copiar archivos.

!!! note "Dónde está y cómo se usa"
    `adb` viene en la carpeta **platform-tools** del SDK de Android (la instala Android Studio). Para usarlo desde cualquier terminal, añade esa carpeta al `PATH`, o lanza el terminal integrado de Android Studio. Comprueba que funciona con `adb version`.

## Ver los dispositivos conectados

```bash
adb devices
```

Lista los móviles y emuladores que ve el ordenador. Si el tuyo no aparece, repasa la depuración USB ([5. Emuladores y dispositivos reales](emuladores.md)). Si hay varios, indica a cuál va cada orden con `-s IDENTIFICADOR`.

## Instalar, actualizar y desinstalar

```bash
adb install app-debug.apk            # instala
adb install -r app-release.apk       # reinstala conservando los datos
adb uninstall com.ejemplo.app        # desinstala (y borra sus datos)
```

* Tras `install` no se abre nada, pero el icono aparece en el lanzador y la consola responde `Success`.
* `-r` actualiza la app **sin perder los datos** del usuario.
* `uninstall` quita el icono y borra los datos de la app.

El nombre que se pasa a `uninstall` es el **nombre de paquete** (`com.ejemplo.app`), no el nombre que ve el usuario.

## Arrancar y consultar apps

Dentro del móvil hay dos herramientas del sistema que se llaman con `adb shell`: `pm` (*package manager*, administra los paquetes) y `am` (*activity manager*, arranca pantallas y servicios).

```bash
adb shell pm list packages                       # todos los paquetes instalados
adb shell pm list packages | findstr ejemplo     # filtrar (en Linux y macOS: grep ejemplo)
adb shell am start -n com.ejemplo.app/.MainActivity
```

`am start -n paquete/.Actividad` abre esa pantalla: **la app se abre sola en el móvil**. Si el nombre de la actividad no existe, la consola responde con un error. Otras órdenes útiles:

```bash
adb shell am start -a android.intent.action.VIEW -d "https://example.com"   # abrir un enlace
adb shell input keyevent 3                                                   # pulsar el botón Inicio
adb shell input tap 500 1200                                                 # tocar la pantalla en esas coordenadas
adb shell dumpsys window | findstr mCurrentFocus                             # qué ventana tiene el foco
```

## Leer los mensajes del sistema

```bash
adb logcat                 # el registro completo (el mismo que ves en Logcat)
adb logcat *:W             # solo avisos (W) y errores (E)
```

Cada línea lleva fecha, hora, proceso, **nivel**, etiqueta y mensaje. La letra del nivel es clave: **V** verbose, **D** debug, **I** info, **W** warning, **E** error. Con `*:W` filtras casi todo el ruido, que es imprescindible para encontrar el motivo de un cierre inesperado entre miles de líneas. Es el mismo registro que muestra la ventana **Logcat** de Android Studio ([apartado 4](android-studio.md)).

## Permisos

```bash
adb shell pm grant com.ejemplo.app android.permission.ACCESS_FINE_LOCATION
```

Concede un permiso a la app **sin pasar por el aviso en pantalla**. Es muy cómodo para probar: comprobarás en *Ajustes → Aplicaciones → tu app → Permisos* que ya está concedido.

## Copiar archivos y capturar la pantalla

```bash
adb push datos.txt /sdcard/Download/            # del ordenador al móvil
adb pull /sdcard/Download/log.txt .             # del móvil al ordenador (aquí, en la carpeta actual)
adb shell screencap -p /sdcard/captura.png      # captura la pantalla del móvil
adb pull /sdcard/captura.png .                  # y la baja al ordenador
```

## Resumen de órdenes

| Quiero... | Orden |
|---|---|
| Ver qué dispositivos hay | `adb devices` |
| Instalar una app | `adb install app.apk` |
| Actualizarla sin perder datos | `adb install -r app.apk` |
| Desinstalarla | `adb uninstall paquete` |
| Abrir una pantalla | `adb shell am start -n paquete/.Actividad` |
| Listar apps instaladas | `adb shell pm list packages` |
| Ver errores y avisos | `adb logcat *:W` |
| Dar un permiso | `adb shell pm grant paquete permiso` |
| Subir o bajar un archivo | `adb push` / `adb pull` |
| Capturar la pantalla | `adb shell screencap -p` |

!!! warning "Código sin ejecutar con un dispositivo"
    Esta página no se ha probado con un móvil conectado: la sintaxis de las órdenes se ha comprobado con la ayuda de `adb`, pero lo que ocurre en el dispositivo debes verlo tú. Si una orden falla, mira el mensaje: casi siempre es un nombre de paquete o de actividad mal escrito.
