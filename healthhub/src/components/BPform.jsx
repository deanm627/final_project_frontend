import { useState } from 'react';
import axios from "axios";
import { ProgressCircle } from './ProgressCircle';

export const BPform = ({handleModal, refreshScreen}) => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('access_token');

    const submit = async e => {
        e.preventDefault();
        setLoading(true);

        const bodyFormData = new FormData();
        bodyFormData.append('systolic', systolic);
        bodyFormData.append('diastolic', diastolic);
        bodyFormData.append('date_num', date);
        bodyFormData.append('date_str', date);
        bodyFormData.append('time_num', time);
        bodyFormData.append('time_str', time);

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
                            setSystolic('');
                            setDiastolic('');
                            setDate('');
                            setTime('');
                            setLoading(false);
                        } else {
                            setStatus(response.response.status)
                        }
                       });
        
    }

    return (
        <>
            {loading 
                ?   <div className="flex justify-center items-center h-screen w-screen"><ProgressCircle /></div>
                :
                <div className="flex flex-col justify-center items-center">
                    <div className="w-full max-w-md">
                        <form className="flex flex-col bg-white border-2 border-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submit}>
                            {status
                                ?   <button className="self-end text-gray-500 border-2 border-gray-300 shadow-sm rounded w-8 h-8 mb-4 text-lg flex justify-center items-center hover:bg-gray-500 hover:text-gray-100" 
                                        type='button'
                                        onClick={(e) => handleModal(e, refreshScreen)}>
                                        X
                                    </button>
                                :   <button className="self-end text-gray-500 border-2 border-gray-300 shadow-sm rounded w-8 h-8 mb-4 text-lg flex justify-center items-center hover:bg-gray-500 hover:text-gray-100" 
                                        type='button'
                                        onClick={(e) => handleModal(e, false)}>
                                        X
                                    </button>
                            }
                            <div className="mb-4">
                                <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="systolic">Systolic: </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type='number'
                                    name='systolic'
                                    value={systolic}
                                    required
                                    min='20'
                                    max='300'
                                    onChange={e => setSystolic(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="diastolic">Diastolic:</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type='number'
                                    name='diastolic'
                                    value={diastolic}
                                    required
                                    min='20'
                                    max='300'
                                    onChange={e => setDiastolic(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="date">Date:</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type='date'
                                    name='date'
                                    value={date}
                                    required
                                    onChange={e => setDate(e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="time">Time:</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    type='time'
                                    name='time'
                                    value={time}
                                    required
                                    onChange={e => setTime(e.target.value)} />
                            </div>
                            <button className="bg-transparent hover:bg-emerald-500 text-emerald-600 font-semibold hover:text-white py-2 px-4 border border-emerald-500 hover:border-transparent rounded w-24 self-center" type='submit'>Submit</button>
                            {status == 201 ?
                                <div className='mt-4 text-emerald-600 text-lg text-center'>BP successfully entered.</div> : null}
                            {status == 400 ?
                                <div className='mt-4 text-rose-600 text-lg text-center'>An error occurred.</div> : null}
                        </form>
                    </div>
                </div>
            }
        </>
       
    )
}