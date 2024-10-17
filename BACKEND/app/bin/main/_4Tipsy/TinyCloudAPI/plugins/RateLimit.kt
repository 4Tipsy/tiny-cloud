
package _4Tipsy.TinyCloudAPI.plugins


import io.ktor.server.plugins.ratelimit.RateLimitConfig
import kotlin.time.Duration.Companion.seconds



fun RateLimitConfig.globalRateLimit() {
  global {
    rateLimiter(limit = 200, refillPeriod = 60.seconds)
  }
}