import axios, { AxiosRequestHeaders } from 'axios';
import Cookies from 'js-cookie'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../../redux/hook/hook';
import { RootState } from '../../redux/reducers/allReducer';
// import Button from '../customButton/button';
import {logout} from '../../redux/reducers/userReducer';
import { NextPage } from 'next';
import Button from '../customButton/button';
import { useRouter } from 'next/router';
interface User {
    name: string,
    email: string,
    id: string
}
const Navbar:NextPage<{children?:React.ReactChild}> = ({children}) => {
    const status=useAppSelector((s:RootState)=>s.user.status);
    const dispath=useAppDispatch();
    const router=useRouter();
    const handleLogout=()=>{
        if (status==='NOT_AUTHORIZED'|| status==='WAITING') {
            return;
        }
        const headers: AxiosRequestHeaders = {
            ['id']: status.id,
            ['accesstoken']:status.accesstoken,
            ['refreshtoken']: status.refreshtoken,
        }
        axios({
            url: `${process.env.NEXT_PUBLIC_BACKEND}/auth/logout`,
            method: 'DELETE',
            headers: headers
        }).then(res=>{
            if(res.status===200){
                dispath(logout())
            }
        }).catch(err=>{})
    }
    return (
        <>
            <div className={'navbar-fulldiv'}>
                <div className="navbar-leftdiv">
                    <div className="navbar-logodiv">
                        <span>C</span>
                    </div>
                    <div className="navbar-links">
                        <Link
                            href={`/`}
                        >
                            <a className='navlink'>Home</a>
                        </Link>
                        <Link
                            href={`/dash/${Cookies.get('id')}`}
                        >
                            <a className='navlink'>Dashboard</a>
                        </Link>
                    </div>
                </div>
                <div className="navbar-rightdiv">
                    {status==='WAITING' && <div>Loading</div>}
                    {status === 'NOT_AUTHORIZED' && <Button onClick={()=>router.push('/auth/login')} className='login-button' name='logout' type='button' >Login</Button>}
                    {status !== 'NOT_AUTHORIZED' && status!=='WAITING' && <div className='rightdiv-logout'>
                        <span>{status.name.slice(0,13)}{status.name.slice(13,status.name.length)&&'...'}</span> 
                        <Button onClick={handleLogout} className='logout-button' name='logout' type='button'>Logout</Button>
                    </div>}
                </div>
            </div>
           {children}
        </>
    )
}

export default Navbar