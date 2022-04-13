import Link from 'next/link';
import React, { useState } from 'react'
import Lottie from 'react-lottie';
import Button from '../components/customButton/button';
import Navbar from '../components/Navbar/Navbar';
import * as animationData from './calendar.json';

function Intro() {
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  return (
    <Navbar>
      <div className='intro-fulldiv'>

        <div className="intro-topdiv">
          <div className="topintro-leftdiv">
            <div className="leftdiv-top">
              <h1>Attendence</h1>
              <span>manage class attendence like never before</span>
            </div>
            <div className="leftdiv-button">
              <span>Get Started Today</span>
              <Link href='/auth/login'><Button type='button' className='intro-class-button' name='start'>Get Started</Button></Link> 
            </div>
          </div>
          <div className="lottie-animation">
            <Lottie options={{
              loop: true,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
                
              }
            }}
              speed={.5}
              isStopped={isStopped}
              isPaused={isPaused} />
          </div>
        </div>
      </div>
    </Navbar>
  )
}

export default Intro