import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
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

export const BPlist = () => {
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
                            console.log(response);
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
                        .then(response => {
                            console.log(response);
                            setBps(response.data)
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
                <div className="BPList">
                    <h3>{userInfo.first_name}'s BP List</h3>
                    {bps?.map((bp, index) => (
                        <ul key={index}>
                            <li>{bp.systolic}/{bp.diastolic}</li>
                            <Link to={`/medprob/bps/${bp.id}`}><li>{bp.date}</li><li>{bp.time}</li></Link>
                            <li>{bp.user}</li>
                        </ul>
                    ))}
                </div> 
                
            </OuterWrapper>
        </>
    )
}