
package _4Tipsy.TinyCloudAPI.plugins

import io.ktor.http.*
import io.ktor.server.plugins.statuspages.StatusPagesConfig
import io.ktor.server.response.*

import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import kotlinx.serialization.Serializable

// modules
import _4Tipsy.TinyCloudAPI.exceptions.HttpException
import _4Tipsy.TinyCloudAPI.exceptions.Basic404Exception




fun StatusPagesConfig.errorHandler() {

  @Serializable
  data class ErrResponseBody (val errorType: String, val errorDetail: String)


  exception<Throwable> { call, cause ->
    when(cause) {

      // http error
      is HttpException -> {
        val responseBody = ErrResponseBody(cause.errorType, cause.errorDetail).let { Json.encodeToString(it) }
        call.response.headers.append(HttpHeaders.ContentType, ContentType.Application.Json.toString()) // set header
        call.respond(cause.statusCode, responseBody)
      }

      // 404
      is Basic404Exception -> {
        call.respond(HttpStatusCode.NotFound, "404!")
      }

      // 500
      else -> {
        val responseBody = ErrResponseBody("Internal server error", "").let { Json.encodeToString(it) }
        call.response.headers.append(HttpHeaders.ContentType, ContentType.Application.Json.toString()) // set header
        call.respond(HttpStatusCode.InternalServerError, responseBody)
        // for log purposes
        cause.printStackTrace()
      }

    }
  }


}