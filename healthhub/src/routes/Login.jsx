import axios from "axios";
import { useState } from "react";
import styled from 'styled-components';

// const FormWrapper = styled.div`
//     display: flex;
//     justify-content: center;
//     align-content: center;
// `

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
        window.location.href = '/medprob/bp'
    }
   return (
    <div className="flex justify-center items-center h-full">
       <div className="w-full max-w-xs">
         <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submit}>
           <div className="mb-4">
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
             <input
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               id='username'
               type='text'
               value={username}
               required
               onChange={e => setUsername(e.target.value)} />
           </div>
           <div className="mb-6">
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
             <input
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               id='password'
               type="password"
               value={password}
               required
               onChange={e => setPassword(e.target.value)} />
           </div>
           <div className="flex items-center justify-between">
             <button
               className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
               type="submit">
               Submit
             </button>
           </div>
         </form>
       </div>
      </div>
    )
}