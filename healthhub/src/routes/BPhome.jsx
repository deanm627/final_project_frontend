import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { BPedit } from '../components/BPedit';
import Barchart from '../components/Barchart';
import axios from "axios";
import styled from 'styled-components';

const OuterWrapper = styled.div`
    margin: 40px;
    display: flex;
    flex-direction: column;

    th, tr {
        border-bottom: 1px solid;
    }    

    table {
        width: 100%;
        border-collapse: collapse;
    }

    tr {
        height: 40px;
    }

    th {
        width: 25%;
    }

    td {
        text-align: center;
    }

    tr:hover {
        background-color: rgba(255, 255, 255, 0.87);
        color: black;
    }

    // tr:nth-child(even) {background-color: gray;}
    
    .pageLinks {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;
    }

    .link {
        border: 1px solid rgba(255, 255, 255, 0.87);
        padding: 10px;
    }

    .link:hover {
        background-color: rgba(255, 255, 255, 0.87);
        color: black;
    }

    .BPListTable {
        overflow-x: scroll;
        border-bottom: none;
    }

    .BPnumber {
        width: 30%;
        margin: 0 5px;
    }

    button {
        margin: 0 5px;
    }

    .chart {
        border: 2px solid black;
        height: 300px;
        width: 600px;
        display: flex;
        margin: 40px auto;
        background-color: #fafafa;
    }

    .chartsAMPM {
        margin-top: 40px;
        display: flex;
        justify-content: space-evenly;
    }

    .circle {
        width: 250px;
        height: 250px;
        line-height: 75px;
        border-radius: 50%;
        font-size: 50px;
        color: #030712;
        text-align: center;
        background: #fafafa;
        display: flex;
        flex-direction: column;
        align-items: center;
    }    

    .circle.am { 
        border: 3px solid #fde047;
    }

    .circle.pm { 
        border: 3px solid #881337;
    }

    .filterButton, .editButton {
        border: 1px solid black;
        border-radius: 5px;
        padding: 2px 8px;
    }

    .filterButton:hover, .editButton:hover {
        background-color: #1f2937;
        color: #f5f5f4;
    }

    input {
        border: 1px solid #1f2937;
    }
`

const InnerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;

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
        font-weight: 500;
        padding: 15px;
    }

    p {
        margin: 0;
        padding: 0;
    }

    .line {
        font-weight: 800;
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
    const [addNew, setAddNew] = useState(false);

    const token = localStorage.getItem('access_token');
    const blankBP = {
        'systolic': '',
        'diastolic': '',
        'date_num': '',
        'date_str': '',
        'time_num': '',
        'time_str': '',
    }

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
                            localStorage.setItem('first_name', response.data['first_name']);
                            localStorage.setItem('username', response.data['username']);
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

    function handleAddNew() {
        setAddNew(!addNew)
    }

    return (
        <>
            <OuterWrapper>
                <div className="pageLinks">
                    <Link to="/medprob/bplist"><button className="link">BP readings list</button></Link>
                    <button className="link" type='button' onClick={handleAddNew}>Enter new BP reading</button>
                </div>
                <div>
                    {addNew ? 
                        <div className="BPListTable">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Blood Pressure (mmHg)</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <BPedit bp={blankBP} newOrEdit={true} defaultEdit={true} newCancel={handleAddNew} />
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        : null}
                </div>
                <InnerWrapper>
                    <div className="BPHome">
                        <h3>Average Blood Pressure</h3>
                        <div className="display bg-gray-500">
                            <div className='valueSys text-stone-100 border-b-8 border-stone-100'>{bpSys}</div>
                            <div className='valueDia text-stone-100'>{bpDia}</div>
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
                            <button className='filterButton' type='submit'>Submit</button>
                        </form>
                    </div> 
                </InnerWrapper>
                <div className='chartsAMPM'>
                    <div className='circle am'>
                        <div className='border-b-4 border-gray-950 mt-12'>120</div>
                        <div>80</div>
                    </div>
                    <div className='circle pm'>
                    <div className='border-b-4 border-gray-950 mt-12'>120</div>
                        <div>80</div>
                    </div>
                </div>
                <div className='chart'>
                    <Barchart />
                </div>
            </OuterWrapper>
        </>
    )
}