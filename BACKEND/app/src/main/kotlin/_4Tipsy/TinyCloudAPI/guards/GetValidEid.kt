
package _4Tipsy.TinyCloudAPI.guards


import io.ktor.http.HttpStatusCode

import kotlin.jvm.Throws


// modules
import _4Tipsy.TinyCloudAPI.core.PseudoFs
import _4Tipsy.TinyCloudAPI.exceptions.PseudoFsException
import _4Tipsy.TinyCloudAPI.exceptions.HttpException



@Throws(HttpException::class)
suspend fun GetValidEid(path: String, uid: String): String? {


  // get eid
  try {
    val targetEid = PseudoFs.pathToEid(path, uid)
    return targetEid


  // if no such entity
  } catch (exc: PseudoFsException) {
    throw HttpException(HttpStatusCode.BadRequest, "Wrong target path", exc.message!!)
  }

}