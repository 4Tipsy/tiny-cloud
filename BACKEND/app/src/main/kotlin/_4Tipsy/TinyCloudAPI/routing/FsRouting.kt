
package _4Tipsy.TinyCloudAPI.routing


import io.ktor.server.routing.*
import io.ktor.server.application.call
import io.ktor.server.response.respond

import kotlinx.serialization.Serializable


// modules
import _4Tipsy.TinyCloudAPI.services.FsEntityService
import _4Tipsy.TinyCloudAPI.guards.AuthGuard
import _4Tipsy.TinyCloudAPI.guards.GetValidEid
import _4Tipsy.TinyCloudAPI.core.receiveValid





fun Routing.fsRouting() {
  route("/fs-service") {



    /* ROUTE */
    route("/get-entity-by-eid") {

      // models
      @Serializable
      data class RequestBody (
        val targetEid: String,
      )

      // handler
      post {
        val uid = AuthGuard(call) // AUTH NEEDED

        val body = call.receiveValid<RequestBody>()

        val entity = FsEntityService.getEntityByEid(
          eid = body.targetEid,
          uid = uid
        )

        call.respond(entity)
      }
    }




    /* ROUTE */
    route("/get-dir-contents") {

      // models
      @Serializable
      data class RequestBody (
        val where: String,
      )

      // handler
      post {
        val uid = AuthGuard(call) // AUTH NEEDED

        val body = call.receiveValid<RequestBody>()
        val whereEid = GetValidEid(body.where, uid)

        val contents = FsEntityService.getDirContents(
          where = body.where,
          _whereEid = whereEid,
          uid = uid
        )

        // if ok
        call.respond(contents)
      }
    }





    /* ROUTE */
    route("/create-new-dir") {

      // models
      @Serializable
      data class RequestBody (
        val where: String,
        val name: String,
      )

      // handler
      post {
        val uid = AuthGuard(call) // AUTH NEEDED

        val body = call.receiveValid<RequestBody>()
        val whereEid = GetValidEid(body.where, uid)


        FsEntityService.createNewDir(
          where = body.where,
          _whereEid = whereEid,
          name = body.name,
          uid = uid
        )

        // if ok
        call.respond("OK")
      }
    }



    /* ROUTE */
    _uploadFile() // this handler is too big...




    /* ROUTE */
    route("/rename-entity") {

      // models
      @Serializable
      data class RequestBody (
        val target: String,
        val newName: String,
      )

      // handler
      post {
        val uid = AuthGuard(call) // AUTH NEEDED

        val body = call.receiveValid<RequestBody>()
        val targetEid = GetValidEid(body.target, uid)!!

        FsEntityService.renameEntity(
          target = body.target,
          _targetEid = targetEid,
          newName = body.newName,
          uid = uid
        )

        // if ok
        call.respond("OK")
      }
    }




    /* ROUTE */
    route("/delete-entity") {

      // models
      @Serializable
      data class RequestBody (
        val target: String,
      )

      // handler
      post {
        val uid = AuthGuard(call) // AUTH NEEDED

        val body = call.receiveValid<RequestBody>()
        val targetEid = GetValidEid(body.target, uid)!!

        FsEntityService.deleteEntity(
          target = body.target,
          _targetEid = targetEid,
          uid = uid
        )

        // if ok
        call.respond("OK")
      }
    }





    /* ROUTE */
    route("/move-entity") {

      // models
      @Serializable
      data class RequestBody (
        val target: String,
        val newParent: String,
      )

      // handler
      post {
        val uid = AuthGuard(call) // AUTH NEEDED

        val body = call.receiveValid<RequestBody>()
        val targetEid = GetValidEid(body.target, uid)

        FsEntityService.moveEntity(
          target = body.target,
          _targetEid = targetEid,
          newParentPath = body.newParent,
          uid = uid
        )

        // if ok
        call.respond("OK")
      }
    }


  }
}