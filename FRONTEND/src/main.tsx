
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)






// GLOBALS
declare global {
  interface Window {
    API_URL: string,
    SHARE_BASE_URL: string,
    SOURCE_CODE_LINK: string,
  }
}

window.API_URL = "http://localhost:1234/api"
window.SHARE_BASE_URL = "http://share.tiny-cloud.xyz"
window.SOURCE_CODE_LINK = "https://github.com/4Tipsy/tiny-cloud/tree/main/FRONTEND"






// FONT AWESOME ICONS
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config as faiConfig} from '@fortawesome/fontawesome-svg-core'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faHardDrive, faMagnifyingGlass, faSliders, faBox, faPaperPlane, faTrash, faArrowsTurnToDots, faGear, faTableCellsLarge, faList, faRightFromBracket, faMugHot, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faFolderClosed, faFile, faFileAudio, faFileCode, faFileZipper, faFileWord } from '@fortawesome/free-solid-svg-icons'

faiConfig.autoAddCss = false

library.add(
  faSpinner, faHardDrive, faMagnifyingGlass, faSliders, faBox, faPaperPlane, faTrash, faArrowsTurnToDots, faGear, faGithub, faTableCellsLarge, faList, faRightFromBracket, faMugHot, faCloudArrowUp,

  faFolderClosed, faFile, faFileAudio, faFileCode, faFileZipper, faFileWord // FsEntity's icons
)