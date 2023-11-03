import { useEffect, useState } from "react";
import { useLoaderData, Link } from 'react-router-dom';
import BPForm from '../components/BPform';
import axios from "axios";
import styled from 'styled-components';

const OuterWrapper = styled.div`
    display: flex;
    margin: 30px auto;
    
    .BPList {
        width: 60%;
    }
`
const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;

    label {
        margin: 5px 0;
    }

    button {
        margin: 15px;
        width: 10%;
    }

    .success {
        color: green;
    }

    .failure {
        color: red;
    }
`

export async function loader({ params }) {
    const token = localStorage.getItem('access_token');
    let data = '';

    try {
        await axios.get(`http://127.0.0.1:8000/medprob/bps/${params.bpId}`, 
                    { headers: 
                        {'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'} })
                    .then(response => {
                        console.log(response)
                        data = response.data
                    });
        return data;
    } catch (e) {
        console.error(e)
    }
    
}

export const BPdetail = () => {
    if (localStorage.getItem('access_token') === null) {
        window.location.href = '/login'
    }
    const bp = useLoaderData();
    const [form, setForm] = useState(false);
    const [systolic, setSystolic] = useState(bp.systolic);
    const [diastolic, setDiastolic] = useState(bp.diastolic);
    const [date, setDate] = useState(bp.date);
    const [time, setTime] = useState(bp.time);
    const [status, setStatus] = useState('');
    const id = bp.id;
    const token = localStorage.getItem('access_token');

    const deleteBP = async e => {
        e.preventDefault();

        
        await axios.delete(`http://127.0.0.1:8000/medprob/bps/${id}/`,  
                       {headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json' }
                       },
                       {withCredentials: true})
                       .then(response => {
                        console.log(response)
                        setStatus(response.status)
                        if (response.status == 204) {
                            setTimeout(() => { 
                                window.location.href = '/userhome'
                            }, 1000);
                        } 
                       });
    }
    
    const submit = async e => {
        e.preventDefault();

        const bodyFormData = new FormData();
        bodyFormData.append('systolic', systolic);
        bodyFormData.append('diastolic', diastolic);
        bodyFormData.append('date', date);
        bodyFormData.append('time', time);

        // PUT request
        await axios.put(`http://127.0.0.1:8000/medprob/bps/${id}/`, 
                        bodyFormData, 
                       {headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'}
                       },
                       {withCredentials: true})
                       .then(response => {
                        console.log(response)
                        if (response.status == 200) {
                            setStatus(response.status)
                            setTimeout(() => { 
                                window.location.reload()
                            }, 1000);
                        } else {
                            setStatus(response.response.status)
                        }
                       });
    }

    return (
        <>
            {form ?
                <form className="BPForm" onSubmit={submit}>
                    <FormWrapper>
                        <h3>Edit BP reading: </h3>
                        <label>Systolic: </label>
                        <input
                            type='number'
                            name='systolic'
                            value={systolic}
                            required
                            max='300'
                            onChange={e => setSystolic(e.target.value)} />
                        <label>Diastolic:</label>
                        <input
                            type='number'
                            name='diastolic'
                            value={diastolic}
                            required
                            max='300'
                            onChange={e => setDiastolic(e.target.value)} />
                        <label>Date:</label>
                        <input
                            type='date'
                            name='date'
                            value={date}
                            onChange={e => setDate(e.target.value)} />
                        <label>Time:</label>
                        <input
                            type='time'
                            name='time'
                            value={time}
                            onChange={e => setTime(e.target.value)} />
                        <div>
                            <button type='button' onClick={() => setForm(false)}>Cancel</button>
                            <button type='submit'>Save</button>
                            <button type='button' onClick={deleteBP}>Delete</button>
                        </div>
                        {status == 200 ?
                            <p className='success'>Successfully updated.</p> : null}
                        {status == 204 ?
                            <p className='success'>Successfully deleted.</p> : null}
                        {status == 400 ?
                            <p className='failure'>Error processing request.</p> : null}
                    </FormWrapper>
                </form>

                : 
                <>
                    <OuterWrapper>
                        <div className="BPDetail">
                            <h3>BP Detail</h3>
                            <ul key={bp.id}>
                                <li>{bp.systolic}/{bp.diastolic}</li>
                                <li>{bp.date}</li><li>{bp.time}</li>
                                <li>{bp.user}</li>
                            </ul>
                        </div>
                    </OuterWrapper>
                    <button type='button' onClick={() => setForm(true)}>Edit</button>
                </>
            }
                
            
            
            
        </>
    )
}