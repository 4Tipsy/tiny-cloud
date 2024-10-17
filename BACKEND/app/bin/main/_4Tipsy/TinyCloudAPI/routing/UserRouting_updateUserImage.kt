
package _4Tipsy.TinyCloudAPI.routing

import io.ktor.server.routing.*
import io.ktor.server.application.call
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.content.forEachPart
import io.ktor.http.content.PartData
import io.ktor.http.content.streamProvider
import io.ktor.http.*

import java.io.InputStream


// modules
import _4Tipsy.TinyCloudAPI.services.UserService
import _4Tipsy.TinyCloudAPI.guards.AuthGuard
import _4Tipsy.TinyCloudAPI.exceptions.HttpException





fun Route._uploadUserImage() {




  route("update-user-image") {

    // handler
    post {
      val uid = AuthGuard(call)

      var _fileSize: Long? = null
      var fileStream: InputStream? = null

      call.receiveMultipart().forEachPart { part ->
        when(part) {
          is PartData.FileItem -> {

            // validations
            if (part.name != "File") throw HttpException(HttpStatusCode.UnprocessableEntity, "Request validation error", "Single field 'File' allowed here")
            val _mimeType_full = part.contentType?.toString() ?: "NOT_PROVIDED"
            val _mimeType = _mimeType_full?.split('/')?.get(0) ?: "NOT_PROVIDED"

            if (_mimeType != "image") throw HttpException(HttpStatusCode.UnsupportedMediaType, "Unsupported media type", "Media type '$_mimeType_full' is not supported, provide image")

            // assign vars
            _fileSize = call.request.header(HttpHeaders.ContentLength)?.toLong() ?: throw HttpException(HttpStatusCode.LengthRequired, "Validation error", "Please provide Content-Length header")
            fileStream = part.streamProvider()
          }

          else -> throw HttpException(HttpStatusCode.UnprocessableEntity, "Request validation error", "Single field 'File' allowed here")
        }
      }

      if (fileStream == null) throw HttpException(HttpStatusCode.UnprocessableEntity, "Validation error", "Field 'File' is not provided")

      UserService.updateUserImage(
        uid = uid,
        fileStream = fileStream!!,
        _fileSize = _fileSize!!
      )

      // if ok
      call.respond("OK")
    }
  }





}