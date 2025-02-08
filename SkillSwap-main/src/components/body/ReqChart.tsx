import React, { useState, useEffect, useContext } from 'react';
import { username_context } from '../../App';
import { CircleUser } from 'lucide-react';
import Loader from '../Loader/Loader';

type Request = {
  request_id: string;
  requester_name: string;
  skill: string;
  message: string;
  skill_id: string;
  requester_id: string;
};

type Response = {
  requester_id: string;
  status: boolean;
  receiver_id: string;
  skill_id: string;
};

const API_BASE_URL = 'https://skill-api.penneithendral.workers.dev';

export default function ReqChart() {
  const { user_id } = useContext(username_context);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user_id) return;

    fetch(`${API_BASE_URL}/pending-requests?receiver_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data?.results ?? []); // Ensuring data is always an array
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching requests:', err);
        setError('Failed to load skill requests.');
        setLoading(false);
      });
  }, [user_id]);

  const handleResponse = async (request_id: string, requester_id: string, skill_id: string, status: boolean) => {
    try {
      const responsePayload: Response = {
        requester_id,
        status,
        receiver_id: user_id,
        skill_id,
      };

      const res = await fetch(`${API_BASE_URL}/res`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responsePayload),
      });

      if (!res.ok) throw new Error('Failed to update request.');

      setRequests((prevRequests) => prevRequests.filter((req) => req.request_id !== request_id));
    } catch (err) {
      console.error('Error updating request:', err);
      setError('Failed to process the request.');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;
  if (requests.length === 0) return <p className="text-gray-400">No skill requests pending.</p>;

  return (
    <div className="flex flex-col gap-4">
      {requests.map(({ request_id, requester_name, skill, message, skill_id, requester_id }) => (
        <div
          key={request_id}
          className="grid grid-cols-4 gap-3 p-4 bg-gray-200 rounded-md w-1/2 max-sm:flex max-sm:flex-col max-sm:gap-3 hover:scale-105 transition duration-300"
        >
          <div className="flex flex-col gap-3 col-span-3 max-sm:order-last">
            <h2 className="font-bold">User Name: <span className="font-normal">{requester_name}</span></h2>
            <p className="font-bold">Skill: <span className="font-normal">{skill}</span></p>
            <p className="font-bold">Message: <span className="font-normal">{message}</span></p>

            <div className="flex flex-row gap-2 justify-between w-full">
              <button
                onClick={() => handleResponse(request_id, requester_id, skill_id, true)}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-3 py-1 transition duration-300"
              >
                Accept
              </button>
              <button
                onClick={() => handleResponse(request_id, requester_id, skill_id, false)}
                className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-1 transition duration-300"
              >
                Reject
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center w-full">
            <CircleUser size={70} className="max-w-fit text-gray-600" />
          </div>
        </div>
      ))}
    </div>
  );
}
