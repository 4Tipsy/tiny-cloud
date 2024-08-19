
package _4Tipsy.TinyCloudAPI


import com.mongodb.kotlin.client.coroutine.MongoClient
import com.mongodb.kotlin.client.coroutine.MongoDatabase

import io.lettuce.core.RedisClient
import io.lettuce.core.api.sync.RedisCommands




object Databases {

  public var mongo: MongoDatabase? = null
  public var redis: RedisCommands<String, String?>? = null


  // mongo db
  init {
    if (this.mongo == null) {
      println("MONGO DB LOADED")
      val client = MongoClient.create(connectionString = Config.load().databases.mongoDbUri)
      val db = client.getDatabase("TinyCloud")
      this.mongo = db
    }
  }



  // redis
  init {
    if (this.redis == null) {
      println("REDIS DB LOADED")
      val client = RedisClient.create( Config.load().databases.redisCred )
      this.redis = client.connect().sync()
    }
  }


  // lifeCheck
  operator fun invoke() {
    this.mongo; this.redis
  }


}