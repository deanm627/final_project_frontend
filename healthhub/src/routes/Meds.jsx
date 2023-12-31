import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { MedEdit } from "../components/Mededit";
import { ProgressCircle } from "../components/ProgressCircle";
import LeftNav from '../components/Nav/LeftNav';

const OuterWrapper = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 86%;

    th, tr {
        border-top: 1px solid;
    }    

    table {
        background-color: #f5f5f4;
        width: 100%;
        border-collapse: collapse;
    }

    tr {
        height: 40px;
    }

    td {
        text-align: center;
    }

    td.noteField textarea {
        vertical-align: top;
        margin-bottom: 10px;
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
        margin-bottom: 40px;
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

    input, select {
        border: 1px solid #1f2937;
        height: 30px;
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
        font-size: 3rem;
        font-weight: 200;
        text-align: center;
        text-shadow: #a5f3fc 1px 0 10px;
    }

    .hiddenOld, .hiddenNote {
        display: none;
    }

    .visibleOld {
        background-color: #d1d5db;
    }

    .visibleOld.visibleNote {
        background-color: #d1d5db;
    }

    .visibleNote {
        background-color: #f5f5f4;
        height: 50px;
        border-top: none;
    }

    .editRow {
        background-color: #0891b250;
        color: #083344;
    }

    .editRow:hover {
        background-color: #0891b250;
        color: #083344;
    }

    .editRow.editRowNote {
        border-top: none;
    }

    .editFieldButton {
        background-color: white;
        margin: 4px;
    }

    .editFieldButtons {
        display: flex;
    }

    .showNoteButtonDiv {
        margin-bottom: 10px;
        margin-left: 5px;
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

    .medModalDiv {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.6);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    @media (max-width: 900px) {
        width: 100%; 
        margin: 0;

        h1 {
            font-size: 2.7rem;
        }

        .pageLinks {
            width: 100%;
            margin-bottom: 20px;
        }

        .spinner {
            height: 200px;
        }
`

export default function Meds() {
    const [currentMeds, setCurrentMeds] = useState([]);
    const [oldMeds, setOldMeds] = useState([]);
    const [addNew, setAddNew] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showOld, setShowOld] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [status, setStatus] = useState('');

    const token = localStorage.getItem('access_token');
    const blankMed = {
        'name': '',
        'dose': '',
        'frequency': '',
        'start_date_num': '',
        'end_date_num': '',
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
        
        try {
            await axios.get('http://127.0.0.1:8000/meds/meds/', 
                { headers: 
                    {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'} })
                .then(response => {
                    console.log(response);
                    setCurrentMeds(response.data.current);
                    setOldMeds(response.data.old);
                    setLoading(false);
                });
        } catch (e) {
            console.error(e)
        }
    }

    function handleAddNew() {
        setAddNew(!addNew);
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
            <LeftNav currentPage='medlist' />
            <OuterWrapper>
                <h1>My Med List</h1>
                <div className="pageLinks">
                    {showOld 
                    ?   <button className='link leftLink' onClick={(e) => setShowOld(!showOld)}>Hide Prior Meds</button>
                    :   <button className='link leftLink' onClick={(e) => setShowOld(!showOld)}>Show Prior Meds</button>
                    }
                    <button 
                        type='button' 
                        className="link newValue"
                        onClick={handleAddNew}>
                        Add Medicine
                    </button>
                </div>
                <div className='showNoteButtonDiv'>
                    {showNotes
                    ?   <button type='button' className='editButton' onClick={(e) => setShowNotes(!showNotes)}>Hide Notes</button>
                    :   <button type='button' className='editButton' onClick={(e) => setShowNotes(!showNotes)}>Show Notes</button>
                    } 
                </div>
                <div>
                    {status == 201 ?
                        <div className='mb-4 text-emerald-700 text-xl text-center'>Medicine successfully entered.</div> : null}
                    {status == 200 ?
                        <div className='mb-4 text-emerald-700 text-xl text-center'>Medicine successfully updated.</div> : null}
                    {status == 400 ?
                        <div className='mb-4 text-rose-700 text-xl text-center'>An error occurred.</div> : null}
                </div>
                {loading  
                        ?   <div className="spinner flex justify-center items-center h-screen w-screen"><ProgressCircle /></div>
                        : 
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Dose</th>
                                        <th>Frequency</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Associated Medical Problems</th>
                                        <th></th>
                                    </tr>
                                </thead>    
                                <tbody>
                                    {addNew ?
                                        <MedEdit 
                                            med={blankMed} 
                                            newOrEdit={true} 
                                            defaultEdit={true} 
                                            newCancel={handleAddNew} 
                                            statusChange={handleStatus}/>
                                        : null
                                    }
                                    {currentMeds?.map((med, index) => (
                                        <MedEdit 
                                            med={med} 
                                            newOrEdit={false} 
                                            defaultEdit={false} 
                                            key={index} 
                                            hideOrShowNote={showNotes? 'visibleNote' : 'hiddenNote'} 
                                            statusChange={handleStatus}/>
                                    ))}
                                    {oldMeds?.map((med, index) => (
                                        <MedEdit 
                                            med={med} 
                                            newOrEdit={false} 
                                            defaultEdit={false} 
                                            key={index} 
                                            hideOrShowMed={showOld? 'visibleOld' : 'hiddenOld'} 
                                            hideOrShowNote={showNotes? 'visibleNote' : 'hiddenNote'} 
                                            statusChange={handleStatus}/>
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
                                        <td>Values: <strong>{showOld? (oldMeds.length + currentMeds.length) : currentMeds.length}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                }
            </OuterWrapper>
        </>
    )
}