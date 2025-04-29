import { User } from '../models/user.model.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';
import bcryptjs from 'bcryptjs';


export async function signup(req, res) { 

    try {
        const {email, username, password} = req.body;//Lấy email, password, username từ request body

        if (!email || !password || !username) { // Kiểm tra xem người dùng có nhập đủ thông tin không
            return res.status(400).json({success:false, message: 'All fields are required'});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({success:false, message: 'Invalid email format'});
        }

        if (password.length < 6) {
            return res.status(400).json({success:false, message: 'Password must be at least 6 characters'});
        }

        //Kiểm tra xem email hoặc username đã tồn tại chưa
        const existingUserByEmail = await User.findOne({email: email});
        if (existingUserByEmail) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        //Kiểm tra xem email hoặc username đã tồn tại chưa
        const existingUserByUsername = await User.findOne({username:username})
        if (existingUserByUsername) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        const salt = await bcryptjs.genSalt(10);//tạo salt với độ mạnh là 10
        const hashedPassword = await bcryptjs.hash(password, salt);//hash mật khẩu bằng bcryptjs để tăng cường bảo mật.
        //Cách này tốt hơn về bảo mật vì nó chạy bất đồng bộ, tránh chặn luồng xử lý của server.
        // Lưu ý: Nếu quên hash, mật khẩu sẽ lưu dưới dạng plain text trong database, rất nguy hiểm!

        //Gán avatar ngẫu nhiên cho user
        const PROFILE_PICS = ['/avt1.jpg', '/avt2.jpg', '/avt3.jpg'];
        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)];
        
        //Tạo một user mới với dữ liệu đã xử lý
        const newUser = new User({
            email, 
            password: hashedPassword,// Lưu hashedPassword
            username,
            image,
        });

        //Tạo token JWT và lưu vào cookie
        //newUser._id được dùng làm payload trong JWT.
        generateTokenAndSetCookie(newUser._id, res);
        //Lưu user vào MongoDB
        await newUser.save();

        //Trả về thông tin user (không có mật khẩu)
        res.status(201).json({
            success: true,
            user: {
                ...newUser._doc,//giúp lấy toàn bộ dữ liệu user từ MongoDB.
                password: "",//đảm bảo mật khẩu không bị lộ.
            },
        });
     } catch (error) {
        console.error('error in signup controller:', error.message);
        res.status(500).json({success:false, message: 'Internal server error'});
    }
}

export async function login(req, res) { 
    try {
        const {email, password} = req.body;//Lấy email và password từ request body
 
        if(!email || !password) { // Kiểm tra xem người dùng có nhập đủ thông tin không
            return res.status(400).json({success:false, message: 'All fields are required'});
        }

        const user =  await User.findOne({email: email});//Tìm user trong database theo email
        if(!user) {
            return res.status(404).json({success:false, message: 'Invalid credentials'});// Nếu không tìm thấy user, trả về lỗi 404
            //Lý do: Không nên tiết lộ "email không tồn tại" vì lý do bảo mật.
            //Phản hồi chung chung "Invalid credentials" để tránh hacker dò email hợp lệ.
        }

        const isPasswordCorrect = await bcryptjs.compare(password, user.password);//So sánh mật khẩu nhập vào (password) với mật khẩu đã hash (user.password)
        //bcryptjs.compare() sẽ băm mật khẩu nhập vào và so sánh với hash trong database.

        if(!isPasswordCorrect) {
            //Nếu password trong database không phải hash, bcryptjs.compare() luôn trả về false.
            //ần kiểm tra xem lúc signup đã hash mật khẩu chưa.
            return res.status(400).json({success:false, message: 'Invalid credentials'});
        }
        
        //Tạo token JWT và lưu vào cookie
        //user._id được dùng làm payload trong JWT.
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: "",
            }
        });
        

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({success: false, message: "Internal server error"});
    }
}

export async function logout(req, res) { 
    try {
        res.clearCookie("jwt-netflix");//xóa cookie có tên "jwt-netflix"
        // Cookie chỉ bị xóa nếu nó không có HttpOnly: true, hoặc frontend gửi request với credentials (withCredentials: true trong axios).
        res.status(200).json({success: true, message:"Logged out successfully"});//Trả về phản hồi JSON với mã trạng thái 200 (OK)
    } catch (error) {//Bắt lỗi nếu có bất kỳ vấn đề nào xảy ra trong
        console.log("Error in logout controller logout", error.message);// Giúp lập trình viên debug nếu có lỗi xảy ra khi đăng xuất.
        res.status(500).json({success: false, message: "Internal server error"});//Trả về mã lỗi 500 (Internal Server Error) nếu có lỗi xảy ra
    }  

}

export async function authCheck(req, res) { 
    
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        console.log("req.user:" + req.user)
        res.status(200).json({success: true, user: req.user});//Trả về phản hồi JSON với mã trạng thái 200 (OK)
    } catch (error) {
        console.log("Error in logout controller authCheck", error.message);// Giúp lập trình viên debug nếu có lỗi xảy ra khi đăng xuất.
        res.status(500).json({success: false, message: "Internal server error"});//Trả về mã lỗi 500 (Internal Server Error) nếu có lỗi xảy ra
    }  

}
