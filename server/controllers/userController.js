
//Get/api/user

import User from "../models/User.js";

export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({ success: true, role ,recentSearchedCities})
    } catch (error) {
        console.log({success: false,error: error.message })
    }
}

export const getRecentSearchedCities = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        
        const user = await User.findById(userId).select('searchedCities');
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User không tồn tại' 
            });
        }

        res.json({
            success: true,
            data: user.searchedCities || []
        });
    } catch (error) {
        console.error('getRecentSearchedCities error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi lấy searched cities' 
        });
    }
};

// ✅ Lưu searched cities
export const saveSearchedCities = async (req, res) => {
    try {
        const { recentSearchedCities } = req.body;
        const userId = req.user._id || req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User không tồn tại' 
            });
        }

        if (!user.searchedCities) {
            user.searchedCities = [];
        }

        user.searchedCities = [
            recentSearchedCities,
            ...user.searchedCities.filter(city => city !== recentSearchedCities)
        ].slice(0, 3);

        await user.save();

        res.json({
            success: true,
            message: 'Lưu thành công',
            data: user.searchedCities
        });
    } catch (error) {
        console.error('saveSearchedCities error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Lỗi lưu searched cities' 
        });
    }
};