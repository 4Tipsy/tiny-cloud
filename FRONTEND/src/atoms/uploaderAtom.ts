
import { atom } from "jotai"



export const uploaderAtom_value = atom<FileList | null>(null)


const uploaderAtom = atom(
  get => get(uploaderAtom_value),
  (_, set, newState: FileList | null) => set(uploaderAtom_value, newState)
)




export { uploaderAtom }