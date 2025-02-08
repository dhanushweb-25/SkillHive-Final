export type PersonDetails = {
  id: number;
  username: string;
  email: string;
  password: string;
  offeredSkills: string; // Comma-separated values
  desiredSkills: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  availability: string;
  rating: number;
};

export type RequestReceived = {
  requester_id: number;
  skill_id: string;
  requester_name: string;
  requester_skills: string;
  message: string;
};

// Used in Sign component
export type Signin = {
  username: string;
  email: string;
  password: string;
  offeredSkills: string; // Comma-separated values
  desiredSkills: string; // Comma-separated values
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  availability: string;
  rating?: number; // Optional, as it has a default value in SQL
};

// Used in Chart component
export type PersonDetailsProps = {
  receiver_id: number;
  name: string;
  rating: number;
  desired_skills: string;
  skills: string;
};

// Convert results into PersonDetailsProps[]
export const mappedResults = (results: PersonDetails[]): PersonDetailsProps[] =>
  results.map((result: PersonDetails) => ({
    receiver_id: result.id, // Ensure ID is properly mapped
    name: result.username,
    rating: result.rating ?? 0, // Default to 0 if rating is undefined
    desired_skills: result.desiredSkills ?? '', // Ensure it's always a string
    skills: result.offeredSkills ?? '',
  }));

export type SendRequest = {
  user_id: number;
  receiver_id: number;
  skills: string;
  desired_skills: string;
  message: string;
};
