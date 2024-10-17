
import { useState } from "react"
import clsx from "clsx"
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"



const Search = () => {

  //@ts-ignore
  const [filtersApplied, setFiltersApplied] = useState(false)
  const [focused, setFocused] = useState(false)


  return (
    <div className={clsx("search-wrapper bg-main-1 border-[2px] border-main-3 p-[6.5px] center-div text-xl",
    "w-[90%] h-[46%]",
    focused && "!border-highlight")}>

      { filtersApplied &&
      <div className="border-[1px] border-dashed border-ntw rounded h-full center-div px-6 mr-3">filters_applied!</div> }

      <input type="search" placeholder="Search..." className="flex-grow h-full bg-[transparent] w-[1px]" style={{outline: 'none'}}
      onFocus={_ => setFocused(true)} onBlur={_ => setFocused(false)}
      />

      <FAI icon={"fa-solid fa-sliders" as IconProp} className="text-main-3 !h-[70%] aspect-square  mr-4"/>
      <FAI icon={"fa-solid fa-magnifying-glass" as IconProp} className="text-ntw !h-[70%] aspect-square hover:text-highlight"/>

    </div>
  )




}





export { Search }