import axios from "axios";
import { useState } from "react";
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

export const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Create the submit method.
    const submit = async e => {
         e.preventDefault();
         const user = {
               username: username,
               password: password
              };
         // Create the POST requuest
         const {data} = await                                                                            
                        axios.post('http://127.0.0.1:8000/token/',
                        user, 
                        {headers: 
                          {'Content-Type': 'application/json'}
                        },
                        {withCredentials: true});

        // Initialize the access & refresh token in localstorage.      
        localStorage.clear();
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        // localStorage.setItem('user_id', data.user_id);
        // localStorage.setItem('first_name', data.first_name);
        // axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
        window.location.href = '/userhome'
    }
   return (
     <div>
       <form onSubmit={submit}>
         <FormWrapper>
           <h2>Sign In:</h2>
           <label>Username</label>
           <input
             name='username'
             type='text'
             value={username}
             required
             onChange={e => setUsername(e.target.value)} />
           <label>Password</label>
           <input name='password'
             type="password"
             value={password}
             required
             onChange={e => setPassword(e.target.value)} />
           <button type="submit">Submit</button>
         </FormWrapper>
       </form>
     </div>
    )
}