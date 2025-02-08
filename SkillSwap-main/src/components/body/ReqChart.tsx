import React, { useState, useEffect, useContext } from 'react';
import { username_context } from '../../App';
import { CircleUser } from 'lucide-react';

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

  useEffect(() => {
    if (!user_id) return;
    
    fetch(`${API_BASE_URL}/pending-requests?receiver_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching requests:', err);
        setLoading(false);
      });
  }, [user_id]);

  const handleResponse = (request_id: string, requester_id: string, skill_id: string, status: boolean) => {
    const responsePayload: Response = {
      requester_id,
      status,
      receiver_id: user_id,
      skill_id,
    };

    fetch(`${API_BASE_URL}/res`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(responsePayload),
    })
      .then((res) => res.json())
      .then(() => {
        setRequests((prevRequests) => prevRequests.filter((req) => req.request_id !== request_id));
      })
      .catch((err) => console.error('Error updating request:', err));
  };

  if (loading) return <p>Loading requests...</p>;
  if (requests.length === 0) return <p>No skill requests pending.</p>;

  return (
    <div className="flex flex-col gap-4">
      {requests.map(({ request_id, requester_name, skill, message, skill_id, requester_id }) => (
        <div
          key={request_id}
          className="grid grid-cols-4 gap-3 p-4 bg-gray-200 rounded-md w-1/2 max-sm:flex max-sm:flex-col max-sm:gap-3 hover:scale-105 hover:duration-500"
        >
          <div className="flex flex-col gap-3 col-span-3 max-sm:order-last">
            <h2><span className="font-bold">User Name</span>: {requester_name}</h2>
            <p><span className="font-bold">Skill</span>: {skill}</p>
            <p><span className="font-bold">Message</span>: {message}</p>

            <div className="flex flex-row gap-2 justify-between w-full">
              <button onClick={() => handleResponse(request_id, requester_id, skill_id, true)} className="bg-green-300 rounded-lg px-2 py-1">
                Accept
              </button>
              <button onClick={() => handleResponse(request_id, requester_id, skill_id, false)} className="bg-red-400 rounded-lg px-2 py-1">
                Reject
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-center items-center w-full">
            <CircleUser size={70} className="max-w-fit" />
          </div>
        </div>
      ))}
    </div>
  );
}
