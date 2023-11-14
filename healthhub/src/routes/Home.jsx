import { Link } from 'react-router-dom';
import { ProgressCircle } from "../components/ProgressCircle";
import LeftNav from '../components/Nav/LeftNav';
import styled from 'styled-components';
import { BPform } from '../components/BPform';

const OuterWrapper = styled.div`
    width: 86%;

    .h1Div {
        font-size: 5rem;
        font-weight: 200;
        text-align: center;
        margin-top: 150px;
        margin-bottom: 50px;
        text-shadow: #a5f3fc 1px 0 10px;
    }

    .h2Div {
        font-size: 1.8rem;
        text-align: center;
        margin-bottom: 20px;
        font-weight: 600;
    }

    .buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .button {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.4rem;
        font-weight: 250;
        height: 80px;
        width: 25%;
        background-color: #f5f5f4;
        margin-bottom: 20px;
        border-radius: 5px;
        border: 3px solid #030712;
        box-shadow: 5px 5px 5px gray;
    }

    .button:hover {
        border: 3px solid rgba(255, 255, 255, 0.87);
        background-color: #4ade80;
        color: #064e3b;
        font-weight: 700;
    }

    .bpFormDiv {
        display: flex;
        justify-content: center;
    }
`

export default function Home() {
    const firstname = localStorage.getItem('first_name');

    return (
        <>
            <LeftNav currentPage='home' />
            <OuterWrapper>
                <div className='h1Div'>
                    <h1>{firstname}'s HealthHub</h1>
                </div>
                <div className='h2Div'>
                    <h2>Frequent Activities:</h2>
                </div>
                <div className='buttons'>
                    <Link to="/medprob/bp" className='button'>Blood Pressure Summary</Link>
                    <Link to="/meds/" className='button'>My Med List</Link>
                    <button className='button'>Add BP reading</button>
                </div>
                <div className='bpFormDiv'>
                    {/* <BPform /> */}
                </div>
            </OuterWrapper>
        </>
    )
}