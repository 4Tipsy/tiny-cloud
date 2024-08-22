

val ktorVersion = "2.3.12"


plugins {
  id("io.ktor.plugin") version "2.3.12"
  alias(libs.plugins.jvm)
  kotlin("plugin.serialization") version "2.0.0"
  application
}



group = "_4Tipsy.TinyCloudAPI"
version = "0.0.1"

repositories {
  mavenCentral()
}

dependencies {
  // ktor shit
  implementation("io.ktor:ktor-server-core:$ktorVersion")
  implementation("io.ktor:ktor-server-netty:$ktorVersion")
  implementation("io.ktor:ktor-server-default-headers:$ktorVersion")
  implementation("io.ktor:ktor-server-content-negotiation:$ktorVersion")
  implementation("io.ktor:ktor-server-status-pages:$ktorVersion")
  implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
  implementation("io.ktor:ktor-server-auto-head-response:$ktorVersion")
  implementation("io.ktor:ktor-server-partial-content:$ktorVersion")
  implementation("io.ktor:ktor-server-rate-limit:$ktorVersion")
  implementation("ch.qos.logback:logback-classic:1.5.6")

  // serialization
  implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.1")
  implementation("net.peanuuutz.tomlkt:tomlkt:0.4.0")

  // databases
  implementation("org.mongodb:mongodb-driver-kotlin-coroutine:4.10.1")
  implementation("io.lettuce:lettuce-core:6.4.0.RELEASE")

  // argon2
  implementation("de.mkammerer:argon2-jvm:2.11")

}





// Apply a specific Java toolchain to ease working on different environments.
java {
  toolchain {
    languageVersion = JavaLanguageVersion.of(19)
  }
}

application {
  mainClass = "_4Tipsy.TinyCloudAPI.AppKt"
}


ktor {
  fatJar {
    archiveFileName.set("fat.jar")
  }
}