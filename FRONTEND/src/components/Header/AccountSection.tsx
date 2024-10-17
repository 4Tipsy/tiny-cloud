
import { useQuery } from "@tanstack/react-query"
import { Link } from "wouter"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

// modules
import { User } from "../../models/User"
import { fetchUser } from "../../requests/fetchUser"





const AccountSection = () => {

  const {data, isLoading, isError, isSuccess} = useQuery<User, any>({
    queryKey: ['user'],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    retry: false,
  })


  return (
    <div className="account-section flex-grow center-div text-3xl">


        
      {
        isLoading &&
        <div className="login-btn flex items-center">
          <FAI icon={"fa-solid fa-spinner" as IconProp} spin className="aspect-square h-[40px]"/>
        </div>
      }
      {
        isError &&
        <div className="login-btn flex items-center text-center cursor-pointer hover:text-highlight">
          <Link to="/login">No account (login)</Link>
        </div>
      }
      {
        isSuccess &&
        <div className="flex items-center">
          <div className="mr-[20px]">
            <div className="text-highlight text-right font-main_semiBold  tablet:!hidden mobile:!hidden">{data?.name}</div>
            <Link to="/profile" className="text-xl cursor-pointer hover:underline text-right  tablet:!hidden mobile:!hidden">[profile_settings]</Link>
          </div>
          <Link to="/profile">
            <img
              className="aspect-square h-[70px] rounded-lg border-highlight border-[3px] cursor-pointer"
              src={window.API_URL + "/user-service/get-user-image"}
              alt="@user_image"
            />
          </Link>
        </div>
      }
        

        
        
      
    

    </div>
  )
}




export { AccountSection }