
package _4Tipsy.TinyCloudAPI.services


import com.mongodb.client.model.Filters
import org.bson.Document
import kotlinx.coroutines.flow.firstOrNull

import io.ktor.http.HttpStatusCode


import java.io.File

// modules
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





    suspend fun downloadEntity(target: String, _targetEid: String?, uid: String): Pair<File, String> {

      if (_targetEid != null) {

        val fsEntity = fsEntityCollection.find(
          Filters.and(
            Document("eid", _targetEid),
            Document("ownerUid", uid)
          )
        ).firstOrNull()!!

        if (fsEntity.baseType == BaseType.File) {
          val localFilePath = listOf(FILE_STORAGE, uid, "@files", fsEntity.eid).joinToString(File.separator)
          return Pair(File(localFilePath), fsEntity.name)
        }

      }
      throw HttpException(HttpStatusCode.BadRequest, "Not supported", "Right now, only files are downloadable")
    }



  }
}