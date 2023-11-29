import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { BPedit } from '../components/BPedit';
import axios from "axios";
import styled from 'styled-components';
import { ProgressCircle } from "../components/ProgressCircle";
import LeftNav from '../components/Nav/LeftNav';
import RightNav from '../components/Nav/RightNav';

const OuterWrapper = styled.div`
    margin: 20px;
    width: 72%;
    display: flex;
    flex-direction: column;

    th, tr {
        border-bottom: 1px solid;
    }    

    table {
        background-color: #f5f5f4;
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

    .displayRow:hover {
        background-color: #ddd;
    }

    thead, tfoot {
        background-color: #9ca3af;
    }
    
    .pageLinks {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        border-bottom: 2px solid #030712;
    }

    .link {
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 10px;
    }

    .leftLink {
        background-color: #f5f5f4;
        border: 3px solid #030712;
        font-weight: 600;
        box-shadow: 5px 5px 5px gray;
    }

    .leftLink:hover {
        background-color: #1f2937;
        color: #f5f5f4;
    }

    .newValue {
        border: 3px solid rgba(255, 255, 255, 0.87);
        background-color: #4ade80;
        color: #064e3b;
        font-weight: 700;
        box-shadow: 5px 5px 5px gray;
    }

    .newValue:hover {
        background-color: rgba(255, 255, 255, 0.87);
        color: black;
    }

    .BPnumber {
        width: 30%;
        margin: 0 5px;
    }

    button {
        margin: 0 5px;
    }

    .range {
        display: flex;
        margin: 0 0 25px 0;
        font-size: 1.15rem;
        font-weight: 500;
    }

    .dateInput {
        margin: 0 5px;
    }

    .filterButton, .editButton {
        background-color: #f5f5f4;
        border: 2px solid #030712;
        color: #030712;
        font-size: 1.1rem;
        font-weight: 400;
        border-radius: 5px;
        padding: 0 8px;
    }

    .filterButton:hover, .editButton:hover {
        background-color: #1f2937;
        color: #f5f5f4;
    }

    input {
        border: 1px solid #1f2937;
        height: 30px;
    }

    .pages {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        margin-right: 10px;
        font-weight: 500;
        font-size: 1.15rem;
    }

    .filterButton:disabled {
        display: none;
    }

    h1 {
        font-size: 3rem;
        font-weight: 200;
        text-align: center;
        text-shadow: #a5f3fc 1px 0 10px;
    }

    .editRow {
        background-color: #0891b250;
        color: #083344;
    }

    .editRow:hover {
        background-color: #0891b250;
        color: #083344;
    }

    .default {
        border: 2px solid #3b82f6;
    }

    .required {
        border: 2px solid #f43f5e;
    }

    .spinner {
        display: flex;
        align-items: center;
        height: 50%;
        width: 100%;
    }

    @media (max-width: 900px) {
        width: 100%; 
        margin: 0;
        padding: 10px;

        h1 {
            font-size: 2.7rem;
        }

        .pageLinks {
            width: 100%;
            margin-bottom: 20px;
        }

        .range {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .range label {
            margin-bottom: 8px;
        }

        .rangeButtons {
            margin-top: 8px;
        }

        .spinner {
            height: 200px;
        }
    }
`

