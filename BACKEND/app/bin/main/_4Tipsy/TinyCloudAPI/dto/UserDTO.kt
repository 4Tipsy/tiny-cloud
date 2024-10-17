
package _4Tipsy.TinyCloudAPI.dto


import kotlinx.serialization.Serializable



@Serializable
data class UserDTO(
  val uid: String,

  val name: String,
  val email: String,
  //val hashedPassword: String, // not

  val spaceUsed: Long,
  val totalSpaceAvailable: Long,

  val isVerified: Boolean,
)