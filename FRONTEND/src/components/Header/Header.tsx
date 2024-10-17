
// modules
import { Search } from "./Search"
import { AccountSection } from "./AccountSection"



const Header = () => {

  return (
    <header className="bg-main-2 border-b-[4px] border-main-3
    flex
    h-[var(--header-height)]">


      <div className="search-section center-div
      w-[75%] border-r-[4px] border-main-3">

        <Search/>
      </div>



      <AccountSection />



    </header>
  )
}






export { Header }