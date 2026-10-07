# 4.4 El icono de la aplicación

El icono que ves en el lanzador del móvil se configura en el *manifest*:

```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:label="Mi app" ...>
```

## Asistente de iconos

1. Clic derecho en `res` → **New → Image Asset**.
2. Tipo **Launcher Icons (Adaptive and Legacy)**.
3. Elige una imagen, un texto o un clip art para el **primer plano** y un color o imagen para el **fondo**.
4. Ajusta el recorte en la vista previa y pulsa *Next → Finish*.

## Iconos adaptativos

Desde Android 8 el icono tiene **dos capas** (primer plano y fondo) y cada fabricante las recorta con su forma (círculo, cuadrado redondeado…). Por eso el dibujo importante debe quedar en el **centro**, dentro de la «zona segura» (los 66 dp centrales de 108 dp).

| Capa | Archivo |
|---|---|
| Fondo | `ic_launcher_background` |
| Primer plano | `ic_launcher_foreground` |
| Monocromo (iconos temáticos, Android 13+) | `<monochrome>` en `ic_launcher.xml` |

## Nombre de la app

El nombre bajo el icono está en `res/values/strings.xml`:

```xml
<string name="app_name">Mi app</string>
```

Cámbialo ahí y no en el código. En la [U7](../u07/index.md) verás por qué.
