import React from 'react'
import Home from './home';
import commonStyle from "../../styles/Common.module.css"
// import commonStyle from '../../styles/common.module.css'

export default function LandingWrapper() {
  return (
   <>
    <div className={commonStyle["main-wrapper"]}>
        <Home/>
        
    </div>
   </>
  )
}
