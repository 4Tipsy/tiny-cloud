
package _4Tipsy.TinyCloudAPI.routing

import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.http.HttpHeaders
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.plugins.partialcontent.PartialContent

import kotlinx.serialization.Serializable


// modules
import _4Tipsy.TinyCloudAPI.services.ShareService
import _4Tipsy.TinyCloudAPI.guards.AuthGuard
import _4Tipsy.TinyCloudAPI.guards.GetValidEid
import _4Tipsy.TinyCloudAPI.core.receiveValid



fun Routing.shareRouting() {
  route("/share-service") {



    /* ROUTE */
    route("/make-shared") {

      // models
      @Serializable
      data class RequestBody (
        val target: String,
      )
      @Serializable
      data class ResponseBody (
        val sharedLink: String,
      )

      // handler
      post {
        val uid = AuthGuard(call) // AUTH NEEDED

        val body = call.receiveValid<RequestBody>()
        val targetEid = GetValidEid(body.target, uid)

        val sharedLink = ShareService.makeShared(
          target = body.target,
          _targetEid = targetEid,
          uid = uid
        )

        // if ok
        val responseBody = ResponseBody(sharedLink)
        call.respond(responseBody)
      }
    }



    /* ROUTE */
    route("/make-unshared") {

      // model
      @Serializable
      data class RequestBody (
        val target: String,
      )

      // handler
      post {
        val uid = AuthGuard(call) // AUTH NEEDED

        val body = call.receiveValid<RequestBody>()
        val targetEid = GetValidEid(body.target, uid)

        ShareService.makeUnshared(
          target = body.target,
          _targetEid = targetEid,
          uid = uid
        )

        // if ok
        call.respond("OK")
      }
    }




    /* ROUTE */
    route("/get-all-shared-entities") {

      // handler
      get {
        val uid = AuthGuard(call)

        val contents = ShareService.getAllSharedEntities(
          uid = uid
        )

        call.respond(contents)
      }
    }



  }



  route("/share/{userName}/{sharedLink}") {

    // handler
    get {
      val entity = ShareService.getSharedEntity(
        sharedLink = call.parameters.get("sharedLink"),
        userName = call.parameters.get("userName")
      )
      // if ok
      call.respond(entity)
    }


    // handler
    route("/file") {
      install(PartialContent) // set as streaming
      get {

        val (file, fileName) = ShareService.getSharedEntityDownloadable(
          sharedLink = call.parameters.get("sharedLink"),
          userName = call.parameters.get("userName")
        )

        // if ok
        try {
          call.response.headers.append(HttpHeaders.ContentDisposition, "attachment; filename=\"$fileName\"")
          call.respondFile(file)
        } finally {
          // cleanup (if it was retrieved dir)
          if (file.name.endsWith(".tmp")) file.delete() // `file.name`, not `fileName`
        }
      }
    }


  }



}