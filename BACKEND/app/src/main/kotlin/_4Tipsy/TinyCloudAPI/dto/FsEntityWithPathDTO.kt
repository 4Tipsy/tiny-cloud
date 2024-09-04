
package _4Tipsy.TinyCloudAPI.dto


import kotlinx.serialization.Serializable

import _4Tipsy.TinyCloudAPI.models.BaseType
import _4Tipsy.TinyCloudAPI.models.FsEntity






@Serializable
data class FsEntityWithPathDTO (

  val eid: String,
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
  val sharedLink: String?,


  // ADDITIONAL FIELD
  val _pseudoFsPath: String,

)



// helper extension
fun FsEntity.addPseudoPath(_pseudoFsPath: String): FsEntityWithPathDTO {
  return FsEntityWithPathDTO (
    eid = this.eid,
    parentEid = this.parentEid,
    ownerUid = this.ownerUid,
    name = this.name,
    baseType = this.baseType,
    mimeType = this.mimeType,
    size = this.size,
    createdAt = this.createdAt,
    modifiedAt = this.modifiedAt,
    isShared = this.isShared,
    sharedLink = this.sharedLink,
    _pseudoFsPath = _pseudoFsPath, // add
  )
}