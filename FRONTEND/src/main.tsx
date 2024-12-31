
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'
import './globals.ts'



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)













// FONT AWESOME ICONS
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as faiConfig} from '@fortawesome/fontawesome-svg-core'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faHardDrive, faMagnifyingGlass, faSliders, faBox, faPaperPlane, faTrash, faArrowsTurnToDots, faGear, faTableCellsLarge, faList, faRightFromBracket, faMugHot, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faFolderClosed, faClapperboard, faFile, faFileAudio, faFileCode, faFileZipper, faFileWord, faFilePdf } from '@fortawesome/free-solid-svg-icons'

faiConfig.autoAddCss = false

library.add(
  faSpinner, faHardDrive, faMagnifyingGlass, faSliders, faBox, faPaperPlane, faTrash, faArrowsTurnToDots, faGear, faGithub, faTableCellsLarge, faList, faRightFromBracket, faMugHot, faCloudArrowUp,

  faFolderClosed, faClapperboard, faFile, faFileAudio, faFileCode, faFileZipper, faFileWord, faFilePdf // FsEntity's icons
)