
package _4Tipsy.TinyCloudAPI.core

import com.mongodb.client.model.Filters
import org.bson.Document
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

import java.io.BufferedOutputStream
import java.io.File
import java.io.FileOutputStream
import java.nio.file.Files
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

// modules
import _4Tipsy.TinyCloudAPI.exceptions.PseudoFsException
import _4Tipsy.TinyCloudAPI.models.BaseType
import _4Tipsy.TinyCloudAPI.models.FsEntity
import _4Tipsy.TinyCloudAPI.Config
import _4Tipsy.TinyCloudAPI.Databases



/*
* simulates some functions of real file system
* (cuz entities are not stored in real fs, they just lay in single folder and described in db)
*/
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
          whereNow = "drive:/" + entity.name + whereNow
          break
        }

      }

      // return
      return whereNow
    }





    @Throws(PseudoFsException::class)
    suspend fun retrieveDirAsTempArc(eid: String?, uid: String): File {

      suspend fun _retrieveDir(localWhereInArc: String, _parentEid: String?) {
        _fsEntityCollection.find(/**/ Filters.and( Document("parentEid", _parentEid), Document("ownerUid", uid) ) /**/).toList().forEach {
          when(it.baseType) {

            BaseType.File -> {
              val targetLocalPath = listOf( Config.load().fs.fileStoragePath, uid, "@files", it.eid ).joinToString(File.separator)
              val whereToCopy = localWhereInArc + File.separator + it.name

              // copy file
              Files.copy(
                File(targetLocalPath).toPath(),
                File(whereToCopy).toPath()
              )
            }

            BaseType.Directory -> {
              val _newLocalWhereInArc = localWhereInArc + File.separator + it.name
              File(_newLocalWhereInArc).mkdir()
              _retrieveDir(_newLocalWhereInArc, it.eid) // go further
            }
          }
        }
      }

      fun _zipDir(targetDir: File): File {
        val tempArcFile = File.createTempFile("zipped_dir_", ".tmp", File(Config.load().fs.cacheDirPath) )
        ZipOutputStream(BufferedOutputStream(FileOutputStream(tempArcFile))).use { zipStream ->
          targetDir.walkTopDown().forEach { file ->
            val _fileName = file.absolutePath.removePrefix(targetDir.absolutePath).removePrefix("/")
            val entry = ZipEntry("$_fileName${(if (file.isDirectory) "/" else "")}")
            zipStream.putNextEntry(entry)
            if (file.isFile) {
              file.inputStream().use { it.copyTo(zipStream) }
            }
          }
        }
        return tempArcFile
      }


      // validate eid (if provided)
      if (eid != null) {
        val targetEnt = _fsEntityCollection.find(/**/ Filters.and(Document("eid", eid), Document("ownerUid", uid)) /**/).firstOrNull()
        if (targetEnt == null) throw PseudoFsException("No entity with such eid")
        if (targetEnt.baseType != BaseType.Directory) throw PseudoFsException("Target entity is not <Directory>")
      }

      // retrieve the dir
      val tempDir = withContext(Dispatchers.IO) {
        Files.createTempDirectory(File(Config.load().fs.cacheDirPath).toPath(), "dir_").toFile()
      }
      _retrieveDir(tempDir.absolutePath, eid) // fill dir with contents

      // zip the dir
      val tempArcFile = _zipDir(tempDir)
        .also { tempDir.deleteRecursively() }
      return tempArcFile
    }





  }
}