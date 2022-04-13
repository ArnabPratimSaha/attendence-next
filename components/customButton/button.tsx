import React, { FC, memo } from 'react'
interface CustomButtonInterface{
    name:string,
    type:"button" | "submit" | "reset" | undefined,
    onClick?:(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void,
    style?:React.CSSProperties | undefined,
    className?:string,
    children?:React.ReactChild[]|React.ReactChild
}

const Button:FC<CustomButtonInterface>=({children,name,type,onClick,style,className})=> {
  return (
    <button  style={{...style}} onClick={(e)=>onClick && onClick(e)} name={name} type={type} className={`custom-button-fulldiv ${className && className}`}>
        {children}
    </button>
  )
}

export default Button