import { User } from '../models/user.model.js'
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function  searchPerson (req, res) {
    const { query} = req.params;
    try {
        const response = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`);
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }

        await User.findByIdAndUpdate(req.user._id, {
            $push:{
                searchHistory:{
                    id:response.results[0].id,
                    image:response.results[0].profile_path,
                    title:response.results[0].name,
                    searchType:"person",
                    createAt: Date.now()
                }
            }
        })
        res.status(200).json({success:true, content: response.results})

    } catch (error) {
        console.log("Error in searchPerson controller: " , error.message)
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function searchMovie(req, res) {
    const { query } = req.params; // Lấy từ khóa tìm kiếm từ params
    try {
        const response = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
        ); // Gọi API từ TMDB để tìm kiếm phim

        if (response.results.length === 0) {
            return res.status(404).send(null); // Nếu không tìm thấy phim nào, trả về 404
        }

        // Cập nhật searchHistory của user trong database
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: response.results[0].id, // ID của phim
                    image: response.results[0].poster_path || response.results[0].backdrop_path, // Hình ảnh poster hoặc backdrop
                    title: response.results[0].title || response.results[0].name, // Tiêu đề phim (title hoặc name)
                    searchType: "movie", // Loại tìm kiếm là "movie"
                    createAt: Date.now() // Thời gian tìm kiếm
                }
            }
        });

        res.status(200).json({ success: true, content: response.results }); // Trả kết quả tìm kiếm phim

    } catch (error) {
        console.log("Error in searchMovie controller: ", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" }); // Nếu có lỗi, trả về lỗi server
    }
}


export async function  searchTv (req, res) {
    const { query } = req.params;
    try {
        const response = await fetchFromTMDB(
            `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`);
        if (response.results.length === 0) {
            return res.status(404).send(null);
        }


        await User.findByIdAndUpdate(req.user._id, {
            $push:{
                // có thể poster_path or backdrop_path null
                searchHistory:{
                    id:response.results[0].id,
                    image:response.results[0].poster_path || response.results[0].backdrop_path,
                    title:response.results[0].name || response.results[0].title,
                    searchType:"Tv",
                    createAt: Date.now()
                }
            }
        })

        res.status(200).json({success:true, content: response.results})


    } catch (error) {
        console.log("Error in searchTv controller: " , error.message)
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}

export async function getSearchHistory (req,res) {
    try {

        res.status(200).json({success:true, content: req.user.searchHistory})
    } catch (error) {
        console.log("Error in getSearchHistory controller", error.message);
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}
    
export async function removeItemFromSearchHistory (req,res) {
    let { id } = req.params;
    id = parseInt(id)
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $pull:{
                searchHistory: {id: id},
            },
        }) ;
        res.status(200).json({success:true, message: "Item removed from search history"})
    } catch (error) {
        console.log("Error in removeItemFromSearchHistory controller", error.message);
        res.status(500).json({success: false, message: "Internal Server Error"})
    }
}
    