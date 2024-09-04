
package _4Tipsy.TinyCloudAPI.services


import com.mongodb.client.model.Updates
import com.mongodb.client.model.Filters
import org.bson.Document
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList

import io.ktor.http.HttpStatusCode

import java.io.File


// modules
import _4Tipsy.TinyCloudAPI.core.PseudoFs
import _4Tipsy.TinyCloudAPI.models.FsEntity
import _4Tipsy.TinyCloudAPI.models.BaseType
import _4Tipsy.TinyCloudAPI.models.User
import _4Tipsy.TinyCloudAPI.dto.FsEntityWithPathDTO
import _4Tipsy.TinyCloudAPI.dto.addPseudoPath
import _4Tipsy.TinyCloudAPI.exceptions.HttpException
import _4Tipsy.TinyCloudAPI.exceptions.Basic404Exception
import _4Tipsy.TinyCloudAPI.utils.getSimpleHash
import _4Tipsy.TinyCloudAPI.Config
import _4Tipsy.TinyCloudAPI.Databases



class ShareService {
  companion object {
    private val fsEntityCollection = Databases.mongo!!.getCollection<FsEntity>("fsEntities")
    private val userCollection = Databases.mongo!!.getCollection<User>("users")
    private val redis = Databases.redis!!
    private val FILE_STORAGE = Config.load().fs.fileStoragePath



    /*
    * makeShared
    */
    @Throws(HttpException::class)
    suspend fun makeShared(target: String, _targetEid: String?, uid: String): String {

      // try to get entity
      val fsEntity = fsEntityCollection.find(
        Filters.and(
          Document("eid", _targetEid),
          Document("ownerUid", uid)
        )
      ).firstOrNull()

      // if no entity
      if (fsEntity == null) throw HttpException(HttpStatusCode.BadRequest, "No such entity", "There is no entity on path '$target'")

      // if already shared
      if (fsEntity.isShared == true) throw HttpException(HttpStatusCode.BadRequest, "Failed to make shared", "Entity already shared")


      // get next free sharedLink
      var sharedLink: String
      while (true) {
        sharedLink = getSimpleHash(6, withNumeric = true, withLowerCase = true)

        if (fsEntityCollection.find(/**/ Filters.and( Document("ownerUid", uid), Document("sharedLink", sharedLink) ) /**/).firstOrNull()
        == null) break
      }


      // modify
      fsEntityCollection.updateOne(
        // filter
        Filters.and(
          Document("eid", _targetEid),
          Document("ownerUid", uid)
        ),
        // update
        Updates.combine(
          Updates.set("isShared", true),
          Updates.set("sharedLink", sharedLink)
        )
      )

      return sharedLink
    }




    /*
    * makeUnshared
    */
    @Throws(HttpException::class)
    suspend fun makeUnshared(target: String, _targetEid: String?, uid: String) {

      // try to get entity
      val fsEntity = fsEntityCollection.find(
        Filters.and(
          Document("eid", _targetEid),
          Document("ownerUid", uid)
        )
      ).firstOrNull()

      // if no entity
      if (fsEntity == null) throw HttpException(HttpStatusCode.BadRequest, "No such entity", "There is no entity on path '$target'")

      // if already shared
      if (fsEntity.isShared == false) throw HttpException(HttpStatusCode.BadRequest, "Failed to make unshared", "Entity is not shared")


      // modify
      fsEntityCollection.updateOne(
        // filter
        Filters.and(
          Document("eid", _targetEid),
          Document("ownerUid", uid)
        ),
        // update
        Updates.combine(
          Updates.set("isShared", false),
          Updates.unset("sharedLink")
        )
      )

    }




    /*
    * getAllSharedEntities
    */
    suspend fun getAllSharedEntities(uid: String): List<FsEntityWithPathDTO> {

      val _contents = fsEntityCollection.find(
        Filters.and(
          Document("ownerUid", uid),
          Document("isShared", true)
        )
      ).toList()

      val contents = _contents.map {
        it.addPseudoPath( PseudoFs.eidToPath(it.eid, it.ownerUid) )
      }

      return contents

    }




    /*
    * getSharedEntity
    */
    @Throws(Basic404Exception::class)
    suspend fun getSharedEntity(sharedLink: String?, userName: String?): FsEntity {

      // if no parameters provided
      if (sharedLink==null || userName==null) throw Basic404Exception()

      // userName to uid
      val user = userCollection.find( Document("name", userName) ).firstOrNull()
      if (user == null) throw Basic404Exception() // if no user

      // get entity
      val fsEntity = fsEntityCollection.find(
        Filters.and(
          Document("ownerUid", user.uid),
          Document("sharedLink", sharedLink)
        )
      ).firstOrNull()

      // if no such entity
      if (fsEntity == null) throw Basic404Exception()

      // hide some vars
      var _fsEntity = fsEntity.copy(
        eid = "<hidden>",
        parentEid = "<hidden>",
        ownerUid = "<hidden>"
      )
      return _fsEntity
    }





    /*
    * getSharedEntityDownload
    */
    @Throws(Basic404Exception::class, HttpException::class)
    suspend fun getSharedEntityDownloadable(sharedLink: String?, userName: String?): Pair<File, String> {

      // if no parameters provided
      if (sharedLink==null || userName==null) throw Basic404Exception()

      // userName to uid
      val user = userCollection.find( Document("name", userName) ).firstOrNull()
      if (user == null) throw Basic404Exception() // if no user

      // get entity
      val fsEntity = fsEntityCollection.find(
        Filters.and(
          Document("ownerUid", user.uid),
          Document("sharedLink", sharedLink)
        )
      ).firstOrNull()

      // if no such entity
      if (fsEntity == null) throw Basic404Exception()

      // if dir
      if (fsEntity.baseType == BaseType.Directory) throw HttpException(HttpStatusCode.BadRequest, "Not supported", "Right now, only files are downloadable")

      // if file
      val localFilePath = listOf(FILE_STORAGE, user.uid, "@files", fsEntity.eid).joinToString(File.separator)
      return Pair( File(localFilePath), fsEntity.name)
    }




  }
}
