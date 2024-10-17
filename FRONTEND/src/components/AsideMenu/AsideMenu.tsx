
import clsx from "clsx"
import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { useState } from "react"
import { Link } from "wouter"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

// modules
import { Logo } from "./Logo"
import { collectionAtom } from "../../atoms/fsPathAtom"
import { prettifySize_onlyMb } from "../../util/prettifySize"
import { fetchUser } from "../../requests/fetchUser"
import { User } from "../../models/User"





const AsideMenu = () => {


  const [showAside, setShowAside] = useState(false)
  const [collection, setCollection] = useAtom(collectionAtom)


  const {data, isLoading, isError, isSuccess} = useQuery<User, any>({
    queryKey: ['user'],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    retry: false,
  })



  return (
    <>
      {
        !showAside && 
        <div className="show-aside-trigger absolute top-[50vh] translate-y-[-50%] bg-[rgba(0,0,0,0.8)] text-3xl h-[30vh] w-[45px] center-div z-10 cursor-pointer"
        onClick={_ => setShowAside(true)}>
          <div className="rotate-90 text-nowrap">
            Open aside
          </div>
        </div>
      }


      {
        showAside &&
        <div className="
        z-10
        aside-shading absolute top-0 right-0 h-[100vh] bg-[rgba(0,0,0,0.8)] center-div text-4xl cursor-pointer
        mobile:!w-[calc(100vw-280px)]
        desktop:!hidden tablet:!hidden
        "
          onClick={_ => setShowAside(false)}
        >
          <div className="rotate-90 text-nowrap">
            Close aside
          </div>
        </div>
      }

      <div className={clsx(
      "aside min-w-[min(20vw,_335px)] w-[min(20vw,_335px)] h-[100vh] bg-main-2 border-r-[4px] border-main-3 flex flex-col z-10",
      "tablet:min-w-[33vw] tablet:w-[33vw]",
      "mobile:min-w-[280px] mobile:w-[280px] mobile:!absolute", !showAside && "mobile:hidden"
      )}>




        <div className="logo border-b-[4px] border-main-3 h-[var(--header-height)] center-div">
          <Logo/>
        </div>




        <div className="collections p-[7%]  border-b-[4px] border-main-3">
          <div className="font-main_semiBold text-3xl">Collections</div>

          <div className={clsx("btn flex gap-[9px] w-full h-[48px] cursor-pointer hover:underline my-5", collection=='DRIVE' && "text-highlight")}
          onClick={_ => setCollection('DRIVE')}>
            <div className="bg-main-1 aspect-square center-div  rounded-l-xl"> <FAI icon={"fa-solid fa-box" as IconProp} className="w-[44%] !h-[44%]"/> </div>
            <div className="bg-main-1 flex items-center text-2xl pl-[7%] flex-grow  rounded-r-xl">Drive</div>
          </div>

          <div className={clsx("btn flex gap-[9px] w-full h-[48px] cursor-pointer hover:underline my-5", collection=='SHARED' && "text-highlight")}
          onClick={_ => setCollection('SHARED')}>
            <div className="bg-main-1 aspect-square center-div  rounded-l-xl"> <FAI icon={"fa-solid fa-paper-plane" as IconProp} className="w-[44%] !h-[44%]"/> </div>
            <div className="bg-main-1 flex items-center text-2xl pl-[7%] flex-grow  rounded-r-xl">Shared</div>
          </div>

          <div className={clsx("btn flex gap-[9px] w-full h-[48px] cursor-pointer hover:underline my-5", collection=='TRASH' && "text-highlight")}
          onClick={_ => setCollection("TRASH")}>
            <div className="bg-main-1 aspect-square center-div  rounded-l-xl"> <FAI icon={"fa-solid fa-trash" as IconProp} className="w-[44%] !h-[44%]"/> </div>
            <div className="bg-main-1 flex items-center text-2xl pl-[7%] flex-grow  rounded-r-xl">Trash</div>
          </div>

        </div>




        <div className="general p-[7%] text-xl">
          <div className="font-main_semiBold text-3xl">General</div>

          <div className="btn flex gap-[15px] items-center my-5 cursor-pointer hover:text-highlight  w-fit">
            <FAI icon={"fa-solid fa-mug-hot" as IconProp} />
            <Link to={"/hotkeys"}>Hotkeys</Link>
          </div>

          <div className="btn flex gap-[15px] items-center my-5 cursor-pointer hover:text-highlight  w-fit">
            <FAI icon={"fa-solid fa-arrows-turn-to-dots" as IconProp} />
            <a onClick={e => {e.preventDefault(); window.open(`${window.API_URL}/docs`)} } href={`${window.API_URL}/docs`}>API Routes</a>
          </div>

          <div className="btn flex gap-[15px] items-center my-5 cursor-pointer hover:text-highlight  w-fit">
            <FAI icon={"fa-brands fa-github" as IconProp} />
            <a onClick={e => {e.preventDefault(); window.open(window.SOURCE_CODE_LINK)} } href={window.SOURCE_CODE_LINK}>Source code</a>
          </div>

          <div className="btn flex gap-[10px] items-center my-5 cursor-pointer hover:text-highlight  w-fit">
            <FAI icon={"fa-solid fa-box" as IconProp} />
            <button onClick={_ => downloadRoot()}>Download root dir</button>
          </div>

        </div>




        <div className="drive-usage-section flex-grow p-[7%]">
          <div className="drive-usage h-full bg-main-1 rounded-xl relative">

            <div className="absolute aspect-square h-[60%] border-main-2 border-[8px] bg-main-1 rounded-full center-div  left-[50%] translate-x-[-50%] translate-y-[-50%]  z-10">
              {isLoading  && <FAI icon={"fa-solid fa-spinner" as IconProp} spin className="aspect-square !h-[60%]"/>}
              {!isLoading && <FAI icon={"fa-solid fa-hard-drive" as IconProp} className="aspect-square !h-[60%] text-highlight"/>}
            </div>



            {
              isError &&
              <div className="_inner-content center-div  pt-[25%]">
                <div className="text-xl font-main_semiBold">no_user</div>
              </div>
            }

            { isSuccess &&
              <>
                <div className="_inner-content h-full w-full text-xl center-div  relative z-10">
                  <div className="grid grid-cols-[auto,_1fr] grid-rows-2 gap-x-3 justify-items-end items-baseline  pt-[12.5%]">

                    <div className="text-highlight font-main_semiBold">{"- Space used:"}</div>
                    <div>{prettifySize_onlyMb(data?.spaceUsed)}</div>

                    <div className="text-highlight font-main_semiBold">{"- Space total:"}</div>
                    <div>{prettifySize_onlyMb(data?.totalSpaceAvailable)}</div>

                  </div>
                </div>

                <DriveUsageLiquid used={data?.spaceUsed} total={data?.totalSpaceAvailable}/>
              </>
            }

          </div>
        </div>



      </div>
    </>
  )
}






function DriveUsageLiquid({used, total}: {used: number, total: number}) {

  const calcH = (): string => {
    let pc = used / total * 100
    if (pc < 12) { pc = 12 }
    return `${pc.toFixed(1)}%`
  }


  return (
    <div className="liquid-wrapper absolute top-0 left-0 h-full w-full overflow-hidden rounded-xl">
      <div
        className="liquid w-full absolute bottom-0 left-0 bg-[#3d1944] opacity-60"
        style={{height: calcH(), backgroundImage: "url('/abstract.gif')"}}
      />
    </div>
  )
}




function downloadRoot() {
  const downloadUrl = window.API_URL + "/download-service/download?target=" + "drive:/"
  window.open(downloadUrl, "_blank")
}





export { AsideMenu }