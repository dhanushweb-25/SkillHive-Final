import { CircleUser, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useFetch from '../hook/Usefetch';
import { SendHorizontal } from 'lucide-react';
import { username_context } from '../../App';
import { useNavigate } from 'react-router-dom';


type skill_type = {
	user_name: string;
	skill_name: string;
};

export default function Profile() {
	const nav = useNavigate();
	const { user_id } = React.useContext(username_context);

	const [user_name, setname] = useState('');
	const [userskill, setuserskill] = useState('');
	const [skilllist, setskilllist] = useState<string[]>([]);
	const [profileImage, setProfileImage] = useState<string>(''); // Profile Image State
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	// Fetch User Data & Skills
	const { data } = useFetch({ url: `https://skill-api.penneithendral.workers.dev/getskills/${user_id}` });

	useEffect(() => {
		if (data?.results?.length > 0) {
			setskilllist(data.results.map((skill: skill_type) => skill.skill_name));
			setname(data.results[0].user_name);
			setProfileImage(data.results[0].profile_image || 'https://via.placeholder.com/150'); // Default Image
		}
	}, [data]);

	// Function to Add Skill
	const addSkill = async (skill: string) => {
		const formattedSkill = skill
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');

		if (!skilllist.includes(formattedSkill)) {
			setskilllist(prev => [...prev, formattedSkill]);

			await fetch('https://skill-api.penneithendral.workers.dev/skills', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name: formattedSkill, user_id })
			});
		}
		setuserskill('');
	};

	// Function to Handle Profile Picture Upload
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
		}
	};

	const uploadProfilePicture = async () => {
		if (!selectedFile) return;
		const formData = new FormData();
		formData.append('profile_image', selectedFile);
		formData.append('user_id', user_id.toString());

		await fetch('https://skill-api.penneithendral.workers.dev/upload-profile', {
			method: 'POST',
			body: formData
		});
	};

	return (
		<div className='flex flex-col text-white gap-6 p-3 max-w-full my-7 mx-auto max-md:px-5 max-w-lg'>
			<div className='font-bold text-2xl flex justify-between w-full'>
				<h2>User Details</h2>
				<button className='hover:bg-gray-300 rounded-full p-2' onClick={() => nav(-1)}>
					<X />
				</button>
			</div>

			<div className='flex flex-col items-center gap-3'>
				<img src={profileImage} alt='Profile' className='w-32 h-32 rounded-full border-2 border-gray-300 object-cover' />
				<input type='file' accept='image/*' onChange={handleFileChange} className='text-white' />
				<button onClick={uploadProfilePicture} className='bg-blue-500 text-white p-2 rounded-md'>Upload</button>
				<h2 className='text-xl font-bold'>{user_name}</h2>
			</div>

			<div className='flex flex-col gap-3 px-6'>
				<div className='flex flex-row gap-3'>
					<span className='font-bold'>User ID:</span> <span>{user_id}</span>
				</div>
				<div className='flex flex-row gap-3'>
					<span className='font-bold'>Username:</span> <span>{user_name}</span>
				</div>
			</div>

			<div className='flex flex-col gap-3'>
				<h1 className='font-bold text-2xl'>Your Skills</h1>
				<div className='flex flex-col px-4 gap-7'>
					<div className='flex items-center gap-3'>
						<input
							type='text'
							placeholder='Enter a skill...'
							value={userskill}
							onChange={(e) => setuserskill(e.target.value)}
							className='bg-gray-900 text-white p-2 rounded-xl border-2 border-white w-full'
						/>
						<button onClick={() => addSkill(userskill)} className='p-2 bg-blue-500 rounded-full hover:bg-blue-700'>
							<SendHorizontal size={32} />
						</button>
					</div>
					<ul className='flex flex-col gap-3 mx-4'>
						{skilllist.map((skill, index) => (
							<li key={index} className='list-disc mx-3'>
								{skill}
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}
