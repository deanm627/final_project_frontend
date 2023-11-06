import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { BPedit } from '../components/BPedit';
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

    .range {
        margin: 0 0 25px 0;
    }

    .dateInput {
        margin: 0 5px;
    }
`

export const BPlist = () => {
    const [bps, setBps] = useState([]);
    const [filter1, setFilter1] = useState('');
    const [filter2, setFilter2] = useState('');
    const [bpsFiltered, setBpsFiltered] = useState([]);
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
            async function getBPData() {
                try {
                    await axios.get('http://127.0.0.1:8000/medprob/bps/', 
                        { headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'} })
                        .then(response => {
                            console.log(response);
                            setBps(response.data);
                            setBpsFiltered(response.data);
                        });
                } catch (e) {
                    console.error(e)
                }
            }

            getBPData();
        };
    }, []);

    async function getBPFilteredData(e) {
        e.preventDefault()

        try {
            await axios.get(`http://127.0.0.1:8000/medprob/bps/?date1=${filter1}&date2=${filter2}`, 
                { headers: 
                    {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'} })
                .then(response => {
                    console.log(response);
                    setBpsFiltered(response.data);
                });
        } catch (e) {
            console.error(e)
        }
    }

    function handleReset() {
        setFilter1('')
        setFilter2('')
        setBpsFiltered(bps)
    }

    function handleAddNew() {
        setAddNew(!addNew)
    }

    return (
        <>
            <OuterWrapper>
                <div className="pageLinks">
                    <Link to="/medprob/bp"><button className="link">BP Summary</button></Link>
                    <button 
                        type='button' 
                        className="link"
                        onClick={handleAddNew}>
                        Add BP reading
                    </button>
                </div>
                <form className='range' onSubmit={(e) => getBPFilteredData(e)}>
                    <label>Select new date range: </label>
                    <input 
                        className='dateInput' 
                        type='date' required 
                        value={filter1} 
                        onChange={e => setFilter1(e.target.value)} />
                    <input 
                        className='dateInput' 
                        type='date' required 
                        value={filter2} 
                        onChange={e => setFilter2(e.target.value)} />
                    <button type='submit'>Filter</button>
                    <button type='button' onClick={handleReset}>Reset</button>
                </form>
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
                            {addNew ?
                                <tr>
                                    <BPedit bp={blankBP} newOrEdit={true} defaultEdit={true} newCancel={handleAddNew}/>
                                </tr>
                                : null
                            }
                            {bpsFiltered?.map((bp, index) => (
                                <tr key={index}>
                                    <BPedit bp={bp} newOrEdit={false} defaultEdit={false} />
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Values: {bpsFiltered.length}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>  
            </OuterWrapper>
        </>
    )
}