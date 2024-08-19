
package _4Tipsy.TinyCloudAPI.utils


import com.mongodb.client.model.Filters
import org.bson.Document
import kotlinx.coroutines.flow.toList



// modules
import _4Tipsy.TinyCloudAPI.models.FsEntity
import _4Tipsy.TinyCloudAPI.models.BaseType
import _4Tipsy.TinyCloudAPI.Databases



suspend fun getDirSizeRecursively(eid: String, uid: String): Long {

  val _fsEntitiesCollection = Databases.mongo!!.getCollection<FsEntity>("fsEntities")
  var totalSize: Long = 0





  suspend fun _getContentsSize(_eid: String) {

    val contents = _fsEntitiesCollection.find(
      Filters.and(
        Document("parentEid", _eid),
        Document("ownerUid", uid)
      )
    ).toList()

    for (content in contents) {
      when (content.baseType) {
        BaseType.File -> totalSize += content.size!!
        BaseType.Directory -> _getContentsSize(content.eid)
      }
    }

  }



  _getContentsSize(eid)
  return totalSize
}