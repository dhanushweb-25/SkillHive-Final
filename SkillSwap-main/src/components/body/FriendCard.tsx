import React, { useEffect, useState } from "react";
import { username_context } from "../../App";
import { CircleUser } from "lucide-react";

// Type for request data
type Request = {
  user_id: string;
  name: string;
  skill: string;
  skill_id: string;
};

export default function ReqChart() {
  const { user_id } = React.useContext(username_context);
  const [requests, setRequests] = useState<Request[]>([]);
  const [rating, setRating] = useState<{ [key: string]: number }>({});
  const [removed, setRemoved] = useState<{ [key: string]: boolean }>({});

  // Fetch requests initially
  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = async () => {
    const response = await fetch(
      `https://skill-api.penneithendral.workers.dev/requests/${user_id}`
    );
    const data = await response.json();
    setRequests(data.results);
  };

  const sendRating = async (skill_id: string, requester_id: string, value: number) => {
    if (value < 0 || value > 5) {
      alert("Rating must be between 0 and 5.");
      return;
    }
    const payload = {
      skill_id,
      requester_id,
      receiver_id: user_id,
      rating: value,
    };

    await fetch("https://skill-api.penneithendral.workers.dev/requests/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setRemoved((prev) => ({ ...prev, [requester_id]: true }));
  };

  // Generate a consistent color for each card based on user_id
  const generateColor = (userId: string) => {
    const colors = ["#FFDDC1", "#FEC8D8", "#D5AAFF", "#B5EAD7", "#85E3FF"];
    const index = userId
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-wrap gap-6 justify-center max-md:mx-7">
      {requests.map((req) =>
        removed[req.user_id] ? null : (
          <div
            key={req.user_id}
            className="flex flex-col gap-3 w-56 p-3 rounded-md hover:scale-105 hover:duration-500"
            style={{ backgroundColor: generateColor(req.user_id) }}
          >
            <div className="flex flex-row justify-center">
              <CircleUser size={40} />
            </div>
            <div className="flex flex-col justify-evenly h-40">
              <h2>
                <span className="font-bold">User Name</span>: {req.name}
              </h2>
              <p>
                <span className="font-bold">Skill</span>: {req.skill}
              </p>
              <div className="flex flex-row justify-between">
                {rating[req.user_id] == null ? (
                  <button
                    onClick={() => setRating((prev) => ({ ...prev, [req.user_id]: 0 }))}
                    className="bg-red-500 px-2 py-2 text-white max-w-fit rounded-xl"
                  >
                    Rate
                  </button>
                ) : (
                  <div>
                    <input
                      type="number"
                      className="w-20 rounded-full"
                      min="0"
                      max="5"
                      value={rating[req.user_id]}
                      onChange={(e) =>
                        setRating((prev) => ({ ...prev, [req.user_id]: Number(e.target.value) }))
                      }
                    />
                    <button
                      onClick={() => sendRating(req.skill_id, req.user_id, rating[req.user_id])}
                      className="bg-red-500 px-2 py-2 text-white max-w-fit rounded-xl"
                    >
                      Send
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
