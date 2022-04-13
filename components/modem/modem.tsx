import { NextPage } from 'next';
import React, { ReactChild, useEffect } from 'react'
interface ModemInterface{
  status?:boolean,
  className?:string,
  style?:React.CSSProperties | undefined,
  onClick?:()=>void,
  id:string,
  children?:ReactChild
}
const Modem:NextPage<ModemInterface>=({children,status,className,style,onClick,id})=> {
  useEffect(()=>{
    const element=document.getElementById(id);
    let timeout:ReturnType< typeof setTimeout>|undefined;
    if(element){
      timeout=setTimeout(()=>{
        if(status)element.classList.add('modem_open');
        else element.classList.remove('modem_open');
      },100)
    }
    return ()=>timeout && clearTimeout(timeout)
  },[status])
  return (
    <div className={`modem-fulldiv`} style={{display:status?'flex':'none'}}>
      <div className={`modem-layer `} onClick={()=>onClick && onClick()}></div>
      <div className={`modem-card ${className && className}`} id={id} style={{...style}}  >
        {children}
      </div>
    </div>
  )
}

export default Modem