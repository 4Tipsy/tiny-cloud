
package _4Tipsy.TinyCloudAPI.models


import kotlinx.serialization.Serializable



@Serializable
data class Refresh(
  val uid: String,
  val relatedSessionId: String,
)