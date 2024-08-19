
package _4Tipsy.TinyCloudAPI.utils





fun getSimpleHash(
  length: Int,
  withNumeric: Boolean = false,
  withLowerCase: Boolean = false,
  withUpperCase: Boolean = false
): String {


  val allowedChars = mutableListOf<Char>()

  if (withNumeric) {
    allowedChars.addAll('0'..'9')
  }

  if (withLowerCase) {
    allowedChars.addAll('a'..'z')
  }

  if (withUpperCase) {
    allowedChars.addAll('A'..'Z')
  }

  // ...
  if (allowedChars.toList().isEmpty()) {
    throw Exception("No chars provided!")
  }

  // build hash string
  return (1..length)
    .map { allowedChars.random() }
    .joinToString("")
}