import { useState } from 'react';
import axios from "axios";
import { ProgressCircle } from './ProgressCircle';

export const MedModal = ({options, handleClick}) => {
    
    const [selected, setSelected] = useState('');

    

    return (
        <>
            <button className='bg-stone-100' type="button" onClick={handleClick}>X</button>
            {options?.map((option, index) => (
               <li key={index}>{option}</li> 
            ))}
        </>
    )
}