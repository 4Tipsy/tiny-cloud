
package _4Tipsy.TinyCloudAPI.routing


import io.ktor.server.routing.*
import io.ktor.server.application.call
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.http.HttpStatusCode
import io.ktor.http.HttpHeaders
import io.ktor.http.content.*

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json

import java.io.InputStream
import kotlin.jvm.Throws


// modules
import _4Tipsy.TinyCloudAPI.services.FsEntityService
import _4Tipsy.TinyCloudAPI.guards.AuthGuard
import _4Tipsy.TinyCloudAPI.guards.GetValidEid
import _4Tipsy.TinyCloudAPI.exceptions.HttpException



/*
* Should be inserted into FsRouting
* Is in another file, cuz handler is too big (multiPartData)
*/
fun Route._uploadFile() {


  /* ROUTE */
  route("/upload-file") {

    // models
    @Serializable
    data class RequestBody (
      val where: String,
      val name: String,
    )


    // handler
    post {
      val uid = AuthGuard(call) // AUTH NEEDED

      var body: RequestBody? = null
      var fileStream: InputStream? = null
      var _mimeType: String? = null
      var _fileSize: Long? = null

      call.receiveMultipart().forEachPart { part ->
        when (part) {

          // -- Request --
          is PartData.FormItem -> {

            // field name validation
            if (part.name != "Request") throw HttpException(
              HttpStatusCode.UnprocessableEntity,
              "Validation error",
              "Unsupported field '${part.name}'"
            )

            // try to validate body
            body = _getValidBody<RequestBody>(part.value)

          }


          // -- FileStream --
          is PartData.FileItem -> {

            // field name validation
            if (part.name != "File") throw HttpException(
              HttpStatusCode.UnprocessableEntity,
              "Validation error",
              "Unsupported field '${part.name}'"
            )

            // try to get file
            _mimeType = part.contentType?.toString() ?: "unknown"
            _fileSize = call.request.header(HttpHeaders.ContentLength)?.toLong()
            fileStream = part.streamProvider()

          }

          // -- no idea --
          else -> part.dispose()
        }
      }
      // after checks
      if (body == null) throw HttpException(HttpStatusCode.UnprocessableEntity, "Validation error", "Field 'Request' is not provided")
      if (fileStream == null) throw HttpException(HttpStatusCode.UnprocessableEntity, "Validation error", "Field 'File' is not provided")
      if (_fileSize == null) throw HttpException(HttpStatusCode.LengthRequired, "Validation error", "Please provide Content-Length header")

      // call service!
      val whereUid = GetValidEid(body!!.where)
      FsEntityService.uploadFile(
        where = body!!.where,
        _whereEid = whereUid,
        name = body!!.name,
        uid = uid,
        fileStream = fileStream!!,
        _mimeType = _mimeType!!,
        _fileSize = _fileSize!!
      )

      // if ok
      call.respond("OK")


    }
  }





}





@Throws(HttpException::class)
inline fun <reified T> _getValidBody(rawBody: String): T {

  try {
    return Json.decodeFromString<T>(rawBody)

  } catch (exc: SerializationException) {
    throw HttpException(HttpStatusCode.UnprocessableEntity, "Request validation error", exc.message!!)
  }

}


