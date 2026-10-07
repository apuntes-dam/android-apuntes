# 8.4 Datos locales: DataStore y Room

| Necesito guardar… | Usa |
|---|---|
| Un ajuste sencillo (modo oscuro, nombre de usuario) | **DataStore** |
| Datos estructurados (tareas, contactos…) que se consultan | **Room** (base de datos SQLite) |

## DataStore: preferencias

```kotlin
implementation("androidx.datastore:datastore-preferences:1.1.1")
```

```kotlin
val Context.datos by preferencesDataStore("ajustes")
val CLAVE_OSCURO = booleanPreferencesKey("oscuro")

// Leer: es un Flow, se actualiza solo
val oscuro: Flow<Boolean> = contexto.datos.data.map { it[CLAVE_OSCURO] ?: false }

// Escribir (función suspendida)
suspend fun guardar(valor: Boolean) = contexto.datos.edit { it[CLAVE_OSCURO] = valor }
```

## Room: base de datos

Room traduce clases Kotlin a tablas SQL. Tiene tres piezas:

**Entidad** (una tabla):

```kotlin
@Entity(tableName = "tareas")
data class Tarea(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val titulo: String,
    val hecha: Boolean = false
)
```

**DAO** (las consultas):

```kotlin
@Dao
interface TareaDao {
    @Query("SELECT * FROM tareas ORDER BY id DESC")
    fun todas(): Flow<List<Tarea>>

    @Insert
    suspend fun insertar(t: Tarea)

    @Update
    suspend fun actualizar(t: Tarea)

    @Delete
    suspend fun borrar(t: Tarea)
}
```

**Base de datos**:

```kotlin
@Database(entities = [Tarea::class], version = 1)
abstract class AppDb : RoomDatabase() {
    abstract fun tareaDao(): TareaDao
}

val db = Room.databaseBuilder(contexto, AppDb::class.java, "tareas.db").build()
```

Como `todas()` devuelve un `Flow`, la lista de la pantalla **se actualiza sola** cada vez que insertas o borras. Esa es la gran ventaja: el ViewModel observa la base de datos y la interfaz solo dibuja.

!!! note "Un paso más"
    Las migraciones (cambiar la estructura al actualizar la app) y las relaciones entre tablas son temas de acceso a datos que se verán con más detalle en el módulo correspondiente.

!!! note "Código de Android sin ejecutar aquí"
    Los fragmentos de esta unidad usan Jetpack Compose y no se han ejecutado en este entorno (hace falta el SDK y un emulador). Pruébalos siempre en tu proyecto; si algo no compila, suele faltar un `import`: pulsa **Alt+Enter** sobre el nombre en rojo.
