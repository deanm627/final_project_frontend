import { useState } from 'react';
import axios from "axios";

export const MedEdit = ({ med, newOrEdit, defaultEdit, newCancel, hideOrShowMed, hideOrShowNote }) => {
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
                <tr className={`displayRow ${hideOrShowMed}`}>
                    <td>{med.name}</td>
                    <td>{med.dose}</td>
                    <td>{med.route}</td>
                    <td>{med.freq}</td>
                    <td>{med.start_date_str}</td>
                    <td>{med.end_date_str}</td>
                    <td>{med.assoc_medprob}</td>
                    <td>
                        {neworEdit 
                            ? null
                            : <button type='button' className='editButton' onClick={() => setEdit(true)}>Edit</button>
                        }
                    </td>
                </tr> 
                {med.note? 
                    <tr className={`noteRow ${hideOrShowMed} ${hideOrShowNote}`}>
                        <td colSpan='8'><strong>Notes: </strong>{med.note}</td>
                    </tr>
                    : null}
            </>
            : 
            <>
                <tr className='editRow'>
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
                        <select name='route' value={route} required onChange={e => setRoute(e.target.value)} >
                            <option>Oral</option>
                            <option>Intramuscular</option>
                            <option>Other</option>
                        </select>
                    </td>
                    <td>
                        <select name='freq' value={freq} required onChange={e => setFreq(e.target.value)} >
                            <option>Once daily</option>
                            <option>Once nightly</option>
                            <option>Twice daily</option>
                            <option>Every 12 hours</option>
                            <option>Three times daily</option>
                            <option>Every 8 hours</option>
                            <option>Four times daily</option>
                            <option>Every 6 hours</option>
                            <option>Other</option>
                        </select>
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
                    <td className='editFieldButtons'>
                        {neworEdit 
                            ? null
                            : <button type='button' className='editButton editFieldButton' onClick={handleCancel}>Cancel</button>
                        }
                        {neworEdit 
                            ? <button type='submit' className='editButton editFieldButton' onClick={(e) => createNew(e)}>Save</button>
                            : <button type='submit' className='editButton editFieldButton' onClick={(e) => saveChange(e)}>Save</button>
                        }
                        {neworEdit 
                            ? <button type='button' className='editButton editFieldButton' onClick={newCancel}>Cancel</button>
                            : <button type='button' className='editButton editFieldButton' onClick={(e) => deleteBP(e)}>Delete</button>
                        }
                    </td>
                </tr>
                <tr className='editRow editRowNote'>
                    <td colSpan='8' className='noteField'>
                        <strong><label htmlFor='notes'>Notes: </label></strong>
                        <textarea rows='3' cols='50'
                            id='notes'
                            name='note'
                            value={note}
                            placeholder='Notes'
                            onChange={e => setNote(e.target.value)}></textarea>
                    </td>
                </tr>
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