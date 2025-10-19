
//Get/api/user

export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({ success: true, role ,recentSearchedCities})
    } catch (error) {
        console.log({success: false,error: error.message })
    }
}

//Thành phố gần đây
export const getRecentSearchedCities = async (req, res) => {
    try {
        const {recentSearchedCities} = req.body;
        const user = await req.user;

        if(user.recentSearchedCities.length < 3){
            user.recentSearchedCities.push(recentSearchedCities)
        }else{
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCities)
        }
        await user.save();
        res.json({ success: true, message: "Thêm vị trí"})
    } catch (error) {
        res.json({ success: false, error: error.message })
    }
}