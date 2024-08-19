
package _4Tipsy.TinyCloudAPI.routing


import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.http.HttpStatusCode
import io.ktor.http.HttpHeaders
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.plugins.partialcontent.PartialContent



// modules
import _4Tipsy.TinyCloudAPI.services.DownloadService
import _4Tipsy.TinyCloudAPI.guards.AuthGuard
import _4Tipsy.TinyCloudAPI.guards.GetValidEid
import _4Tipsy.TinyCloudAPI.exceptions.HttpException








fun Routing.downloadRouting() {
  route("/api/download-service") {







    /* ROUTE */
    route("/download") {

      install(PartialContent) // set as streaming


      // handler
      get {
        val target = call.parameters.get("target")
          ?: throw HttpException(HttpStatusCode.UnprocessableEntity, "Request validation error", "No 'target' param provided")

        val uid = AuthGuard(call)
        val targetEid = GetValidEid(target)

        val (file, fileName) = DownloadService.downloadEntity(
          target = target,
          _targetEid = targetEid,
          uid = uid
        )

        // if ok
        call.response.headers.append(HttpHeaders.ContentDisposition, "attachment; filename=\"$fileName\"")
        call.respondFile(file)
      }
    }







  }
}