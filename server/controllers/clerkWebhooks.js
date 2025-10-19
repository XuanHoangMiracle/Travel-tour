import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req,res) =>{
    try {
        //Tạo clerk
        const whook = new Webhook(process.env.WEBHOOK_SECRET) || process.env.CLERK_WEBHOOK_SECRET;
        //Lấy Headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };
        //xác minh
        await whook.verify(JSON.stringify(req.body), headers)

        //Lấy dữ liệu yêu cầu
        const {data,type} = req.body

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        }
        //Sự kiện
        switch(type){
            case "user.created":{
                await User.create(userData);
                break;
            }
            case "user.update":{
                await User.findByIdAndUpdate(data.id,userData);
                break;
            }
            case "user.deleted":{
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
        }
        res.json({success: true,message: "Xử lý thành công"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false,message: error.message});
    }
}
export default clerkWebhooks;