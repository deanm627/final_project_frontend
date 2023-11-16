import { useState, useEffect} from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const OutletWrapper = styled.div`
    display: flex;
    height: 115vh;

    @media (max-width: 900px) {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }
`

const NavWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    box-shadow: 0 0 10px gray;
    font-size: 1.2rem;
    font-weight: 450;
    height: 50px;
    background-color: #f5f5f4;

    .navButton {
        display: flex;
        align-items: center; 
        padding: 0 10px;
    }

    .navButton:hover {
        background-color: #1f2937;;
        color: #f5f5f4;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdownContent {
        display: none;
        position: absolute;
        background-color: #f1f1f1;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1;
    }

    .dropdownContentLink {
        color: #030712;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
    }

    .dropdownContentLink:hover {
        background-color: #ddd;
        color: #0891b2;
    }

    .dropdown:hover .dropdownContent {display: block;}

    .dropdown:hover .dropdownButton {
        background-color: #1f2937;;
        color: #f5f5f4;
    }

    .dropdownButton {
        height: 50px;
        padding: 0 10px;
    }

    .printButton {
        min-width: 160px;
        text-align: left;
    }

    @media (max-width: 900px) {
        display: flex;

        .dropdownContent {
            position: absolute;
            right: 0;
        }
    }
`

export default function Navigation() {
    const [isAuth, setIsAuth] = useState(false);

    const username = localStorage.getItem('username');

    useEffect(() => {
        if (localStorage.getItem('access_token') !== null) {
            setIsAuth(true); 
        }
    }, [isAuth]);


    return (
        <>  <NavWrapper>
                <Link className='navButton' to="/">HealthHub</Link>
                {isAuth 
                    ?   <Link className='navButton' to="/userhome">My HealthHub</Link>
                    :   <Link className='navButton' to="/register">Register</Link>
                }
                {isAuth 
                ?
                    <div className="dropdown">
                        <button className='dropdownButton' type='button'>{username}</button>
                        <div className='dropdownContent'>
                            <Link className='dropdownContentLink' to="/myaccount/">My Account</Link> 
                            <button className='dropdownContentLink printButton' onClick={(e) => print()}>Print</button>
                            <Link className='dropdownContentLink' to="/logout">Logout</Link> 
                        </div>
                    </div>
                :
                    <Link className='navButton' to="/login">Login</Link>
                }
            </NavWrapper>
            <OutletWrapper>
                <Outlet />
            </OutletWrapper>
            
        </>
    );
 }