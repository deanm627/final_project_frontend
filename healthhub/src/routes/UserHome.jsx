import { useEffect, useState } from "react";
import BPForm from '../components/BPform';
import axios from "axios";
import styled from 'styled-components';

const OuterWrapper = styled.div`
    display: flex;
    margin: 30px auto;
    
    .BPList {
        width: 60%;
    }
`

// Define the Login function.
export const UserHome = () => {
    const [bps, setBps] = useState([]);
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
                            console.log(response.data);
                            setUserInfo(response.data);
                        })
                } catch (e) {
                    console.error(e)
                }
            }

            async function getBPData() {
                try {
                    await axios.get('http://127.0.0.1:8000/medprob/bps/', 
                        { headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'} })
                        .then(response => setBps(response.data));
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
                <div className="BPList">
                    <h3>{userInfo.first_name}'s BP List</h3>
                    {bps?.map((bp, index) => (
                        <ul key={index}>
                            <li>{bp.systolic}/{bp.diastolic}</li>
                            <li>{bp.date}</li>
                            <li>{bp.time}</li>
                            <li>{bp.user}</li>
                        </ul>
                    ))}
                </div> 
                <BPForm />
            </OuterWrapper>
        </>
    )
}