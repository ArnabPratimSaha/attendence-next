import axios,{AxiosRequestHeaders} from 'axios';
import Cookies from 'js-cookie';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Column from '../../../components/column/column';
import StudentStat from '../../../components/studentStat/studentStat';
import { ClassInterface, Student } from '../../../interfaces/classData';
import { IoAdd } from 'react-icons/io5';
import { IoMdAddCircleOutline } from 'react-icons/io';
import Button from '../../../components/customButton/button';
import Input from '../../../components/customInput/input';
import Modem from '../../../components/modem/modem';
import { useAppDispatch, useAppSelector } from '../../../redux/hook/hook';
import { setData, setStatus, update } from '../../../redux/reducers/attendenceReducer';
import { useRouter } from 'next/router';
function Attendance() {
    const {cid} = useRouter().query;
    const router=useRouter();
    const [modemStatus,setModemStatus]=useState<boolean>(false);
    const status=useAppSelector(s=>s.user.status);
    const attendence=useAppSelector(s=>s.attendence.status)
    const [access, setAccess] = useState<"RO" | "RW">('RO');
    const dispatch=useAppDispatch();
    const [name,setName]=useState<string>('');
    const [roll,setRoll]=useState<string>('');
    const targetRef=useRef<HTMLDivElement | null>(null);
    const fetchData=useCallback(async():Promise<void>=>{
        try {
            if(status==='WAITING'|| status==='NOT_AUTHORIZED'||attendence==='NOT_FOUND'||attendence==='WAITING')return;
            const res=await axios({
                url: `${process.env.NEXT_PUBLIC_BACKEND}/class`,
                method: 'GET',
                params: {
                    cid
                }
            });
            if(res.status===200){
                const data: ClassInterface = res.data;
                dispatch(setData(data))
            }
        } catch (error) {
            throw error;
        }
    },[status,attendence])
    useEffect(()=>{
        if(status!=='NOT_AUTHORIZED' && status!=='WAITING'&& attendence!=='NOT_FOUND' && attendence!=='WAITING'){
            setAccess( s=> attendence.teachers.includes(status.id)?'RW':'RO');
        }
    },[status,attendence])
    useEffect(() => {
        if(!cid)return;
        axios({
            url: `${process.env.NEXT_PUBLIC_BACKEND}/class`,
            method: 'GET',
            params: {
                cid
            }
        }).then(res => {
            console.log(res);
            
            if (res.status === 200 && res.data) {
                const data: ClassInterface = res.data;
                return dispatch(setData(data))
            }
            dispatch(setStatus('NOT_FOUND'));
        }).catch(err=>{
            dispatch(setStatus('NOT_FOUND'));
        })
        return ()=>{dispatch(setStatus('WAITING'))}
    }, [cid]);
    const [device,setDevice]=useState<"MOBILE"|"PC">('PC');
    const ev0=()=>{
        if(window.innerWidth <= 800)setDevice('MOBILE');
        else setDevice('PC');
    }
    useEffect(()=>{
        window.addEventListener('resize',ev0);
        return ()=>{
            window.removeEventListener('resize',ev0);
        }
    },[])

    useEffect(() => {
        const ev1=(ev:Event)=>{
            const top: HTMLElement | null = document.getElementById('top');
            const bottom: HTMLElement | null = document.getElementById('bottom');
            if (top && bottom) top.scrollLeft = bottom.scrollLeft;
        }
        const ev2=(ev:Event)=>{
            const top: HTMLElement | null = document.getElementById('top');
            const bottom: HTMLElement | null = document.getElementById('bottom');
            if (top && bottom) bottom.scrollLeft = top.scrollLeft;
        }
        const top: HTMLElement | null = document.getElementById('top');
        const bottom: HTMLElement | null = document.getElementById('bottom');
        if(top && bottom){
            top.removeEventListener('scroll',ev1);
            bottom.removeEventListener('scroll',ev2);
        }
        if (top && bottom) {
            if(device==='MOBILE'){
                bottom.addEventListener('scroll',ev1)
                top.ontouchmove=(e:Event)=>{
                    e.preventDefault();
                    top.scrollLeft+=0;
                }
            }else{
                top.addEventListener('scroll', ev2)
                bottom.onscroll=(ev)=>{
                    bottom.scrollLeft+=0;
                }
            }
        }        
        return ()=>{
            if(top && bottom){
                top.removeEventListener('scroll',ev1);
                bottom.removeEventListener('scroll',ev2);
            }
        }
    }, [attendence,status]);
    const handleAttendance:((remark: boolean, index: number, sid: string) => void)=async(remark:boolean,index:number,sid:string)=>{
        try {
            if(access==='RO'||status==='NOT_AUTHORIZED'||status==='WAITING')return;
            dispatch(update({index,remark,sid}))
            const headers:AxiosRequestHeaders={
                ['id']:status.id,
                ['accesstoken']:status.accesstoken,
                ['refreshtoken']:status.refreshtoken,
                ['classid']:cid?.toString()||''
            }
            const res=await axios({
                url: `${process.env.NEXT_PUBLIC_BACKEND}/class/col`,
                method: 'PATCH',
                data:{
                    sid,index,remark,
                    time:new Date()
                },
                headers:headers
            });
            if(res.status!==200){
                return dispatch(update({index,remark:!remark,sid}))
            }
        } catch (error) {
            return dispatch(update({index,remark:!remark,sid}))
        }
    }
    const handleAddColClick:((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined=async()=>{
        try {
            if(access==='RO'||status==='NOT_AUTHORIZED'||status==='WAITING')return;
            const headers:AxiosRequestHeaders={
                ['id']:status.id,
                ['accesstoken']:status.accesstoken,
                ['refreshtoken']:status.refreshtoken,
                ['classid']:cid?.toString()||''
            }
            const res=await axios({
                url: `${process.env.NEXT_PUBLIC_BACKEND}/class/col`,
                method: 'POST',
                data:{
                    cid,
                    time:new Date()
                },
                headers:headers
            });
            if(res.status===200){
                await fetchData();
            }
        } catch (error) {
            
        }
    }
    const handleStudentAddSubmit:React.FormEventHandler<HTMLFormElement> | undefined=async(ev)=>{
        try {
            ev.preventDefault();
            if(access==='RO'||status==='NOT_AUTHORIZED'||status==='WAITING')return;
            const headers:AxiosRequestHeaders={
                ['id']:status.id,
                ['accesstoken']:status.accesstoken,
                ['refreshtoken']:status.refreshtoken,
                ['classid']:cid?.toString()||''
            }
            const res=await axios({
                url: `${process.env.NEXT_PUBLIC_BACKEND}/class/student`,
                method: 'POST',
                data:{
                    name,roll
                },
                headers:headers
            });
            setModemStatus(false);
            if(res.status===200){
                await fetchData();
            }
        } catch (error) {
            
        }
    }
    const handleColClick=(index:number)=>{
        router.push(`/class/${cid}/${index}`)
    }
    
    const getCount=useCallback(
      (index:number):number => {
        let num=0;
        if(attendence!=='NOT_FOUND' && attendence!=='WAITING'){
            attendence.students.forEach(s=>s.attendanceArray[index]&&num++);
        }
        return num;
      },
      [attendence],
    )
    if(attendence==='NOT_FOUND'){
       return( <div>Not Found</div>)
    }
    if(attendence==='WAITING'){
        return(<div>Loading</div>)
    }
    return (
        <div className='attendence-topdiv'>
            <Modem id='1' status={modemStatus} onClick={()=>setModemStatus(false)}>
                <form onSubmit={handleStudentAddSubmit}>
                    <div className="student__add_data">
                        <div className="student__add_field">
                            <span>Name</span>
                            <Input autoComplete='off' onChange={(e)=>setName(e.target.value)} required name='name' placeholder='Enter Name' type={'text'} className='student__add_name' />
                        </div>
                        <div className="student__add_field">
                            <span>Roll</span>
                            <Input autoComplete='off' onChange={(e)=>setRoll(e.target.value)} required name='roll' placeholder='Enter Roll' type={'text'} className='student__add_roll' />
                        </div>
                        <Button className='student__add_data_button' type='submit' name='add'>ADD</Button>
                    </div>
                </form>
            </Modem>
            <div className='attendance-label-div'>
                <div className='attendance-label'>
                    <span>Students</span>
                    {access==='RW' &&<Button name='add' type='button' className='student-add' onClick={()=>setModemStatus(true)}>{ device==='MOBILE'?<IoMdAddCircleOutline/>:'Add Student'}</Button>}
                </div>
                <div className='attendance-date' id='top'>
                    {attendence.attendanceArray.map((t: Date, index) => {
                        const time: Date = new Date(t);
                        return <div key={index} className={`column-date-div ${access}`} onClick={()=>handleColClick(index)}>
                            <div className="column-date-div__time">
                                <p className='column-par column-date'>{time.getDate()}.{time.getMonth()}.{time.getFullYear().toString().slice(2,4)}</p>
                                <p className='column-par column-time'>{time.getHours()}:{time.getMinutes()}</p>
                            </div>
                            <div className="column-date-div__stat">
                                <p>{getCount(index)}/{attendence.students.length}</p>
                                <p>{(getCount(index)/attendence.students.length*100).toFixed(1)}%</p>
                            </div>
                        </div>
                    })}
                    {access==='RW' && <Button onClick={handleAddColClick} type='button' name='add' className={`column__add ${access}`}>
                        <IoAdd/>
                    </Button>}
                </div>
                <div className="overall-stats">
                    <span>{device==='PC'?`Overall Attendance`:'Attendence'}</span>
                </div>
            </div>
            <div className='attendence-fulldiv' >
                {attendence.students.length===0&&<div className='attendence-null'>
                    <p>No Student Found</p>
                    <Button type='button' name='add' className='student-add' onClick={()=>setModemStatus(true)} >Add Student</Button>
                </div>}
                {attendence.students.length!==0&&<div className='attendence-leftdiv' >
                    {attendence.students.map((s,i)=><div onClick={()=>router.push(`/class/${cid}/student/${s.id}`)} key={s.id} style={{background:i%2===0?'#fff':'#eeeeee'}} className='student-attr'>
                        <p>{s.name}</p>
                        <p>{s.roll}</p>
                    </div>)}
                </div>}
                <div className='attendence-display' id='bottom'>
                    <div className='attendence-rightdiv' >
                        {attendence.attendanceArray.map((s, i) => <Column
                            onClick={handleAttendance}
                            key={i} 
                            time={new Date(attendence.attendanceArray[i])}
                            index={i}
                            attendanceArray={attendence.students.map(s => s.attendanceArray[i])} 
                            access={access} 
                            sidArray={attendence.students.map(s => s.id)}
                            />)}
                        {access ==='RW' && <div ref={targetRef} className="attendence-rightdiv__add">

                        </div>}
                    </div>
                </div>
                {attendence.students.length!==0&&<div className="attendance-student-stat">
                    {attendence.students.map((s,i)=><StudentStat key={i} className='attendance-student-stat__stat' style={{background:i%2!==0?'#eeeeee':"#fff"}} student={s} />)}
                </div>}
            </div>
        </div>
    )
}

export default Attendance