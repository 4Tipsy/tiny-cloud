
package _4Tipsy.TinyCloudAPI.plugins


import io.ktor.server.application.createApplicationPlugin
import io.ktor.server.application.hooks.ResponseSent
import io.ktor.server.request.httpMethod
import io.ktor.server.request.path



fun OnCallLoggingPlugin() = createApplicationPlugin(name = "OnCallLoggingPlugin") {
  on(ResponseSent) { call ->
    val callRoute = "${call.request.httpMethod.value} ${call.request.path()}"
    val callResult = "${call.response.status()}"

    call.application.environment.log.info("Received call: $callRoute -> $callResult")
  }
}