import { fetchFromTMDB } from "../services/tmdb.service.js";
export async function  getTrendingMovie(req, res, next) {
    try {
        //Gọi hàm fetchFromTMDB để lấy danh sách phim thịnh hành trong ngày từ API của TMDB.
        //Vì API được gọi là một thao tác bất đồng bộ, ta cần await để đợi dữ liệu trả về trước khi tiếp tục xử lý.
        const data = await fetchFromTMDB('https://api.themoviedb.org/3/trending/movie/day?language=en-US');
        //Chọn ngẫu nhiên một bộ phim từ danh sách data.results
        //?. (Optional Chaining) giúp tránh lỗi nếu data.results là undefined hoặc không tồn tại.
        const randomMovie = data.results?.[Math.floor(Math.random() * data.results?.length)];
        //Trả kết quả về cho client dưới dạng JSON.
        res.json({ success:true, content: randomMovie });
    } catch (error) {
        console.log("Error in getTrendingMoive controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function  getMovieTrailers(req, res, next) { 
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`)
        res.json({ success:true, trailers: data.results });
    } catch (error) {

        if (error.message.includes('404')) {
            return res.status(400).send(null)
         }

        console.log("Error in getMovieTrailers controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function  getMovieDetails(req, res, next) { 
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`)
        res.json({ success:true, content: data });
    } catch (error) {

        if (error.message.includes('404')) {
            return res.status(400).send(null)
         }

        console.log("Error in getMovieDetails controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function  getSimilarMovie(req, res, next) { 
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`)

        res.status(200).json({success: true, similar: data.results  });
    } catch (error) {
        console.log("Error in getSimilarMovie controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}


export async function  getMoviesByCategory(req, res, next) { 
    const { category } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`)

        res.status(200).json({success: true, content: data.results  });
    } catch (error) {
        console.log("Error in getMoviesByCategory controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}