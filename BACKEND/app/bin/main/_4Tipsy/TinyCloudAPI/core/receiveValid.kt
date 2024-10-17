/*
* I have no how to handle validation errors globally, so... OVERRIDING!!!
 */

package _4Tipsy.TinyCloudAPI.core



import io.ktor.server.request.*
import io.ktor.server.application.ApplicationCall
import io.ktor.http.HttpStatusCode

import kotlinx.serialization.json.Json
import kotlinx.serialization.SerializationException

import kotlin.jvm.Throws


// modules
import _4Tipsy.TinyCloudAPI.exceptions.HttpException



0



// same as receive, but on serialization error throws HTTPException
@Throws(HttpException::class)
suspend inline fun <reified T> ApplicationCall.receiveValid(): T {

  try {
    // validation
    val rawBody = this.receiveText()
    return Json.decodeFromString<T>(rawBody)

  } catch (exc: SerializationException) {
    throw HttpException(HttpStatusCode.UnprocessableEntity, "Request validation error", exc.message!!)
  }

}