import React, { useState } from 'react';
import { username_context } from '../../App';
import { useNavigate } from 'react-router-dom';
import Errorpop from '../Errorpop/Errorpop';

type Login = {
  username: string;
  email: string;
  password: string;
};

export default function Login() {
  const [login, setLogin] = useState<Login>({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const [err, setError] = useState(false);
  const [errorMsg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { setuser_id } = React.useContext(username_context);

  async function apilogin() {
    if (!login.username || !login.email || !login.password) {
      setMsg('Please fill in all fields');
      setError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login),
      });

      const data = await response.json();

      if (response.ok) {
        setuser_id(data.username);
        localStorage.setItem('user_id', data.username);
        localStorage.setItem('email', login.email);
        navigate('/Home');
      } else {
        setMsg(data.error || 'Invalid credentials');
        setError(true);
      }
    } catch (error) {
      setMsg('Network error, please try again');
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function changencomponent(err: boolean) {
    setError(err);
  }

  return (
    <>
      {err && <Errorpop err={errorMsg} open={err} changencomponent={changencomponent} />}

      <div className="flex flex-col gap-5 p-4 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-center">Login</h2>

        <div className="flex flex-col gap-3">
          <label htmlFor="username" className="text-lg">Username:</label>
          <input
            type="text"
            id="username"
            value={login.username}
            placeholder="Enter username"
            className="rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="text-lg">Email:</label>
          <input
            type="email"
            id="email"
            value={login.email}
            placeholder="Enter email"
            className="rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setLogin({ ...login, email: e.target.value })}
            required
          />
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="password" className="text-lg">Password:</label>
          <input
            type="password"
            id="password"
            value={login.password}
            placeholder="Enter password"
            className="rounded-lg px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
            required
          />
        </div>

        <button
          onClick={apilogin}
          disabled={loading || !login.username || !login.email || !login.password}
          className={`px-4 py-2 text-white rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} transition duration-200`}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </>
  );
}
