
package _4Tipsy.TinyCloudAPI


import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.application.*
import io.ktor.server.routing.*

import io.ktor.server.plugins.cors.routing.CORS
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.plugins.defaultheaders.DefaultHeaders
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.autohead.AutoHeadResponse
import io.ktor.server.plugins.ratelimit.RateLimit

import io.ktor.serialization.kotlinx.json.json


// modules
import _4Tipsy.TinyCloudAPI.plugins.applyConfiguredCors
import _4Tipsy.TinyCloudAPI.plugins.errorHandler
import _4Tipsy.TinyCloudAPI.plugins.OnCallLoggingPlugin
import _4Tipsy.TinyCloudAPI.plugins.globalRateLimit
import _4Tipsy.TinyCloudAPI.routing.userRouting
import _4Tipsy.TinyCloudAPI.routing.fsRouting
import _4Tipsy.TinyCloudAPI.routing.shareRouting
import _4Tipsy.TinyCloudAPI.routing.downloadRouting
import _4Tipsy.TinyCloudAPI.routing.staticRouting


/* main */
const val API_VERSION = "2.1.1" // also in openapi.yaml
fun main() {
  Databases.lifeCheck() // lifeCheck db's
  embeddedServer(
    Netty,
    port = Config.load().main.port,
    host = Config.load().main.host,
    module = Application::mainModule
  ).start(wait = true)
}



fun Application.mainModule() {


  /* plugins */
  install(ContentNegotiation) {
    json()
  }
  install(CORS) {
    applyConfiguredCors()
  }
  install(StatusPages) {
    errorHandler()
  }
  //install(RateLimit) {
  //  globalRateLimit()
  //}
  install(DefaultHeaders) {
    header("X-Tiny-Cloud-Version", "API v$API_VERSION")
    header("X-_by_4Tipsy", "<3")
  }
  install(AutoHeadResponse)
  install(OnCallLoggingPlugin())


  /* routes */
  routing {

    userRouting()
    fsRouting()
    shareRouting()
    downloadRouting()
    staticRouting()

  }
}
