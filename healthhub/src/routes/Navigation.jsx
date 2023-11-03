import { useState, useEffect} from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const NavWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    background-color: gray;
    
    a {
        color: black;
    }
`

export default function Navigation() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
      if (localStorage.getItem('access_token') !== null) {
         setIsAuth(true); 
       }
     }, [isAuth]);

      return ( 
        <>
            <NavWrapper>    
                <div>
                    <Link to="/">Home</Link>
                </div> 
                <div> 
                    {isAuth ? <Link to ="/medprob/bp">My HealthHub</Link> : 
                            <Link to ="/register">Register</Link> }
                </div>
                <div>
                    {isAuth ? <Link to ="/logout">Logout</Link> :  
                            <Link to ="/login">Login</Link>}
                </div>
            </NavWrapper>
            <Outlet />
        </>
      );
 }