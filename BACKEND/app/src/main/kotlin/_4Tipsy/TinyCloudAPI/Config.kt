
package _4Tipsy.TinyCloudAPI



import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName
import net.peanuuutz.tomlkt.Toml
import net.peanuuutz.tomlkt.decodeFromTomlElement


import java.io.File

// modules
import _4Tipsy.TinyCloudAPI.exceptions.InvalidConfigException



// model
@Serializable
data class ConfigModel (
  val main: Main,
  val fs: Fs,
  val databases: Databases
) {
  @Serializable
  data class Main (
    val port: Int,
    val host: String,
    @SerialName("new_user_space_available")
    val newUserSpaceAvailable: Long,
    @SerialName("user_image_max_size")
    val userImageMaxSize: Long,
    @SerialName("session_ttl")
    val sessionTtl: Long,
    @SerialName("refresh_ttl")
    val refreshTtl: Long,
  )
  @Serializable
  data class Fs (
    @SerialName("default_user_image_path")
    val defaultUserImagePath: String,
    @SerialName("file_storage_path")
    val fileStoragePath: String,
    @SerialName("cache_dir_path")
    val cacheDirPath: String,
  )
  @Serializable
  data class Databases (
    @SerialName("mongo_db_uri")
    val mongoDbUri: String,
    @SerialName("redis_cred")
    val redisCred: String,
  )
}





object Config {
  private var instance: ConfigModel? = null


  // get config singleton
  fun load(): ConfigModel {

    if (this.instance == null) {

      println("LOADED CONFIG FROM FILE")

      // try to get file
      val configFile = File("Config.toml")
      if (!configFile.exists()) {
        val cwd = File(".").getAbsolutePath()
        throw InvalidConfigException("No config file provided in `$cwd`")
      }

      // try to parse
      try {
        val configTree = Toml.parseToTomlTable(configFile.readText())
        val config = Toml.decodeFromTomlElement<ConfigModel>( configTree.get("Config")!! )
        this.instance = config

      // on parse errors
      } catch (exc: Exception) {
        throw InvalidConfigException("Error while parsing config file", exc)
      }

      // some after-checks
      if ( !File(this.instance!!.fs.fileStoragePath).exists() ) {
        throw InvalidConfigException("Config.fs.file_storage_path ('${this.instance!!.fs.fileStoragePath}') should exist")
      }
      if ( !File(this.instance!!.fs.defaultUserImagePath).exists() ) {
        throw InvalidConfigException("Config.fs.default_user_image_path ('${this.instance!!.fs.defaultUserImagePath}') should exist")
      }
      if ( !File(this.instance!!.fs.cacheDirPath).exists() ) {
        throw InvalidConfigException("Config.fs.cache_dir_path ('${this.instance!!.fs.cacheDirPath}') should exist")
      }
    }

    // finally
    return this.instance!!
  }


}