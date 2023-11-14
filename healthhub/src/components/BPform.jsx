import { useState } from 'react';
import axios from "axios";
import styled from 'styled-components';

const FormWrapper = styled.div`
    height: 100%;
    width: 43%;
    display: flex;
    justify-content: center;
    background-color: gray;

    .BPForm {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
    }

    label {
        margin: 5px 0;
    }

    .formButton {
        width: 50%;
        background-color: #f5f5f4;
        border: 2px solid #030712;
        color: #030712;
        font-size: 1.1rem;
        font-weight: 400;
        border-radius: 5px;
        padding: 0 8px;
        margin-top: 5px;
    }

    button:hover {
        background-color: #1f2937;
        color: #f5f5f4;
    }

    .success {
        color: green;
    }

    .failure {
        color: red;
    }
`

export const BPform = () => {
    const [systolic, setSystolic] = useState('');
    const [diastolic, setDiastolic] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [status, setStatus] = useState('');

    const token = localStorage.getItem('access_token');

    const submit = async e => {
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
                        } else {
                            setStatus(response.response.status)
                        }
                       });
        
    }

    return (
        <FormWrapper>
            <form className="BPForm" onSubmit={submit}>
                <h3>Submit new BP reading: </h3>
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
                <button className='formButton' type='submit'>Submit</button>
                {status == 201 ?
                    <p className='success'>BP reading successfully entered.</p> : null}
                {status == 400 ?
                    <p className='failure'>An error occured.</p> : null}
            </form>
        </FormWrapper>
    )
}