
package _4Tipsy.TinyCloudAPI.routing


import io.ktor.server.routing.*
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.response.*
import io.ktor.http.HttpStatusCode


// modules
import _4Tipsy.TinyCloudAPI.services.StaticService




fun Routing.staticRouting() {

  route("/api/openapi.yaml") {
    get {
      val file = StaticService.getOpenapiFile()
      call.respondFile(file)
    }
  }

  route("/api/redoc") {
    get {
      val file = StaticService.getRedoc()
      call.respondFile(file)
    }
  }

  route("/api/rapidoc") {
    get {
      val file = StaticService.getRapidoc()
      call.respondFile(file)
    }
  }


}