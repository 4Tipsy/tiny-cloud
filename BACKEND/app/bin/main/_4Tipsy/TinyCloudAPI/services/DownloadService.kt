
package _4Tipsy.TinyCloudAPI.services


import com.mongodb.client.model.Filters
import org.bson.Document
import kotlinx.coroutines.flow.firstOrNull

import io.ktor.http.HttpStatusCode

import kotlin.jvm.Throws
import java.io.File

// modules
import _4Tipsy.TinyCloudAPI.core.PseudoFs
import _4Tipsy.TinyCloudAPI.models.FsEntity
import _4Tipsy.TinyCloudAPI.models.BaseType
import _4Tipsy.TinyCloudAPI.exceptions.HttpException
import _4Tipsy.TinyCloudAPI.Config
import _4Tipsy.TinyCloudAPI.Databases




class DownloadService {
  companion object {
    private val fsEntityCollection = Databases.mongo!!.getCollection<FsEntity>("fsEntities")
    private val redis = Databases.redis!!
    private val FILE_STORAGE = Config.load().fs.fileStoragePath


    @Throws(HttpException::class)
    suspend fun downloadEntity(target: String, _targetEid: String?, uid: String): Pair<File, String> {


      // downloading ROOT
      if (_targetEid == null) {
        val arcFile = PseudoFs.retrieveDirAsTempArc(_targetEid, uid)
        return Pair(arcFile, "@root.zip")
      }


      val fsEntity = fsEntityCollection.find(
        Filters.and(
          Document("eid", _targetEid),
          Document("ownerUid", uid)
        )
      ).firstOrNull()

      // if no entity found
      if (fsEntity == null) throw HttpException(HttpStatusCode.BadRequest, "No such entity", "There is no entity on path '$target'")

      // download
      if (fsEntity.baseType == BaseType.File) {
        val file = listOf(FILE_STORAGE, uid, "@files", fsEntity.eid).joinToString(File.separator).let { File(it) }
        return Pair(file, fsEntity.name)
      }
      else {
        val arcFile = PseudoFs.retrieveDirAsTempArc(_targetEid, uid)
        return Pair(arcFile, fsEntity.name)
      }
    }


  }
}