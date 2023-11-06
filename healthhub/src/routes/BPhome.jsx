import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { BPform } from '../components/BPform';
import axios from "axios";
import styled from 'styled-components';

const OuterWrapper = styled.div`
    display: flex;
    flex-direction: column;

    .form {
        width: 30%;
    }
`

const InnerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px auto;

    h3 {
        font-size: 2rem;
        text-align: center;
    }

    .display {
        border: 1px solid white;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 5rem;
        padding: 15px;
    }

    p {
        margin: 0;
        padding: 0;
    }

    .line {
        font-weight: 800;
    }

    .valueSys {
        border-bottom: 4px solid rgba(255, 255, 255, 0.87);
        
    }

    .data {
        margin-bottom: 20px;
    }
`

export const BPHome = () => {
    const [bpSys, setBpSys] = useState('');
    const [bpDia, setBpDia] = useState('');
    const [count, setCount] = useState('');
    const [oldestDate, setOldestDate] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const [form, setForm] = useState(false);

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login'
        }
        else {
            
            async function getUserData() {
                try {
                    await axios.get('http://127.0.0.1:8000/accounts/login/', 
                        { headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'} })
                        .then(response => {
                            console.log(response);
                            setUserInfo(response.data);
                        })
                } catch (e) {
                    console.error(e)
                }
            }

            async function getBPData() {
                try {
                    await axios.get('http://127.0.0.1:8000/medprob/bp/', 
                        { headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'} })
                        .then(response => {
                            console.log(response);
                            setBpSys(response.data['sys_avg']);
                            setBpDia(response.data['dia_avg']);
                            setCount(response.data['count']);
                            setOldestDate(response.data['first_date']);
                        });
                } catch (e) {
                    console.error(e)
                }
            }

            getUserData();
            getBPData();
        };
    }, []);

    const submitDateRange = async e => {
        e.preventDefault();

        const days = {days: {dateRange}}

        console.log(days)

        await axios.get(`http://127.0.0.1:8000/medprob/bp/?days=${dateRange}`, 
                       {headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'}
                       }).then(response => {
                        console.log(response)
                        if (response.status == 200) {
                            setBpSys(response.data['sys_avg']);
                            setBpDia(response.data['dia_avg']);
                            setCount(response.data['count']);
                            setOldestDate(response.data['first_date']);
                        } else {
                            // some error handling here
                        }
                       });
    }

    return (
        <>
            <OuterWrapper>
                <InnerWrapper>
                <div className="BPHome">
                    <h3>Average Blood Pressure</h3>
                    <div className="display">
                        <p className='valueSys'>{bpSys}</p>
                        <p className='valueDia'>{bpDia}</p>
                    </div>
                    <div className="data">
                        <p>mmHg. Calculated from <strong>{count}</strong> values since <strong>{oldestDate}</strong></p>
                    </div>
                    <form onSubmit={submitDateRange}>
                        <label>Select new date range: </label>
                        <select value={dateRange} onChange={e => setDateRange(e.target.value)}>
                            <option>-----</option>
                            <option value='7'>1 week</option>
                            <option value='14'>2 weeks</option>
                            <option value='30'>1 month</option>
                            <option value='90'>3 months</option>
                            <option value='180'>6 months</option>
                            <option value='270'>9 months</option>
                            <option value='365'>1 year</option>
                        </select>
                        <button type='submit'>Submit</button>
                    </form>
                </div> 
                </InnerWrapper>
                <div className='form'>
                    <button type='button' onClick={() => setForm(!form)}>Enter new BP reading</button>
                    {form ? <BPform /> : null}
                </div>
                <div>
                    <Link to="/medprob/bplist">BP readings list</Link>
                </div>
            </OuterWrapper>
        </>
    )
}