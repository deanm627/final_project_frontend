import { useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import axios from "axios";
import styled from 'styled-components';

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 25%;

    label {
        margin: 5px 0;
    }

    button {
        margin: 15px 0;
        width: 50%;
    }

    .success {
        color: green;
    }

    .failure {
        color: red;
    }
`

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [reason, setReason] = useState('');

    const submit = async e => {
        e.preventDefault();

        const bodyFormData = new FormData();
        bodyFormData.append('first_name', firstName);
        bodyFormData.append('last_name', lastName);
        bodyFormData.append('username', username);
        bodyFormData.append('password', password);
        bodyFormData.append('email', email);

        // Create the POST requuest
        await axios.post('http://127.0.0.1:8000/accounts/register/',
                       bodyFormData, 
                       {headers: 
                            {'Content-Type': 'multipart/form-data'}
                       },
                       {withCredentials: true})
                       .then(response => {
                        console.log(response)
                        if (response.status == 201) {
                            setFirstName('')
                            setLastName('')
                            setUsername('')
                            setPassword('')
                            setEmail('')
                            setStatus(response.status)
                            setTimeout(() => { 
                                window.location.href = '/login'
                            }, 1000);
                        } else {
                            setReason(response.response.data)
                            setStatus(response.response.status)
                        }
                       });

       // Redirect after submission.      
    //    window.location.href = '/login'
   }

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-lg">
                <form className="registerForm bg-white border-2 border-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">First Name</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='text'
                            name="firstName"
                            value={firstName}
                            required
                            onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">Last Name</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='text'
                            name="lastName"
                            value={lastName}
                            required
                            onChange={e => setLastName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='email'
                            name="email"
                            value={email}
                            required
                            onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='username'
                            name='username'
                            value={username}
                            required
                            onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type='password'
                            name="password"
                            value={password}
                            required
                            onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button className="bg-transparent hover:bg-emerald-500 text-emerald-600 font-semibold hover:text-white py-2 px-4 border border-emerald-500 hover:border-transparent rounded" type='submit'>Submit</button>
                    {status == 201
                        ? <p className='success'>User successfully created. <br></br>
                            You will be re-directed to the login page</p>
                        : null}
                    {status == 400 ?
                        <p className='failure'>{reason}</p> : null}
                </form>
            </div>
        </div>
    )
}