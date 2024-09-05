
package _4Tipsy.TinyCloudAPI.routing


import io.ktor.server.routing.*
import io.ktor.server.application.call
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.http.*

import kotlinx.serialization.Serializable


// modules
import _4Tipsy.TinyCloudAPI.services.UserService
import _4Tipsy.TinyCloudAPI.guards.AuthGuard
import _4Tipsy.TinyCloudAPI.core.receiveValid
import _4Tipsy.TinyCloudAPI.Config




fun Routing.userRouting() {
  route("/api/user-service") {




    /* ROUTE */
    route("/create-new-user") {

      // models
      @Serializable
      data class RequestBody (
        val name: String,
        val email: String,
        val password: String,
      )

      // handler
      post {
        val body = call.receiveValid<RequestBody>()
        UserService.createNewUser(
          name = body.name,
          email = body.email,
          rawPassword = body.password,
          log = call.application.environment.log
        )
        call.respond(HttpStatusCode.OK, "OK") // if ok
      }
    }





    /* ROUTE */
    route("/login") {

      // models
      @Serializable
      data class RequestBody (
        val email: String,
        val password: String,
      )

      // handler
      post {
        val body = call.receiveValid<RequestBody>()
        val (sessionId, refreshToken) = UserService.openNewSession(
          email = body.email,
          rawPassword = body.password,
          call = call
        )

        // if ok
        call.response.cookies.append("session_token", sessionId, maxAge = Config.load().main.sessionTtl, path = "/")
        call.response.cookies.append("refresh_token", refreshToken, maxAge = Config.load().main.refreshTtl, path = "/api/user-service/refresh-token")
        call.respond("OK")
      }
    }




    /* ROUTE */
    route("/refresh-session") {

      // models
      @Serializable
      data class RequestBody (
        val refreshToken: String,
      )

      // handler
      get {
        val body = call.receiveValid<RequestBody>()

        val (newSessionId, newRefreshToken) = UserService.openNewSession(
          refreshToken = body.refreshToken,
          call = call
        )

        // if ok
        call.response.cookies.append("session_token", newSessionId, maxAge = Config.load().main.sessionTtl)
        call.response.cookies.append("refresh_token", newRefreshToken, maxAge = Config.load().main.refreshTtl, path = "/api/user-service/refresh-token")
        call.respond("OK")
      }
    }






    /* ROUTE */
    route("/get-current-user") {

      // handler
      get {
        val uid = AuthGuard(call, allowUnverified = true) // AUTH NEEDED

        val userDto = UserService.getCurrentUser(
          uid = uid
        )

        // if ok
        call.respond(userDto)
      }
    }






    /* ROUTE */
    route("/get-user-image") {

      // handler
      get {
        val uid = AuthGuard(call, allowUnverified = true)

        val userImageFile = UserService.getUserImageFile(
          uid = uid
        )

        // if ok
        call.response.headers.append(HttpHeaders.ContentDisposition, "attachment; filename=\"user_image\"")
        call.respondFile(userImageFile)
      }
    }





    /* ROUTE */
    _uploadUserImage()



  }
}