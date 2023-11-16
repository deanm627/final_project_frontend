import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Barchart from '../components/Barchart';
import axios from "axios";
import styled from 'styled-components';
import { ProgressCircle } from "../components/ProgressCircle";
import LeftNav from '../components/Nav/LeftNav';
import RightNav from '../components/Nav/RightNav';
import { BPform } from "../components/BPform";

const OuterWrapper = styled.div`
    margin: 20px;
    display: flex;
    flex-direction: column;
    width: 72%;
    
    .pageLinks {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
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

    .BPnumber {
        width: 30%;
        margin: 0 5px;
    }

    button {
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

    input {
        border: 1px solid #1f2937;
    }

    h3 {
        text-align: center;
        font-size: 2rem;
        font-weight: 500;
    }

    h1 {
        font-size: 3rem;
        font-weight: 200;
        text-align: center;
        text-shadow: #a5f3fc 1px 0 10px;
    }

    .editRow {
        background-color: #0891b250;
        color: #083344;
    }

    .editRow:hover {
        background-color: #0891b250;
        color: #083344;
    }

    .default {
        border: 2px solid #3b82f6;
    }

    .required {
        border: 2px solid #f43f5e;
    }

    .bpFormDiv {
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
        margin: 10px 0;

        .pageLinks {
            width: 100%;
            margin-top: 10px;
        }
    }
`

const InnerWrapper = styled.div`
    display: flex;
    flex-direction: column;

    .subtitleDiv {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
    }

    h3.subtitle {
        font-size: 2.2rem;
        text-align: center;
    }

    .display {
        background: linear-gradient(0.25turn, #0891b2, white, #0891b2);
        color: #030712;
        border: 3px solid #0891b2;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 5rem;
        font-weight: 500;
        padding: 15px;
    }

    p {
        margin: 0;
        padding: 0;
    }

    .line {
        font-weight: 800;
    }

    .data {
        margin-bottom: 20px;
    }

    select {
        margin: 0 3px;
        border: 1px solid #1f2937;
        height: 30px;
    }

    .dataDisplay {
        display: flex;
        justify-content: space-evenly;
    }

    .circle {
        width: 200px;
        height: 200px;
        line-height: 48px;
        border-radius: 50%;
        font-size: 50px;
        color: #030712;
        text-align: center;
        background-color: #fafafa;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0 0 10px gray;
    }    

    .circle.am { 
        border: 4px solid #fde047;
    }

    .circle.pm { 
        border: 4px solid #881337;
    }

    .formDiv {
        display: flex;
        justify-content: center;
        margin-bottom: 10px;
        margin-top: 10px;
        font-size: 1.15rem;
        font-weight: 500;
    }

    .form {
        display: flex;
    }

    select {
        border: 1px solid #1f2937;
    }

    .spinner {
        margin-top: 200px;
        height: 100%;
        width: 100%;
    }

    @media (max-width: 900px) {
        .subtitleDiv {
            margin-bottom: 5px;
        }
    
        h3.subtitle {
            font-size: 1.8rem;
        }

        .form {
            display: flex;
            flex-direction: column;
        }

        .formDiv {
            margin-bottom: 5px;
            margin-top: 0;
            font-size: 1.2rem;
            font-weight: 500;
        }

        .formSelect {
            display: flex;
            justify-content: center;
        }

        .filterButtonDiv {
            display: flex;
            justify-content: center;
            margin-top: 8px;
            margin-bottom: 8px;
        }

        .dataDisplay {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        h3 {
            font-size: 1.5rem;
        }

        .display {
            margin: 8px;
            margin-top: 15px;
        }
        
        .caption {
            font-size: 0.9rem;
        }

        .circle.am {
            margin-bottom: 8px;
        }

        .spinner {
            height: 200px;
        }
    }

    
`

