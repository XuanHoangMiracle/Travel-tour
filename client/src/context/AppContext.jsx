import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "https://travelserver-oekt.onrender.com";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY || " vnđ";
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();

    const [isAdmin, setIsAdmin] = useState(false);
    const [searchedCities, setSearchedCities] = useState([]);
    const [tours, setTours] = useState([]);

    const fetchTours = async () => {
        try {
            const { data } = await axios.get('/api/tours');
            if (data.success) {
                setTours(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('fetchTours error:', error);
            toast.error(error.message);
        }
    }

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user', {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            if (data) {
                setIsAdmin(data.role === 'admin');
                setSearchedCities(data.searchedCities || []);
            } else {
                setTimeout(() => fetchUser(), 5000);
            }
        } catch (error) {
            console.error('fetchUser error:', error);
            toast.error(error.message);
        }
    };

    const saveSearchedCity = async (city) => {
        try {
            if (!user) {
                toast.error('Vui lòng đăng nhập để lưu lịch sử tìm kiếm');
                return;
            }

            const token = await getToken();
            const { data } = await axios.post('/api/user/search-cities', 
                { searchedCity: city },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (data.success) {
                setSearchedCities(data.data);
                return data.data;
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('saveSearchedCity error:', error);
            toast.error('Lỗi lưu lịch sử tìm kiếm');
        }
    };

    // ✅ Thêm function check availability
    const checkAvailability = async (tourId, date) => {
        try {
            const { data } = await axios.get('/api/bookings/availability', {
                params: { tourId, date }
            });
            
            if (data.success) {
                return data.data;
            }
            return null;
        } catch (error) {
            console.error('checkAvailability error:', error);
            return null;
        }
    };

    // ✅ Thêm function tạo booking
    const createBooking = async (bookingData) => {
        try {
            if (!user) {
                toast.error('Vui lòng đăng nhập để đặt tour');
                return { success: false };
            }

            const token = await getToken();
            const { data } = await axios.post('/api/bookings/create', 
                bookingData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (data.success) {
                toast.success('Đặt tour thành công!');
                return { success: true, data: data.data };
            } else {
                toast.error(data.message);
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('createBooking error:', error);
            const errorMsg = error.response?.data?.message || 'Lỗi đặt tour';
            toast.error(errorMsg);
            return { success: false, message: errorMsg };
        }
    };

    useEffect(() => {
        if (isLoaded && user) {
            fetchUser();
        }
    }, [user, isLoaded]);

    useEffect(() => {
        fetchTours();
    }, []);

    const value = {
        currency, navigate, user, getToken, axios,
        isAdmin, setIsAdmin,
        searchedCities, setSearchedCities,
        tours, setTours, 
        fetchTours,
        saveSearchedCity,
        checkAvailability,  // ✅ Export
        createBooking,      // ✅ Export
        isLoaded
    }

    return (
        <AppContext.Provider value={value}>
            <Toaster 
                position="top-center"
                reverseOrder={false}
                gutter={8}
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        borderRadius: '8px',
                        padding: '16px',
                        fontSize: '14px',
                    },
                    success: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
