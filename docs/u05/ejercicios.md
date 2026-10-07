# A5 · Ejercicios de formularios

<div class="ej-gate" data-unit="u05" data-nombre="U5 · Formularios"></div>

Todos los formularios deben usar el teclado adecuado a cada campo y mostrar los errores solo cuando el usuario haya escrito algo.

## Ejercicio A5.1

**Hola, nombre.** Un `OutlinedTextField` y un texto que muestre «Hola, …» con lo que se escribe, en tiempo real.

<details class="sol" data-key="android/u05/A5.1">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun HolaNombre() {
    var nombre by remember { mutableStateOf("") }
    Column(Modifier.padding(16.dp)) {
        OutlinedTextField(
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A5.2

**Teclados.** Tres campos (correo, teléfono, número) y comprueba que cada uno saca un teclado distinto.

## Ejercicio A5.3

**Contraseña con ojo.** Campo de contraseña con un icono que muestre u oculte lo escrito.

## Ejercicio A5.4

**Preferencias.** Un `Switch` de «Notificaciones», un `Checkbox` de «Recibir novedades» y un grupo de tres `RadioButton` para elegir el idioma. Debajo, un resumen de lo elegido.

## Ejercicio A5.5

**Volumen y brillo.** Dos `Slider` con su porcentaje a la derecha. El brillo debe ir de 10 a 100.

## Ejercicio A5.6

**Elige ciudad.** Un menú desplegable con cinco ciudades. Al elegir una, aparece en el botón.

## Ejercicio A5.7

**Confirmar borrado.** Un botón «Borrar cuenta» abre un `AlertDialog` con «Cancelar» y «Borrar». Al borrar, muestra un `Snackbar` con la opción «Deshacer».

## Ejercicio A5.8

**Registro.** Formulario con nombre, correo, edad (16–99) y casilla de condiciones. El botón «Registrarme» solo está activo si todo es válido y los errores aparecen bajo cada campo.

## Ejercicio A5.9

⭐ **Reto: calculadora de IMC.** Dos campos (peso en kg y altura en cm), validación numérica y un botón que muestre el IMC y la categoría (bajo peso, normal, sobrepeso, obesidad).

<details class="sol" data-key="android/u05/A5.9">
<summary>Solución modelo (bloqueada)</summary>
<div class="sol-body"><p class="sol-aviso">🔒 La solución completa está bloqueada. Esto es solo un ejemplo de cómo empieza:</p><pre><code>@Composable
fun CalculadoraImc() {
    var peso by remember { mutableStateOf("") }
    var altura by remember { mutableStateOf("") }
    val p = peso.replace(',', '.').toDoubleOrNull()
// ... (resto de la solución bloqueado)</code></pre></div>
</details>

## Ejercicio A5.10

⭐ **Reto: el estado en una clase.** Reescribe A5.8 agrupando todos los datos en una `data class RegistroUi` y la validación en funciones que reciban esa clase.
