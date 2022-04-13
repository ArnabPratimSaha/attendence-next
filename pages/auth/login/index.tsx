import React,{useState} from 'react'
import { VscEye,VscEyeClosed } from 'react-icons/vsc';
import axios from 'axios';
import Cookies from 'js-cookie';
import AuthResponse from '../../../interfaces/authResponseData';
import Input from '../../../components/customInput/input';
import Button from '../../../components/customButton/button';
import { login, User } from '../../../redux/reducers/userReducer';
import { useAppDispatch } from '../../../redux/hook/hook';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Auth from '../index';
import Navbar from '../../../components/Navbar/Navbar';
function Login() {
    const [showPassword,setShowPassword]=useState<boolean>(false);
    const [email,setEmail]=useState<string>('');
    const [password,setPassword]=useState<string>('');
    const router=useRouter();
    const dispatch=useAppDispatch();
    const [id,setId]=useState<string>('');
    const handleClassFormSubmit:React.FormEventHandler<HTMLFormElement> | undefined=async(event):Promise<void>=>{
        try {
            event.preventDefault();
            const res=await axios({
                url:`${process.env.NEXT_PUBLIC_BACKEND}/class`,
                method:'GET',
                params:{
                    cid:id
                }
            });
            if(res.status===200)router.push(`/class/${id}`)
        } catch (error) {
            
        }
    }

    const handleFormSubmit:React.FormEventHandler<HTMLFormElement> | undefined=async(event):Promise<void>=>{
        try {
            event.preventDefault();
            const res=await axios({
                url:`${process.env.NEXT_PUBLIC_BACKEND}/auth/login`,
                method:'POST',
                data:{
                    email,password
                }
            });
            if(res.status===200){
                const user: User = {
                    name: res.data.name,
                    email: res.data.email,
                    id:res.data.id, accesstoken:res.data.accesstoken, refreshtoken:res.data.refreshtoken
                }
                dispatch(login(user));
                router.push(`/dash/${user.id}`);
            }
            
        } catch (error) {
            if(axios.isAxiosError(error)){
                console.log({err:error});
                
            }
        }
    }
  return (
      <Navbar>
        <div className='auth-full-div'>
            <form onSubmit={handleClassFormSubmit}>
                <div className="class-join-div">
                    <Input placeholder='Enter class id' type={'text'} name={id} value={id} onChange={e => setId(e.target.value)} />
                    <Button style={{marginLeft:'1rem'}} name={'sub'} type={'submit'}>Go</Button>
                </div>
            </form>
            <div className='auth-card login-full-div'>
                <h1 className='auth-card-title'>LOG IN</h1>
                <form onSubmit={handleFormSubmit}>
                    <Input required type={'email'} name={'email'} placeholder={'Enter Your email'} value={email} onChange={e => setEmail(e.target.value)} />
                    <div className='password-div'>
                        <Input style={{ marginTop: '15px' }} required type={showPassword ? 'text' : 'password'} name={'email'} placeholder={'Enter Your password'} value={password} onChange={e => setPassword(e.target.value)} />
                        <Button style={{ marginLeft: '10px', marginTop: '15px', height: '2rem', width: '2rem' }} onClick={(e) => setShowPassword(s => !s)} type={'button'} name={'show'} >{showPassword ? <VscEye /> : <VscEyeClosed />}</Button>
                    </div>
                    <Button className='auth-button login-button' type={'submit'} name={'submit'} >Login</Button>
                </form>
                <div className='auth-card-change'>
                    Switch to <Link href={'/auth/signup'} >Sign up</Link>
                </div>
            </div>

        </div>

      </Navbar>
  )
}

export default Login