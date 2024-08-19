
package _4Tipsy.TinyCloudAPI.services



import kotlinx.coroutines.flow.firstOrNull
import io.ktor.http.HttpStatusCode
import io.ktor.server.application.ApplicationCall
import io.ktor.util.logging.Logger
import io.ktor.server.plugins.*
import io.ktor.server.request.*

import org.bson.Document
import io.lettuce.core.SetArgs

import kotlinx.serialization.json.Json
import kotlinx.serialization.encodeToString

import kotlin.jvm.Throws

import java.time.LocalDate
import java.time.format.DateTimeFormatter as Frm

import java.io.File
import java.io.InputStream
import java.nio.file.Files
import java.nio.file.StandardCopyOption
import java.text.DecimalFormat

// modules
import _4Tipsy.TinyCloudAPI.exceptions.HttpException
import _4Tipsy.TinyCloudAPI.models.User
import _4Tipsy.TinyCloudAPI.models.Session
import _4Tipsy.TinyCloudAPI.models.Refresh
import _4Tipsy.TinyCloudAPI.dto.UserDTO
import _4Tipsy.TinyCloudAPI.Databases
import _4Tipsy.TinyCloudAPI.Config
import _4Tipsy.TinyCloudAPI.REFRESH_TOKENS_TTL
import _4Tipsy.TinyCloudAPI.utils.getSimpleHash
import _4Tipsy.TinyCloudAPI.core.PasswordHasher



