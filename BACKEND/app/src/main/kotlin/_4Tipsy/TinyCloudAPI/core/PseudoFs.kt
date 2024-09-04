
package _4Tipsy.TinyCloudAPI.core


import org.bson.Document
import com.mongodb.client.model.Filters

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.withContext

import kotlin.jvm.Throws

import java.io.File
import java.nio.file.Files

// modules
import _4Tipsy.TinyCloudAPI.Config
import _4Tipsy.TinyCloudAPI.Databases
import _4Tipsy.TinyCloudAPI.exceptions.PseudoFsException
import _4Tipsy.TinyCloudAPI.models.FsEntity







class PseudoFs {
  companion object {
    val _fsEntityCollection = Databases.mongo!!.getCollection<FsEntity>("fsEntities")





    @Throws(PseudoFsException::class)
    suspend fun pathToEid(path: String, uid: String): String? {

      // validate path
      if (!path.startsWith("drive:")) throw PseudoFsException("Path should be specified with 'drive:'")
      if (!path.startsWith("drive:/")) throw PseudoFsException("Path should be absolute (start with '/')")


      val pathSegments = path.removePrefix("drive:/").split("/").filter { it.isNotEmpty() }

      // if eid is ROOT
      if (pathSegments.isEmpty()) return null


      // iterate
      var _whereNow = "drive:" // for logging...
      var eidNow: String? = null

      for (pathSegment in pathSegments) {
        _whereNow += "/$pathSegment"

        // // try to get next entity
        val entity = _fsEntityCollection.find(
          Filters.and(
            Document("name", pathSegment),
            Document("parentEid", eidNow),
            Document("ownerUid", uid)
          )
        ).firstOrNull()

        // // if no such entity
        if (entity == null) throw PseudoFsException("No such entity as '$_whereNow'")

        eidNow = entity.eid // change current eid
      }

      // finally
      return eidNow
    }






    @Throws(PseudoFsException::class)
    suspend fun eidToPath(eid: String, uid: String): String {

      var whereNow = ""
      var eidSearchingNow: String? = eid
      while (true) {

        // // try to get entity
        val entity = _fsEntityCollection.find(
          Filters.and(
            Document("eid", eidSearchingNow),
            Document("ownerUid", uid)
          )
        ).firstOrNull()

        // // if no such entity
        if (entity == null) throw PseudoFsException("No entity with such eid ('$eidSearchingNow')")

        // // change current eid
        if (entity.parentEid != null) {
          whereNow = "/" + entity.name + whereNow
          eidSearchingNow = entity.parentEid

        } else {
          // // if entity is in root
          whereNow = "drive:" + whereNow
          break
        }

      }

      // return
      return whereNow
    }





//    @Throws(PseudoFsException::class)
//    suspend fun retrieveDirAsTempArc(eid: String, uid: String): File {
//
//      // reconstruct dir
//      val tempDir = withContext(Dispatchers.IO) {
//        Files.createTempDirectory( File(Config.load().fs.fileStoragePath).path, "tempDir" )
//      }
//
//      val tempArc = withContext(Dispatchers.IO) {
//        File.createTempFile("tempArc_", ".tmp", File(Config.load().fs.fileStoragePath))
//          .deleteOnExit()
//      }
//
//
//    }





  }
}