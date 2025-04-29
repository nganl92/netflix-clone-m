import { fetchFromTMDB } from "../services/tmdb.service.js";
export async function  getTrendingTv(req, res, next) {
    try {
        //Gọi hàm fetchFromTMDB để lấy danh sách phim thịnh hành trong ngày từ API của TMDB.
        //Vì API được gọi là một thao tác bất đồng bộ, ta cần await để đợi dữ liệu trả về trước khi tiếp tục xử lý.
        const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/tv/day?language=en-US');
        //Chọn ngẫu nhiên một bộ phim từ danh sách data.results
        //?. (Optional Chaining) giúp tránh lỗi nếu data.results là undefined hoặc không tồn tại.
        const randomMovie = data.results?.[Math.floor(Math.random() * data.results?.length)];
        //Trả kết quả về cho client dưới dạng JSON.
        res.json({ success:true, content: randomMovie });
    } catch (error) {
        console.log("Error in getTrendingTv controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function  getTvTrailers(req, res, next) { 
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`)
        res.json({ success:true, trailers: data });
    } catch (error) {

        if (error.message.includes('404')) {
            return res.status(400).send(null)
         }

        console.log("Error in getTvTrailers controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function  getTvDetails(req, res, next) { 
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`)
        res.json({ success:true, content: data });
    } catch (error) {

        if (error.message.includes('404')) {
            return res.status(400).send(null)
         }

        console.log("Error in getTvDetails controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function  getSimilarTvs(req, res, next) { 
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`)

        res.status(200).json({success: true, similar: data.results  });
    } catch (error) {
        console.log("Error in getSimilarTvs controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export async function  getTvsByCategory(req, res, next) { 
    const { category } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`)

        res.status(200).json({success: true, content: data.results  });
    } catch (error) {
        console.log("Error in getTvsByCategory controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}