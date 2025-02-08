import { createContext, useEffect, useState } from "react";
import { PersonDetails } from "./schema structure/Schema";
import Home from "./components/body/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Requestrecived from "./components/body/Requsetrecived";
import Friendlist from "./components/body/Friendlist";
import Auth from "./components/auth/Auth";
import { ProjLayout } from "./components/ProjLayout";
import Profile from "./components/body/Profile";
import Errorpage from "./components/Errorpop/Errorpage";
import Login from './components/auth/Login';

type username_context_type = {
  user_id: string;
  setuser_id: (value: string) => void;
};

type context_type = {
  Persons: PersonDetails[];
  filterPerson: PersonDetails[];
  selectedSkill: string;
  searchPerson: string;
  setPersons: (value: PersonDetails[]) => void;
  setSearchPerson: (value: string) => void;
  setSelectedSkill: (value: string) => void;
};

export const username_context = createContext<username_context_type>({
  user_id: localStorage.getItem("user_id") || "",
  setuser_id: () => {},
});

export const userContext = createContext<context_type>({
  Persons: [],
  selectedSkill: "",
  searchPerson: "",
  setPersons: () => {},
  filterPerson: [],
  setSearchPerson: () => {},
  setSelectedSkill: () => {},
});

export default function App() {
  const [user_id, setuser_id] = useState(localStorage.getItem("user_id") || "");

  useEffect(() => {
    localStorage.setItem("user_id", user_id);
  }, [user_id]);

  const [Persons, setPersons] = useState<PersonDetails[]>([]);
  const [selectedSkill, setSelectedSkill] = useState("");
  const [searchPerson, setSearchPerson] = useState("");

  const filterPerson = Persons?.filter((person) => {
    const skillMatch = selectedSkill ? person.skill_name.includes(selectedSkill) : true;
    const nameMatch = searchPerson ? person.username.toLowerCase().includes(searchPerson.toLowerCase()) : true;
    return skillMatch && nameMatch;
  });

  return (
    <BrowserRouter>
      <username_context.Provider value={{ user_id, setuser_id }}>
        <div className="box-border bg-custom-blue h-screen overflow-y-scroll">
          <userContext.Provider
            value={{
              Persons,
              selectedSkill,
              searchPerson,
              setSearchPerson,
              setSelectedSkill,
              setPersons,
              filterPerson,
            }}
          >
            <Routes>
              {/* Redirect from '/' to '/auth' */}
              <Route path="/" element={<Navigate to="/auth" replace />} />

              {/* Defined Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/Home" element={<ProjLayout><Home /></ProjLayout>} />
              <Route path="/req" element={<ProjLayout><Requestrecived /></ProjLayout>} />
              <Route path="/friendlist" element={<ProjLayout><Friendlist /></ProjLayout>} />
              <Route path="/profile" element={<Profile />} />

              {/* Catch-all 404 Error Page */}
              <Route path="*" element={<Errorpage />} />
            </Routes>
          </userContext.Provider>
        </div>
      </username_context.Provider>
    </BrowserRouter>
  );
}
