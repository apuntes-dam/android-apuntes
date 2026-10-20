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

### Qué caracteriza a un dispositivo móvil

* **Características principales**: **tamaño** reducido (se transporta, incluso haciendo deporte), **movilidad** (sin cables, con batería duradera y comunicación inalámbrica), **conectividad** (redes inalámbricas) y **capacidad de procesado** (un microprocesador capaz de calcular y gestionar la información).
* **Características secundarias**: el sistema operativo, la ergonomía, el diseño, el tamaño de pantalla y los accesorios compatibles.

Además de los tipos de la tabla, existen los **PDA** (organizadores personales, hoy en declive) y los **libros electrónicos** (tinta electrónica, ligeros y con mucho almacenamiento). La familia no se limita al *smartphone*: una misma app de mensajería debe funcionar en un móvil de 6 pulgadas, en una tableta de 10 y en un reloj, con **la misma lógica y tres interfaces muy distintas**.

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

### Evolución completa de las redes móviles

| Generación | Época | Tecnología | Aportó (velocidades orientativas) |
|---|---|---|---|
| **0G** | Años 30-40 | Radio (los primeros «walkie-talkies») | Solo voz |
| **1G** | Finales de los 70 | AMPS, NMT | Voz analógica; equipos grandes y poca seguridad |
| **2G** | Años 90 | GSM | Voz y datos digitales, tarjeta SIM y SMS |
| **2.5G / 2.75G** | Finales de los 90 | GPRS, EDGE | Navegación muy básica; sigue como red de respaldo |
| **3G** | 2001 | UMTS | Hasta unos 2 Mbps; internet móvil utilizable |
| **3.5G** | Hacia 2005 | HSPA | Hasta unos 14 Mbps |
| **4G** | 2010 | LTE | Decenas de Mbps; streaming de vídeo |
| **4G+** | 2016 | LTE-Advanced | Hasta unos 300 Mbps |
| **5G** | 2017 | NR | De 1 a 10 Gbps; baja latencia; internet de las cosas (IoT) |
| **6G** | En investigación | Frecuencias mucho más altas, satélites | Cobertura global y velocidades aún mayores |

Las velocidades son valores de referencia: la velocidad real depende de la cobertura, la antena y el número de usuarios.

!!! tip "Qué implica para tu app"
    Un vídeo en directo necesita al menos una buena 4G; un chat funciona incluso con una 2G de respaldo. La app debe **degradarse con elegancia** cuando la red empeora, y no perder su estado: el contexto (red, luz, batería, orientación) cambia sin avisar.

Además de la red del operador, los móviles usan **Wi-Fi**, **Bluetooth** y **NFC**. Una buena app debe funcionar razonablemente con **poca o ninguna conexión** (por ejemplo, guardando datos localmente).
