import axios from "axios";
import { useState } from "react";
import { ProgressCircle } from "../components/ProgressCircle";

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setLoading(true);

    const user = {username: username, password: password};

    try {
      const { data } = await axios.post('http://127.0.0.1:8000/token/',
        user,
        {
          headers:
            { 'Content-Type': 'application/json' }
        },
        { withCredentials: true });
      localStorage.clear();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      getUserData();
    } catch (e) {
      console.error(e);
      setStatus(401);
      setReason('Incorrect username or password.');
      setLoading(false);
    }
  }

  async function getUserData() {
    const token = localStorage.getItem('access_token');
    
    try {
      await axios.get('http://127.0.0.1:8000/accounts/login/',
        {
          headers:
          {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          localStorage.setItem('first_name', response.data['first_name']);
          localStorage.setItem('username', response.data['username']);
          window.location.href = "/userhome"
        })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
    {loading
      ? <div className="flex justify-center items-center h-screen w-screen"><ProgressCircle /></div>
      : 
        <div className="flex flex-col justify-center items-center h-screen w-screen">
          <h1 className="text-gray-700 text-5xl mb-4 font-extralight">Login</h1>
          <div className="w-full max-w-xs">
            <form className="bg-white border-2 border-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={submit}>
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
                  className="bg-transparent hover:bg-emerald-500 text-emerald-600 font-semibold hover:text-white py-2 px-4 border border-emerald-500 hover:border-transparent rounded"
                  type="submit">
                  Submit
                </button>
              </div>
              {status == 401 ?
                <p className='failure mt-4 text-rose-700'>{reason}</p> : null}
            </form>
          </div>
        </div>
    }
  </> 
  )
}