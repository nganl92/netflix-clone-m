
//Đây là một đoạn code JavaScript sử dụng fetch và axios để lấy dữ liệu từ The Movie Database (TMDB) API

//Dòng này nhập thư viện axios, một thư viện giúp gửi yêu cầu HTTP dễ dàng hơn so với fetch.
import axios from 'axios';
import { ENV_VARS } from "../config/envVars.js";


//Đây là một hàm bất đồng bộ (async function) giúp gọi API TMDB.
export const fetchFromTMDB = async (url) => {
    const options = {
        headers: {
          accept: 'application/json',// Yêu cầu API trả về dữ liệu JSON
          Authorization: 'Bearer ' + ENV_VARS.TMDB_API_KEY,//Thêm API key vào yêu cầu.
           //Lưu ý: API key phải được bảo mật, không để lộ ra mã nguồn công khai.
        }
      };

      const response = await axios.get(url, options)//Sử dụng axios.get(url, options) để gửi yêu cầu GET đến API TMDB.
    
      if ( response.status !== 200) { 
        throw new Error('Failed to fetch data form TMDB' + response.statusText);//Nếu mã trạng thái (response.status) không phải 200, hàm sẽ ném lỗi (throw new Error).
        //response.statusText chứa mô tả lỗi từ API.
      }
      return response.data;//chứa dữ liệu JSON từ API.
}



  
  