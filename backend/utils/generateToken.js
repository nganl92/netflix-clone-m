import jwt from 'jsonwebtoken';
import { ENV_VARS } from '../config/envVars.js';


// Định nghĩa đối tượng với 2 tham số (userId và res(respose của express dùng để gửi cookie về phía clieent))
export const generateTokenAndSetCookie = (userId, res) => { 
    // Tạo 1 jwt chứa
        //UserID như payload
        // secretKey là chuỗi bí mật để mã hoá và giải mã token
        // expiresIn là thời gian thời hạn của token (15 ngày)
    const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: '15d' });
    
    //Dùng phương thức res.cookie để lưu biến token vào cookie của trình duyệt với tên "jwt-netflix"
    res.cookie("jwt-netflix", token, {
        maxAge: 15 * 24 * 60 * 60 *1000, //thời gian tồn tại của cookie
        httpOnly: true, //Ngăn chặn không co javascript trên trình duyệt truy cập vào cookie tránh XSSXSS 
        sameSite:"strict",//CChỉ cho phép truy cập cookie trên cùng 1 trang web, cross size request foregy csrf
        secure: ENV_VARS.NODE_ENV !== 'development',//chỉ bật secure: true nếu môi trường không phải development, http chỉ được gửi qua môi trường production
    });

    return token;
};
