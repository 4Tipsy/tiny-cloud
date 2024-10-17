
package _4Tipsy.TinyCloudAPI.services

import org.bson.Document
import com.mongodb.client.model.Filters

import io.ktor.http.HttpStatusCode

import kotlinx.coroutines.flow.firstOrNull

import java.io.File

// modules
import _4Tipsy.TinyCloudAPI.models.FsEntity
import _4Tipsy.TinyCloudAPI.models.BaseType
import _4Tipsy.TinyCloudAPI.exceptions.HttpException
import _4Tipsy.TinyCloudAPI.Config
import _4Tipsy.TinyCloudAPI.Databases



class UtilsService {
  companion object {

    private val fsEntityCollection = Databases.mongo!!.getCollection<FsEntity>("fsEntities")
    private val redis = Databases.redis!!
    private val FILE_STORAGE = Config.load().fs.fileStoragePath


    /*
    * getVideoPreviewImg
    */
    @Throws(HttpException::class)
    suspend fun getVideoPreviewImg(target: String, _targetEid: String, newName: String, uid: String) {

      val fsEntity = fsEntityCollection.find(
        Filters.and(
          Document("eid", _targetEid),
          Document("ownerUid", uid)
        )
      ).firstOrNull()

      // some checks
      if (fsEntity == null) throw HttpException(HttpStatusCode.BadRequest, "No such entity", "There is no entity on path '$target'")
      if (fsEntity.baseType == BaseType.Directory) throw HttpException(HttpStatusCode.BadRequest, "Target entity is not a File", "Entity '$target' is Directory")
      if (fsEntity.mimeType!!.split("/").get(0) != "video") throw HttpException(HttpStatusCode.BadRequest, "Target is not a video", "Entity's ('$target') mime type is '${fsEntity.mimeType}'")



    }




  }
}