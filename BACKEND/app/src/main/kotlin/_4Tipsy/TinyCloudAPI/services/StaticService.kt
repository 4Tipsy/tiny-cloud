
package _4Tipsy.TinyCloudAPI.services


import java.io.File
import kotlin.io.path.toPath


class StaticService {
  companion object {

    private fun _getResource(i: String): String {
      return this.javaClass.classLoader.getResource(i)!!.toURI().toPath().toAbsolutePath().toString()
    }



    fun getOpenapiFile(): File {
      val path = _getResource("openapi.yaml")
      return File(path)
    }


    fun getRedoc(): File {
      val path = _getResource("redoc.html")
      return File(path)
    }


    fun getRapidoc(): File {
      val path = _getResource("rapidoc.html")
      return File(path)
    }


  }
}