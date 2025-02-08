import React, { useEffect, useContext } from 'react';
import { userContext } from '../../App';
import Chart from './Chart';
import useFetch from '../hook/Usefetch';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

export default function Home() {
  const navigate = useNavigate();
  const {filterPerson, setPersons } = useContext(userContext);

  const { data, loading, error } = useFetch({
    url: `http://localhost:5000/users`,
  });
  useEffect(() => {
    if (data) {
      setPersons(data);
    }
  }, [data, setPersons]);

  if (error) {
    navigate('/auth');
    return null;
  }

  return (
    <div className='flex flex-col gap-4 m-3'>
      <h2 className='text-center font-bold text-3xl text-white'>Person Details</h2>
      <div className='flex flex-wrap gap-6 justify-center max-md:mx-7'>
        {loading ? (
          <div className='flex flex-col h-screen justify-center items-center'>
            <Loader />
          </div>
        ) : (
          (filterPerson).map((person) => (
            <Chart
              key={person.id}
              name={person.username || 'Unknown'}
              rating={person.rating || 0}
              skills={person.offeredSkills || 'Not specified'}
              skill_id={person.desiredSkills}
              receiver_id={person.email}
            />
          ))
        )}
      </div>
    </div>
  );
}
