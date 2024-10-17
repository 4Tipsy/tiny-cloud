
package _4Tipsy.TinyCloudAPI.core


import de.mkammerer.argon2.Argon2Factory





class PasswordHasher {
  companion object {
    private val argon2 = Argon2Factory.create()



    fun hashPassword(rawPassword: String): String {
      val hashedPassword = argon2.hash(10, 65536, 1, rawPassword.toCharArray())
      return hashedPassword
    }



    fun validatePassword(rawPassword: String, hashedPasswordFromDB: String): Boolean {
      return argon2.verify(hashedPasswordFromDB, rawPassword.toCharArray())
    }



  }
}