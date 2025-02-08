import React, { useContext } from 'react';
import ReqChart from './ReqChart';
import useFetch from '../hook/Usefetch';
import { RequestReceived } from '../../schema structure/Schema';
import { username_context } from '../../App';
import Loader from '../Loader/Loader';

export default function RequsetSend() {
  const { user_id } = useContext(username_context);

  // Fetch data from backend
  const { data, loading } = useFetch({
    url: `http://localhost:5000/getreqs/${user_id}`
  });

  console.log(data, "===========");

  return (
    <>
      {loading ? (
        <div className='flex flex-col h-screen justify-center items-center'>
          <Loader />
        </div>
      ) : (
        <div className='box-border flex flex-col gap-4 m-3'>
          <h2 className='flex flex-row justify-center w-full font-bold text-3xl text-white'>
            Requests
          </h2>
          <div className='flex flex-col flex-wrap gap-3 items-center justify-center w-full'>
            {data?.results?.length > 0 ? (
              data.results.map((person: RequestReceived) => (
                <ReqChart
                  key={person.requester_id} // Unique key for React optimization
                  name={person.requester_name}
                  skill={person.requester_skills}
                  message={person.message}
                  skill_id={person.skill_id}
                  requester_id={person.requester_id}
                />
              ))
            ) : (
              <p className="text-white text-lg">No requests found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
