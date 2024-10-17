
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Route, Router, useLocation } from "wouter"
import { useHashLocation } from "wouter/use-hash-location"
import { useState, useEffect } from "react"

// components
import { Header } from "./components/Header/Header"
import { AsideMenu } from "./components/AsideMenu/AsideMenu"
import { FileManager } from "./components/FileManager/FileManager"
import { LoginModal } from "./components/LoginModal/LoginModal"
import { ProfileModal } from "./components/ProfileModal/ProfileModal"
import { ImageViewer } from "./components/ImageViewer/ImageViewer"
import { AudioPlayer } from "./components/AudioPlayer/AudioPlayer"
import { VideoPlayer } from "./components/VideoPlayer/VideoPlayer"
import { HotkeysModal } from "./components/HotkeysModal/HotkeysModal"

import { DndUpload } from "./components/FileUploader/DndUpload"
import { UploadingFrame } from "./components/FileUploader/UploadingFrame"

import { User } from "./models/User"
import { fetchUser } from "./requests/fetchUser"







const App = () => {

  const [location, setLocation] = useLocation()
  const rootQueryClient = new QueryClient()

  const [dndUploadShow, setDndUploadShow] = useState(false)



  return (
    <QueryClientProvider client={rootQueryClient}>
      <Router hook={useHashLocation}>
        <div className="BODY max-w-[100vw] max-h-[100vh] w-[100vw] h-[100vh] flex
        font-main_regular text-ntw"
        onDragOver={ e => {e.preventDefault(); setDndUploadShow(true)} }
        onDragLeave={ e => {e.preventDefault(); setDndUploadShow(false)} }
        >


          <Hotkeys/>


          {/* content */}
          <AsideMenu/>
          <div className="flex flex-col flex-grow">
            <Header/>
            <FileManager/>
          </div>


          {/* modals */}
          <Route path={"/login"} component={LoginModal} />
          <Route path={"/profile"} component={ProfileModal} />
          <Route path={"/image/:entityEid"}>{params => <ImageViewer entityEid={params.entityEid}/>}</Route> 
          <Route path={"/audio/:entityEid"}>{params => <AudioPlayer entityEid={params.entityEid}/>}</Route>
          <Route path={"/video/:entityEid"}>{params => <VideoPlayer entityEid={params.entityEid}/>}</Route>
          <Route path={"/hotkeys"} component={HotkeysModal} />

          <DndUpload showSelf={dndUploadShow} setShowSelf={setDndUploadShow}/>
          <UploadingFrame/>


        </div>
        <ReactQueryDevtools/>
      </Router>
    </QueryClientProvider>
  )





  function Hotkeys() {

    const user = useQuery<User, any>({
      queryKey: ['user'],
      queryFn: fetchUser,
      refetchOnWindowFocus: false,
      retry: false,
    })


    // hotkeys
    useEffect(() => {

      const _hotkeys = (e: KeyboardEvent) => {
        if (location != '/') { return }
  
        if (e.ctrlKey && (e.key.toLowerCase() == 'u')) {
          e.preventDefault()
          if (!user.isSuccess) { return }
          setLocation('/profile')
        }
      }


      window.addEventListener('keydown', _hotkeys)
      return () => {
        window.removeEventListener('keydown', _hotkeys)
      }

    }, [location, user.isSuccess])


    return (<></>)
  }


}





export { App }