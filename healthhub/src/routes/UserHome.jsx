import { useEffect, useState } from "react";
// import UrlForm from '../components/UrlForm';
import axios from "axios";
import styled from 'styled-components';

const OuterWrapper = styled.div`
    display: flex;
    margin: 30px auto;
    
    .urlList {
        width: 60%;
    }
`

// Define the Login function.
export const UserHome = () => {
    const [bps, setBps] = useState([]);

    // const user_id = localStorage.getItem('user_id');
    // const first_name = localStorage.getItem('first_name')
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login'
        }
        else {
            (async () => {
                try {
                    await axios.get(`http://127.0.0.1:8000/medprob/bps/`, 
                        {headers: 
                            {'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'}
                        },
                        // {params: 
                        //     { user: user_id }
                        // }
                        )
                        .then(response => setBps(response.data));
                } catch (e) {
                    console.log(e, 'not authorized')
                }
            })()
        };
    }, []);

    return (
        <>
            <OuterWrapper>
                <div className="BPList">
                    {/* <h3>{first_name}'s Url List</h3> */}
                    {bps?.map((bp, index) => (
                        <ul key={index}>
                            <li>{bp.systolic}</li>
                            <li>{bp.diastolic}</li>
                            <li>{bp.date}</li>
                            <li>{bp.time}</li>
                            <li>{bp.user}</li>
                        </ul>
                    ))}
                </div> 
                {/* <UrlForm /> */}
            </OuterWrapper>
        </>
    )
}