export const BPlist = () => {
    const [listCount, setListCount] = useState('');
    const [nextUrl, setNextUrl] = useState('');
    const [previousUrl, setPreviousUrl] = useState('');
    const [pageNum, setPageNum] = useState(0);
    const [pageTotal, setPageTotal] = useState([]);
    const [filter1, setFilter1] = useState('');
    const [filter2, setFilter2] = useState('');
    const [bps, setBps] = useState([]);
    const [addNew, setAddNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');

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
            getBPData();
        };
    }, []);

    async function getBPData() {
        setPageNum(1);
        setPageTotal([]);
        
        try {
            await axios.get('http://127.0.0.1:8000/medprob/bps/', 
                { headers: 
                    {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'} })
                .then(response => {
                    console.log(response);
                    setListCount(response.data.count);
                    setPageTotal(Math.ceil(response.data.count/10));
                    setNextUrl(response.data.next);
                    setPreviousUrl(response.data.previous);
                    setBps(response.data.results);
                    setLoading(false);
                });
        } catch (e) {
            console.error(e)
        }
    }

    async function getBPFilteredData(e) {
        e.preventDefault()
        setLoading(true);
        setPageNum(1);
        setPageTotal([]);

        try {
            await axios.get(`http://127.0.0.1:8000/medprob/bps/?date1=${filter1}&date2=${filter2}`, 
                { headers: 
                    {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'} })
                .then(response => {
                    console.log(response);
                    setListCount(response.data.count);
                    setPageTotal(Math.ceil(response.data.count/10));
                    setNextUrl(response.data.next);
                    setPreviousUrl(response.data.previous);
                    setBps(response.data.results);
                    setLoading(false);
                });
        } catch (e) {
            console.error(e)
        }
    }

    async function getPageData(e, url) {
        e.preventDefault()

        try {
            await axios.get(url, 
                { headers: 
                    {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'} })
                .then(response => {
                    console.log(response);
                    setListCount(response.data.count);
                    setPageTotal(Math.ceil(response.data.count/10));
                    setNextUrl(response.data.next);
                    setPreviousUrl(response.data.previous);
                    setBps(response.data.results);
                    setLoading(false);
                });
        } catch (e) {
            console.error(e)
        }
    }

    function handleReset() {
        setFilter1('');
        setFilter2('');
        setLoading(true);
        getBPData();
    }

    function handleAddNew() {
        setAddNew(!addNew);
    }

    function handlePrevious(e) {
        setLoading(true);
        setPageNum(pageNum - 1);
        getPageData(e, previousUrl);
    }

    function handleNext(e) {
        setLoading(true);
        setPageNum(pageNum + 1);
        getPageData(e, nextUrl);
    }

    function handleStatus(status) {
        if (status == 201 || status == 200) {
            setStatus(status);
            setTimeout(() => { 
                window.location.reload()
            }, 1500);
        } else {
            setStatus(status);
        }
    }

    return (
        <>
            <LeftNav currentPage='bp' />
            <OuterWrapper>
                <h1>BP Readings List</h1>
                <div className="pageLinks">
                    <Link to="/medprob/bp"><button className="link leftLink">BP Summary</button></Link>
                    <button 
                        type='button' 
                        className="link newValue"
                        onClick={handleAddNew}>
                        Add BP reading
                    </button>
                </div>
                <form className='range' onSubmit={(e) => getBPFilteredData(e)}>
                    <label>Select new date range: </label>
                    <div>
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
                    </div>
                    <div className="rangeButtons">
                        <button className='filterButton' type='submit'>Filter</button>
                        <button className='filterButton' type='submit' onClick={handleReset}>Reset</button>
                    </div>
                </form>
                <div>
                    {status == 201 ?
                        <div className='mb-4 text-emerald-700 text-xl text-center'>BP successfully entered.</div> : null}
                    {status == 200 ?
                        <div className='mb-4 text-emerald-700 text-xl text-center'>BP successfully updated.</div> : null}
                    {status == 400 ?
                        <div className='mb-4 text-rose-700 text-xl text-center'>An error occurred.</div> : null}
                </div>
                {loading  
                    ?   <div className="spinner flex justify-center items-center h-screen w-screen"><ProgressCircle /></div>
                    : 
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
                                    <BPedit 
                                        bp={blankBP} 
                                        newOrEdit={true} 
                                        defaultEdit={true} 
                                        newCancel={handleAddNew}
                                        statusChange={handleStatus} />
                                    : null
                                }
                                {bps?.map((bp, index) => (
                                    <BPedit 
                                        key={index} 
                                        bp={bp} 
                                        newOrEdit={false} 
                                        defaultEdit={false}
                                        statusChange={handleStatus} />
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><strong>{bps.length} of {listCount}</strong></td>
                                </tr>
                            </tfoot>
                        </table>
                    }
                    {bps.length > 0 ? 
                        <div className='pages'>
                            <button 
                                type='submit' 
                                className='filterButton' 
                                value={previousUrl}
                                onClick={(e) => handlePrevious(e)}
                                disabled={pageNum === 1}
                                >Previous</button>
                            <div>Page {pageNum} of {pageTotal} </div>
                            <button 
                                type='submit' 
                                className='filterButton' 
                                value={nextUrl}
                                onClick={(e) => handleNext(e)}
                                disabled={pageNum === pageTotal}
                                >Next</button>
                        </div>
                        : null
                    }
            </OuterWrapper>
            <RightNav medprob='bp' />
        </>
    )
}