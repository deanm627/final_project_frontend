import { useState } from 'react';
import axios from "axios";
import styled from 'styled-components';

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;

    label {
        margin: 5px 0;
    }

    button {
        margin: 15px 0;
        width: 50%;
    }

    .success {
        color: green;
    }

    .failure {
        color: red;
    }
`

export default function UrlForm() {
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
        bodyFormData.append('date', date);
        bodyFormData.append('time', time);

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
                            setTimeout(() => { 
                                window.location.reload()
                            }, 2000);
                        } else {
                            setStatus(response.response.status)
                        }
                       });

       // Redirect after submission.      
    //    window.location.href = '/userhome'
        
        
    }

    return (
        <form className="BPForm" onSubmit={submit}>
                <FormWrapper>
                    <h3>Submit new BP reading: </h3>
                    <label>Systolic: </label>
                    <input 
                        type='number'
                        name='systolic'
                        value={systolic} 
                        required
                        max='300'
                        onChange={e => setSystolic(e.target.value)}/>
                    <label>Diastolic:</label>
                    <input 
                        type='number' 
                        name='diastolic'
                        value={diastolic} 
                        required
                        max='300'
                        onChange={e => setDiastolic(e.target.value)}/>
                    <label>Date:</label>
                    <input 
                        type='date' 
                        name='date'
                        value={date} 
                        onChange={e => setDate(e.target.value)}/>
                    <label>Time:</label>
                    <input 
                        type='time' 
                        name='time'
                        value={time} 
                        onChange={e => setTime(e.target.value)}/>
                    <button type='submit'>Submit</button>
                    { status == 201 ? 
                        <p className='success'>BP reading successfully entered.</p> : null}
                    { status == 400 ? 
                        <p className='failure'>An error occured.</p> : null}
                </FormWrapper>
         </form>
    )
}