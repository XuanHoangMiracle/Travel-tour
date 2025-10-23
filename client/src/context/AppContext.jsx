import axios from "axios";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || " vnđ";
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();

    const [isAdmin, setIsAdmin] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);

    const fetchUser = async () => {
        try {
           const {data} = await axios.get('/api/user', {headers: {Authorization: `Bearer ${await getToken()}`}});
           if (data) {
               setIsAdmin(data.role === 'admin');
               setSearchedCities(data.searchedCities || []);
           } else {
               setTimeout(() => fetchUser(), 5000);
           }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (user){
            fetchUser();
        }
    }, [user]);


    const value ={
        currency,navigate,user,getToken,axios,
        isAdmin,setIsAdmin,searchedCities,setSearchedCities
    }
  return <AppContext.Provider value={value}>
        {children}
        </AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);