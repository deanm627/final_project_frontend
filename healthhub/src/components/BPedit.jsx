import { useState } from 'react';
import axios from "axios";

export const BPedit = ({ bp, newOrEdit, defaultEdit, newCancel, statusChange }) => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [edit, setEdit] = useState(defaultEdit);
    const [neworEdit, setNeworEdit] = useState(newOrEdit);
    const [required, setRequired] = useState(['default', 'default', 'default', 'default']);

    const token = localStorage.getItem('access_token');

    const createNew = async e => {
        e.preventDefault();

        if (systolic === '' | diastolic === '' | date === '' | time === '' ) {
            fieldCheck();
            alert("Please enter all required fields");
            return;
        }

        const bodyFormData = new FormData();
        bodyFormData.append('systolic', systolic);
        bodyFormData.append('diastolic', diastolic);
        bodyFormData.append('date_num', date);
        bodyFormData.append('date_str', date);
        bodyFormData.append('time_num', time);
        bodyFormData.append('time_str', time);

        await axios.post('http://127.0.0.1:8000/medprob/bps/', 
            bodyFormData, 
            {headers: 
                {'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'}
            },
            {withCredentials: true})
            .then(response => {
                console.log(response)
                if (response.status == 201) {
                    {statusChange(response.status)};
                } else {
                    {statusChange(response.response.status)};
                }
            });
    }

    const saveChange = async e => {
        e.preventDefault();

        if (systolic === '' | diastolic === '' | date === '' | time === '' ) {
            fieldCheck();
            alert("Please enter all required fields");
            return;
        }

        const bodyFormData = new FormData();
        bodyFormData.append('systolic', systolic);
        bodyFormData.append('diastolic', diastolic);
        bodyFormData.append('date_num', date);
        bodyFormData.append('date_str', date);
        bodyFormData.append('time_num', time);
        bodyFormData.append('time_str', time);

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
                    {statusChange(response.status)};
                } else {
                    {statusChange(response.response.status)};
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
        setRequired(['default', 'default', 'default', 'default', 'default']);
    }

    const setValues = () => {
        setEdit(true);
        setSystolic(bp.systolic);
        setDiastolic(bp.diastolic);
        setDate(bp.date_num);
        setTime(bp.time_num);
    }

    const fieldCheck = () => {
        const fields = [systolic, diastolic, date, time];
        const newArr = [];
        fields.forEach((field, index) => {
            console.log(field, index)
            if (field === '') {
                newArr[index] = 'required';
            } else {
                newArr[index] = '';
            }
        })
        console.log(newArr);
        setRequired(newArr);
    }

    return (
        <>
            {!edit 
            ? 
            <tr className='displayRow'>
                <td>{bp.systolic}/{bp.diastolic}</td>
                <td>{bp.date_str}</td>
                <td>{bp.time_str}</td>
                <td>
                    {neworEdit 
                        ? null
                        : <button type='button' className='editButton' onClick={setValues}>Edit</button>
                    }
                </td>
            </tr> 
            : 
            <tr className='editRow'>
                <td>
                    <input 
                        className={`BPnumber ${required[0]}`}
                        type='number'
                        name='systolic'
                        value={systolic}
                        required
                        min='20'
                        max='300'
                        placeholder='Systolic'
                        onChange={e => setSystolic(e.target.value)} />/
                    <input
                        className={`BPnumber ${required[1]}`}
                        type='number'
                        name='diastolic'
                        value={diastolic}
                        required
                        min='20'
                        max='300'
                        placeholder='Diastolic'
                        onChange={e => setDiastolic(e.target.value)} />
                </td>
                <td>
                    <input
                        type='date'
                        name='date'
                        value={date}
                        className={required[2]}
                        required
                        onChange={e => setDate(e.target.value)} />
                </td>
                <td>
                    <input
                        type='time'
                        name='time'
                        value={time}
                        className={required[3]}
                        required
                        onChange={e => setTime(e.target.value)} />
                </td>
                <td>
                    {neworEdit 
                        ? null
                        : <button type='button' className='editButton' onClick={handleCancel}>Cancel</button>
                    }
                    {neworEdit 
                        ? <button type='submit' className='editButton' onClick={(e) => createNew(e)}>Save</button>
                        : <button type='submit' className='editButton' onClick={(e) => saveChange(e)}>Save</button>
                    }
                    {neworEdit 
                        ? <button type='button' className='editButton' onClick={newCancel}>Cancel</button>
                        : <button type='button' className='editButton' onClick={(e) => deleteBP(e)}>Delete</button>
                    }
                </td>
            </tr>
            }
        </>
    )
}