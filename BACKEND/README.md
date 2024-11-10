## BACKEND

Basically it's simple Ktor application with MongoDB and Redis

---

In order to serve users' files it needs some existing dirs (`file_storage`, `cache_dir`) and `default_user_image_path`,  all of them are defined in Config.toml (in `fs` section).

For example, on my VDS:
```
@storages/
    tiny-cloud/   # <- it is `file_storage`
        @default_user_image
        @cache   # <- cache_dir
```

---

User files are stored in single folder (that's why `PseudoFs` module exist):  
![3.png](https://github.com/4Tipsy/tiny-cloud/blob/main/screenshots/3.png)  

---

MongoDB used as primary database (storing users, fs entities). Fs structure described only there.

Redis used for storing tokens and sessions

Their connection settings are in Config.toml (in `databases` section).

---

FsEntity:
```kt
@Serializable
data class FsEntity (

  val eid: String,
  val parentEid: String?, // null if in root
  val ownerUid: String,

  val name: String,
  val baseType: BaseType, // `File` or `Directory`

  /* if file */
  val mimeType: String?,
  val size: Long?,
  val createdAt: String?,
  val modifiedAt: String?,

  /* is shared */
  val isShared: Boolean,
  val sharedLink: String?,
)
```

## Deploy

1) Grab src code (`BACKEND` folder)
2) Run `./gradlew buildFatJar`
3) Your app is in `app/build/libs/fatJar.jar`
4) Place it anywhere you want, copy `app/data` there
5) Also copy there `app/Config.example.toml`, rename to `Config.toml` and adjust application
5) `java -jar fatJar.jar`
