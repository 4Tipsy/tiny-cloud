
package _4Tipsy.TinyCloudAPI.models


import kotlinx.serialization.Serializable



@Serializable
data class Session(
  val uid: String,

  val openedAt: String,
  val userAgent: String,
  val id: String,
)