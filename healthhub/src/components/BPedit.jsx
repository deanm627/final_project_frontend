import { useState } from 'react';
import axios from "axios";

export const BPedit = ({ bp, newOrEdit, defaultEdit, newCancel }) => {
    const [systolic, setSystolic] = useState(bp.systolic);
    const [diastolic, setDiastolic] = useState(bp.diastolic);
    const [date, setDate] = useState(bp.date_num);
    const [time, setTime] = useState(bp.time_num);
    const [status, setStatus] = useState('');
    const [edit, setEdit] = useState(defaultEdit);
    const [neworEdit, setNeworEdit] = useState(newOrEdit)

    const token = localStorage.getItem('access_token');

    const createNew = async e => {
        e.preventDefault();

        const bodyFormData = new FormData();
        bodyFormData.append('systolic', systolic);
        bodyFormData.append('diastolic', diastolic);
        bodyFormData.append('date_num', date);
        bodyFormData.append('date_str', date);
        bodyFormData.append('time_num', time);
        bodyFormData.append('time_str', time);

        // Create the POST request
        await axios.post('http://127.0.0.1:8000/medprob/bps/', bodyFormData, 
                       {headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'}
                       },
                       {withCredentials: true})
                       .then(response => {
                        console.log(response)
                        if (response.status == 201) {
                            setStatus(response.status)
                            window.location.reload()
                        } else {
                            setStatus(response.response.status)
                        }
                       });
        
        
    }

    const saveChange = async e => {
        e.preventDefault();

        const bodyFormData = new FormData();
        bodyFormData.append('systolic', systolic);
        bodyFormData.append('diastolic', diastolic);
        bodyFormData.append('date_num', date);
        bodyFormData.append('date_str', date);
        bodyFormData.append('time_num', time);
        bodyFormData.append('time_str', time);

        // PUT request
        await axios.put(`http://127.0.0.1:8000/medprob/bps/${bp.id}/`,
            bodyFormData,
            {
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            },
            { withCredentials: true })
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    setStatus(response.status)
                    window.location.reload()
                    
                } else {
                    setStatus(response.response.status)
                }
            });
    }

    const deleteBP = async e => {
        e.preventDefault();

        await axios.delete(`http://127.0.0.1:8000/medprob/bps/${bp.id}/`,
            {
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            },
            { withCredentials: true })
            .then(response => {
                console.log(response)
                setStatus(response.status)
                if (response.status == 204) {
                    window.location.reload()
                }
            });
    }

    const handleCancel = () => {
        setEdit(false);
        setSystolic(bp.systolic);
        setDiastolic(bp.diastolic);
        setDate(bp.date_num);
        setTime(bp.time_num);
    }

    return (
        <>
            {!edit 
            ? 
            <>
                <td>{bp.systolic}/{bp.diastolic}</td>
                <td>{bp.date_str}</td>
                <td>{bp.time_str}</td>
                <td>
                    {neworEdit 
                        ? null
                        : <button type='button' onClick={() => setEdit(true)}>Edit</button>
                    }
                </td>
            </> 
            : 
            <>
                <td>
                    <input 
                        className='BPnumber'
                        type='number'
                        name='systolic'
                        value={systolic}
                        required
                        max='300'
                        placeholder='Systolic'
                        onChange={e => setSystolic(e.target.value)} />/
                    <input
                        className='BPnumber'
                        type='number'
                        name='diastolic'
                        value={diastolic}
                        required
                        max='300'
                        placeholder='Diastolic'
                        onChange={e => setDiastolic(e.target.value)} />
                </td>
                <td>
                    <input
                        type='date'
                        name='date'
                        value={date}
                        required
                        onChange={e => setDate(e.target.value)} />
                </td>
                <td>
                    <input
                        type='time'
                        name='time'
                        value={time}
                        required
                        onChange={e => setTime(e.target.value)} />
                </td>
                <td>
                    {neworEdit 
                        ? null
                        : <button type='button' onClick={handleCancel}>Cancel</button>
                    }
                    {neworEdit 
                        ? <button type='submit' onClick={(e) => createNew(e)}>Save</button>
                        : <button type='submit' onClick={(e) => saveChange(e)}>Save</button>
                    }
                    {neworEdit 
                        ? <button type='button' onClick={newCancel}>Cancel</button>
                        : <button type='button' onClick={(e) => deleteBP(e)}>Delete</button>
                    }
                </td>
            </>
            }
        
            {/* 
                        {status == 201 ?
                            <p className='success'>BP reading successfully entered.</p> : null}
                        {status == 400 ?
                            <p className='failure'>An error occured.</p> : null}
                     */}
            
        </>

    )
}