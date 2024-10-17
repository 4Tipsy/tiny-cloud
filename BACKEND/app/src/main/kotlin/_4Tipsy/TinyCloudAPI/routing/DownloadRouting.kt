
package _4Tipsy.TinyCloudAPI.routing


import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.plugins.partialcontent.PartialContent
import io.ktor.http.HttpStatusCode
import io.ktor.http.HttpHeaders
import io.ktor.http.quote // 0_o

import java.nio.file.Files

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
        val targetEid = GetValidEid(target, uid)

        val (file, fileName) = DownloadService.downloadEntity(
          target = target,
          _targetEid = targetEid,
          uid = uid
        )

        // if ok
        try {
          call.response.headers.append(HttpHeaders.ContentDisposition, "attachment; filename=${fileName.quote()}")
          call.respondFile(file)
        } finally {
          // cleanup (if it was retrieved dir) // in `finally` cuz call might be interrupted
          if (file.name.endsWith(".tmp")) Files.delete(file.toPath()) // `file.name`, not `fileName`
        }
      }
    }



  route("/download-by-eid") {

    install(PartialContent) // set as streaming


    // handler
    get {
      val targetEid = call.parameters.get("target")
        ?: throw HttpException(HttpStatusCode.UnprocessableEntity, "Request validation error", "No 'target' param provided")

      val uid = AuthGuard(call)


      if (targetEid == "null") throw HttpException(HttpStatusCode(418, "I'm a teapot"), "Root has no EID, this route not supposed to download it", "Use regular '/download', silly ;3")
      val (file, fileName) = DownloadService.downloadEntity(
        target = "@eid="+targetEid,
        _targetEid = targetEid,
        uid = uid
      )

      // if ok
      try {
        call.response.headers.append(HttpHeaders.ContentDisposition, "attachment; filename=${fileName.quote()}")
        call.respondFile(file)
      } finally {
        // cleanup (if it was retrieved dir) // in `finally` cuz call might be interrupted
        if (file.name.endsWith(".tmp")) Files.delete(file.toPath()) // `file.name`, not `fileName`
      }
    }
  }



  }
}
