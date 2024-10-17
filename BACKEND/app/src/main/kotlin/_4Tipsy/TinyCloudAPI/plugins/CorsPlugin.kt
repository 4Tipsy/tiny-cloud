
package _4Tipsy.TinyCloudAPI.plugins

import io.ktor.server.plugins.cors.CORSConfig
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod

// modules
import _4Tipsy.TinyCloudAPI.Config



fun CORSConfig.applyConfiguredCors() {

  // allow client requests
  Config.load().main.allowedHosts.forEach {
    allowHost(it, schemes = listOf("http", "https"))
  }
  allowCredentials = true

  allowHeader(HttpHeaders.ContentType)

  // some methods
  allowMethod(HttpMethod.Options)
  allowMethod(HttpMethod.Patch)
}