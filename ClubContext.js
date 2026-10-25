import {createContext,useContext} from 'react';
export const ClubContext=createContext(null);
export const useClub=()=>useContext(ClubContext);
