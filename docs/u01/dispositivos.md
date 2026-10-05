# 1. Dispositivos y redes móviles

## Dispositivos móviles

Un dispositivo móvil es, en la práctica, un **ordenador de bolsillo** pensado para funcionar con batería, conexión inalámbrica y pantalla táctil. Han pasado de los PDA y los primeros teléfonos con teclado a terminales con pantallas de alta resolución, CPU multinúcleo, GPU potentes y muchos sensores.

| Tipo | Ejemplos |
|---|---|
| Teléfono inteligente (*smartphone*) | Móviles Android e iPhone |
| Tableta | iPad, tabletas Android |
| Reloj y pulsera | Wear OS, watchOS |
| Televisión y coche | Android TV, Android Auto, CarPlay |
| Plegables y otros | Móviles con pantalla plegable |

## Limitaciones a tener en cuenta

Programar para móvil no es programar para un PC pequeño. Hay que contar con:

* **Batería**: el consumo importa (pantalla, red, GPS, procesamiento).
* **Memoria y procesador** limitados: el sistema cierra apps en segundo plano para liberar recursos.
* **Pantalla**: tamaños, densidades y orientaciones muy distintos.
* **Conectividad intermitente**: la red puede fallar o ser lenta.
* **Interacción táctil**: botones grandes, gestos, teclado en pantalla.
* **Seguridad y permisos**: el usuario decide qué datos y sensores puede usar la app.

## Redes de comunicaciones móviles

| Generación | Aportó |
|---|---|
| **2G** (GSM) | Voz digital y mensajes de texto, datos muy lentos |
| **3G** | Internet móvil utilizable |
| **4G** (LTE) | Banda ancha móvil: vídeo en streaming, apps con mucha red |
| **5G** | Más velocidad, **menor latencia** y muchos dispositivos conectados |

Además de la red del operador, los móviles usan **Wi-Fi**, **Bluetooth** y **NFC**. Una buena app debe funcionar razonablemente con **poca o ninguna conexión** (por ejemplo, guardando datos localmente).
