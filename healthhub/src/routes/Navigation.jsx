import { useState, useEffect} from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const NavWrapper = styled.div`
    display: flex;
    justify-content: space-evenly;
    background-color: gray;
    overflow: hidden;
    
    .userMenu {
        overflow: hidden;
    }

    a {
        color: black;
    }

    ul {
        list-style-type: none;
    }
`

export default function Navigation() {
    const [isAuth, setIsAuth] = useState(false);
    const [dropdown, setDropdown] = useState(false);

    const username = localStorage.getItem('username');

    useEffect(() => {
        if (localStorage.getItem('access_token') !== null) {
            setIsAuth(true); 
        }
    }, [isAuth]);

    const handleMouseEnter = () => {
        setDropdown(true);
    };
    
    const handleMouseLeave = () => {
        setDropdown(false);
    };

    return (
        <div className='w-screen h-screen overflow-auto'>
            <header className="sticky top-0 z-50">
                <NavWrapper>
                    <div>
                        <Link to="/">Home</Link>
                    </div>
                    <div>
                        {isAuth ? <Link to="/medprob/bp">My HealthHub</Link> :
                            <Link to="/register">Register</Link>}
                    </div>
                    <div>
                        {isAuth 
                        ?
                            <div className="userMenu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <button type='button'>{username}</button>
                                {dropdown 
                                    ? <ul>
                                        <li><Link to="/logout">My Account</Link> </li>
                                        <li><Link to="/logout">Logout</Link> </li>
                                        </ul>  
                                    : null
                                }
                            </div>
                        :
                            <Link className='hover:bg-gray-300' to="/login">Login</Link>}
                    </div>
                </NavWrapper>
            </header>
            <main className="relative h-full">
                <Outlet />
            </main>
        </div>
    );
 }