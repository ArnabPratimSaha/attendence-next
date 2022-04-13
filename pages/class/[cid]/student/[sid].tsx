import React, { useCallback, useEffect, useRef, useState } from 'react'
import Cookies from 'js-cookie';
import axios, { AxiosRequestHeaders } from 'axios';
import { BiCopy } from 'react-icons/bi';
import { AiFillPrinter } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import ReactToPrint from 'react-to-print';
import { StudentCombineDataInterface } from '../../../../interfaces/studentData';
import { useAppSelector } from '../../../../redux/hook/hook';
import { useRouter } from 'next/router';
import Modem from '../../../../components/modem/modem';
import Button from '../../../../components/customButton/button';
import Input from '../../../../components/customInput/input';

const StudentAttendence = () => {
    const { cid, sid } = useRouter().query;
    const status=useAppSelector(s=>s.user.status);
    const [student, setStudent] = useState<StudentCombineDataInterface | "LOADING" | "NOT_FOUND">("LOADING");
    const [access, setAccess] = useState<"RW" | "RO">('RO');
    const [modemStatus, setModemStatus] = useState<boolean>(false);
    const componentRef = useRef<any>();
    const [password, setPassword] = useState<string>();
    const router = useRouter();
    const getStudentCount = useCallback((student: StudentCombineDataInterface): number => {
        let num: number = 0;
        student.attendanceArray.forEach(s => s && num++);
        return num;
    }, [student])
    useEffect(() => {
        axios({
            url: `${process.env.NEXT_PUBLIC_BACKEND}/student`,
            method: 'GET',
            params: {
                cid, id: sid
            }
        }).then(res => {
            if (res.status === 200 && res.data) {
                const data: StudentCombineDataInterface = res.data;
                setStudent(data);
                if (status!=='WAITING' && status!=='NOT_AUTHORIZED' && data.teachers.includes(status.id))
                    setAccess('RW');
                return;
            }
            setStudent('NOT_FOUND');
        }).catch(err => {
            setStudent('NOT_FOUND');
        })
    }, [sid,cid])
    const handleStudentDelete: React.FormEventHandler<HTMLFormElement> | undefined = async (ev) => {
        try {
            ev.preventDefault();
            if (access === 'RO' || status==='WAITING' || status==='NOT_AUTHORIZED') {
                return setModemStatus(false);
            };
            const headers: AxiosRequestHeaders = {
                ['id']: status.id ,
                ['accesstoken']: status.accesstoken ,
                ['refreshtoken']: status.refreshtoken,
                ['classid']: cid?.toString() || ''
            }
            const res = await axios({
                url: `${process.env.NEXT_PUBLIC_BACKEND}/student`,
                method: 'DELETE',
                data: {
                    id:sid
                },
                headers: headers
            });
            if (res.status === 200) {
                setModemStatus(false);
                return router.push(`/class/${cid}`)
            }
            setModemStatus(false);
        } catch (error) {
            setModemStatus(false);
        }
    }

    if (student === 'LOADING')
        return (<div>Loading</div>)
    if (student === 'NOT_FOUND')
        return (<div>Not found</div>)
    return (
        <>
         <Modem id='3' status={modemStatus} onClick={() => setModemStatus(false)}>
                <form onSubmit={handleStudentDelete}>
                    <div className="password_data">
                        <div className="password__add_field">
                            <span>Password</span>
                            <Input autoComplete='off' onChange={(e) => setPassword(e.target.value)} required name='roll' placeholder='Enter Your passwrod' type={'password'} />
                        </div>
                        <Button className='password_button' type='submit' name='add'>Confirm</Button>
                    </div>
                </form>
            </Modem>
            <div className='studentAttendence-fulldiv' ref={componentRef}>
                <div className="studentAttendence-topdiv">
                    <div className="studentAttendence-infodiv">
                        <div className="studentAttendence-infodiv__attribute">
                            <p>{student.name}</p>
                            <p>{student.roll}</p>
                            <span>{student.id} <BiCopy className='copytoclipboard-icon' /></span>
                        </div>
                        <div className="studentAttendence-infodiv__data">
                            <p>Present {getStudentCount(student)} Out Of {student.attendanceArray.length}</p>
                            <p>({(getStudentCount(student) / student.attendanceArray.length * 100).toFixed(1)}%)</p>
                        </div>
                    </div>
                    <div className="studentAttendence-rightdiv">
                        <ReactToPrint
                            trigger={() => <Button className='print-icon' name='print' type='button'><AiFillPrinter /></Button>}
                            content={() => componentRef.current}
                        />
                        {access === 'RW' && <Button onClick={() => setModemStatus(true)} className='print-icon delete-col' type='button' name='delete' ><RiDeleteBinLine /></Button>}
                    </div>
                </div>
                <div className="studentAttendence-attendance">
                    {student.attendanceArray.map((a, i) => <div  key={i} className={`studentAttendence-attendance__card ${i % 2 == 0 ? `card__even` : `card__odd`}`}>
                        <span>On {new Date(student.attendenceDate[i]).toLocaleDateString()} at {new Date(student.attendenceDate[i]).toLocaleTimeString()}</span>
                        {a && <p className='present-p'>Present</p>}
                        {!a && <p className='absent-p'>Not Present</p>}
                    </div>)}
                </div>
            </div>
        </>
    )
}

export default StudentAttendence