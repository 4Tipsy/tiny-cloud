
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"





const fsViewModeAtom_value = atomWithStorage<'CARDS'|'TABLE'>('@fsViewMode', 'CARDS')

const fsViewMode = atom(
  get => get(fsViewModeAtom_value),
  (_, set, newState: 'CARDS'|'TABLE') => set(fsViewModeAtom_value, newState)
)



export { fsViewMode }