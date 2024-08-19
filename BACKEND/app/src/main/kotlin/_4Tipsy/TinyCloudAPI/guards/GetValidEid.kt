
package _4Tipsy.TinyCloudAPI.guards


import io.ktor.http.HttpStatusCode

import com.mongodb.client.model.Filters
import org.bson.Document
import kotlinx.coroutines.flow.firstOrNull

import kotlin.jvm.Throws


// modules
import _4Tipsy.TinyCloudAPI.models.FsEntity
import _4Tipsy.TinyCloudAPI.exceptions.HttpException
import _4Tipsy.TinyCloudAPI.Databases



@Throws(HttpException::class)
suspend fun GetValidEid(path: String): String? {
  val _fsEntityCollection = Databases.mongo!!.getCollection<FsEntity>("fsEntities")


  if (!path.startsWith("drive:")) throw HttpException(HttpStatusCode.UnprocessableEntity, "Wrong target path", "Path should be specified with 'drive:'")
  if (!path.startsWith("drive:/")) throw HttpException(HttpStatusCode.UnprocessableEntity, "Wrong target path", "Path should be absolute (start with '/')")

  val _path = path.removePrefix("drive:/")
  val pathSegments = _path.split('/').filter { it.isNotEmpty() }

  // if "drive:/" // related to `where` params
  if (pathSegments.isEmpty()) return null


  // PATH -> EID
  var wherePath = "drive:"
  var hereEid: String? = null
  for (segment in pathSegments) {
    wherePath += "/$segment"

    // try to get next entity
    val entity = _fsEntityCollection.find(
      Filters.and(
        Document("name", segment),
        Document("parentEid", hereEid)
      )
    ).firstOrNull()

    // if no such entity
    if (entity == null) throw HttpException(HttpStatusCode.BadRequest, "No such entity", "There is no entity on path '$wherePath'")

    hereEid = entity.eid
  }


  return hereEid
}