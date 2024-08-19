
package _4Tipsy.TinyCloudAPI.services



import com.mongodb.client.model.Updates
import com.mongodb.client.model.Filters
import org.bson.Document
import io.ktor.http.HttpStatusCode

import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.flow.toList

import kotlinx.coroutines.withContext
import kotlinx.coroutines.Dispatchers

import kotlin.jvm.Throws

import java.io.File
import java.io.InputStream
import java.nio.file.Files


// modules
import _4Tipsy.TinyCloudAPI.exceptions.HttpException
import _4Tipsy.TinyCloudAPI.models.FsEntity
import _4Tipsy.TinyCloudAPI.models.BaseType
import _4Tipsy.TinyCloudAPI.models.User
import _4Tipsy.TinyCloudAPI.Databases
import _4Tipsy.TinyCloudAPI.Config
import _4Tipsy.TinyCloudAPI.utils.getSimpleHash
import _4Tipsy.TinyCloudAPI.utils.getDirSizeRecursively



class FsEntityService {
  companion object {
    private val fsEntityCollection = Databases.mongo!!.getCollection<FsEntity>("fsEntities")
    private val userCollection = Databases.mongo!!.getCollection<User>("users")
    private val redis = Databases.redis!!
    private val FILE_STORAGE = Config.load().fs.fileStoragePath




    /*
    * getDirContents
    */
    @Throws(HttpException::class)
    suspend fun getDirContents(where: String, _whereEid: String?, uid: String): List<FsEntity> {

      // if not a folder
      if (_whereEid != null) {
        if (
          fsEntityCollection.find(/**/ Filters.and(Document("eid", _whereEid), Document("ownerUid", uid)) /**/).firstOrNull()!!
            .baseType == BaseType.File

        ) throw HttpException(HttpStatusCode.BadRequest, "Target entity is file", "There is no contents in file")
      }

      // get contents
      val contents = fsEntityCollection.find(
        Filters.and(
          Document("parentEid", _whereEid),
          Document("ownerUid", uid)
        )
      ).toList()

      return contents
    }




    /*
    * createNewDir
    */
    @Throws(HttpException::class)
    suspend fun createNewDir(where: String, _whereEid: String?, name: String, uid: String): String {

      // if name already taken
      if (fsEntityCollection.find(
        Filters.and(
          Document("parentEid", _whereEid),
          Document("name", name)
        )
      ).firstOrNull() != null
      ) {
        throw HttpException(HttpStatusCode.BadRequest, "Name already taken", "Entity '$where/$name' already exists")
      }

      // get new free id
      var newEid: String
      while (true) {
        newEid = "ENT-" + getSimpleHash(11, withNumeric = true, withLowerCase = true, withUpperCase = true) + "-DIR"

        if (fsEntityCollection.find(/**/ Filters.and( Document("eid", newEid), Document("ownerUid", uid) ) /**/).firstOrNull() == null
        ) break
      }

      // construct
      val newFsEntity = FsEntity(
        eid = newEid,
        parentEid = _whereEid,
        ownerUid = uid,
        name = name,
        baseType = BaseType.Directory,
        mimeType = null,
        size = null,
        createdAt = "",
        modifiedAt = "",
        isShared = false,
        sharedLink = null,
      )

      // push into db
      fsEntityCollection.insertOne(newFsEntity)
      return newEid
    }



    /*
    * upload file
    */
    suspend fun uploadFile(where: String, _whereEid: String?, name: String, uid: String, fileStream: InputStream, _mimeType: String, _fileSize: Long) {

      // if name already taken
      if (fsEntityCollection.find(
          Filters.and(
            Document("parentEid", _whereEid),
            Document("name", name)
          )
        ).firstOrNull() != null
      ) {
        throw HttpException(HttpStatusCode.BadRequest, "Name already taken", "Entity '$where/$name' already exists")
      }

      // if not enough space
      val user = userCollection.find( Document("uid", uid) ).firstOrNull()!!
      val _spaceWillBe = user.spaceUsed + _fileSize
      if (_spaceWillBe > user.totalSpaceAvailable) throw HttpException(HttpStatusCode.BadRequest, "Not enough space", "Not enough available space at your drive, please free space")

      // get new free eid
      var newEid: String
      while (true) {
        newEid = "ENT-" + getSimpleHash(11, withNumeric = true, withLowerCase = true, withUpperCase = true) + "-FILE"

        if (fsEntityCollection.find(/**/ Filters.and( Document("eid", newEid), Document("ownerUid", uid) ) /**/).firstOrNull() == null
        ) break
      }

      // construct
      val newFsEntity = FsEntity(
        eid = newEid,
        parentEid = _whereEid,
        ownerUid = uid,
        name = name,
        baseType = BaseType.File,
        mimeType = _mimeType,
        size = _fileSize,
        createdAt = "",
        modifiedAt = "",
        isShared = false,
        sharedLink = null,
      )

      // try to save
      val newFilePath = listOf(FILE_STORAGE, uid, "@files", newEid).joinToString(File.separator)
      withContext(Dispatchers.IO) {
        Files.copy( fileStream, File(newFilePath).toPath() )
      }

      // push into db
      fsEntityCollection.insertOne(newFsEntity)
      userCollection.findOneAndUpdate(
        Document("uid", uid),
        Updates.inc("spaceUsed", _fileSize)
      )
    }





    /*
    * renameEntity
    */
    @Throws(HttpException::class)
    suspend fun renameEntity(target: String, _targetEid: String, newName: String, uid: String) {

      // try to edit
      val fsEntity = fsEntityCollection.findOneAndUpdate(
        Filters.and(
          Document("eid", _targetEid),
          Document("ownerUid", uid)
        ),
        Updates.set("name", newName)
      )

      // if no entity found
      if (fsEntity == null) {
        throw HttpException(HttpStatusCode.BadRequest, "No such entity", "There is no entity on path '$target'")
      }

    }


    /*
    * deleteEntity
    */
    @Throws(HttpException::class)
    suspend fun deleteEntity(target: String, _targetEid: String, uid: String) {

      // try to delete
      val fsEntity = fsEntityCollection.findOneAndDelete(
        Filters.and(
          Document("eid", _targetEid),
          Document("ownerUid", uid)
        )
      )

      suspend fun _deleteRecursively(_eid: String) {
        val contents = fsEntityCollection.find(/**/ Filters.and( Document("parentEid", _eid), Document("ownerUid", uid)) /**/).toList()
        for (content in contents) {
          when (content.baseType) {
            BaseType.File -> {
              val localFilePath = listOf(FILE_STORAGE, uid, "@files", content.eid).joinToString(File.separator)
              File(localFilePath).delete()
            }
            BaseType.Directory -> { _deleteRecursively(content.eid) }
          }
          fsEntityCollection.deleteOne(/**/ Filters.and( Document("eid", content.eid), Document("ownerUid", uid)) /**/)
        }
      }

      // if no entity found
      if (fsEntity == null) {
        throw HttpException(HttpStatusCode.BadRequest, "No such entity", "There is no entity on path '$target'")
      }

      // delete files from STORAGE
      when (fsEntity.baseType) {
        BaseType.File -> {
          val localFilePath = listOf(FILE_STORAGE, uid, "@files", fsEntity.eid).joinToString(File.separator)
          File(localFilePath).delete()
        }
        BaseType.Directory -> { _deleteRecursively(fsEntity.eid) }
      }

      // change `user.spaceUsed`
      val deletedSize = when (fsEntity.baseType) {
        BaseType.File -> fsEntity.size!!
        BaseType.Directory -> getDirSizeRecursively(_targetEid, uid)
      }
      userCollection.updateOne(
        Document("uid", uid),
        Updates.inc("spaceUsed", -deletedSize)
      )

    }




  }
}