export const BPHome = () => {
    const [bpAvgAll, setBpAvgAll] = useState('');
    const [bpAvgAM, setBpAvgAM] = useState('');
    const [bpAvgPM, setBpAvgPM] = useState('');
    const [chartData, setChartData] = useState('');
    const [rangeNum, setRangeNum] = useState('');
    const [rangeType, setRangeType] = useState('');
    const [loading, setLoading] = useState(true);
    const [showChart, setShowChart] = useState(false);
    const [modal, setModal] = useState(false);

    const token = localStorage.getItem('access_token');
    const blankBP = {
        'systolic': '',
        'diastolic': '',
        'date_num': '',
        'date_str': '',
        'time_num': '',
        'time_str': '',
    }

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login'
        }
        else {
            getBPData();
        };
    }, []);

    async function getBPData() {
        try {
            await axios.get('http://127.0.0.1:8000/medprob/bp/', 
                { headers: 
                    {'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'} })
                .then(response => {
                    console.log(response);
                    setBpAvgAll(response.data['all']);
                    setBpAvgAM(response.data['am']);
                    setBpAvgPM(response.data['pm']);
                    setLoading(false);
                });
        } catch (e) {
            console.error(e)
        }
    }

    const submitDateRange = async e => {
        e.preventDefault();
        setLoading(true);
        setShowChart(false);

        await axios.get(`http://127.0.0.1:8000/medprob/bp/?num=${rangeNum}&type=${rangeType}`, 
                       {headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'}
                       }).then(response => {
                        console.log(response)
                        if (response.status == 200) {
                            setBpAvgAll(response.data['all']);
                            setBpAvgAM(response.data['am']);
                            setBpAvgPM(response.data['pm']);
                            setChartData(response.data['data_chart']);
                            console.log(response.data['data_chart']);
                            setLoading(false);
                            setShowChart(true);
                        } else {
                            alert(response.data);
                        }
                       });
    }

    function handleChange(e, type) {
        setShowChart(false);
        if (type === 'num') {
            setRangeNum(e.target.value);
            return
        }
        setRangeType(e.target.value);
    }

    function handleReset() {
        setRangeNum('');
        setRangeType('');
        setLoading(true);
        getBPData();
    }

    function handleModal(e, refresh) {
        setModal(!modal)
        if (refresh) {
            window.location.reload();
        };
    }

    return (
        <>
            <LeftNav currentPage='bp' />
            <OuterWrapper>
                <h1>BP Summary</h1>
                <div className="pageLinks">
                    <Link to="/medprob/bplist"><button className="link leftLink">BP readings list</button></Link>
                    <button className="link newValue" type='button' onClick={(e) => handleModal(e, false)}>Enter new BP reading</button>
                </div>
                {modal 
                    ?   <div className='bpFormDiv'>
                            <BPform handleModal={handleModal} refreshScreen={true} />
                        </div>
                    :   null
                }
                <InnerWrapper>
                    {loading  
                        ?   <div className="spinner flex justify-center items-center h-screen w-screen"><ProgressCircle /></div>
                        : 
                        <>
                            <div className='subtitleDiv'>
                                <h3 className='subtitle'>Average Blood Pressure</h3>
                            </div>
                            <div className='formDiv'>
                                <form className='form' onSubmit={submitDateRange}>
                                    <label>Select data from last: </label>
                                    <div className='formSelect'>
                                        <select value={rangeNum} onChange={(e) => handleChange(e, 'num')} required >
                                            <option value=''></option>
                                            <option value='1'>1</option>
                                            <option value='2'>2</option>
                                            <option value='3'>3</option>
                                            <option value='4'>4</option>
                                            <option value='5'>5</option>
                                            <option value='6'>6</option>
                                            <option value='7'>7</option>
                                            <option value='8'>8</option>
                                            <option value='9'>9</option>
                                            <option value='10'>10</option>
                                            <option value='11'>11</option>
                                            <option value='12'>12</option>
                                        </select>
                                        <select value={rangeType} onChange={(e) => handleChange(e, 'type')} required >
                                            <option value=''></option>
                                            {rangeNum == 1 
                                                ?
                                                <>
                                                    <option value='Day'>day</option>
                                                    <option value='Week'>week</option>
                                                    <option value='Month'>month</option>
                                                    <option value='Year'>year</option>
                                                </>
                                                :   
                                                <>
                                                    <option value='Day'>days</option>
                                                    <option value='Week'>weeks</option>
                                                    <option value='Month'>months</option>
                                                    <option value='Year'>years</option>
                                                </>
                                            }
                                            
                                        </select>
                                    </div>
                                    <div className='filterButtonDiv'>
                                        <button className='filterButton' type='submit'>Submit</button>
                                        <button className='filterButton' type='submit' onClick={handleReset}>Reset</button>
                                    </div> 
                                </form>
                            </div> 
                            <div className='dataDisplay'>
                                <div className='chartsAMPM'>
                                    <div>
                                        <h3>AM</h3>
                                        <div className='circle am'>
                                            <div className='border-b-4 border-gray-950 mt-12'>{bpAvgAM.sys_avg}</div>
                                            <div>{bpAvgAM.dia_avg}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="chartMain">
                                    <div className="display">
                                        <div className='valueSys border-b-8 border-gray-950'>{bpAvgAll.sys_avg}</div>
                                        <div className='valueDia '>{bpAvgAll.dia_avg}</div>
                                    </div>
                                    <div className="data">
                                        <p className='caption'>mmHg. Calculated from <strong>{bpAvgAll.count}</strong> values since <strong>{bpAvgAll.first_date}</strong></p>
                                    </div>
                                </div>
                                <div className='chartsAMPM'>
                                    <div>
                                        <h3>PM</h3>
                                        <div className='circle pm'>
                                            <div className='border-b-4 border-gray-950 mt-12'>{bpAvgPM.sys_avg}</div>
                                            <div>{bpAvgPM.dia_avg}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </InnerWrapper>
                {showChart? <Barchart dataset={chartData} timeInterval={rangeType} /> : null }
            </OuterWrapper>
            <RightNav medprob='bp' />
        </>
    )
}