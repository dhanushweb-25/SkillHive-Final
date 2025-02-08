import React, { useState, useContext } from 'react';
import { Signin } from '../../schema structure/Schema';
import Errorpop from '../Errorpop/Errorpop';
import { username_context } from '../../App';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();
  const { setuser_id } = useContext(username_context);

  const [err, setError] = useState(false);
  const [errormsg, setMsg] = useState('');

  const [signindata, setSignData] = useState<Signin>({
    username: '',
    email: '',
    password: '',
    offeredSkills: '',
    desiredSkills: '',
    experienceLevel: 'Beginner',
    availability: '',
    rating: 3, // Default rating
  });

  const api = async () => {
    console.log(signindata);
    try {
      if (
        !signindata.username ||
        !signindata.email ||
        !signindata.password ||
        !signindata.offeredSkills ||
        !signindata.desiredSkills ||
        !signindata.availability
      ) {
        alert('Please fill all the fields');
        return;
      }

      fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signindata),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data?.error) {
            setError(true);
            setMsg(data?.error);
          }
          if (data?.message) {
            setuser_id(data?.random_id);
            localStorage.setItem('user_id', JSON.stringify(data?.random_id));
            navigate('/Home');
          }
        })
        .catch((err) => alert('Error: ' + err.message));
    }catch(error : unknown){
		setError(true);
	}
  };

  function changencomponent(err: boolean) {
    setError(err);
  }

  return (
    <>
      {err ? (
        <Errorpop err={errormsg} open={err} changencomponent={changencomponent} />
      ) : (
        <div className="flex flex-col gap-5 p-4">
          {/* Username */}
          <div className="flex flex-col gap-3">
            <label className="text-lg">Username:</label>
            <input
              type="text"
              value={signindata.username}
              className="rounded-lg px-2"
              placeholder="Enter username"
              onChange={(e) => setSignData({ ...signindata, username: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-3">
            <label className="text-lg">Email:</label>
            <input
              type="email"
              value={signindata.email}
              className="rounded-lg px-2"
              placeholder="Enter email"
              onChange={(e) => setSignData({ ...signindata, email: e.target.value })}
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-3">
            <label className="text-lg">Password:</label>
            <input
              type="password"
              value={signindata.password}
              className="rounded-lg px-2"
              placeholder="Enter password"
              onChange={(e) => setSignData({ ...signindata, password: e.target.value })}
              required
            />
          </div>

          {/* Offered Skills */}
          <div className="flex flex-col gap-3">
            <label className="text-lg">Offered Skills:</label>
            <input
              type="text"
              value={signindata.offeredSkills}
              className="rounded-lg px-2"
              placeholder="E.g., JavaScript, Python"
              onChange={(e) => setSignData({ ...signindata, offeredSkills: e.target.value })}
              required
            />
          </div>

          {/* Desired Skills */}
          <div className="flex flex-col gap-3">
            <label className="text-lg">Desired Skills:</label>
            <input
              type="text"
              value={signindata.desiredSkills}
              className="rounded-lg px-2"
              placeholder="E.g., React, MySQL"
              onChange={(e) => setSignData({ ...signindata, desiredSkills: e.target.value })}
              required
            />
          </div>

          {/* Experience Level */}
          <div className="flex flex-col gap-3">
            <label className="text-lg">Experience Level:</label>
            <select
              className="rounded-lg px-2"
              value={signindata.experienceLevel}
              onChange={(e) => setSignData({ ...signindata, experienceLevel: e.target.value as 'Beginner' | 'Intermediate' | 'Expert' })}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Availability */}
          <div className="flex flex-col gap-3">
            <label className="text-lg">Availability:</label>
            <input
              type="text"
              value={signindata.availability}
              className="rounded-lg px-2"
              placeholder="E.g., Weekdays 6 PM - 9 PM"
              onChange={(e) => setSignData({ ...signindata, availability: e.target.value })}
              required
            />
          </div>

          {/* Rating (Hidden Input - Default 3) */}
          <input type="hidden" value={signindata.rating} readOnly />

          {/* Submit Button */}
          <div className="flex flex-row justify-center">
            <button onClick={api} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Sign Up</button>
          </div>
        </div>
      )}
    </>
  );
}
