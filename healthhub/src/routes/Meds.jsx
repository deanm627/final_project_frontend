import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import MedListAPI from '../components/MedListAPI';
import styled from 'styled-components';
import axios from 'axios';
import { MedEdit } from "../components/Mededit";
import { ProgressCircle } from "../components/ProgressCircle";
import LeftNav from '../components/Nav/LeftNav';

const OuterWrapper = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;

    th {
        width: 10%;
    }

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

    .MedListTable {
        overflow-x: scroll;
        border-bottom: none;
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

    .hidden {
        display: none;
    }

    .old {
        background-color: #9ca3af;
    }
`

export default function Meds() {
    const [listCount, setListCount] = useState('');
    const [nextUrl, setNextUrl] = useState('');
    const [previousUrl, setPreviousUrl] = useState('');
    const [pageNum, setPageNum] = useState(1);
    const [pageTotal, setPageTotal] = useState([]);
    const [meds, setMeds] = useState([]);
    const [addNew, setAddNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showOld, setShowOld] = useState(false);

    const token = localStorage.getItem('access_token');
    const blankMed = {
        'name': '',
        'dose': '',
        'route': '',
        'frequency': '',
        'start_date': '',
        'end_date': '',
        'assoc_medprob': '',
        'note': '',
    }

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login'
        }
        else {
            getMedData();
        };
    }, []);

    async function getMedData() {
        setPageNum(1);
        setPageTotal([]);
        
        try {
            await axios.get('http://127.0.0.1:8000/meds/meds/', 
                { headers: 
                    {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'} })
                .then(response => {
                    console.log(response);
                    setListCount(response.data.count);
                    setPageTotal(Math.ceil(response.data.count/10));
                    setNextUrl(response.data.next);
                    setPreviousUrl(response.data.previous);
                    setMeds(response.data.results);
                    setLoading(false);
                });
        } catch (e) {
            console.error(e)
        }
    }

    async function getPageData(e, url) {
        e.preventDefault()

        console.log(url)

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
                    setMeds(response.data.results);
                    setLoading(false);
                });
        } catch (e) {
            console.error(e)
        }
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
            <LeftNav currentPage='medlist' />
            <OuterWrapper>
                <h1>My Med List</h1>
                <div className="pageLinks">
                    {showOld 
                    ?   <button className='link' onClick={(e) => setShowOld(!showOld)}>Hide Prior Meds</button>
                    :   <button className='link' onClick={(e) => setShowOld(!showOld)}>Show Prior Meds</button>
                    }
                    
                    {loading ? <ProgressCircle /> : null}
                    <button 
                        type='button' 
                        className="link"
                        onClick={handleAddNew}>
                        Add Medicine
                    </button>
                </div>
                <div className="MedListTable">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Dose</th>
                                <th>Route</th>
                                <th>Frequency</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Associated Medical Problems</th>
                                <th>Notes</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {addNew ?
                                <tr>
                                    <MedEdit med={blankMed} newOrEdit={true} defaultEdit={true} newCancel={handleAddNew}/>
                                </tr>
                                : null
                            }
                            {meds?.map((med, index) => (
                                med.end_date_num?
                                    <tr key={index} className={showOld? 'old' : 'hidden'}>
                                        <MedEdit med={med} newOrEdit={false} defaultEdit={false} />
                                    </tr>
                                : 
                                    <tr key={index}>
                                        <MedEdit med={med} newOrEdit={false} defaultEdit={false} />
                                    </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Values: <strong>{meds.length} of {listCount}</strong></td>
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
            {/* <MedListAPI /> */}
        </>
    )
}