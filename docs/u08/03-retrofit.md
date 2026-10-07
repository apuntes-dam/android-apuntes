# 8.3 Datos de internet con Retrofit

La mayoría de apps consume una **API REST**: una dirección web que devuelve datos en formato **JSON**. En Android se usa **Retrofit** para pedirlos y convertirlos en objetos Kotlin.

## Preparación

```kotlin
implementation("com.squareup.retrofit2:retrofit:2.11.0")
implementation("com.squareup.retrofit2:converter-gson:2.11.0")
```

Y el permiso `INTERNET` en el manifest (igual que con las imágenes, [4.3](../u04/03-internet.md)).

## Los tres elementos

**1. Una clase que representa el JSON**

```kotlin
data class Publicacion(val id: Int, val title: String, val body: String)
```

**2. Una interfaz con las peticiones**

```kotlin
interface ApiService {
    @GET("posts")
    suspend fun publicaciones(): List<Publicacion>

    @GET("posts/{id}")
    suspend fun publicacion(@Path("id") id: Int): Publicacion
}
```

**3. El objeto Retrofit**

```kotlin
object Api {
    val servicio: ApiService = Retrofit.Builder()
        .baseUrl("https://jsonplaceholder.typicode.com/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(ApiService::class.java)
}
```

La dirección de ejemplo es una API pública de pruebas.

## Usarlo desde el ViewModel

```kotlin
class PostsViewModel : ViewModel() {
    private val _estado = MutableStateFlow<Estado>(Estado.Cargando)
    val estado = _estado.asStateFlow()

    init { cargar() }

    fun cargar() = viewModelScope.launch {
        _estado.value = Estado.Cargando
        _estado.value = try {
            Estado.Exito(Api.servicio.publicaciones())
        } catch (e: Exception) {
            Estado.Error("No se pudo cargar")
        }
    }
}

sealed interface Estado {
    data object Cargando : Estado
    data class Exito(val datos: List<Publicacion>) : Estado
    data class Error(val mensaje: String) : Estado
}
```

Y la pantalla reacciona a cada estado con `when` (el patrón *cargando / error / datos* de la [7.4](../u07/04-ui-ux.md)):

```kotlin
val estado by vm.estado.collectAsStateWithLifecycle()
when (val e = estado) {
    Estado.Cargando -> CircularProgressIndicator()
    is Estado.Error -> Column { Text(e.mensaje); Button(onClick = vm::cargar) { Text("Reintentar") } }
    is Estado.Exito -> LazyColumn { items(e.datos) { Text(it.title, Modifier.padding(12.dp)) } }
}
```

!!! warning "Nunca en el hilo principal"
    Las peticiones de red tardan. Por eso las funciones de Retrofit son `suspend` y se llaman desde una corrutina (`viewModelScope.launch`). Si bloqueas el hilo principal, la app se congela.
