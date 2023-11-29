import { useState } from 'react';
import axios from "axios";
import { MedModal } from './MedModal';

export const MedEdit = ({ med, newOrEdit, defaultEdit, newCancel, hideOrShowMed, hideOrShowNote, statusChange }) => {
    const [name, setName] = useState('');
    const [dose, setDose] = useState('');
    const [freq, setFreq] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [assocMedProb, setAssocMedProb] = useState('');
    const [note, setNote] = useState('');
    const [edit, setEdit] = useState(defaultEdit);
    const [neworEdit, setNeworEdit] = useState(newOrEdit);
    const [required, setRequired] = useState(['default', 'default', 'default', 'default']);
    const [modal, setModal] = useState(false);
    const [medOptions, setMedOptions] = useState([]);
    const [medDoseOptions, setMedDoseOptions] = useState([]);
    const [selectedMedDoseOptions, setSelectedMedDoseOptions] = useState([]);
    
    const token = localStorage.getItem('access_token');

    const createNew = async e => {
        e.preventDefault();

        if (name === '' | dose === '' | freq === '' | startDate === '') {
            fieldCheck();
            alert("Please enter all required fields");
            return;
        }

        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('dose', dose);
        bodyFormData.append('freq', freq);
        bodyFormData.append('start_date_num', startDate);
        bodyFormData.append('start_date_str', startDate);
        bodyFormData.append('end_date_num', endDate);
        bodyFormData.append('end_date_str', endDate);
        bodyFormData.append('assoc_medprob', assocMedProb);
        bodyFormData.append('note', note);

        await axios.post('http://127.0.0.1:8000/meds/meds/', bodyFormData, 
                       {headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'}
                       },
                       {withCredentials: true})
                       .then(response => {
                        console.log(response)
                        if (response.status == 201) {
                            {statusChange(response.status)};
                        } else {
                            {statusChange(response.response.status)};
                        }
                       });
    }

    const saveChange = async e => {
        e.preventDefault();

        if (name === '' | dose === '' | freq === '' | startDate === '') {
            fieldCheck();
            alert("Please enter all required fields");
            return;
        }

        const bodyFormData = new FormData();
        bodyFormData.append('name', name);
        bodyFormData.append('dose', dose);
        bodyFormData.append('freq', freq);
        bodyFormData.append('start_date_num', startDate);
        bodyFormData.append('start_date_str', startDate);
        bodyFormData.append('end_date_num', endDate);
        bodyFormData.append('end_date_str', endDate);
        bodyFormData.append('assoc_medprob', assocMedProb);
        bodyFormData.append('note', note);

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
                    {statusChange(response.status)};
                } else {
                    {statusChange(response.response.status)};
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
                statusChange(response.status)
                if (response.status == 204) {
                    window.location.reload()
                }
            });
    }

    const handleCancel = () => {
        setEdit(false);
        setName(med.name);
        setDose(med.dose);
        setFreq(med.freq);
        setStartDate(med.start_date_num);
        setAssocMedProb(med.assoc_medprob);
        setNote(med.note);
        setRequired(['default', 'default', 'default', 'default', 'default']);
        if (med.end_date_num) {
            setEndDate(med.end_date_num);
            return
        }
        setEndDate('');
    }

    const setValues = () => {
        setEdit(true);
        setName(med.name);
        setDose(med.dose);
        setFreq(med.freq);
        setStartDate(med.start_date_num);
        setAssocMedProb(med.assoc_medprob);
        setNote(med.note);
        if (med.end_date_num) {
            setEndDate(med.end_date_num);
            return
        }
        setEndDate('');
    }

    const fieldCheck = () => {
        const fields = [name, dose, freq, startDate];
        const newArr = [];
        fields.forEach((field, index) => {
            console.log(field, index)
            if (field === '') {
                newArr[index] = 'required';
            } else {
                newArr[index] = '';
            }
        })
        console.log(newArr);
        setRequired(newArr);
    }

    async function getMedResults() {
        try {
            await axios.get(`https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=${name}&ef=STRENGTHS_AND_FORMS`)
                .then(response => {
                    console.log(response);
                    setMedOptions(response.data[1]);
                    setMedDoseOptions(response.data[2]['STRENGTHS_AND_FORMS']);
            });
        } 
        catch (e) {
            console.error(e)
        }
    }

    function handleModal() {
        setModal(!modal);
        getMedResults();
    }

    function handleMedSelect(e, index) {
        const selected = medDoseOptions[index];
        setSelectedMedDoseOptions(selected);
        const selectedMed = medOptions[index];
        setName(selectedMed);
        setModal(!modal);
    }

    return (
        <>
            {!edit 
            ? 
            <>
                <tr className={`displayRow ${hideOrShowMed}`}>
                    <td>{med.name}</td>
                    <td>{med.dose}</td>
                    <td>{med.freq}</td>
                    <td>{med.start_date_str}</td>
                    <td>{med.end_date_str}</td>
                    <td>{med.assoc_medprob}</td>
                    <td>
                        {neworEdit 
                            ? null
                            : <button type='button' className='editButton' onClick={setValues}>Edit</button>
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
                {modal ?
                    <tr className='medModalDiv'>
                        <MedModal handleClick={handleModal} handleSelect={handleMedSelect} options={medOptions}/>
                    </tr>
                    : null
                }
                <tr className='editRow'>
                    <td className='flex items-center'>
                        <input 
                            type='text'
                            name='name'
                            className={required[0]}
                            value={name}
                            required
                            placeholder='Type then search'
                            onChange={e => setName(e.target.value)} />
                            <button className='flex items-center bg-white border-2 border-gray-800 rounded hover:bg-emerald-300' type='button' onClick={handleModal}><i className="material-icons">search</i></button>
                    </td>
                    <td>
                        <select name='dose' className={required[1]} value={dose} required onChange={e => setDose(e.target.value)} >
                            <option value=''>Select</option>
                            {selectedMedDoseOptions?.map((dose, index) => (
                                <option key={index} value={dose}>{dose}</option>
                            ))}
                        </select>
                    </td>
                    <td>
                        <select name='freq' className={required[2]} value={freq} required onChange={e => setFreq(e.target.value)} >
                            <option value=''></option>
                            <option value='once daily'>Once daily</option>
                            <option value='once nightly'>Once nightly</option>
                            <option value='twice daily'>Twice daily</option>
                            <option value='every 12 hours'>Every 12 hours</option>
                            <option value='three times daily'>Three times daily</option>
                            <option value='every 8 hours'>Every 8 hours</option>
                            <option value='four times daily'>Four times daily</option>
                            <option value='every 6 hours'>Every 6 hours</option>
                            <option value='other'>Other</option>
                        </select>
                    </td>
                    <td>
                        <input
                            type='date'
                            name='start_date'
                            className={required[3]}
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
        </>
    )
}