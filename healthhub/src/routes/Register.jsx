import { useState } from 'react';
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
`

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

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
                       .then(response => console.log(response));

       // Redirect after submission.      
    //    window.location.href = '/login'
   }

    return (
        <form className="registerForm" onSubmit={submit}>
                <FormWrapper>
                    <h2>Registration: </h2>
                    <label>First Name: </label>
                    <input 
                        type='text'
                        name="firstName"
                        value={firstName} 
                        required
                        onChange={e => setFirstName(e.target.value)}/>
                    <label>Last Name: </label>
                    <input 
                        type='text'
                        name="lastName"
                        value={lastName} 
                        required
                        onChange={e => setLastName(e.target.value)}/>
                    <label>Email:</label>
                    <input 
                        type='email' 
                        name="email"
                        value={email} 
                        required
                        onChange={e => setEmail(e.target.value)}/>
                    <label>Username:</label>
                    <input 
                        type='username' 
                        name='username'
                        value={username} 
                        required
                        onChange={e => setUsername(e.target.value)}/>
                    <label>Password:</label>
                    <input 
                        type='password' 
                        name="password"
                        value={password} 
                        required
                        onChange={e => setPassword(e.target.value)}/>
                    <button type='submit'>Submit</button>
                </FormWrapper>
         </form>
    )
}