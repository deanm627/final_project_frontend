import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavWrapper = styled.div`
    background-color: #e0f2fe;
    width: 15%;
    padding: 15px;
    border-right: 1px solid navy;


    .primary {
        font-size: 1.1rem;
    }

    .secondary {
        margin-left: 20px;
    }

    .true {
        color: #3b82f6;
        font-weight: 500;
    }
`

export default function LeftNav({currentPage}) {
    const [isOpen1, setIsOpen1] = useState(setOpen('bp'));
    const [isOpen2, setIsOpen2] = useState(setOpen('medlist'));

    function setOpen(page) {
        if (currentPage === page) {
            return true
        }
        return false
    }

    return (
        <NavWrapper>
            <div>
                <details open={isOpen1}>
                    <summary className='primary'>Medical Problems</summary>
                    <Link to="/medprob/bp" id='bp' className={`secondary ${isOpen1}`}>Blood Pressure</Link>
                </details>
                <details open={isOpen2}>
                    <summary className='primary'>Medications</summary>
                    <Link to="/meds/" id='medlist' className={`secondary ${isOpen2}`}>Med List</Link>
                </details>
            </div>
        </NavWrapper>
    )   
}