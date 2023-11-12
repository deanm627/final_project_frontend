import { useState, useEffect} from 'react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const OutletWrapper = styled.div`
    display: flex;
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
        <>
            <div className='h-12 flex justify-evenly items-center bg-stone-100'>
                    <div className='hover:bg-gray-800 hover:text-stone-100 h-full p-2 flex justify-evenly items-center'>
                        <Link to="/">Home</Link>
                    </div>
                    <div className='hover:bg-gray-800 hover:text-stone-100 h-full p-2 flex justify-evenly items-center'>
                        {isAuth ? <Link to="/medprob/bp">My HealthHub</Link> :
                            <Link to="/register">Register</Link>}
                    </div>
                    <div className='hover:bg-gray-800 hover:text-stone-100 h-full p-2 flex justify-evenly items-center'>
                        {isAuth 
                        ?
                            <div className="relative inline-block" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                                <button type='button'>{username}</button>
                                {dropdown 
                                    ? <div className='absolute w-24'>
                                        <Link className='w-24 text-gray-800 bg-stone-100 block hover:bg-gray-800 hover:text-stone-100'to="/logout">My Account</Link> 
                                        <Link className='w-24 text-gray-800 bg-stone-100 block hover:bg-gray-800 hover:text-stone-100' to="/medprob/bp">BP home</Link> 
                                        <Link className='w-24 text-gray-800 bg-stone-100 block hover:bg-gray-800 hover:text-stone-100' to="/meds/">Med List</Link> 
                                        <Link className='w-24 text-gray-800 bg-stone-100 block hover:bg-gray-800 hover:text-stone-100' to="/logout">Logout</Link> 
                                     </div>
                                    : null
                                }
                            </div>
                        :
                            <Link to="/login">Login</Link>}
                    </div>
            </div>
            <OutletWrapper>
                <Outlet />
            </OutletWrapper>
            
        </>
    );
 }