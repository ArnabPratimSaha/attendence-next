import axios from 'axios';
import React,{useState} from 'react'
import { VscEye,VscEyeClosed } from 'react-icons/vsc';
import Input from '../../../components/customInput/input';
import Button from '../../../components/customButton/button';
import { useAppDispatch } from '../../../redux/hook/hook';
import { login, User } from '../../../redux/reducers/userReducer';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../../../components/Navbar/Navbar';

const  Signup=()=> {
    const [showPassword,setShowPassword]=useState<boolean>(false);
    const [name,setName]=useState<string>('');
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
                url:`${process.env.NEXT_PUBLIC_BACKEND}/auth/signup`,
                method:'POST',
                data:{
                    name,email,password
                }
            });
            if(res.status===200){
                const user:User=res.data as User;
                dispatch(login(user))
                router.push(`/dash/${user.id}`);
            }
            
        } catch (error) {
            
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
        <div className='auth-card signup-full-div'>
            <h1 className='auth-card-title'>SIGN UP</h1>
            <form onSubmit={handleFormSubmit}>
                <Input required type={'text'} name={'name'} placeholder={'Enter Your name'} value={name} onChange={(e)=>setName(e.target.value) }/>
                <Input style={{marginTop:'15px'}} required type={'email'} name={'email'} placeholder={'Enter Your email'} value={email}  onChange={e=>setEmail(e.target.value) }/>
                <div className='password-div'>
                    <Input style={{marginTop:'15px'}} required type={showPassword?'text':'password'} name={'email'} value={password} onChange={e=>setPassword(e.target.value) } placeholder={'Enter Your password'} />
                    <Button style={{marginLeft:'10px',marginTop:'15px',height:'2rem',width:'2rem'}} onClick={()=>setShowPassword(s=>!s)} type={'button'} name={'show'}>{showPassword?<VscEye/>:<VscEyeClosed/>}</Button>
                </div>
                <Button  className='auth-button signup-button'  type={'submit'} name={'submit'} >Sign up</Button>
            </form>
            <div className='auth-card-change'>
                Switch to <Link href={'/auth/login'} >Login</Link>
            </div>
        </div>
      </div>
    </Navbar>
  )
}

export default Signup