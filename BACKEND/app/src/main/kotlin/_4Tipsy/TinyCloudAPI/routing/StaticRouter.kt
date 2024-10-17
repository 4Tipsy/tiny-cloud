
package _4Tipsy.TinyCloudAPI.routing


import io.ktor.server.routing.*
import io.ktor.server.application.call
import io.ktor.server.response.*


// modules
import _4Tipsy.TinyCloudAPI.services.StaticService




fun Routing.staticRouting() {

  route("/openapi.yaml") {
    get {
      val file = StaticService.getOpenapiFile()
      call.respondFile(file)
    }
  }

  route("/docs") {
    get {
      val file = StaticService.getRapidoc()
      call.respondFile(file)
    }
  }


}