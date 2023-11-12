import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { ProgressTriangle } from "../ProgressCircle";

const NavWrapper = styled.div`
    background-color: #1f2937;
    width: 16%;
    padding: 15px;
    color: #f5f5f4;

    .primary {
        font-size: 1.1rem;
    }

    .secondary {
        color: #4ade80;
        margin-left: 10px;
    }

    list-style-type: square;

    .manage {
        color: #a5f3fc;
        display: flex;
        justify-content: flex-end;
        margin-bottom: 15px;
        font-size: 0.8rem;
    }

    .manageLink:hover {
        background-color: #f5f5f4;
        color: #1f2937;
        font-size: 1rem;
    
    ProgressTriangle {
        background-color: blue;
    }
`

export default function RightNav({medprob}) {
    const [medList, setMedList] = useState([]);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        getMedList();
    }, []);

    async function getMedList() {
        setLoading(true);
        
        try {
            await axios.get(`http://127.0.0.1:8000/meds/meds/?medprob=${medprob}`, 
                { headers: 
                    {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'} })
                .then(response => {
                    console.log(response);
                    setMedList(response.data.results);
                    setLoading(false);
                });
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <NavWrapper>
            <div>
                <div className='manage'>
                    <Link to="/meds/" className='manageLink'>Manage</Link>
                </div>
                <details open>
                    <summary className='primary'>My BP Meds</summary>
                    {loading? <ProgressTriangle /> : null}
                    {medList?.map((med, index) => (
                        <li className='secondary' key={index}>{med.name}</li>
                    ))}
                </details>
            </div>
        </NavWrapper>
    )   
}