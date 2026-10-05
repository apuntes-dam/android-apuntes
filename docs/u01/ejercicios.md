# A1 · Ejercicios de tecnologías móviles

<div class="ej-gate" data-unit="u01" data-nombre="U1 · Tecnologías para dispositivos móviles"></div>

## Ejercicio A1.1 · Limitaciones

Elige una app que uses a diario y enumera **cinco limitaciones** del móvil que sus desarrolladores han tenido que tener en cuenta (batería, red, pantalla…). Explica cómo crees que las resuelve.

## Ejercicio A1.2 · Android frente a iOS

Haz una tabla comparando Android e iOS en: fabricantes, lenguaje, entorno de desarrollo, tienda, fragmentación y requisitos de equipo. Indica qué sistema elegirías para una app solo para tu instituto y por qué.

## Ejercicio A1.3 · Nativo o multiplataforma

Para cada caso, razona si harías la app **nativa** o **multiplataforma** y con qué tecnología: (a) un juego 3D muy exigente, (b) una app de horarios para un instituto, (c) una app bancaria con huella dactilar, (d) una tienda online que también debe funcionar en la web.

## Ejercicio A1.4 · Instalar Android Studio

Instala Android Studio, abre **SDK Manager** y anota qué versión de Android (API level) tienes instalada y cuánto ocupa el SDK. Haz una captura de la pantalla de bienvenida.

## Ejercicio A1.5 · Primer proyecto

Crea un proyecto **Empty Activity** con Compose llamado `HolaMovil`. Cambia el texto a `Hola, <tu nombre>` y ejecútalo. Explica qué hacen `onCreate` y `setContent`.

## Ejercicio A1.6 · Dispositivo virtual

Crea un AVD con un perfil de teléfono y otro con una tableta. Arranca ambos y compara cómo se ve tu app. Anota qué API level usa cada uno.

## Ejercicio A1.7 · Ciclo de vida

Añade mensajes con `Log.d` a los seis métodos del ciclo de vida de `MainActivity`. En Logcat, anota qué métodos se llaman al: abrir la app, pulsar *Inicio*, volver a la app, girar la pantalla y cerrarla. Dibuja el diagrama de estados resultante.

## Ejercicio A1.8 · Reto: el contador que no se pierde

Añade un botón `+` y un contador. Comprueba que al **girar la pantalla** el contador vuelve a 0. Arréglalo con `rememberSaveable` y explica por qué ocurría.
