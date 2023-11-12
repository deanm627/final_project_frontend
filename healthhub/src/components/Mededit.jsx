import { useState } from 'react';
import axios from "axios";

export const MedEdit = ({ med, newOrEdit, defaultEdit, newCancel }) => {
    const [name, setName] = useState(med.name);
    const [dose, setDose] = useState(med.dose);
    const [route, setRoute] = useState(med.route);
    const [freq, setFreq] = useState(med.freq);
    const [startDate, setStartDate] = useState(med.start_date_num);
    const [endDate, setEndDate] = useState(checkEndDate());
    const [assocMedProb, setAssocMedProb] = useState(med.assoc_medprob);
    const [note, setNote] = useState(med.note);
    const [status, setStatus] = useState('');
    const [edit, setEdit] = useState(defaultEdit);
    const [neworEdit, setNeworEdit] = useState(newOrEdit);

    function checkEndDate() {
        if (med.end_date_num) {
            return med.end_date_num;
        } else {
            return '';
        }  
    }
    
    const token = localStorage.getItem('access_token');

    const createNew = async e => {
        e.preventDefault();
        if (name === '' | dose === '' | route === '' | freq === '' | startDate === '') {
            alert('empty fields')
            return
        }

        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('dose', dose);
        bodyFormData.append('route', route);
        bodyFormData.append('freq', freq);
        bodyFormData.append('start_date_num', startDate);
        bodyFormData.append('start_date_str', startDate);
        bodyFormData.append('end_date_num', endDate);
        bodyFormData.append('end_date_str', endDate);
        bodyFormData.append('assoc_medprob', assocMedProb);
        bodyFormData.append('note', note);

        // Create the POST request
        await axios.post('http://127.0.0.1:8000/meds/meds/', bodyFormData, 
                       {headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'}
                       },
                       {withCredentials: true})
                       .then(response => {
                        console.log(response)
                        if (response.status == 201) {
                            setStatus(response.status)
                            window.location.reload()
                        } else {
                            setStatus(response.response.status)
                        }
                       });
    }

    const saveChange = async e => {
        e.preventDefault();
        if (name === '' | dose === '' | route === '' | freq === '' | startDate === '') {
            alert('empty fields')
            return
        }

        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('dose', dose);
        bodyFormData.append('route', route);
        bodyFormData.append('freq', freq);
        bodyFormData.append('start_date_num', startDate);
        bodyFormData.append('start_date_str', startDate);
        bodyFormData.append('end_date_num', endDate);
        bodyFormData.append('end_date_str', endDate);
        bodyFormData.append('assoc_medprob', assocMedProb);
        bodyFormData.append('note', note);

        // PUT request
        await axios.put(`http://127.0.0.1:8000/meds/meds/${med.id}/`,
            bodyFormData,
            {
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            },
            { withCredentials: true })
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    setStatus(response.status)
                    window.location.reload()
                    
                } else {
                    setStatus(response.response.status)
                }
            });
    }

    const deleteBP = async e => {
        e.preventDefault();

        await axios.delete(`http://127.0.0.1:8000/meds/meds/${med.id}/`,
            {
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            },
            { withCredentials: true })
            .then(response => {
                console.log(response)
                setStatus(response.status)
                if (response.status == 204) {
                    window.location.reload()
                }
            });
    }

    const handleCancel = () => {
        setEdit(false);
        setName(med.name);
        setDose(med.dose);
        setRoute(med.route);
        setFreq(med.freq);
        setStartDate(med.start_date_num);
        setEndDate('');
        if (med.end_date_num) {
            setEndDate(med.end_date_num);
        }
        setAssocMedProb(med.assoc_medprob);
        setNote(med.note);
    }

    return (
        <>
            {!edit 
            ? 
            <>
                <td>{med.name}</td>
                <td>{med.dose}</td>
                <td>{med.route}</td>
                <td>{med.freq}</td>
                <td>{med.start_date_str}</td>
                <td>{med.end_date_str}</td>
                <td>{med.assoc_medprob}</td>
                <td>{med.note}</td>
                <td>
                    {neworEdit 
                        ? null
                        : <button type='button' className='editButton' onClick={() => setEdit(true)}>Edit</button>
                    }
                </td>
            </> 
            : 
            <>
                {/* <td>
                    <input 
                            type='text'
                            id="rxterms"
                            name='name'
                            value={name}
                            required
                            placeholder='Name'
                            onChange={e => setName(e.target.value)} 
                            onSelect={(val) => setName(val)} />
                </td>
                <td>
                    <input 
                            type='text'
                            id="drug_strengths"
                            name='dose'
                            value={dose}
                            required
                            placeholder='Dose'
                            onChange={e => setDose(e.target.value)} />
                </td> */}
                
                <td>
                    <input 
                        type='text'
                        name='name'
                        value={name}
                        required
                        placeholder='Name'
                        onChange={e => setName(e.target.value)} />
                </td>
                <td>
                    <input
                        type='text'
                        name='dose'
                        value={dose}
                        required
                        placeholder='Dose'
                        onChange={e => setDose(e.target.value)} />
                </td>
                <td>
                    <input
                        type='text'
                        name='route'
                        value={route}
                        required
                        onChange={e => setRoute(e.target.value)} />
                </td>
                <td>
                    <input
                        type='text'
                        name='freq'
                        value={freq}
                        required
                        onChange={e => setFreq(e.target.value)} />
                </td>
                <td>
                    <input
                        type='date'
                        name='start_date'
                        value={startDate}
                        required
                        onChange={e => setStartDate(e.target.value)} />
                </td>
                <td>
                    <input
                        type='date'
                        name='end_date'
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)} />
                </td>
                <td>
                    <input
                        type='text'
                        name='assoc_medprob'
                        value={assocMedProb}
                        onChange={e => setAssocMedProb(e.target.value)} />
                </td>
                <td>
                    <input
                        type='text'
                        name='note'
                        value={note}
                        onChange={e => setNote(e.target.value)} />
                </td>
                <td>
                    {neworEdit 
                        ? null
                        : <button type='button' className='editButton' onClick={handleCancel}>Cancel</button>
                    }
                    {neworEdit 
                        ? <button type='submit' className='editButton' onClick={(e) => createNew(e)}>Save</button>
                        : <button type='submit' className='editButton' onClick={(e) => saveChange(e)}>Save</button>
                    }
                    {neworEdit 
                        ? <button type='button' className='editButton' onClick={newCancel}>Cancel</button>
                        : <button type='button' className='editButton' onClick={(e) => deleteBP(e)}>Delete</button>
                    }
                </td>
            </>
            }
        
            {/* 
                        {status == 201 ?
                            <p className='success'>BP reading successfully entered.</p> : null}
                        {status == 400 ?
                            <p className='failure'>An error occured.</p> : null}
                     */}
            
        </>
    )
}