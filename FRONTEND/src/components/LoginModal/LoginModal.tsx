
import { AxiosError } from "axios"
import clsx from "clsx"
import { useLocation } from "wouter"
import { useState, useEffect } from "react"

// modules
import { performLogin } from "../../requests/performLogin"
import { BaseErrorRes } from "../../models/BaseErrorRes"


const LoginModal = () => {


  const [_, setLocation] = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [reqError, setRequestError] = useState<BaseErrorRes | null>(null)
  const [_reqStatus, _setReqStatus] = useState<number|string>(0)




  useEffect(() => {
    const _esc = (e: KeyboardEvent) => {
      if (e.key == "Escape") setLocation('/', {replace: true})
    }
    window.addEventListener('keydown', _esc)
    return () => window.removeEventListener('keydown', _esc)
  }, [])




  const handleLogin = () => {
    // cleanup
    _setReqStatus(0)
    setRequestError(null)

    // input validation
    if (email=='' || password=='') {
      _setReqStatus("not_send")
      const _err: BaseErrorRes = {errorType: 'Input is invalid', errorDetail: 'Fill all inputs!'}
      setRequestError(_err) 
      return
    }
    if (email.indexOf('@') == -1) {
      _setReqStatus("not_send")
      const _err: BaseErrorRes = {errorType: 'Input is invalid', errorDetail: 'You inserted invalid email'}
      setRequestError(_err) 
      return
    }

    // handling
    performLogin(email, password)
    .then(_ => {
      _setReqStatus(200)
      setLocation('/', {replace: true})
      window.location.reload()    
    })
    .catch(_e => {
      const e: AxiosError = _e

      if (e.response) {
        _setReqStatus(e.response.status)
        // @ts-ignore
        setRequestError(e.response.data)
      }
      else {
        _setReqStatus("not_send")
        const _err: BaseErrorRes = {errorType: 'Request error', errorDetail: 'Error while performing request'}
        setRequestError(_err) 
      }
    })
  }




  return (
    <div className="wrapper bg-shading absolute w-[100vw] h-[100vh] center-div  z-40" onClick={_ => setLocation('/', {replace: true}) }>

      <div className={clsx(
        "bg-main-1 h-[30%] desktop:w-[40%] tablet:w-[60%] mobile:w-[80%]  relative",
        "before:content-['[tap_outside_to_close]'] before:text-lg before:absolute before:translate-y-[-115%] before:right-3"
      )}
      onClick={e => e.stopPropagation()}>

        <div className="w-full h-full flex flex-col items-center justify-evenly text-xl">


          <div className="email-input w-[80%] bg-main-2 border-main-3 border-[1px] font-main_regular_italic">
            <input className="w-full h-full bg-[transparent] pl-3 py-2" type="text" placeholder="Email" autoFocus
            value={email}
            onChange={e => setEmail(e.currentTarget.value)} 
            onKeyDown={e => {if (e.key=="Enter") {e.preventDefault(); handleLogin()} }}/>
          </div>

          <div className="password-input w-[80%] bg-main-2 border-main-3 border-[1px] font-main_regular_italic">
            <input className="w-full h-full bg-[transparent] pl-3 py-2" type="password" placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.currentTarget.value)} 
            onKeyDown={e => {if (e.key=="Enter") {e.preventDefault(); handleLogin()} }}/>
          </div>

          <button className="bg-highlight rounded cursor-pointer hover:underline px-6 py-2" onClick={_ => handleLogin()}>
            perform_login
          </button>

        </div>



        { reqError &&
        <div className="errors absolute top-full left-0 py-4  text-lg">
          <span className="text-status-err">Error[<span className="text-ntw">{_reqStatus}</span>]: </span>{reqError.errorType}
          <br/>
          <span className="text-status-err">Details: </span>{reqError.errorDetail}
        </div>}

      </div>




    </div>
  )
}



export { LoginModal }