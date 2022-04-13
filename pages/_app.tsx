import '../styles/globals.css'
import '../styles/button.css';
import '../styles/intro.css';
import '../styles/input.css';
import '../styles/studentStat.css';
import '../styles/column.css';
import '../styles/modem.css';

import '../styles/navbar.css';

import '../styles/attendence.css';
import '../styles/auth.css';
import '../styles/dashboard.css';
import '../styles/attendenceIndex.css';
import '../styles/studentAttendence.css';

import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import store from '../redux/reducers/allReducer'

import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hook/hook';
import Cookies from 'js-cookie';
import axios, { AxiosRequestHeaders } from 'axios';
import { login, logout, User } from '../redux/reducers/userReducer';
import Head from 'next/head';


const Test=()=>{
  const dispatch = useAppDispatch();
  useEffect(() => {

    const id = Cookies.get('id')
    const accesstoken = Cookies.get('accesstoken')
    const refreshtoken = Cookies.get('refreshtoken')
    if (!id || !accesstoken || !refreshtoken) {
      dispatch(logout());
    } else {
      const headers: AxiosRequestHeaders = {
        ['id']: id,
        ['accesstoken']: accesstoken,
        ['refreshtoken']: refreshtoken,
      }
      axios({
        url: `${process.env.NEXT_PUBLIC_BACKEND}/user`,
        method: 'get',
        headers: headers
      }).then(res => {
        if (res.status === 200) {
          const user: User = {
            name: res.data.name,
            email: res.data.email,
            id, accesstoken, refreshtoken
          }
          dispatch(login(user))
        } else {
          dispatch(logout())
        }
      }).catch(err => {  })
    }
  }, [])
  return null;
}


const MyApp=({ Component, pageProps }: AppProps)=> {
  return <Provider store={store}>
    <Head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Gugi&display=swap');
      </style>

    </Head>
    
    <Test />
    <Component {...pageProps} />
  </Provider>
}
// MyApp.getInitialProps = async (appContext: any) => {
//   const appProps = await App.getInitialProps(appContext);
//   return { ...appProps }
// }
export default MyApp
