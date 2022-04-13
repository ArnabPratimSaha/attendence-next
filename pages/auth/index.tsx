import axios from 'axios';
import { NextPage } from 'next';
import  { useRouter } from 'next/router';
import React, { useState } from 'react'
import Button from '../../components/customButton/button';
import Input from '../../components/customInput/input';
const Auth:NextPage<{Children?:React.ReactChild}>=({Children})=> {
    const [id,setId]=useState<string>('');
    const router=useRouter();
    const handleFormSubmit:React.FormEventHandler<HTMLFormElement> | undefined=async(event):Promise<void>=>{
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
  return (
    <div className='auth-full-div'>
            <form onSubmit={handleFormSubmit}>
              <div className="class-join-div">
                  <Input placeholder='Enter class id' type={'text'} name={id} value={id} onChange={e => setId(e.target.value)} />
                  <Button style={{marginLeft:'1rem'}} name={'sub'} type={'submit'}>Go</Button>
              </div>
          </form>
           {Children}
    </div>
  )
}

export default Auth