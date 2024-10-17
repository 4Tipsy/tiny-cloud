
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import { uploaderAtom_value } from "./uploaderAtom"




const collectionAtom_value = atomWithStorage<'DRIVE'|'SHARED'|'TRASH'>('@collection', 'DRIVE')

const collectionAtom = atom(
  get => get(collectionAtom_value),
  (_, set, newState: 'DRIVE'|'SHARED'|'TRASH') => set(collectionAtom_value, newState)
)







const fsPathAtom_value = atomWithStorage<string[]>('@fsPath', [])

const fsPathAtom = atom(
  get => get(fsPathAtom_value),
  (_, set, newState: string[]) => {
    set(fsPathAtom_value, newState)
    set(uploaderAtom_value, null)
  }
)





export { collectionAtom, fsPathAtom }