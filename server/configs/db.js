import mongoose from "mongoose";

const connectDB = async() =>{
    try{
        mongoose.connection.on('Kết nối thành công', () => console.log("Cơ sở dữ liệu được kết nối"));
        await mongoose.connect(`${process.env.MONGODB_URL}/travel-tour`)
} catch(error){
    console.log(error.message)
    }
}

export default connectDB;