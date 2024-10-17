

// modules
import { FsEntity } from "../../models/FsEntity"





function sortContents(contents: FsEntity[]): FsEntity[] {
  let _contents = [...contents]

  // folders first!
  _contents.sort((a, b) => (a.baseType === "Directory" ? -1 : 1) - (b.baseType === "Directory" ? -1 : 1))




  return _contents
}



export { sortContents }