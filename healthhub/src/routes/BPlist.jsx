import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { BPedit } from '../components/BPedit';
import axios from "axios";
import styled from 'styled-components';
import { ProgressCircle } from "../components/ProgressCircle";

const OuterWrapper = styled.div`
    margin: 20px;
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
        border-bottom: 2px solid black;
    }

    .link {
        border: 2px solid rgba(255, 255, 255, 0.87);
        padding: 10px;
        margin-bottom: 10px;
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

    .pages {
        display: flex;
        justify-content: center;
        padding: 10px;
        margin-right: 10px;
    }

    .filterButton:disabled {
        display: none;
    }

    h1 {
        font-size: 2.5rem;
        font-weight: 500;
        text-align: center;
    }
`

export const BPlist = () => {
    const [listCount, setListCount] = useState('');
    const [nextUrl, setNextUrl] = useState('');
    const [previousUrl, setPreviousUrl] = useState('');
    const [pageNum, setPageNum] = useState(1);
    const [pageTotal, setPageTotal] = useState([]);
    const [filter1, setFilter1] = useState('');
    const [filter2, setFilter2] = useState('');
    const [bpsFiltered, setBpsFiltered] = useState([]);
    const [addNew, setAddNew] = useState(false);
    const [loading, setLoading] = useState(true);

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
                    setBpsFiltered(response.data.results);
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
                    setBpsFiltered(response.data.results);
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
                    setBpsFiltered(response.data.results);
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

    return (
        <>
            <OuterWrapper>
                <h1>BP Readings List</h1>
                <div className="pageLinks">
                    <Link to="/medprob/bp"><button className="link">BP Summary</button></Link>
                    {loading ? <ProgressCircle /> : null}
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
                    <button className='filterButton' type='submit'>Filter</button>
                    <button className='filterButton' type='submit' onClick={handleReset}>Reset</button>
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
                                <td>Values: <strong>{bpsFiltered.length} of {listCount}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
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
                </div>  
            </OuterWrapper>
        </>
    )
}