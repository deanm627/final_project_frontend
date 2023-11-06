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

    .link a {
        color: black;
    }

    .link:hover {
        background-color: rgba(255, 255, 255, 0.87);
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

    function handleFilter(e) {
        e.preventDefault()

        if (filter1 > filter2) {
            const result = bps.filter((bp) => bp.date_num <= filter1 && bp.date_num >= filter2);
            setBpsFiltered(result);
            return;
        }
        if (filter2 > filter1) {
            const result = bps.filter((bp) => bp.date_num <= filter2 && bp.date_num >= filter1);
            setBpsFiltered(result);
            return;
        }
        if (filter1 === filter2) {
            const result = bps.filter((bp) => bp.date_num === filter1);
            setBpsFiltered(result);
            return;
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
                    <button className="link"> 
                        <Link to="/medprob/bp">BP Summary</Link>
                    </button>
                    <button 
                        type='button' 
                        className="link"
                        onClick={handleAddNew}>
                        Add BP reading
                    </button>
                </div>
                <form onSubmit={(e) => handleFilter(e)}>
                    <label>Select new date range: </label>
                    <input type='date' value={filter1} onChange={e => setFilter1(e.target.value)} />
                    <input type='date' value={filter2} onChange={e => setFilter2(e.target.value)} />
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
                                <td>{bpsFiltered.length} values</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>  
            </OuterWrapper>
        </>
    )
}