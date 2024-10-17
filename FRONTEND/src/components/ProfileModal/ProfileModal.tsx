
import { useLocation, Redirect } from "wouter"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import Cookies from "js-cookie"
import clsx from "clsx"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

// modules
import { fetchUser } from "../../requests/fetchUser"
import { User } from "../../models/User"







const ProfileModal = () => {

  const [_, setLocation] = useLocation()

  const {data: user, isLoading, isError, isSuccess} = useQuery<User, any>({
    queryKey: ['user'],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    retry: false,
  })


  useEffect(() => {
    const _esc = (e: KeyboardEvent) => {
      if (e.key == "Escape") setLocation('/', {replace: true})
    }
    window.addEventListener('keydown', _esc)
    return () => window.removeEventListener('keydown', _esc)
  }, [])




  const handleLogOut = () => {
    Cookies.remove('session_token')
    Cookies.remove('refresh_token')
    window.location.reload()
  }



  return (
    <div className="wrapper bg-shading absolute w-[100vw] h-[100vh] center-div  z-40"
    onClick={_ => setLocation('/', {replace: true})}>

      <div className={clsx(
        "bg-main-1 w-[65%] h-[65%] mobile:w-[90%] mobile:h-[75%] tablet:w-[85%]  flex mobile:flex-col  relative",
        "before:content-['[tap_outside_to_close]'] before:text-lg before:absolute before:translate-y-[-115%] before:right-3"
      )}
      onClick={e => e.stopPropagation()}>


        {
          isLoading ? <div className="center-div w-full h-full text-2xl">Loading...</div>
          : isError ? <Redirect to="/" replace state={{modal: true}}/>
          

          : isSuccess &&
          <>
            <div className="profile-section flex-grow text-2xl  p-9">

              <div className="flex gap-6 mobile:flex-col mobile:items-start">
                <img
                  className="aspect-square h-[180px] rounded-xl border-highlight border-[4px] ml-[20px]"
                  src={window.API_URL + "/user-service/get-user-image"}
                  alt="@user_image"
                />

                <div className="pt-2">
                  <div className="text-highlight font-main_semiBold text-3xl">{user!!.name}</div>
                  <div>{user!!.email}</div>
                </div>
              </div>

              <div className="mt-4">
                uid: <span className="font-main_regular_italic text-xl">{user!!.uid}</span>
              </div>

            </div>




            <div className="btns-section flex flex-col bg-main-2 p-6  desktop:max-w-[40%] tablet:max-w-[45%]">

              <div className="btn flex gap-[9px] w-full h-[48px] cursor-pointer hover:text-highlight my-3"
              onClick={_ => _}>
                <div className="bg-main-1 aspect-square center-div  rounded-l-xl"> <FAI icon={"fa-solid fa-mug-hot" as IconProp} className="w-[44%] !h-[44%]"/> </div>
                <div className="bg-main-1 flex items-center text-2xl pl-[7%] flex-grow  rounded-r-xl">Change user_name</div>
              </div>
              {/* - info - */}
              <div className="text-xl font-main_regular_italic ml-1 mb-5">* changing user_name will affect <span className="text-highlight">sharedLink</span>'s</div>
              {/* -------- */}
              <div className="btn flex gap-[9px] w-full h-[48px] cursor-pointer hover:text-highlight my-3"
              onClick={_ => _}>
                <div className="bg-main-1 aspect-square center-div  rounded-l-xl"> <FAI icon={"fa-solid fa-gear" as IconProp} className="w-[44%] !h-[44%]"/> </div>
                <div className="bg-main-1 flex items-center text-2xl pl-[7%] flex-grow  rounded-r-xl">Change email</div>
              </div>
              <div className="btn flex gap-[9px] w-full h-[48px] cursor-pointer hover:text-highlight my-3"
              onClick={_ => _}>
                <div className="bg-main-1 aspect-square center-div  rounded-l-xl"> <FAI icon={"fa-solid fa-gear" as IconProp} className="w-[44%] !h-[44%]"/> </div>
                <div className="bg-main-1 flex items-center text-2xl pl-[7%] flex-grow  rounded-r-xl">Change password</div>
              </div>


              <div className="flex-grow"/> {/* <- gap */}


              <div className="btn flex gap-[9px] w-full h-[48px] cursor-pointer hover:text-highlight my-3"
              onClick={_ => handleLogOut()}>
                <div className="bg-main-1 aspect-square center-div  rounded-l-xl"> <FAI icon={"fa-solid fa-right-from-bracket" as IconProp} className="w-[44%] !h-[44%]"/> </div>
                <div className="bg-main-1 flex items-center text-2xl pl-[7%] flex-grow  rounded-r-xl">Log out</div>
              </div>

            </div>
          </>
        }



      </div>

    </div>
  )

}




export { ProfileModal }