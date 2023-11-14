import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavWrapper = styled.div`
    background-color: #1f2937;
    width: 16%;
    padding: 15px;
    color: #f5f5f4;
    border-right: 10px double white;

    .primary {
        font-size: 1.1rem;
    }

    .secondary {
        margin-left: 20px;
    }

    .true {
        color: #67e8f9;
        font-weight: 600;
        font-style: italic;
    }

    .false:hover {
        color: #67e8f9;
        padding: 2px 10px;
        font-size: 1.2rem;
    }

    .home {
        text-align: center;
        font-size: 1.3rem;
        color: #a5f3fc;
        font-weight: 600;
        border-bottom: 5px dotted;
        margin-bottom: 10px;
        padding-bottom: 7px;
    }
`

export default function LeftNav({currentPage}) {
    const [isOpen1, setIsOpen1] = useState(setOpen('bp'));
    const [isOpen2, setIsOpen2] = useState(setOpen('medlist'));

    const firstname = localStorage.getItem('first_name');

    function setOpen(page) {
        if (currentPage === page) {
            return true
        }
        return false
    }

    return (
        <NavWrapper>
            <div>
                <div className='home'>
                    <Link to="/userhome" className='manageLink'>{firstname}'s HealthHub</Link>
                </div>
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