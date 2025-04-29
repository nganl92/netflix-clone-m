import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ENV_VARS } from '../config/envVars.js';


export const protectRoute = async (req, res, next) =>{
    try {
        // lấy token từ cookies từ trình duyệt.
        const token = req.cookies["jwt-netflix"]; 

        if(!token) {
            return res.status(401).json({ success: false, message: 'Token is not provided'});
        }
        
        //giải mã token và gán vào biến decoded
        const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);

        //Nếu token bị thay đổi, hết hạn, hoặc không đúng định dạng → sẽ ném lỗi.
        if(!decoded) {
            return res.status(401).json({ success: false, message: 'Token is invalid'});
        }

        //.select('-password') để loại bỏ trường mật khẩu ra khỏi kết quả.
        const user = await User.findById(decoded.userId).select('-password');
        if(!user) {
            return res.status(404).json({ success: false, message: 'User not found'});
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({ success: false, message: 'Internal server error'});
    }
}