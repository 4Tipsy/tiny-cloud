
package _4Tipsy.TinyCloudAPI.guards


import org.bson.Document
import kotlinx.coroutines.flow.firstOrNull

import io.ktor.server.application.ApplicationCall
import io.ktor.server.request.header
import io.ktor.http.HttpStatusCode

import kotlinx.serialization.json.Json
import kotlin.jvm.Throws


// modules
import _4Tipsy.TinyCloudAPI.exceptions.HttpException
import _4Tipsy.TinyCloudAPI.models.User
import _4Tipsy.TinyCloudAPI.models.Session
import _4Tipsy.TinyCloudAPI.Databases




@Throws(HttpException::class)
suspend fun AuthGuard(call: ApplicationCall, allowUnverified: Boolean = false): String {

  // inner vars
  val _userCollection = Databases.mongo!!.getCollection<User>("users")
  val _redis = Databases.redis!!




  val sessionToken = call.request.cookies.get("session_token")
  if (sessionToken == null) throw HttpException(HttpStatusCode.Unauthorized, "Unauthorized", "User is not authorized, please login")


  val sessionRaw = _redis.get("session:$sessionToken")
  if (sessionRaw == null) throw HttpException(HttpStatusCode.Unauthorized, "Unauthorized", "User is not authorized, please login again")


  val _session = Json.decodeFromString<Session>(sessionRaw)
  val user = _userCollection.find( Document("uid", _session.uid) ).firstOrNull()
  if (user == null) throw HttpException(HttpStatusCode.Unauthorized, "Unauthorized", "User is not authorized, please login again")


  // verification case
  if (!allowUnverified) {
    if (!user.isVerified) throw HttpException(HttpStatusCode.Forbidden, "Not verified", "User is not verified")
  }


  // if ok
  return user.uid
}

