import React, { useState } from 'react';

import { PersonDetailsProps } from '../../schema structure/Schema';
import { SendRequest } from '../../schema structure/Schema';
import { username_context } from '../../App';

import { CircleUser } from 'lucide-react';

export default function PersonDetails({ name, rating, skills, desired_skills, receiver_id }: PersonDetailsProps) {
    const { user_id } = React.useContext(username_context);
    console.log('user_id in Home', user_id);

    const [msgstatus, setmesgstatus] = useState(true);
    const [msg, setmsg] = useState('');
    const [disabled, setdisabled] = useState(true);

    const senddata: SendRequest = {
        user_id: Number(user_id),
        receiver_id: receiver_id,
        skills: skills,
        desired_skills: desired_skills,
        message: msg,
    };

    async function sendRequestfun() {
        if (senddata.message === '') {
            alert('Message is empty');
            return;
        }

        try {
            setdisabled(false);
            // POST request to save data to the database
            const response = await fetch('http://localhost:5000/req', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(senddata),
            });

            if (response.ok) {
                console.log('Request sent successfully', senddata);
            } else {
                console.error('Error sending request', response.statusText);
            }
        } catch (error) {
            console.error('Error in sendRequestfun:', error);
        } finally {
            setdisabled(true); // Re-enable the button after the request
        }
    }

    return (
        <div
            className={`flex flex-col bg-custom shadow-lg gap-3 py-7 hover:scale-105 hover:duration-500 sm:max-w-full px-4 rounded-lg w-60 text-${
                msgstatus || !disabled ? 'text-base' : 'text-sm'
            }`}
        >
            <div className={`flex flex-col ${msgstatus || !disabled ? 'gap-5' : 'gap-3'}`}>
                <div className="flex flex-row justify-center gap-2">
                    <CircleUser size={msgstatus || !disabled ? 54 : 38} />
                </div>

                <div className="flex flex-col gap-3">
                    <p>
                        <span className="font-bold">Name</span> : {name}
                    </p>
                    <p>
                        <span className="font-bold">Rating</span> : {rating ? rating : 'newbie'}
                    </p>
                    <p>
                        <span className="font-bold">Skills</span> : {skills}
                    </p>
                    <p>
                    <span className="font-bold">Desired Skills</span> : {desired_skills}
                    </p>
                </div>
            </div>

            <p className={`flex flex-row gap-2 w-full`}>
                <span className="font-bold"> message:</span>
                <div className="flex flex-col w-full ">
                    {msgstatus ? (
                        <button onClick={() => setmesgstatus(false)} className="max-w-full">
                            Click to message
                        </button>
                    ) : (
                        <>
                            {disabled ? (
                                <div className="flex flex-col gap-3 justify-center max-w-28">
                                    <input
                                        type="text"
                                        onChange={(e) => setmsg(e.target.value)}
                                        className="rounded-lg "
                                    />

                                    <div className="flex flex-row gap-2 justify-around w-full ">
                                        <button
                                            onClick={() => {
                                                sendRequestfun();
                                            }}
                                            className="bg-red-500 rounded-xl p-1 px-2  "
                                        >
                                            send
                                        </button>
                                        <button
                                            onClick={() => setmesgstatus(true)}
                                            className="bg-red-500 rounded-xl p-1 px-2 "
                                        >
                                            cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button className="">Request sent</button>
                            )}
                        </>
                    )}
                </div>
            </p>
        </div>
    );
}
