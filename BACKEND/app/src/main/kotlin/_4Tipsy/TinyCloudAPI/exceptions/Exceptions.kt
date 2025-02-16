
package _4Tipsy.TinyCloudAPI.exceptions


import java.lang.Exception
import io.ktor.http.HttpStatusCode


class InvalidConfigException: Exception {
  constructor(message: String) : super(message)
  constructor(message: String, cause: Throwable) : super(message, cause)
}



class PseudoFsException: Exception {
  constructor(message: String) : super(message)
  constructor(message: String, cause: Throwable) : super(message, cause)
}



class HttpException (
  val statusCode: HttpStatusCode,
  val errorType: String,
  val errorDetail: String,

  ) : Exception("HttpException")



class Basic404Exception : Exception("Basic404Exception")