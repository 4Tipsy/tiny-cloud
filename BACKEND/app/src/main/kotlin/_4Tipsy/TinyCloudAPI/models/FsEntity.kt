
package _4Tipsy.TinyCloudAPI.models


import com.mongodb.lang.Nullable
import kotlinx.serialization.Serializable




enum class BaseType {
  File, Directory
}



@Serializable
data class FsEntity (

  val eid: String,
  @Nullable
  val parentEid: String?, // null if in root
  val ownerUid: String,

  val name: String,
  val baseType: BaseType,

  /* if file */
  val mimeType: String?,
  val size: Long?,
  val createdAt: String?,
  val modifiedAt: String?,

  /* is shared */
  val isShared: Boolean,
  @Nullable
  val sharedLink: String?,

)