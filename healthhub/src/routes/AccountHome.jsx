import { useEffect, useState } from "react";
import axios from "axios";
import { ProgressCircle } from "../components/ProgressCircle";

export default function AccountHome() {
    const [userInfo, setUserInfo] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('');
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('access_token');

    useEffect(() => {
        if (localStorage.getItem('access_token') === null) {
            window.location.href = '/login'
        }
        else {
            setLoading(true);
            getUserData();
        };
    }, []);

    async function getUserData() {
        const token = localStorage.getItem('access_token');
        
        try {
          await axios.get('http://127.0.0.1:8000/accounts/user/',
            {
              headers:
              {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            .then(response => {
                setUserInfo(response.data)
                setEmail(response.data['email']);
                setFirstName(response.data['first_name']);
                setLastName(response.data['last_name']);
                setUsername(response.data['username']);
                setLoading(false);
                console.log(response)
            })
        } catch (e) {
          console.error(e)
        }
      }

    const saveChange = async e => {
        e.preventDefault();
        setLoading(true);
        setStatus('');

        const bodyFormData = new FormData();
        bodyFormData.append('first_name', firstName);
        bodyFormData.append('last_name', lastName);
        bodyFormData.append('username', username);
        bodyFormData.append('email', email);

        await axios.put(`http://127.0.0.1:8000/accounts/user/${userInfo['id']}/`,
            bodyFormData,
            {
                headers:
                {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            },
            { withCredentials: true })
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    localStorage.setItem('first_name', response.data['first_name']);
                    localStorage.setItem('username', response.data['username']);
                    setStatus(response.status);
                    setLoading(false);
                    setTimeout(() => { 
                        window.location.reload()
                    }, 1500);
                } else {
                    setStatus(response.response.status);
                    setReason(response.response.data);
                    setLoading(false);
                }
            });
    }

    return (
        <>
            {loading
                ?   <div className="flex justify-center items-center h-screen w-screen"><ProgressCircle /></div>
                :
                <div className="flex flex-col justify-center items-center h-screen w-screen">
                    <h1 className="text-gray-700 text-5xl mb-4 font-extralight">My Account</h1>
                    <div className="w-full max-w-lg">
                        <form className="registerForm bg-white border-2 border-gray-300 shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={saveChange}>
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
                            <button className="bg-transparent hover:bg-emerald-500 text-emerald-600 font-semibold hover:text-white py-2 px-4 border border-emerald-500 hover:border-transparent rounded" type='submit'>Save Changes</button>
                            {status == 200
                                ? <p className='success mt-4 text-emerald-600'>Changes successfully saved.</p>
                                : null}
                            {status == 400 ?
                                <p className='failure mt-4 text-rose-700'>{reason}</p> : null}
                        </form>
                    </div>
                </div>
            }
        </>
        
    )
}