class UserService {
  companion object {

    private val userCollection = Databases.mongo!!.getCollection<User>("users")
    private val redis = Databases.redis!!
    private val FILE_STORAGE = Config.load().fs.fileStoragePath






    /*
    * createNewUser
    */
    @Throws(HttpException::class)
    suspend fun createNewUser(name: String, email: String, rawPassword: String, log: Logger) {

      // check if user's name or email r already taken
      if (userCollection.find( Document("email", email) ).firstOrNull()
        != null
      ) throw HttpException(HttpStatusCode.BadRequest, "Failed creating user", "Such email is already in use")

      // get free uid
      var newUid: String
      while (true) {
        val hash = getSimpleHash(11, withNumeric=true)
        val now = LocalDate.now().format( Frm.ofPattern("ddMMyy") )
        newUid = "USR-${hash}H-${now}T"

        if (userCollection.find( Document("uid", newUid) ).firstOrNull()
          == null) break
      }

      // push new user
      val newUser = User(
        uid = newUid,
        name = name,
        email = email,
        hashedPassword = PasswordHasher.hashPassword(rawPassword),
        spaceUsed = 0,
        totalSpaceAvailable = Config.load().main.newUserSpaceAvailable,
        isVerified = false
      )
      userCollection.insertOne(newUser)

      // create new user's fs
      val localUserFsPath = listOf(FILE_STORAGE, newUid).joinToString(File.separator)
      val localUserFsPath_files = localUserFsPath + File.separator + "@files"
      val localUserFsPath_userImage = localUserFsPath + File.separator + "@user_image"
      File(localUserFsPath).mkdir()
      File(localUserFsPath_files).mkdir()
      Files.copy(
        File(Config.load().fs.defaultUserImagePath).toPath(),
        File(localUserFsPath_userImage).toPath()
      )

      // log
      log.info("[call bellow] Created user: '$name' $newUid")
    }





    /*
    * openNewSession
    */

    // interface, via login
    @Throws(HttpException::class)
    suspend fun openNewSession(email: String, rawPassword: String, call: ApplicationCall): Pair<String, String> {

      val user = userCollection.find( Document("email", email) ).firstOrNull()
      if (user == null) throw HttpException(HttpStatusCode.Unauthorized, "Auth failed", "Email or password is wrong")

      val isPasswordValid = PasswordHasher.validatePassword(rawPassword, user.hashedPassword)
      if (isPasswordValid == false) throw HttpException(HttpStatusCode.Unauthorized, "Auth failed", "Email or password is wrong")

      // if ok
      return this._openNewSession(user, call=call)
    }

    // interface, via refresh
    @Throws(HttpException::class)
    suspend fun openNewSession(refreshToken: String, call: ApplicationCall): Pair<String, String> {

      val refreshDataString = redis.get("refresh:$refreshToken")
      if (refreshDataString == null) throw HttpException(HttpStatusCode.Unauthorized, "Auth failed", "Invalid refresh token")
      val refreshData = Json.decodeFromString<Refresh>(refreshDataString)

      val user = userCollection.find( Document("uid", refreshData.uid) ).firstOrNull()
      if (user == null) throw HttpException(HttpStatusCode.Unauthorized, "Auth failed", "Invalid refresh token")

      // if ok
      redis.del("refresh:$refreshToken") // waste refresh
      redis.del("session:${refreshData.relatedSessionId}") // del active rel session
      return this._openNewSession(user, call=call)
    }


    // inner function
    private suspend fun _openNewSession(user: User, call: ApplicationCall): Pair<String, String> {

      val session = Session(
        uid = user.uid,
        openedAt = LocalDate.now().toString(),
        userAgent = call.request.userAgent() ?: "unknown",
        id = call.request.origin.remoteAddress,
      )

      // get next free session id
      var sessionId: String
      while (true) {
        sessionId = getSimpleHash(17, withNumeric = true, withLowerCase = true, withUpperCase = true)
        if (redis.get("session:$sessionId") == null) break // check if free
      }

      // open session
      redis.set(
        "session:$sessionId",
        Json.encodeToString(session),
        SetArgs().ex( Config.load().main.sessionTtl )
      )

      // register refresh
      var refreshToken: String
      while (true) {
        refreshToken = getSimpleHash(17, withNumeric = true, withLowerCase = true, withUpperCase = true)
        if (redis.get("refresh:$refreshToken") == null) break // check if free
      }
      val refreshData = Refresh(
        uid = user.uid,
        relatedSessionId = sessionId
      )
      redis.set(
        "refresh:$refreshToken",
        Json.encodeToString(refreshData),
        SetArgs().ex(REFRESH_TOKENS_TTL)
      )

      call.application.environment.log.info("[call bellow] Opened new session: '${user.name}' > $sessionId")
      return Pair(sessionId, refreshToken)
    }




    /*
    * getCurrentUser
    */
    suspend fun getCurrentUser(uid: String): UserDTO {

      val user = userCollection.find( Document("uid", uid) ).firstOrNull()!! // uid comes from authGuard, it makes sure user exists in DB

      val userDto = UserDTO (
        uid = user.uid,
        name = user.name,
        email = user.email,
        spaceUsed = user.spaceUsed,
        totalSpaceAvailable = user.totalSpaceAvailable,
        isVerified = user.isVerified,
      )
      return userDto
    }




    /*
    * getUserImageFile
    */
    fun getUserImageFile(uid: String): File {
      val userImagePath = listOf(FILE_STORAGE, uid, "@user_image").joinToString(File.separator)
      return File(userImagePath)
    }


    /*
    * updateUserImage
    */
    fun updateUserImage(uid: String, fileStream: InputStream, _fileSize: Long) {

      // if too large
      val _currentMaxSizeInMb = (Config.load().main.userImageMaxSize / 1024 / 1024).also { DecimalFormat("#.##").format(it) }
      if (_fileSize > Config.load().main.userImageMaxSize) throw HttpException(HttpStatusCode.PayloadTooLarge, "File is too large", "Current max user image size is ${_currentMaxSizeInMb} MB")

      // save
      val userImagePath = listOf(FILE_STORAGE, uid, "@user_image").joinToString(File.separator)
      Files.copy(fileStream, File(userImagePath).toPath(), StandardCopyOption.REPLACE_EXISTING )
    }


  }
}