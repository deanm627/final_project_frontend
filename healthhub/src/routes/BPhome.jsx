import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import BPForm from '../components/BPform';
import axios from "axios";
import styled from 'styled-components';

const OuterWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px auto;

    h3 {
        font-size: 2rem;
    }

    .display {
        border: 1px solid white;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 5rem;
        padding: 15px;
    }

    p {
        margin: 0;
        padding: 0;
    }

    .line {
        font-weight: 800;
    }

    .valueSys {
        border-bottom: 4px solid rgba(255, 255, 255, 0.87);
        
    }
`

export const BPHome = () => {
    const [bpSys, setBpSys] = useState([]);
    const [bpDia, setBpDia] = useState([]);
    const [count, setCount] = useState([]);
    const [oldestDate, setOldestDate] = useState([]);
    const [userInfo, setUserInfo] = useState([]);

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login'
        }
        else {
            async function getUserData() {
                try {
                    await axios.get('http://127.0.0.1:8000/accounts/login/', 
                        { headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'} })
                        .then(response => {
                            console.log(response);
                            setUserInfo(response.data);
                        })
                } catch (e) {
                    console.error(e)
                }
            }

            async function getBPData() {
                try {
                    await axios.get('http://127.0.0.1:8000/medprob/bp/', 
                        { headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'} })
                        .then(response => {
                            console.log(response);
                            setBpSys(Math.round(response.data['systolic__avg']));
                            setBpDia(Math.round(response.data['diastolic__avg']));
                            setCount(response.data['count']);
                            setOldestDate(response.data['date__min']);
                        });
                } catch (e) {
                    console.error(e)
                }
            }

            getUserData();
            getBPData();
        };
    }, []);

    return (
        <>
            <OuterWrapper>
                <div className="BPHome">
                    <h3>{userInfo.first_name}'s Blood Pressure</h3>
                    <div className="display">
                        <p className='valueSys'>{bpSys}</p>
                        <p className='valueDia'>{bpDia}</p>
                    </div>
                    <div>
                        <p>Average BP calculated from <strong>{count}</strong> values since <strong>{oldestDate}</strong></p>
                    </div>
                </div> 
                {/* <BPForm /> */}
            </OuterWrapper>
        </>
    )
}