
package _4Tipsy.TinyCloudAPI.models


import kotlinx.serialization.Serializable



@Serializable
data class User(

  val uid: String,

  val name: String,
  val email: String,
  val hashedPassword: String,

  val spaceUsed: Long,
  val totalSpaceAvailable: Long,

  val isVerified: Boolean,
)