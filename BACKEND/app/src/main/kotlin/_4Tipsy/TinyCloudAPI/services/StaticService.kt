
package _4Tipsy.TinyCloudAPI.services


import java.io.File


class StaticService {
  companion object {



    fun getOpenapiFile(): File {
      return File("data/openapi.yaml")
    }



    fun getRapidoc(): File {
      return File("data/rapidoc.html")
    }


  }
}