import fs from "fs"
import path from "path"
import semver from "semver"

const packagePath = path.resolve(__dirname, "..", "package.json")
const manifestPath = path.resolve(__dirname, "assets", "manifest.json")

const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"))
const manifestJson = JSON.parse(fs.readFileSync(manifestPath, "utf8"))

const packageVersion = packageJson.version
const manifestVersion = manifestJson.version
const newPackageVersion = semver.inc(packageVersion, "patch")
const newManifestVersion = semver.inc(manifestVersion, "patch")

packageJson.version = newPackageVersion
manifestJson.version = newManifestVersion

fs.writeFile(
  packagePath,
  JSON.stringify(packageJson, null, 2),
  "utf8",
  (writeErr) => {
    if (writeErr) {
      console.error("Error writing package.json:", writeErr)
    } else {
      console.log(`package.json updated to ${newPackageVersion}`)
    }
  }
)

fs.writeFile(
  manifestPath,
  JSON.stringify(manifestJson, null, 2),
  "utf8",
  (writeErr) => {
    if (writeErr) {
      console.error("Error writing package.json:", writeErr)
    } else {
      console.log(`manifest.json updated to ${newManifestVersion}`)
    }
  }
)
